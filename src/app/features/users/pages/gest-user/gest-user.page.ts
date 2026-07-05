import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonBadge
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  addOutline,
  personOutline,
  chevronForwardOutline,
  checkmarkOutline,
  closeOutline,
  briefcaseOutline,
  callOutline,
  eyeOffOutline
} from 'ionicons/icons';

import { UserService } from 'projects/shared-core/src/lib/services/user.service';
import { User } from 'shared-core';
import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';
import { DialogService } from 'projects/shared-core/src/lib/services/dialog.service';
import { LoadingService } from 'projects/shared-core/src/lib/services/loading.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';
import { AuthPoliciesService } from 'projects/shared-core/src/lib/services/auth-policies.service';
import { AppMessageCode } from 'shared-core';
import { EmptyStateComponent } from 'shared-core';
import { PageHeaderComponent } from 'shared-core';

/**
 * @class GestUserPage
 * @description Componente controlador de la pantalla de directorio y gestión general de usuarios.
 * Se encuentra 100% desacoplado de la base de datos de Firebase, canalizando todas las lecturas a través de la interfaz expuesta por el UserService.
 * @implements OnInit
 */
@Component({
  selector: 'app-gest-user',
  templateUrl: './gest-user.page.html',
  styleUrls: ['./gest-user.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonBadge,
    EmptyStateComponent,
    PageHeaderComponent
  ]
})
export class GestUserPage implements OnInit {

  /**
   * @description Listado maestro global de usuarios activos recuperados del servicio.
   * @type {User[]}
   */
  public users: User[] = [];

  /**
   * @description Listado secundario filtrado en tiempo real de usuarios activos para renderizar en la interfaz gráfica.
   * @type {User[]}
   */
  public filteredUsers: User[] = [];

  /**
   * @description Listado maestro de usuarios cuya solicitud de pre-alta web está pendiente de revisión.
   * @type {User[]}
   */
  public pendingUsers: User[] = [];

  /**
   * @description Listado secundario filtrado en tiempo real de usuarios pendientes.
   * @type {User[]}
   */
  public filteredPendingUsers: User[] = [];

  /**
   * @description Listado maestro de usuarios que han sido dados de baja de forma lógica en la plataforma.
   * @type {User[]}
   */
  public inactiveUsers: User[] = [];

  /**
   * @description Listado secundario filtrado en tiempo real de usuarios en estado inactivo.
   * @type {User[]}
   */
  public filteredInactiveUsers: User[] = [];

  /**
   * @description Segmento de usuarios activos actualmente acoplado al scroll infinito para evitar bloqueos del DOM.
   * @type {User[]}
   */
  public visibleUsers: User[] = [];

  /**
   * @description Segmento de usuarios pendientes acoplado al paginador progresivo del scroll infinito.
   * @type {User[]}
   */
  public visiblePendingUsers: User[] = [];

  /**
   * @description Segmento de usuarios inactivos acoplado al paginador progresivo del scroll infinito.
   * @type {User[]}
   */
  public visibleInactiveUsers: User[] = [];

  /**
   * @description Tamaño máximo predeterminado del bloque de carga por lote para la paginación progresiva.
   * @type {number}
   */
  public pageSize: number = 15;

  /**
   * @description Cadena de texto reactiva vinculada al buscador que almacena los criterios introducidos por el usuario.
   * @type {string}
   */
  public searchText: string = '';

  /**
   * @description Flag lógico que determina si el usuario en sesión posee privilegios para dar de alta perfiles de forma manual.
   * @type {boolean}
   */
  public canAddUsers: boolean = false;

  /**
   * @description Flag lógico que determina si el usuario en sesión está autorizado a validar o denegar altas pendientes.
   * @type {boolean}
   */
  public canApproveUsers: boolean = false;

  /**
   * @description Flag de administración que habilita la capacidad de visualizar registros históricos de bajas.
   * @type {boolean}
   */
  public canViewInactiveUsers: boolean = false;

  /**
   * @description Identificador de la pestaña o segmento seleccionado actualmente en la vista ('activos' | 'pendientes' | 'inactivos').
   * @type {string}
   */
  public tabActual: string = 'activos';

  /**
   * @description Variable de control atómico que determina si el usuario logueado es un socio ordinario sin privilegios de gestión.
   * @type {boolean}
   */
  public isSocioComun: boolean = false;

