import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonPopover,
  IonCheckbox,
  IonToggle,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline, calendarOutline, mapOutline, peopleOutline,
  imageOutline, cameraOutline, imagesOutline, pinOutline, lockClosedOutline, wineOutline, trashOutline,
  checkmarkCircleOutline, closeCircleOutline, chevronForwardOutline, alertCircleOutline
} from 'ionicons/icons';

import { Subject, of, Subscription, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import {
  PageHeaderComponent,
  EventsService,
  PhotoService,
  MapboxService,
  AppEvent,
  EventType,
  EventStatus,
  LoadingService,
  NotificationService,
  ErrorHandlerService,
  AppMessageCode,
  AuthService,
  DatePickerComponent,
  DatePickerResult,
} from 'shared-core';

import { environment } from '@env/environment';

export const EVENT_TYPE_ES: Record<EventType, string> = {
  [EventType.ASAMBLEA]: '🗳️ Asamblea General',
  [EventType.COMIDA]: '🍽️ Comida / Convivencia',
  [EventType.QUEDADA]: '🛵 Quedada de la Peña',
  [EventType.FERIA]: '🎪 Caseta de la Feria'
};

/**
 * @class EventDetailPage
 * @description Componente controlador inteligente para la visualización detallada, control de asistencia perimetral
 * excluyente por cuotas/cronología y consola de administración de eventos de la peña.
 */
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon,
    IonCheckbox,
    IonToggle,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    PageHeaderComponent
  ]
})
export class EventDetailPage implements OnInit, OnDestroy {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private eventsService = inject(EventsService);
  private photoService = inject(PhotoService);
  private mapboxService = inject(MapboxService);
  private loading = inject(LoadingService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  public authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  @ViewChild('popoverStart') popoverStart!: IonPopover;
  @ViewChild('popoverEnd') popoverEnd!: IonPopover;

  // =========================================================================
  // 📋 VARIABLES DE CONTROL Y ESTADO REACTIVO
  // =========================================================================
  public tipoTraduccion = EVENT_TYPE_ES;

  public isNewEvent = false;
  public isEditing = false;
  public isAdmin = false;

  public eventForm!: FormGroup;
  public event?: AppEvent;
  public temporaryPreviewBase64 = '';

  public selectedStartDate = '';
  public selectedEndDate = '';

  public direccionSubject = new Subject<string>();
  public sugerencias: any[] = [];
  public mostrarSugerencias = false;

  public userStatusAsistencia: 'going' | 'not_going' | 'unconfirmed' = 'unconfirmed';

  private attendanceSub!: Subscription;
  private mapboxSub!: Subscription;
  private eventLiveSub?: Subscription;
  private destroy$ = new Subject<void>();

  /**
   * @constructor
   * @description Registra la colección de iconos vectoriales e inicializa el esquema del formulario.
   */
  constructor() {
    addIcons({
      createOutline, calendarOutline, mapOutline, peopleOutline,
      imageOutline, cameraOutline, imagesOutline, pinOutline, lockClosedOutline, wineOutline, trashOutline,
      checkmarkCircleOutline, closeCircleOutline, chevronForwardOutline, alertCircleOutline
    });
    this.initForm();
  }

  public async ngOnInit(): Promise<void> {
    if (typeof document !== 'undefined' && document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }

    await this.authService.waitForUserData();
    this.isAdmin = this.authService.isAdmin() || this.authService.isDirectiva();

    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.isNewEvent = false;
      this.isEditing = false;
      this.loadEvent(eventId);
      this.loadUserAttendance(eventId);
    } else {
      if (!this.isAdmin) {
        this.notification.warning('Acceso denegado: No tienes permisos para crear eventos.');
        this.router.navigate(['/events']);
        return;
      }
      this.isNewEvent = true;
      this.isEditing = true;
      this.eventForm.enable();
      this.evaluarRequisitosControlAcceso(this.eventForm.get('requiresAccessControl')?.value);
      this.cdr.detectChanges();
    }

    this.mapboxSub = this.direccionSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 3) {
          const peticionMapbox = this.mapboxService.buscarDireccion(query, environment.mapboxToken);
          return from(peticionMapbox).pipe(
            catchError(err => {
              console.error('⚠️ [MAPBOX] Error controlado en la predicción de calle:', err);
              return of([] as any[]);
            })
          );
        } else {
          this.mostrarSugerencias = false;
          return of([] as any[]);
        }
      })
    ).subscribe((resultados: any[]) => {
      this.sugerencias = resultados || [];
      this.mostrarSugerencias = this.sugerencias.length > 0;
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.mapboxSub) this.mapboxSub.unsubscribe();
    if (this.attendanceSub) this.attendanceSub.unsubscribe();
    if (this.eventLiveSub) this.eventLiveSub.unsubscribe();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      imageUrl: [''],
      type: [EventType.COMIDA, [Validators.required]],
      isPrivate: [false],
      isAllDay: [false],
      requiresAccessControl: [false],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      maxAttendees: [null, [Validators.min(1)]],
      limiteInvitadosPorSocio: [null],
      description: ['', [Validators.required, Validators.minLength(10)]],
      locationName: ['', [Validators.required]],
      locationAddress: ['', [Validators.required]]
    });

    this.eventForm.disable();

    this.eventForm.get('isAllDay')?.valueChanges.subscribe((isAllDay: boolean) => {
      const endDateControl = this.eventForm.get('endDate');
      if (isAllDay) {
        endDateControl?.setValue('');
        endDateControl?.clearValidators();
        endDateControl?.disable();
      } else {
        endDateControl?.setValidators([Validators.required]);
        if (this.isEditing) endDateControl?.enable();
      }
      endDateControl?.updateValueAndValidity();
      this.cdr.detectChanges();
    });

    this.eventForm.get('requiresAccessControl')?.valueChanges.subscribe((requiereControl: boolean) => {
      this.evaluarRequisitosControlAcceso(requiereControl);
    });
  }



  /**
   * @method loadEvent
   * @description Sincroniza los datos del evento utilizando una sola escucha reactiva en tiempo real (onSnapshot).
   * Mapea todas las propiedades civiles y de aforo unificadas de forma elástica sin duplicidades.
   */
  private loadEvent(id: string): void {
    if (this.eventLiveSub) {
      this.eventLiveSub.unsubscribe();
    }

    this.eventLiveSub = this.eventsService.getEventLive(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (eventData) => {
        if (eventData) {
          this.event = eventData;

          this.selectedStartDate = eventData.startDate || '';
          this.selectedEndDate = eventData.endDate || '';

          this.eventForm.patchValue({
            title: eventData.title,
            imageUrl: eventData.imageUrl || '',
            type: eventData.type,
            isPrivate: eventData.isPrivate ?? false,
            isAllDay: eventData.allDay || false,
            requiresAccessControl: (eventData as any).requiresAccessControl ?? false,
            startDate: eventData.startDate,
            endDate: eventData.endDate || '',
            maxAttendees: eventData.maxAttendees,
            limiteInvitadosPorSocio: eventData.limiteInvitadosPorSocio !== undefined ? eventData.limiteInvitadosPorSocio : null,
            description: eventData.description,
            locationName: eventData.location?.name,
            locationAddress: eventData.location?.address
          }, { emitEvent: false });

          this.evaluarRequisitosControlAcceso((eventData as any).requiresAccessControl ?? false);
          this.cdr.markForCheck();
        }
      },
      error: (err) => this.errorHandler.handle(err, AppMessageCode.ADC_EVENT_ERR_0005)
    });
  }

  private loadUserAttendance(eventId: string): void {
    const authUid = this.authService.getUid();
    if (!authUid) return;

    this.attendanceSub = this.eventsService.getUserAttendanceForEvent(eventId, authUid).subscribe({
      next: (attendance) => {
        if (attendance && attendance.status) {
          this.userStatusAsistencia = attendance.status as 'going' | 'not_going';
        } else {
          this.userStatusAsistencia = 'unconfirmed';
        }
        this.cdr.detectChanges();
      }
    });
  }

  public async toggleAsistenciaSocio(confirmarAsistencia: boolean): Promise<void> {
    if (!this.event?.id) return;
    const authUid = this.authService.getUid();
    if (!authUid) {
      this.notification.error(AppMessageCode.ADC_AUTH_ERR_0001);
      return;
    }

    try {
      await this.loading.wrap(async () => {
        await this.eventsService.registerAttendance(this.event!.id!, authUid, confirmarAsistencia);

        this.userStatusAsistencia = confirmarAsistencia ? 'going' : 'not_going';

        if (this.event) {
          const actual = this.event.attendeeCount || 0;
          this.event.attendeeCount = confirmarAsistencia ? actual + 1 : Math.max(0, actual - 1);
        }

        const msgExito = confirmarAsistencia
          ? AppMessageCode.ADC_EVENT_INF_0003
          : 'Asistencia cancelada. Tu plaza e invitaciones feriales han sido liberadas.';

        this.notification.success(msgExito);
        this.cdr.detectChanges();
      }, confirmarAsistencia ? 'Asegurando tu plaza...' : 'Cancelando tu reserva...');

    } catch (error: any) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0002);
    }
  }

  // =========================================================================
  // 🔐 CONTROLES PERIMETRALES DE SEGURIDAD, TESORERÍA Y CRONOLOGÍA
  // =========================================================================

  public esUsuarioSolvente(): boolean {
    if (this.authService.isAdmin()) return true;
    const userData = this.authService.currentUserData;
    if (!userData) return false;
    return userData.cuotaAlCorriente === true;
  }

  public esEventoCaducado(): boolean {
    if (!this.event) return false;
    const ahora = new Date();
    const fechaLimiteStr = this.event.endDate || this.event.startDate;
    if (!fechaLimiteStr) return false;

    const fechaLimite = new Date(fechaLimiteStr);
    if (this.event.allDay) {
      fechaLimite.setHours(23, 59, 59, 999);
    }
    return ahora > fechaLimite;
  }

  public puedeApuntarse(): boolean {
    if (!this.event) return false;
    if (this.esEventoCaducado()) return false;
    if (this.event.isPrivate && this.authService.isInvitado()) return false;
    if (this.event.isPrivate && !this.esUsuarioSolvente()) return false;
    if (this.event.maxAttendees && (this.event.attendeeCount || 0) >= this.event.maxAttendees) {
      return false;
    }
    return true;
  }

  public onAddressInput(event: any): void {
    const nuevaDireccion = this.eventForm.get('locationAddress')?.value || '';
    if (nuevaDireccion.trim().length <= 3) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      return;
    }
    this.direccionSubject.next(nuevaDireccion);
  }

  public selectAddressSuggestion(sugerencia: any): void {
    const direccionFinal = sugerencia.place_formatted || sugerencia;
    this.eventForm.get('locationAddress')?.setValue(direccionFinal);
    this.mostrarSugerencias = false;
    this.sugerencias = [];
    this.cdr.detectChanges();
  }

  public ocultarSugerencias(): void {
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.cdr.detectChanges();
    }, 250);
  }

  public async onDateConfirmNative(controlName: string, event: any): Promise<void> {
    const rawValue = event.detail.value;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

    if (!value) {
      this.closePopoverRef(controlName);
      return;
    }

    const startDateControl = this.eventForm.get('startDate');
    const endDateControl = this.eventForm.get('endDate');
    const isAllDay = this.eventForm.get('isAllDay')?.value;
    const now = new Date();

    // Accedemos directamente a la propiedad .value del control
    console.log('[EVENT-DETAIL] - Fecha inicio...: ', startDateControl?.value);
    console.log('[EVENT-DETAIL] - Fecha fin......: ', endDateControl?.value);

    if (controlName === 'startDate') {
      const selectedStart = new Date(value);

      if (isAllDay) {
        const compareStart = new Date(selectedStart.getFullYear(), selectedStart.getMonth(), selectedStart.getDate());
        const compareNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (compareStart < compareNow) {
          this.notification.warning(AppMessageCode.ADC_EVENT_ERR_0006);
          startDateControl?.setValue(now.toISOString());
          this.closePopoverRef(controlName);
          return;
        }
      } else {
        const nowWithGracePeriod = new Date(now.getTime() - 10 * 60 * 1000);

        if (selectedStart < nowWithGracePeriod) {
          this.notification.warning(AppMessageCode.ADC_EVENT_ERR_0006);
          startDateControl?.setValue(now.toISOString());
          this.closePopoverRef(controlName);
          return;
        }
      }

      startDateControl?.setValue(value);

      if (!isAllDay) {
        const computedEnd = new Date(value);
        computedEnd.setHours(computedEnd.getHours() + 1);
        endDateControl?.setValue(computedEnd.toISOString());
      }
    }

    if (controlName === 'endDate' && !isAllDay) {
      const selectedEnd = new Date(value);
      const currentStart = startDateControl?.value ? new Date(startDateControl.value) : null;

      if (currentStart && selectedEnd <= currentStart) {
        endDateControl?.setErrors({ 'invalidDates': true });
        this.notification.warning(AppMessageCode.ADC_EVENT_ERR_0007);

        const safetyEnd = new Date(currentStart);
        safetyEnd.setHours(safetyEnd.getHours() + 1);
        safetyEnd.setSeconds(0);
        endDateControl?.setValue(safetyEnd.toISOString());
        this.closePopoverRef(controlName);
        return;
      }

      endDateControl?.setValue(value);
      if (endDateControl?.hasError('invalidDates')) {
        endDateControl.setErrors(null);
      }
    }

    this.eventForm.get(controlName)?.markAsTouched();
    this.eventForm.updateValueAndValidity();
    this.cdr.detectChanges();
    this.closePopoverRef(controlName);
  }

  private closePopoverRef(controlName: string): void {
    if (controlName === 'startDate' && this.popoverStart) {
      this.popoverStart.dismiss();
    } else if (controlName === 'endDate' && this.popoverEnd) {
      this.popoverEnd.dismiss();
    }
  }

  public async selectFromGallery(): Promise<void> {
    if (!this.isAdmin) return;
    try {
      const image = await Camera.getPhoto({
        quality: 90, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Photos
      });
      if (image.dataUrl) this.processLocalImage(image.dataUrl);
    } catch (error) { console.warn('Gesto omitido'); }
  }

  public async takePhoto(): Promise<void> {
    if (!this.isAdmin) return;
    try {
      const image = await Camera.getPhoto({
        quality: 90, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Camera
      });
      if (image.dataUrl) this.processLocalImage(image.dataUrl);
    } catch (error) { console.warn('Gesto omitido'); }
  }

  private async processLocalImage(dataUrl: string): Promise<void> {
    try {
      await this.loading.wrap(async () => {
        this.temporaryPreviewBase64 = await this.optimizeImageScale(dataUrl, 1024);
        this.eventForm.patchValue({ imageUrl: this.temporaryPreviewBase64 });
        this.cdr.detectChanges();
      }, 'Preparando cartel en el dispositivo...');
    } catch (error) {
      this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0002);
    }
  }

  private optimizeImageScale(base64Str: string, maxWidth: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width; let height = img.height;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.80));
      };
      img.onerror = (err) => reject(err);
    });
  }

  public toggleEdit(): void {
    if (!this.isAdmin) return;
    this.isEditing = true;

    // 1. Habilitar todo el formulario reactivo
    this.eventForm.enable();

    const requiereControl = this.eventForm.get('requiresAccessControl')?.value ?? false;
    const limiteControl = this.eventForm.get('limiteInvitadosPorSocio');

    // 2. Si requiere control de acceso, asignamos valor por defecto si estaba en null para no bloquear el required
    if (requiereControl) {
      if (limiteControl?.value === null || limiteControl?.value === undefined) {
        limiteControl?.setValue(0); // Valor neutro por defecto (0 invitados)
      }
      limiteControl?.setValidators([Validators.required, Validators.min(0)]);
      limiteControl?.enable();
    } else {
      limiteControl?.setValue(null);
      limiteControl?.clearValidators();
      limiteControl?.disable();
    }
    limiteControl?.updateValueAndValidity();

    // 3. Ajustar el control endDate según si es todo el día
    if (this.eventForm.get('isAllDay')?.value) {
      this.eventForm.get('endDate')?.disable();
    }

    // 4. Recalcular la validez total y refrescar la vista
    this.eventForm.updateValueAndValidity();
    this.cdr.markForCheck();

    Object.keys(this.eventForm.controls).forEach(key => {
      const controlErrors = this.eventForm.get(key)?.errors;
      if (controlErrors != null) {
        console.log('❌ Campo invalido:', key, controlErrors);
      }
    });
  }

  private evaluarRequisitosControlAcceso(requiereControl: boolean): void {
    const limiteControl = this.eventForm.get('limiteInvitadosPorSocio');

    if (requiereControl) {
      // Asignar 0 si está vacío para satisfacer el Validators.required inmediatamente
      if (limiteControl?.value === null || limiteControl?.value === undefined) {
        limiteControl?.setValue(0);
      }
      limiteControl?.setValidators([Validators.required, Validators.min(0)]);
      if (this.isEditing) {
        limiteControl?.enable();
      }
    } else {
      limiteControl?.setValue(null);
      limiteControl?.clearValidators();
      limiteControl?.disable();
    }

    limiteControl?.updateValueAndValidity();
    this.eventForm.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  public cancelEdit(): void {
    if (this.isNewEvent) {
      this.router.navigate(['/events']);
    } else {
      this.isEditing = false;
      this.temporaryPreviewBase64 = '';
      this.eventForm.disable();
      if (this.event?.id) this.loadEvent(this.event.id);
    }
  }

  public async clickEliminarConvocatoria(): Promise<void> {
    if (!this.event || !this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: '🛑 ¿Eliminar Convocatoria?',
      subHeader: 'A.D.C. Los Locos',
      message: `¿Estás seguro de cancelar "${this.event.title}"? Se enviará una alerta push inmediata a los móviles de los socios y la convocatoria se eliminará del sistema por completo.`,
      backdropDismiss: false,
      buttons: [
        { text: 'Volver Atrás', role: 'cancel' },
        {
          text: 'Sí, Cancelar y Notificar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.loading.wrap(async () => {
                await this.eventsService.deleteEvent(this.event!);
                await this.notification.success('El evento ha sido cancelado. Notificación distribuida con éxito.');
              }, 'Cancelando evento y disparando alertas masivas...');

              this.router.navigate(['/events'], { replaceUrl: true });
            } catch (error) { this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0001); }
          }
        }
      ]
    });
    await alert.present();
  }

  public async onSubmit(): Promise<void> {
    if (this.eventForm.invalid || !this.isAdmin) {
      // 🚀 MODIFICADO: Adaptado para notificar el error de invitados sea cual sea el tipo de evento
      if (this.eventForm.get('limiteInvitadosPorSocio')?.hasError('required')) {
        this.notification.warning('El límite de invitados por socio es obligatorio cuando se requiere control de acceso.');
      }
      return;
    }

    const values = this.eventForm.value;
    const finalId = this.isNewEvent ? crypto.randomUUID() : this.event!.id!;

    const payload: any = {
      id: finalId,
      title: values.title,
      type: values.type as EventType,
      isPrivate: values.isPrivate ?? false,
      requiresAccessControl: values.requiresAccessControl ?? false,
      startDate: values.startDate,
      endDate: values.isAllDay ? '' : values.endDate,
      allDay: values.isAllDay ?? false,
      description: values.description,
      status: EventStatus.PUBLISHED,
      attendeeCount: this.isNewEvent ? 0 : (this.event?.attendeeCount || 0),
      location: { name: values.locationName, address: values.locationAddress }
    };

    if (values.maxAttendees !== null && values.maxAttendees !== undefined) {
      payload.maxAttendees = Number(values.maxAttendees);
    }

    if (values.requiresAccessControl && values.limiteInvitadosPorSocio !== null && values.limiteInvitadosPorSocio !== undefined) {
      payload.limiteInvitadosPorSocio = Number(values.limiteInvitadosPorSocio);
    } else {
      payload.limiteInvitadosPorSocio = null;
    }

    try {
      await this.loading.wrap(async () => {
        if (this.temporaryPreviewBase64) {
          payload.imageUrl = await this.photoService.uploadEventPoster(finalId, this.temporaryPreviewBase64);
        } else {
          payload.imageUrl = this.event?.imageUrl || '';
        }

        if (this.isNewEvent) {
          await this.eventsService.createEvent(payload);
          await this.notification.success(AppMessageCode.ADC_EVENT_INF_0001);
        } else {
          await this.eventsService.updateEvent(finalId, payload);
          await this.notification.success(AppMessageCode.ADC_EVENT_INF_0002);
        }
      }, this.isNewEvent ? 'Convocando evento...' : 'Guardando modificaciones...');

      this.temporaryPreviewBase64 = '';
      this.router.navigate(['/events']);

    } catch (error) { this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0001); }
  }

  // 1. Añade el diccionario apuntando a la carpeta de assets/img de tu proyecto
  private readonly EVENT_FALLBACK_IMAGES: Record<string, string> = {
    asamblea: 'assets/img/evento-asamblea.jpg',
    comida: 'assets/img/evento-comida.jpg',
    feria: 'assets/img/evento-feria.jpg',
    quedada: 'assets/img/evento-quedada.jpg'
  };

  /**
   * @method getEventBgImage
   * @description Devuelve la imagen de portada personalizada o el fallback correspondiente.
   * @public
   */
  public getEventBgImage(event: any): string {
    if (event?.imageUrl && event.imageUrl.trim() !== '') {
      return event.imageUrl;
    }

    const tipo = event?.type?.toLowerCase();
    return this.EVENT_FALLBACK_IMAGES[tipo] || 'assets/img/escudo.png';
  }

  /**
   * @method openDatePickerModal
   * @async
   * @description Despliega el modal `DatePickerComponent` para seleccionar la fecha/hora del evento.
   * Actualiza dinámicamente los campos de inicio o fin del formulario reactivo `eventForm`.
   * 
   * @param {'startDate' | 'endDate'} field Nombre del control dentro del formulario a editar.
   * @returns {Promise<void>}
   */
  public async openDatePickerModal(field: 'startDate' | 'endDate'): Promise<void> {
    try {
      const isAllDay = this.eventForm.get('isAllDay')?.value ?? false;
      const currentValue = this.eventForm.get(field)?.value;

      // Asegurar siempre un string ISO válido para pasar al DatePickerComponent
      let initialIsoString = new Date().toISOString();
      if (currentValue) {
        const parsed = new Date(currentValue);
        if (!isNaN(parsed.getTime())) {
          initialIsoString = parsed.toISOString();
        }
      }

      const modal = await this.modalCtrl.create({
        component: DatePickerComponent,
        componentProps: {
          title: field === 'startDate' ? 'Inicio del Evento' : 'Fin del Evento',
          initialDate: initialIsoString,
          includeTime: !isAllDay
        },
        initialBreakpoint: 0.85,
        breakpoints: [0, 0.85, 1],
        handle: true,
        cssClass: 'date-picker-sheet-modal'
      });

      await modal.present();

      const { data, role } = await modal.onWillDismiss<DatePickerResult>();

      if (role === 'confirm' && data?.date) {
        const selectedIso = data.date;

        // 1. Asignar el valor al campo correspondiente (startDate o endDate)
        const control = this.eventForm.get(field);
        control?.setValue(selectedIso);
        control?.markAsDirty();
        control?.markAsTouched();

        // 2. Si se cambia la FECHA DE INICIO: ajustar dinámicamente la de FIN
        if (field === 'startDate' && !isAllDay) {
          const currentEndValue = this.eventForm.get('endDate')?.value;
          const startMs = new Date(selectedIso).getTime();
          const endMs = currentEndValue ? new Date(currentEndValue).getTime() : 0;

          // Si no hay fecha de fin o la fecha de inicio supera/iguala a la de fin -> Fin = Inicio + 2h
          if (!currentEndValue || startMs >= endMs) {
            const autoEndDate = new Date(startMs + 2 * 60 * 60 * 1000).toISOString();
            const endControl = this.eventForm.get('endDate');
            endControl?.setValue(autoEndDate);
            endControl?.markAsDirty();
            endControl?.markAsTouched();
          }
        }

        // 3. Si se cambia la FECHA DE FIN: validar que no sea inferior a la de inicio
        if (field === 'endDate' && !isAllDay) {
          const currentStartValue = this.eventForm.get('startDate')?.value;
          if (currentStartValue && new Date(selectedIso) <= new Date(currentStartValue)) {
            this.notification.warning('La fecha de fin debe ser posterior a la fecha de inicio.');
            // Reajustamos a Inicio + 2h
            const fallbackEnd = new Date(new Date(currentStartValue).getTime() + 2 * 60 * 60 * 1000).toISOString();
            this.eventForm.get('endDate')?.setValue(fallbackEnd);
          }
        }

        // 4. Forzar reevaluación del formulario y refrescar la vista
        this.eventForm.updateValueAndValidity();
        this.cdr.markForCheck();
      }
    } catch (error) {
      this.errorHandler.handle(error, AppMessageCode.ADC_DP_ERR_0004);
    }
  }
}