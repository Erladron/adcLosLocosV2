import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Importamos los componentes Standalone que usa la pantalla desde Ionic (Añadidos Infinite Scroll)
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
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';

// Importamos el motor de registro de iconos nativo de Ionic
import { addIcons } from 'ionicons';

// ⚙️ SECCIÓN DE ICONOS
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

// Importaciones de servicios del núcleo de la aplicación (Shared Core)
import { UserService } from 'projects/shared-core/src/lib/services/user.service';
import { User } from 'shared-core';
import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';
import { DialogService } from 'projects/shared-core/src/lib/services/dialog.service';
import { LoadingService } from 'projects/shared-core/src/lib/services/loading.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';
import { AuthPoliciesService } from 'projects/shared-core/src/lib/services/auth-policies.service';
import { AppMessageCode } from 'shared-core';

// Componentes visuales personalizados compartidos
import { EmptyStateComponent } from 'shared-core';
import { PageHeaderComponent } from 'shared-core';

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
    EmptyStateComponent,
    PageHeaderComponent
  ]
})
export class GestUserPage implements OnInit {

  // ==========================================================================
  // COLECCIONES MAESTRAS Y FILTRADAS
  // ==========================================================================
  users: User[] = [];
  filteredUsers: User[] = [];
  pendingUsers: User[] = [];
  filteredPendingUsers: User[] = [];
  inactiveUsers: User[] = [];
  filteredInactiveUsers: User[] = [];

  // ==========================================================================
  // COLECCIONES VISIBLES (Las que se renderizan en el DOM por lotes)
  // ==========================================================================
  visibleUsers: User[] = [];
  visiblePendingUsers: User[] = [];
  visibleInactiveUsers: User[] = [];
  pageSize: number = 15; // Tamaño del lote de carga

  // ==========================================================================
  // CONTROL DE INTERFAZ DE USUARIO (UI)
  // ==========================================================================
  searchText = '';
  canAddUsers = false;
  canApproveUsers = false;
  canViewInactiveUsers = false;
  tabActual = 'activos';

  /** 🛡️ BANDERA DE CONTROL */
  isSocioComun = false;

  constructor(
    private userService: UserService,
    private notification: NotificationService,
    private router: Router,
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

  async ngOnInit() {
    this.loadPermissions();
    await this.loadUsers();
  }

  async ionViewWillEnter() {
    this.loadPermissions();
    await this.loadUsers();
  }

  // ==========================================================================
  // MOTOR DE CARGA
  // ==========================================================================
  async loadUsers() {
    const rawActiveUsers = await this.userService.getApprovedUsers();

    if (this.isSocioComun) {
      this.users = rawActiveUsers.filter(u => 
        u.tipo === 'directiva' || u.tipo === 'socio' || u.tipo === 'invitado'
      );
    } else {
      this.users = rawActiveUsers;
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

    // Inicializamos el primer lote visible tras cargar todo de Firebase
    this.resetPagination();
  }

  loadPermissions() {
    this.isSocioComun = this.policies.isSocio() && !this.policies.isAdmin() && !this.policies.isDirectiva();
    this.canAddUsers = !this.isSocioComun && (this.policies.isAdmin() || this.policies.isDirectiva());
    this.canApproveUsers = this.policies.canManageUsers() && !this.isSocioComun;
    this.canViewInactiveUsers = (this.policies.isAdmin() || this.policies.isDirectiva()) && !this.isSocioComun;
  }

  // ==========================================================================
  // BARRA DE BÚSQUEDA INTEGRADORA
  // ==========================================================================
  filterUsers() {
    const texto = this.searchText.toLowerCase().trim();

    this.filteredUsers = this.users.filter(user => 
      user.nombre?.toLowerCase().includes(texto) ||
      user.telefono?.toLowerCase().includes(texto) ||
      user.email?.toLowerCase().includes(texto) ||
      user.dni?.toLowerCase().includes(texto) ||
      user.numeroSocio?.toLowerCase().includes(texto) ||
      user.profesion?.toLowerCase().includes(texto) || 
      user.tipo?.toLowerCase().includes(texto)
    );

    this.filteredPendingUsers = this.pendingUsers.filter(user => 
      user.nombre?.toLowerCase().includes(texto) ||
      user.telefono?.toLowerCase().includes(texto) ||
      user.email?.toLowerCase().includes(texto) ||
      user.profesion?.toLowerCase().includes(texto) ||
      user.dni?.toLowerCase().includes(texto)
    );

    this.filteredInactiveUsers = this.inactiveUsers.filter(user => 
      user.nombre?.toLowerCase().includes(texto) ||
      user.telefono?.toLowerCase().includes(texto) ||
      user.email?.toLowerCase().includes(texto) ||
      user.dni?.toLowerCase().includes(texto) ||
      user.numeroSocio?.toLowerCase().includes(texto) ||
      user.profesion?.toLowerCase().includes(texto) ||
      user.tipo?.toLowerCase().includes(texto)
    );

    // Al filtrar, reiniciamos la paginación visual para mostrar los primeros resultados
    this.resetPagination();
  }

  // ==========================================================================
  // MOTOR DE PAGINACIÓN (Scroll Infinito)
  // ==========================================================================
  resetPagination() {
    this.visibleUsers = this.filteredUsers.slice(0, this.pageSize);
    this.visiblePendingUsers = this.filteredPendingUsers.slice(0, this.pageSize);
    this.visibleInactiveUsers = this.filteredInactiveUsers.slice(0, this.pageSize);
  }

  cargarMasUsuarios(event: any) {
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
    
    // Avisamos a Ionic de que ya hemos inyectado las tarjetas nuevas
    event.target.complete();
  }

  // Comprueba si ya se han pintado todos los usuarios de la pestaña actual
  isScrollDisabled(): boolean {
    if (this.tabActual === 'activos') return this.visibleUsers.length >= this.filteredUsers.length;
    if (this.tabActual === 'pendientes') return this.visiblePendingUsers.length >= this.filteredPendingUsers.length;
    if (this.tabActual === 'inactivos') return this.visibleInactiveUsers.length >= this.filteredInactiveUsers.length;
    return true;
  }

  // ==========================================================================
  // ACCIONES
  // ==========================================================================
  nuevoUsuario() {
    this.router.navigate(['/user-detail'], { queryParams: { adminCreate: true } });
  }

  async aprobarUsuario(user: User) {
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

  async rechazarUsuario(user: User) {
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