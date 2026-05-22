import { Routes } from '@angular/router';

import { authGuard }
  from './features/auth/guards/auth.guard';

import { roleGuard }
  from './features/auth/guards/role.guard';

export const routes: Routes = [

  // ============================================
  // ROOT
  // ============================================

  {
    path: '',

    loadComponent: () =>

      import('./features/auth/pages/login/login.page')

        .then(m => m.LoginPage)

  },

  // ============================================
  // LOGIN
  // ============================================

  {
    path: 'login',

    loadComponent: () =>

      import('./features/auth/pages/login/login.page')

        .then(m => m.LoginPage)

  },

  // ============================================
  // REGISTER
  // ============================================

  {
    path: 'register',

    loadComponent: () =>

      import('./features/auth/pages/register/register.page')

        .then(m => m.RegisterPage)

  },

  // ============================================
  // PENDING APPROVAL
  // ============================================

  {
    path: 'pending-approval',

    loadComponent: () =>

      import('./features/auth/pages/pending-approval/pending-approval.page')

        .then(
          m => m.PendingApprovalPage
        )

  },

    // ============================================
  // COMPLETE PROFILE
  // ============================================

  {
    path: 'complete-profile',

    loadComponent: () =>

      import('./features/auth/pages/complete-profile/complete-profile.page')

        .then(
          m => m.CompleteProfilePage
        )

  },

  // ============================================
  // INVITE
  // ============================================

  {
    path: 'invite',

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {

      roles: [

        'socio',
        'directiva',
        'administrador'

      ]

    },

    loadComponent: () =>

      import('./features/auth/pages/invite/invite.page')

        .then(m => m.InvitePage)

  },

  // ============================================
  // HOME
  // ============================================

  {
    path: 'home',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>

      import('./features/home/pages/home/home.page')

        .then(m => m.HomePage)

  },

  // ============================================
  // GESTION USUARIOS
  // ============================================

  {
    path: 'gest-user',

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {

      roles: [

        'invitado',
        'socio',
        'directiva',
        'administrador'

      ]

    },

    loadComponent: () =>

      import('./features/users/pages/gest-user/gest-user.page')

        .then(m => m.GestUserPage)

  },

  // ============================================
  // NUEVO USUARIO
  // ============================================

  {
    path: 'user-detail',

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {

      roles: [

        'socio',
        'directiva',
        'administrador'

      ]

    },

    loadComponent: () =>

      import('./features/users/pages/user-detail/user-detail.page')

        .then(m => m.UserDetailPage)

  },

  // ============================================
  // EDITAR USUARIO
  // ============================================

  {
    path: 'user-detail/:id',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>

      import('./features/users/pages/user-detail/user-detail.page')

        .then(m => m.UserDetailPage)

  },

  // ============================================
  // ESTADISTICAS
  // ============================================

  {
    path: 'stats',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>

      import('./features/stats/pages/stats/stats.page')

        .then(m => m.StatsPage)

  },

  // ============================================
  // EVENTOS
  // ============================================

  {
    path: 'events',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>

      import('./features/events/pages/events/events.page')

        .then(m => m.EventsPage)

  },

  // ============================================
  // FALLBACK
  // ============================================

  {
    path: '**',

    redirectTo: 'home'

  },

  // ============================================
  // COMPLETE PROFILE
  // ============================================

  {
    path: 'complete-profile',

    loadComponent: () =>

      import('./features/users/pages/user-detail/user-detail.page')

        .then(m => m.UserDetailPage)

  },

];