import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonPopover,
  IonDatetime,
  IonCheckbox,
  IonToggle,
  IonList,
  IonItem,
  IonLabel,
  AlertController // 🚀 Importado para lanzar la ventana de confirmación nativa de Ionic
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline, calendarOutline, mapOutline, peopleOutline,
  imageOutline, cameraOutline, imagesOutline, pinOutline, lockClosedOutline, wineOutline, trashOutline
} from 'ionicons/icons';

import { Subject, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';

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
  APP_MESSAGES,
  AuthService
} from 'shared-core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// 🇪🇸 Diccionarios de Traducción Oficial para ACD Los Locos
export const EVENT_TYPE_ES: Record<EventType, string> = {
  [EventType.ASAMBLEA]: '🗳️ Asamblea General',
  [EventType.COMIDA]: '🍽️ Comida / Convivencia',
  [EventType.QUEDADA]: '🛵 Quedada de la Peña',
  [EventType.FERIA]: '🎪 Caseta de la Feria'
};

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon,
    IonPopover,
    IonDatetime,
    IonCheckbox,
    IonToggle,
    IonList,
    IonItem,
    IonLabel,
    PageHeaderComponent
  ]
})
export class EventDetailPage implements OnInit, OnDestroy {
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
  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController); // 🚀 Inyector nativo de diálogos

  @ViewChild('popoverStart') popoverStart!: IonPopover;
  @ViewChild('popoverEnd') popoverEnd!: IonPopover;

  // Exponemos la constante de traducción al HTML
  public tipoTraduccion = EVENT_TYPE_ES;

  isNewEvent: boolean = false;
  isEditing: boolean = false;
  isAdmin: boolean = false;

  eventForm!: FormGroup;
  event?: AppEvent;
  temporaryPreviewBase64: string = '';

  selectedStartDate: string = '';
  selectedEndDate: string = '';

  direccionSubject = new Subject<string>();
  sugerencias: any[] = [];
  mostrarSugerencias = false;
  private mapboxSub!: Subscription;

  constructor() {
    addIcons({
      createOutline, calendarOutline, mapOutline, peopleOutline,
      imageOutline, cameraOutline, imagesOutline, pinOutline, lockClosedOutline, wineOutline, trashOutline
    });
    this.initForm();
  }

  async ngOnInit() {
    await this.authService.waitForUserData();
    this.isAdmin = this.authService.isAdmin() || this.authService.isDirectiva();

    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.isNewEvent = false;
      this.isEditing = false;
      this.loadEvent(eventId);
    } else {
      if (!this.isAdmin) {
        this.notification.warning('Acceso denegado: No tienes permisos para crear eventos.');
        this.router.navigate(['/events']);
        return;
      }
      this.isNewEvent = true;
      this.isEditing = true;
      this.eventForm.enable();
      this.habilitarCamposSegunTipo(this.eventForm.get('type')?.value);
      this.cdr.detectChanges();
    }

    this.mapboxSub = this.direccionSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 3) {
          return this.mapboxService.buscarDireccion(query, environment.mapboxToken);
        } else {
          this.mostrarSugerencias = false;
          return of([]);
        }
      })
    ).subscribe(resultados => {
      this.sugerencias = resultados;
      this.mostrarSugerencias = this.sugerencias.length > 0;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.mapboxSub) this.mapboxSub.unsubscribe();
  }

  private initForm() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      imageUrl: [''],
      type: [EventType.COMIDA, [Validators.required]],
      isPrivate: [false],
      isAllDay: [false],
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

    this.eventForm.get('type')?.valueChanges.subscribe((tipoSeleccionado: EventType) => {
      this.habilitarCamposSegunTipo(tipoSeleccionado);
    });
  }

  private habilitarCamposSegunTipo(tipo: EventType) {
    const limiteControl = this.eventForm.get('limiteInvitadosPorSocio');

    if (tipo === EventType.FERIA) {
      limiteControl?.setValidators([Validators.required, Validators.min(1)]);
      if (this.isEditing) limiteControl?.enable();
    } else {
      limiteControl?.setValue(null);
      limiteControl?.clearValidators();
      limiteControl?.disable();
    }
    limiteControl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  private loadEvent(id: string) {
    this.eventsService.getEventById(id).subscribe({
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
            startDate: eventData.startDate,
            endDate: eventData.endDate || '',
            maxAttendees: eventData.maxAttendees,
            limiteInvitadosPorSocio: eventData.limiteInvitadosPorSocio || null,
            description: eventData.description,
            locationName: eventData.location?.name,
            locationAddress: eventData.location?.address
          });

          this.habilitarCamposSegunTipo(eventData.type);
        }
      },
      error: (err) => this.errorHandler.handle(err, AppMessageCode.ADC_EVENT_ERR_0005)
    });
  }

  onAddressInput(event: any) {
    const nuevaDireccion = this.eventForm.get('locationAddress')?.value || '';
    if (nuevaDireccion.trim().length <= 3) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      return;
    }
    this.direccionSubject.next(nuevaDireccion);
  }

  selectAddressSuggestion(sugerencia: any) {
    const direccionFinal = sugerencia.place_formatted || sugerencia;
    this.eventForm.get('locationAddress')?.setValue(direccionFinal);
    this.mostrarSugerencias = false;
    this.sugerencias = [];
    this.cdr.detectChanges();
  }

  ocultarSugerencias() {
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.cdr.detectChanges();
    }, 250);
  }

  async onDateConfirmNative(controlName: string, event: any) {
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

    if (controlName === 'startDate') {
      const selectedStart = new Date(value);

      if (selectedStart < now) {
        this.notification.warning(AppMessageCode.ADC_EVENT_ERR_0006);
        startDateControl?.setValue(now.toISOString());
        this.closePopoverRef(controlName);
        return;
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

  private closePopoverRef(controlName: string) {
    if (controlName === 'startDate' && this.popoverStart) {
      this.popoverStart.dismiss();
    } else if (controlName === 'endDate' && this.popoverEnd) {
      this.popoverEnd.dismiss();
    }
  }

  async selectFromGallery() {
    if (!this.isAdmin) return;
    try {
      const image = await Camera.getPhoto({
        quality: 90, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Photos
      });
      if (image.dataUrl) this.processLocalImage(image.dataUrl);
    } catch (error) { console.warn('Gesto omitido'); }
  }

  async takePhoto() {
    if (!this.isAdmin) return;
    try {
      const image = await Camera.getPhoto({
        quality: 90, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Camera
      });
      if (image.dataUrl) this.processLocalImage(image.dataUrl);
    } catch (error) { console.warn('Gesto omitido'); }
  }

  private async processLocalImage(dataUrl: string) {
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

  toggleEdit() {
    if (!this.isAdmin) return;
    this.isEditing = true;
    this.eventForm.enable();
    this.habilitarCamposSegunTipo(this.eventForm.get('type')?.value);
    if (this.eventForm.get('isAllDay')?.value) {
      this.eventForm.get('endDate')?.disable();
    }
  }

  cancelEdit() {
    if (this.isNewEvent) {
      this.router.navigate(['/events']);
    } else {
      this.isEditing = false;
      this.temporaryPreviewBase64 = '';
      this.eventForm.disable();
      if (this.event?.id) this.loadEvent(this.event.id);
    }
  }

  // 🛑 NUEVO: Función para la eliminación masiva con push integrado
  async clickEliminarConvocatoria() {
    if (!this.event || !this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: '🛑 ¿Eliminar Convocatoria?',
      subHeader: 'A.D.C. Los Locos',
      message: `¿Estás seguro de cancelar "${this.event.title}"? Se enviará una alerta push inmediata a los móviles de los socios y la convocatoria se eliminará del sistema por completo.`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Volver Atrás',
          role: 'cancel'
        },
        {
          text: 'Sí, Cancelar y Notificar',
          role: 'destructive',
          handler: async () => {
            try {
              // Envolvemos el guardado con tu loader atómico y protección offline
              await this.loading.wrap(async () => {
                await this.eventsService.deleteEvent(this.event!);
                await this.notification.success('El evento ha sido cancelado. Notificación distribuida con éxito.');
              }, 'Cancelando evento y disparando alertas masivas...');

              setTimeout(() => {
                this.router.navigate(['/events']);
              }, 100);
              
            } catch (error) {
              this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0001);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async onSubmit() {
    if (this.eventForm.invalid || !this.isAdmin) {
      if (this.eventForm.get('limiteInvitadosPorSocio')?.hasError('required')) {
        this.notification.warning(APP_MESSAGES[AppMessageCode.ADC_EVENT_ERR_0009]);
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
      startDate: values.startDate,
      endDate: values.isAllDay ? '' : values.endDate,
      allDay: values.isAllDay ?? false,
      description: values.description,
      status: EventStatus.PUBLISHED,
      attendeeCount: this.isNewEvent ? 0 : (this.event?.attendeeCount || 0),
      location: {
        name: values.locationName,
        address: values.locationAddress
      }
    };

    if (values.type !== EventType.FERIA && values.maxAttendees !== null && values.maxAttendees !== undefined) {
      payload.maxAttendees = Number(values.maxAttendees);
    }

    if (values.type === EventType.FERIA && values.limiteInvitadosPorSocio !== null && values.limiteInvitadosPorSocio !== undefined) {
      payload.limiteInvitadosPorSocio = Number(values.limiteInvitadosPorSocio);
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

    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0001);
    }
  }
}