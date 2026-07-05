import { Routes } from '@angular/router';
import { authGuard } from '@auth/guards/auth.guard';
import { roleGuard } from '@auth/guards/role.guard';

// Importaciones unificadas del dominio compartido de shared-core
import { UserRole } from 'shared-core';

/**
 * @description Matriz de enrutamiento maestro del chasis de la aplicación (A.D.C. Los Locos).
 * Organiza de forma centralizada las directrices de lazy loading, modularización de componentes Standalone
 * y la restricción perimetral de accesos basada en roles mediante Guards de Angular.
 */
export const routes: Routes = [

  // =========================================================================
  // 🪐 ENRUTAMIENTO RAÍZ
  // =========================================================================
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  // =========================================================================
  // 🔐 SECCIÓN: AUTENTICACIÓN Y REGISTRO PERIMETRAL
  // =========================================================================
  {
    path: 'login',
    loadComponent: () => import('@auth/pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'pending-approval',
    loadComponent: () => import('@auth/pages/pending-approval/pending-approval.page').then(m => m.PendingApprovalPage)
  },
  {
    path: 'complete-profile',
    loadComponent: () => import('@auth/pages/complete-profile/complete-profile.page').then(m => m.CompleteProfilePage)
  },
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

  // =========================================================================
  // 🏛️ SECCIÓN: DASHBOARD CENTRAL
  // =========================================================================
  {
    path: 'home',
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

  // =========================================================================
  // 👥 SECCIÓN: CENSO Y GESTIÓN DE MIEMBROS
  // =========================================================================
  {
    path: 'gest-user',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR
      ]
    },
    loadComponent: () => import('@users/pages/gest-user/gest-user.page').then(m => m.GestUserPage)
  },
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
  {
    path: 'user-detail/:id',
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

  // 👑 CONTROL FINANCIERO: TESORERÍA Y CUOTAS DE SOCIO
  {
    path: 'mantenimiento-cuotas',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR
      ]
    },
    loadComponent: () => import('./features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page').then(m => m.MantenimientoCuotasPage)
  },

  // =========================================================================
  // 📆 SECCIÓN: CONVOCATORIAS Y AGENDA DE LA PEÑA
  // =========================================================================
  {
    path: 'events', // 🚀 DEFINITIVO: Entrada directa al listado unificado con calendario integrado
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
  {
    path: 'events/:id/guests',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [
        UserRole.SOCIO,
        UserRole.DIRECTIVA,
        UserRole.ADMINISTRADOR
      ]
    },
    loadComponent: () => import('./features/events/pages/event-guests/event-guests.page').then(m => m.EventGuestsPage),
  },

  // =========================================================================
  // 🎫 SECCIÓN: PASES DIGITALES Y VERIFICACIÓN PERIMETRAL QR
  // =========================================================================
  {
    path: 'user-passes',
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
  {
    path: 'event-scan',
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

  // =========================================================================
  // 🔄 RUTAS HEREDADAS (MANTENIDAS POR COMPATIBILIDAD DE ENLACES ANTERIORES)
  // =========================================================================
  {
    path: 'fair',
    pathMatch: 'full',
    redirectTo: 'user-passes'
  },
  {
    path: 'fair-scan',
    pathMatch: 'full',
    redirectTo: 'event-scan'
  },

  // =========================================================================
  // 🚨 RUTA COMPLEMENTARIA: FALLBACK GLOBLAL COMODÍN
  // =========================================================================
  {
    path: '**',
    redirectTo: 'home'
  }
];