  /**
   * @constructor
   * @description Inicializa el componente e inyecta las dependencias de la capa de servicios, registrando el set nativo de iconos vectoriores.
   * @param {UserService} userService Servicio centralizado para la manipulación y abstracción de datos de usuarios.
   * @param {NotificationService} notification Servicio reactivo para despachar alertas y notificaciones Toast en pantalla.
   * @param {Router} router Enrutador general de Angular para la navegación entre vistas.
   * @param {ActivatedRoute} route Capturador de estados y parámetros dinámicos de la URL activa.
   * @param {AuthPoliciesService} policies Centralizador de políticas y evaluación perimetral de roles y permisos.
   * @param {DialogService} dialog Componente abstracto para el despliegue de modales y ventanas de confirmación.
   * @param {LoadingService} loading Controlador para superponer velos de carga asíncronos en la UI.
   * @param {ErrorHandlerService} errorHandler Servicio interceptor para el aislamiento y tipado de excepciones críticas del sistema.
   */
  constructor(
    private userService: UserService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private policies: AuthPoliciesService,
    private dialog: DialogService,
    private loading: LoadingService,
    private errorHandler: ErrorHandlerService
  ) {
    addIcons({
      addOutline, personOutline, chevronForwardOutline,
      checkmarkOutline, closeOutline, briefcaseOutline,
      callOutline, eyeOffOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Ciclo de vida inicial del componente Angular. Ejecuta el mapeo de permisos y desencadena la descarga de datos a través del servicio.
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    this.loadPermissions();
    await this.loadUsers();
  }

  /**
   * @method ionViewWillEnter
   * @description Ciclo de vida nativo de Ionic que evalúa parámetros de query-params dinámicos e invoca la recarga limpia de las colecciones desde el servicio.
   * @returns {Promise<void>}
   */
  public async ionViewWillEnter(): Promise<void> {
    this.loadPermissions();
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam && (tabParam === 'activos' || tabParam === 'pendientes' || tabParam === 'inactivos')) {
      this.tabActual = tabParam;
    }
    await this.loadUsers();
  }

  /**
   * @method loadUsers
   * @description Centraliza la sincronización asíncrona de datos invocando de forma abstracta los métodos del UserService.
   * Aplica la bifurcación de seguridad requerida: si detecta un socio común, consume el endpoint blindado `getUsersForSocioComun`; 
   * si es directivo o admin, consume el directorio completo de gestión asumiendo la carga de pestañas pendientes e inactivas.
   * @returns {Promise<void>}
   */
  public async loadUsers(): Promise<void> {
    try {
      this.users = [];

      if (this.isSocioComun) {
        this.users = await this.userService.getUsersForSocioComun();
      } else {
        this.users = await this.userService.getApprovedUsers();
      }

      this.filteredUsers = [...this.users];

      if (this.canApproveUsers && !this.isSocioComun) {
        this.pendingUsers = await this.userService.getPendingUsers();
        this.filteredPendingUsers = [...this.pendingUsers];
      } else {
        this.pendingUsers = [];
        this.filteredPendingUsers = [];
      }

      if (this.canViewInactiveUsers && !this.isSocioComun) {
        this.inactiveUsers = await this.userService.getInactiveUsers();
        this.filteredInactiveUsers = [...this.inactiveUsers];
      } else {
        this.inactiveUsers = [];
        this.filteredInactiveUsers = [];
      }

      this.resetPagination();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  /**
   * @method loadPermissions
   * @description Mapea en caliente las políticas y flags de seguridad analizando los tokens de sesión activos de forma síncrona.
   * @returns {void}
   */
  public loadPermissions(): void {
    this.isSocioComun = this.policies.isSocio() && !this.policies.isAdmin() && !this.policies.isDirectiva();
    this.canAddUsers = !this.isSocioComun && (this.policies.isAdmin() || this.policies.isDirectiva());
    this.canApproveUsers = this.policies.canManageUsers() && !this.isSocioComun;
    this.canViewInactiveUsers = (this.policies.isAdmin() || this.policies.isDirectiva()) && !this.isSocioComun;
  }

  /**
   * @method filterUsers
   * @description Motor de búsqueda local por coincidencia de caracteres. Filtra en minúsculas los arrays en caliente.
   * Incluye el mapeo predictivo del estado financiero convirtiendo el booleano en cadenas textuales en español.
   * @returns {void}
   */
  public filterUsers(): void {
    const texto = this.searchText.toLowerCase().trim();

    this.filteredUsers = this.users.filter(user => {
      const textoCuota = user.cuotaAlCorriente ? 'al corriente' : 'pendiente';
      
      return user.nombre?.toLowerCase().includes(texto) ||
        user.numeroSocio?.toLowerCase().includes(texto) ||
        user.telefono?.toLowerCase().includes(texto) ||
        user.email?.toLowerCase().includes(texto) ||
        user.dni?.toLowerCase().includes(texto) ||
        user.profesion?.toLowerCase().includes(texto) ||
        user.tipo?.toLowerCase().includes(texto) ||
        (!this.isSocioComun && textoCuota.includes(texto));
    });

    this.filteredPendingUsers = this.pendingUsers.filter(user =>
      user.nombre?.toLowerCase().includes(texto) ||
      user.telefono?.toLowerCase().includes(texto) ||
      user.email?.toLowerCase().includes(texto) ||
      user.profesion?.toLowerCase().includes(texto) ||
      user.dni?.toLowerCase().includes(texto)
    );

    this.filteredInactiveUsers = this.inactiveUsers.filter(user => {
      const textoCuota = user.cuotaAlCorriente ? 'al corriente' : 'pendiente';
      return user.nombre?.toLowerCase().includes(texto) ||
        user.telefono?.toLowerCase().includes(texto) ||
        user.email?.toLowerCase().includes(texto) ||
        user.dni?.toLowerCase().includes(texto) ||
        user.numeroSocio?.toLowerCase().includes(texto) ||
        user.profesion?.toLowerCase().includes(texto) ||
        user.tipo?.toLowerCase().includes(texto) ||
        (!this.isSocioComun && textoCuota.includes(texto));
    });

    this.resetPagination();
  }

  /**
   * @method resetPagination
   * @description Inicializa o restablece las porciones de arrays visibles limitados por el tamaño del lote `pageSize`.
   * @returns {void}
   */
  public resetPagination(): void {
    this.visibleUsers = this.filteredUsers.slice(0, this.pageSize);
    this.visiblePendingUsers = this.filteredPendingUsers.slice(0, this.pageSize);
    this.visibleInactiveUsers = this.filteredInactiveUsers.slice(0, this.pageSize);
  }

  /**
   * @method cargarMasUsuarios
   * @description Concatena lotes incrementales de registros a la vista de scroll activo mitigando sobrecargas en el DOM.
   * @param {any} event Objeto evento nativo de finalización del refresco emitido por el componente `<ion-infinite-scroll>`.
   * @returns {void}
   */
  public cargarMasUsuarios(event: any): void {
    if (this.tabActual === 'activos') {
      const currentLen = this.visibleUsers.length;
      const more = this.filteredUsers.slice(currentLen, currentLen + this.pageSize);
      this.visibleUsers = [...this.visibleUsers, ...more];
    } else if (this.tabActual === 'pendientes') {
      const currentLen = this.visiblePendingUsers.length;
      const more = this.filteredPendingUsers.slice(currentLen, currentLen + this.pageSize);
      this.visiblePendingUsers = [...this.visiblePendingUsers, ...more];
    } else if (this.tabActual === 'inactivos') {
      const currentLen = this.visibleInactiveUsers.length;
      const more = this.filteredInactiveUsers.slice(currentLen, currentLen + this.pageSize);
      this.visibleInactiveUsers = [...this.visibleInactiveUsers, ...more];
    }

    event.target.complete();
  }

  /**
   * @method isScrollDisabled
   * @description Evalúa de forma local si el hardware del Infinite Scroll debe inhabilitar su escucha activa.
   * @returns {boolean} Retorna true si se han impreso en pantalla todos los elementos del array filtrado.
   */
  public isScrollDisabled(): boolean {
    if (this.tabActual === 'activos') return this.visibleUsers.length >= this.filteredUsers.length;
    if (this.tabActual === 'pendientes') return this.visiblePendingUsers.length >= this.filteredPendingUsers.length;
    if (this.tabActual === 'inactivos') return this.visibleInactiveUsers.length >= this.filteredInactiveUsers.length;
    return true;
  }

  /**
   * @method nuevoUsuario
   * @description Enruta al operador hacia el detalle de usuario inyectando banderas dinámicas query-params de alta manual.
   * @returns {void}
   */
  public nuevoUsuario(): void {
    this.router.navigate(['/user-detail'], { queryParams: { adminCreate: true } });
  }

  /**
   * @method aprobarUsuario
   * @description Dispacha el UID hacia el UserService para tramitar la aprobación del ingreso del socio a través de la Cloud Function.
   * @param {User} user Instancia de datos del usuario que se pretende aprobar.
   * @returns {Promise<void>}
   */
  public async aprobarUsuario(user: User): Promise<void> {
    try {
      await this.loading.wrap(async () => {
        await this.userService.approveUser(user.id);
        await this.notification.success(AppMessageCode.ADC_USER_INF_0001);
        await this.loadUsers();
      }, 'Aprobando usuario...');
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_ADMIN_ERR_0001);
    }
  }

  /**
   * @method rechazarUsuario
   * @description Despliega el diálogo modal de confirmación y despacha la petición de denegación lógica al UserService.
   * @param {User} user Instancia de datos del usuario que se pretende rechazar.
   * @returns {Promise<void>}
   */
  public async rechazarUsuario(user: User): Promise<void> {
    const confirmar = await this.dialog.confirm({
      header: 'Rechazar usuario',
      message: `¿Rechazar solicitud de ${user.nombre}?`,
      confirmText: 'Rechazar',
      cancelText: 'Cancelar'
    });

    if (!confirmar) return;

    try {
      await this.loading.wrap(async () => {
        await this.userService.rejectUser(user.id);
        await this.notification.success(AppMessageCode.ADC_USER_INF_0002);
        await this.loadUsers();
      }, 'Rechazando usuario...');
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_ADMIN_ERR_0002);
    }
  }
}