import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  closeOutline,
  sendOutline,
  alertCircleOutline,
  trashOutline,
  peopleOutline,
  sparklesOutline,
  calendarOutline
} from 'ionicons/icons';

import {
  PageHeaderComponent,
  AuthService,
  EventsService,
  FairService, // 🚀 INYECTADO: Servicio unificado de shared-core para pases de feria
  NotificationService,
  LoadingService,
  DialogService,
  ErrorHandlerService,
  User,
  FairAccess,
  AppEvent,
  AppMessageCode
} from 'shared-core';

/**
 * @class EventGuestsPage
 * @description Componente controlador de la vista de asignación de pases e invitaciones para acompañantes externos.
 * Cumple con el aislamiento arquitectónico estricto: toda interacción con la BD se delega en servicios de shared-core.
 */
@Component({
  selector: 'app-event-guests',
  templateUrl: './event-guests.page.html',
  styleUrls: ['./event-guests.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    PageHeaderComponent
  ]
})
export class EventGuestsPage implements OnInit {
  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private eventsService = inject(EventsService);
  private fairService = inject(FairService); // 🚀 Consumo delegado de base de datos
  private notification = inject(NotificationService);
  private loading = inject(LoadingService);
  private dialogService = inject(DialogService);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  /** @description ID único de la convocatoria extraído de la URL. */
  public eventId: string | null = null;
  /** @description Datos de la convocatoria hidratados desde el servicio. */
  public eventoData: AppEvent | null = null;
  /** @description UID del socio o directivo autenticado en la sesión actual. */
  public currentUserId: string | null = null;
  /** @description Ficha completa con los datos de perfil del socio logueado. */
  public currentUserData: any = null;
  /** @description Fecha actual formateada en huso local (YYYY-MM-DD) para indexación de pases. */
  public hoyFormateado = '';

  /** @description Cupo máximo de pases configurados en la convocatoria para este socio. */
  public limiteInvitaciones = 0;
  /** @description Contador reactivo del número de pases ya expedidos hoy por el socio. */
  public invitacionesEnviadasHoy = 0;

  /** @description Listado de pases emitidos bajo la responsabilidad del socio para esta convocatoria. */
  public misInvitadosEvento: FairAccess[] = [];
  /** @description Bolsa general de usuarios candidatos con rol invitado activos en el censo. */
  public usuariosActivos: User[] = [];
  /** @description Colección filtrada en caliente según los inputs del buscador de la UI. */
  public usuariosFiltrados: User[] = [];

  /** @description Cadena reactiva vinculada al input de búsqueda de la UI. */
  public nombreBusqueda = '';
  /** @description ID del usuario seleccionado del dropdown predictivo listo para ser invitado. */
  public invitadoSeleccionadoId = '';

  /**
   * @constructor
   * @description Registra la iconografía atómica integrada de la peña.
   */
  constructor() {
    addIcons({
      searchOutline,
      closeOutline,
      sendOutline,
      alertCircleOutline,
      trashOutline,
      peopleOutline,
      sparklesOutline,
      calendarOutline
    });

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    this.hoyFormateado = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
  }

  /**
   * @method ngOnInit
   * @description Ciclo de vida inicial. Hidrata la sesión del socio y valida las rutas de entrada.
   */
  public async ngOnInit(): Promise<void> {
    await this.authService.waitForUserData();
    this.currentUserId = this.authService.getUid();
    this.currentUserData = this.authService.currentUserData;
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (this.currentUserId && this.eventId) {
      await this.cargarConfiguracionYInvitados();
    } else {
      this.router.navigate(['/fair']);
    }
  }

