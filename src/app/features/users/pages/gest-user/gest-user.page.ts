import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';

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

// Importaciones nativas de la SDK de Firebase para armar la consulta con filtros
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

import { UserService } from 'projects/shared-core/src/lib/services/user.service';
import { User, UserRole } from 'shared-core';
import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';
import { DialogService } from 'projects/shared-core/src/lib/services/dialog.service';
import { LoadingService } from 'projects/shared-core/src/lib/services/loading.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';
import { AuthPoliciesService } from 'projects/shared-core/src/lib/services/auth-policies.service';
import { AppMessageCode } from 'shared-core';

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

  // Inyección del motor de base de datos de Firestore
  private firestore = inject(Firestore);

  // Arrays de control para almacenar y filtrar los usuarios según su estado
  users: User[] = [];
  filteredUsers: User[] = [];
  pendingUsers: User[] = [];
  filteredPendingUsers: User[] = [];
  inactiveUsers: User[] = [];
  filteredInactiveUsers: User[] = [];

  // Arrays destinados a la paginación progresiva del scroll infinito
  visibleUsers: User[] = [];
  visiblePendingUsers: User[] = [];
  visibleInactiveUsers: User[] = [];
  pageSize: number = 15;

  // Variables de estado de la interfaz gráfica
  searchText = '';
  canAddUsers = false;
  canApproveUsers = false;
  canViewInactiveUsers = false;
  tabActual = 'activos';

  // Variable de control para saber si el usuario conectado es un socio ordinario
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

  // Método encargado de descargar los usuarios adaptándose a las reglas de Firebase
  async loadUsers() {
    try {
      const usersRef = collection(this.firestore, 'users');
      
      // Aseguramos el vaciado radical del array antes de cualquier consulta para evitar duplicados
      this.users = [];

      // Si las políticas detectan que es un socio común, filtramos antes de llamar al servidor
      if (this.isSocioComun) {
        // Creamos una consulta donde exigimos explícitamente solo los roles comunitarios
        const qActivosSocio = query(
          usersRef,
          where('tipo', 'in', [UserRole.SOCIO, UserRole.DIRECTIVA, UserRole.INVITADO])
        );
        
        // Ejecutamos la consulta en Firestore de forma síncrona
        const snapshot = await getDocs(qActivosSocio);
        
        // Creamos un array temporal local para evitar que hilos en paralelo dupliquen los datos
        const temporalUsers: User[] = [];
        
        // Recorremos los documentos recuperados uno a uno
        snapshot.forEach(docSnap => {
          const uData = docSnap.data() as User;
          // Solo añadimos al listado a aquellos usuarios cuyo estado interno sea activo
          if (uData.estado === 'active') {
            temporalUsers.push({ id: docSnap.id, ...uData });
          }
        });

        // Asignamos el bloque limpio de una sola vez
        this.users = temporalUsers;
        
      } else {
        // Si el usuario es administrador o directiva, descarga la colección completa mediante el servicio
        const rawActiveUsers = await this.userService.getApprovedUsers();
        this.users = rawActiveUsers;
      }

      // Duplicamos la lista descargada para la lógica interna de búsquedas
      this.filteredUsers = [...this.users];

      // Carga de usuarios pendientes (Solo permitida para administración y directivos)
      if (this.canApproveUsers && !this.isSocioComun) {
        this.pendingUsers = await this.userService.getPendingUsers();
        this.filteredPendingUsers = [...this.pendingUsers];
      } else {
        this.pendingUsers = [];
        this.filteredPendingUsers = [];
      }

      // Carga de usuarios dados de baja (Solo permitida para administración y directivos)
      if (this.canViewInactiveUsers && !this.isSocioComun) {
        this.inactiveUsers = await this.userService.getInactiveUsers();
        this.filteredInactiveUsers = [...this.inactiveUsers];
      } else {
        this.inactiveUsers = [];
        this.filteredInactiveUsers = [];
      }

      // Reajustamos los fragmentos de lotes visibles para el scroll
      this.resetPagination();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  // Mapeado dinámico de permisos basado en el token de sesión activo
  loadPermissions() {
    this.isSocioComun = this.policies.isSocio() && !this.policies.isAdmin() && !this.policies.isDirectiva();
    this.canAddUsers = !this.isSocioComun && (this.policies.isAdmin() || this.policies.isDirectiva());
    this.canApproveUsers = this.policies.canManageUsers() && !this.isSocioComun;
    this.canViewInactiveUsers = (this.policies.isAdmin() || this.policies.isDirectiva()) && !this.isSocioComun;
  }

  // Motor del buscador que filtra las colecciones en base a la cadena de texto introducida
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

    this.resetPagination();
  }

  // Divide los arrays completos para pintar únicamente los primeros 15 resultados
  resetPagination() {
    this.visibleUsers = this.filteredUsers.slice(0, this.pageSize);
    this.visiblePendingUsers = this.filteredPendingUsers.slice(0, this.pageSize);
    this.visibleInactiveUsers = this.filteredInactiveUsers.slice(0, this.pageSize);
  }

  // Disparador del scroll infinito que concatena lotes adicionales al llegar al final
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
    
    event.target.complete();
  }

  // Evalúa si el scroll infinito debe detenerse al no haber más registros que pintar
  isScrollDisabled(): boolean {
    if (this.tabActual === 'activos') return this.visibleUsers.length >= this.filteredUsers.length;
    if (this.tabActual === 'pendientes') return this.visiblePendingUsers.length >= this.filteredPendingUsers.length;
    if (this.tabActual === 'inactivos') return this.visibleInactiveUsers.length >= this.filteredInactiveUsers.length;
    return true;
  }

  // Redirección al formulario de creación manual de perfiles
  nuevoUsuario() {
    this.router.navigate(['/user-detail'], { queryParams: { adminCreate: true } });
  }

  // Proceso de aprobación de registros en pre-alta
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

  // Proceso de denegación y borrado de solicitudes entrantes
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