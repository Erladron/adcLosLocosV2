import { Routes } from '@angular/router';

import { authGuard }
  from '@auth/guards/auth.guard';

import { roleGuard }
  from '@auth/guards/role.guard';

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

    loadComponent: () =>

      import('@auth/pages/login/login.page')

        .then(m => m.LoginPage)

  },

  // ============================================
  // PENDING APPROVAL
  // ============================================

  {
    path: 'pending-approval',

    loadComponent: () =>

      import('@auth/pages/pending-approval/pending-approval.page')

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

      import('@auth/pages/complete-profile/complete-profile.page')

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

      import('@auth/pages/invite/invite.page')

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

      import('@home/pages/home/home.page')

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

      import('@users/pages/gest-user/gest-user.page')

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

      import('@users/pages/user-detail/user-detail.page')

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

      import('@users/pages/user-detail/user-detail.page')

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

      import('@stats/pages/stats/stats.page')

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

      import('@events/pages/events/events.page')

        .then(m => m.EventsPage)

  },

  // ============================================
  // FALLBACK
  // ============================================

  {
    path: '**',

    redirectTo: 'home'

  },

];