  /**
   * @method ordenarAlfabeticamente
   * @description Helper de ordenación puramente en memoria de colecciones de usuarios.
   */
  public async ordenarAlfabeticamente(usuarios: User[]): Promise<User[]> {
    return usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  /**
   * @method cargarConfiguracionYInvitados
   * @description Descarga la configuración de la convocatoria delegando la consulta en el EventsService.
   */
  public async cargarConfiguracionYInvitados(): Promise<void> {
    try {
      this.eventsService.getEventById(this.eventId!).subscribe({
        next: async (eventData) => {
          if (eventData) {
            this.eventoData = eventData;
            this.limiteInvitaciones = (eventData as any).limiteInvitadosPorSocio || 0;

            await this.cargarTablaInvitados();
          }
        },
        error: (err) => this.errorHandler.handle(err)
      });
    } catch (error) {
      this.errorHandler.handle(error);
    }
  }

  /**
   * @method cargarTablaInvitados
   * @description Descarga la relación de pases emitidos hoy y filtra las cuentas candidatas a recibir invitación.
   */
  public async cargarTablaInvitados(): Promise<void> {
    if (!this.currentUserId || !this.eventId || !this.eventoData) return;

    try {
      // 🚀 DELEGADO: Obtenemos pases emitidos hoy desde FairService en shared-core
      this.misInvitadosEvento = await this.fairService.obtenerInvitadosDelSocio(this.currentUserId, this.hoyFormateado);
      this.misInvitadosEvento = this.misInvitadosEvento.filter(p => p.eventId === this.eventId);
      this.invitacionesEnviadasHoy = this.misInvitadosEvento.length;

      // 🚀 DELEGADO: Obtenemos candidatos idóneos libres de pases hoy desde FairService
      const candidatosBrutos = await this.fairService.obtenerCandidatosInvitadosDisponibles(this.currentUserId, this.hoyFormateado);

      // Filtro defensivo local adicional por si ya estuviera invitado en esta sub-convocatoria específica
      const usuariosTmp = candidatosBrutos.filter(u => !this.misInvitadosEvento.some(inv => inv.userId === u.id));

      this.usuariosActivos = await this.ordenarAlfabeticamente(usuariosTmp);

      if (this.nombreBusqueda && this.nombreBusqueda.trim()) {
        this.filtrarUsuarios({ target: { value: this.nombreBusqueda } });
      }

      this.cdr.detectChanges();
    } catch (error) {
      this.errorHandler.handle(error);
    }
  }

  /**
   * @method filtrarUsuarios
   * @description Filtra en memoria local el listado predictivo del buscador basándose en nombres o DNI.
   */
  public filtrarUsuarios(event: any): void {
    const termino = event.target.value ? event.target.value.toLowerCase() : '';
    this.nombreBusqueda = event.target.value;
    this.invitadoSeleccionadoId = '';

    if (!termino.trim()) {
      this.usuariosFiltrados = [];
      return;
    }

    this.usuariosFiltrados = this.usuariosActivos.filter(user => {
      const nombreSatisface = user.nombre ? user.nombre.toLowerCase().includes(termino) : false;
      const dniSatisface = user.dni ? user.dni.toLowerCase().includes(termino) : false;
      return nombreSatisface || dniSatisface;
    });
  }

  public seleccionarUsuario(user: User): void {
    this.invitadoSeleccionadoId = user.id;
    this.nombreBusqueda = user.nombre;
    this.usuariosFiltrados = [];
  }

  public limpiarBusqueda(): void {
    this.nombreBusqueda = '';
    this.invitadoSeleccionadoId = '';
    this.usuariosFiltrados = [];
  }

  /**
   * @method enviarInvitacion
   * @description Invoca el método transaccional de FairService en shared-core, el cual evalúa 
   * el aforo en caliente en el servidor blindando la app de condiciones de carrera.
   */
  public async enviarInvitacion(): Promise<void> {
    if (!this.invitadoSeleccionadoId || !this.eventId || !this.eventoData) return;

    const usuarioFinal = this.usuariosActivos.find(u => u.id === this.invitadoSeleccionadoId);
    if (!usuarioFinal) return;

    try {
      await this.loading.wrap(async () => {
        // 🚀 INVOCACIÓN DE CAPA DE SERVICIO CENTRALIZADA: Cero lógica de BD local
        await this.fairService.crearInvitacionTransaccional(
          this.currentUserData,
          usuarioFinal,
          this.hoyFormateado,
          this.eventoData!
        );
      }, 'Emitiendo pase digital seguro...');

      this.notification.success('Invitación generada con éxito. El aforo ha sido actualizado.');
      this.limpiarBusqueda();
      await this.cargarTablaInvitados();
    } catch (error: any) {
      if (error?.message?.includes('¡Aforo Completo!')) {
        this.notification.warning(error.message);
      } else {
        this.errorHandler.handle(error);
      }
    }
  }

  /**
   * @method eliminarPase
   * @description Solicita confirmación imperativa al usuario y delega la anulación del pase digital 
   * individual en la capa de servicios de shared-core. Centraliza el reporte de fallos en el interceptor 
   * maestro del monorrepo.
   * @param {FairAccess} pase Instancia del pase que se desea revocar.
   */
  public async eliminarPase(pase: FairAccess): Promise<void> {
    (document.activeElement as HTMLElement)?.blur();

    if (!this.eventId || !this.eventoData || !pase.id) return;

    const confirmado = await this.dialogService.confirm({
      header: 'Anular Pase de Invitado',
      message: `¿Estás seguro de que deseas anular la invitación de "${pase.userName}"? Se liberará una plaza del aforo de forma inmediata.`,
      confirmText: 'Sí, Anular',
      cancelText: 'Cancelar'
    });

    if (!confirmado) return;

    try {
      await this.loading.wrap(async () => {
        await this.fairService.eliminarInvitacionTransaccional(pase.id!, this.eventId!);

        // 🚀 ALINEACIÓN EN CALIENTE DE LA CACHÉ VISUAL:
        if (this.eventoData) {
          const actual = this.eventoData.attendeeCount || 0;
          this.eventoData.attendeeCount = Math.max(0, actual - 1);
        }
      }, 'Revocando pase y liberando aforo...');

      this.notification.success(AppMessageCode.ADC_FAIR_INF_0002);
      await this.cargarTablaInvitados();
    } catch (error) {
      // 🚀 DELEGACIÓN EN ERROR-HANDLER: Procesa el error traduciéndolo automáticamente 
      // o aplicando el fallback corporativo de fallo de anulación de pase
      await this.errorHandler.handle(error, AppMessageCode.ADC_FAIR_ERR_0005);
    }
  }
}