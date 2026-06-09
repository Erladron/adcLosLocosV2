import { Routes } from '@angular/router';
import { authGuard } from '@auth/guards/auth.guard';
import { roleGuard } from '@auth/guards/role.guard';

// 🚀 IMPORTAMOS LOS ENUMS CORPORATIVOS PARA EL TIPADO ESTRICTO DE ROLES
import { UserRole } from 'shared-core';

export const routes: Routes = [

  // ============================================
  // ROOT
  // ============================================
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  // ============================================
  // LOGIN
  // ============================================
  {
    path: 'login',
    loadComponent: () => import('@auth/pages/login/login.page').then(m => m.LoginPage)
  },

  // ============================================
  // PENDING APPROVAL
  // ============================================
  {
    path: 'pending-approval',
    loadComponent: () => import('@auth/pages/pending-approval/pending-approval.page').then(m => m.PendingApprovalPage)
  },

  // ============================================
  // COMPLETE PROFILE
  // ============================================
  {
    path: 'complete-profile',
    loadComponent: () => import('@auth/pages/complete-profile/complete-profile.page').then(m => m.CompleteProfilePage)
  },

  // ============================================
  // INVITE
  // ============================================
  {
    path: 'invite',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR
      ]
    },
    loadComponent: () => import('@auth/pages/invite/invite.page').then(m => m.InvitePage)
  },

  // ============================================
  // HOME
  // ============================================
  {
    path: 'home',
    // 🚀 AÑADIDO ROLEGUARD: El portero tiene prohibido pisar el Home general
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR,
        UserRole.INVITADO
      ]
    },
    loadComponent: () => import('@home/pages/home/home.page').then(m => m.HomePage)
  },

  // ============================================
  // GESTION USUARIOS
  // ============================================
  {
    path: 'gest-user',
    canActivate: [authGuard, roleGuard],
    data: {
      // 🚀 CORREGIDO: Fuera el rol 'invitado' de aquí, solo entra el núcleo de la peña
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR
      ]
    },
    loadComponent: () => import('@users/pages/gest-user/gest-user.page').then(m => m.GestUserPage)
  },

  // ============================================
  // NUEVO USUARIO
  // ============================================
  {
    path: 'user-detail',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR
      ]
    },
    loadComponent: () => import('@users/pages/user-detail/user-detail.page').then(m => m.UserDetailPage)
  },

  // ============================================
  // EDITAR USUARIO
  // ============================================
  {
    path: 'user-detail/:id',
    // 🚀 AÑADIDO ROLEGUARD: Evitamos saltos de rol ilegales por ID en la barra de navegación
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR,
        UserRole.INVITADO
      ]
    },
    loadComponent: () => import('@users/pages/user-detail/user-detail.page').then(m => m.UserDetailPage)
  },

  // ============================================
  // EVENTOS (Módulo unificado, blindado y ordenado)
  // ============================================
  {
    path: 'events',
    // 🚀 AÑADIDO ROLEGUARD: El portero fuera de la agenda comunitaria
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR,
        UserRole.INVITADO
      ]
    },
    loadComponent: () => import('./features/events/pages/events/events.page').then(m => m.EventsPage),
  },
  {
    path: 'events/new',
    canActivate: [authGuard, roleGuard],
    data: { 
      roles: [
        UserRole.DIRECTIVA, 
        UserRole.ADMINISTRADOR
      ] 
    },
    loadComponent: () => import('./features/events/pages/event-detail/event-detail.page').then(m => m.EventDetailPage),
  },
  {
    path: 'events/:id',
    // 🚀 AÑADIDO ROLEGUARD
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR,
        UserRole.INVITADO
      ]
    },
    loadComponent: () => import('./features/events/pages/event-detail/event-detail.page').then(m => m.EventDetailPage),
  },

  // ============================================
  // Carnet Feria
  // ============================================
  {
    path: 'fair',
    // 🚀 AÑADIDO ROLEGUARD: El portero viene a trabajar, no a mirar su pase
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR,
        UserRole.INVITADO
      ]
    },
    loadComponent: () => import('./features/events/pages/fair/fair.page').then(m => m.FairPage)
  },

  // ============================================
  // Portería Caseta
  // ============================================
  {
    path: 'fair-scan',
    // 🚀 AÑADIDO ROLEGUARD: Solo los encargados del acceso entran aquí
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR,
        UserRole.PORTERO
      ]
    },
    loadComponent: () => import('./features/events/pages/fair-scan/fair-scan.page').then(m => m.FairScanPage)
  },

  // ============================================
  // FALLBACK
  // ============================================
  {
    path: '**',
    redirectTo: 'home'
  }
];