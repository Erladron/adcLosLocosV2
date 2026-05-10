import { Routes } from '@angular/router';

export const routes: Routes = [

  // HOME
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () =>

      import('./pages/home/home.page')

        .then(m => m.HomePage)

  },

  // USUARIOS
  {
    path: 'gest-user',
    loadComponent: () =>

      import('./pages/gest-user/gest-user.page')

        .then(m => m.GestUserPage)

  },

  // DETALLE USUARIO
  {
    path: 'user-detail',
    loadComponent: () =>

      import('./pages/user-detail/user-detail.page')

        .then(m => m.UserDetailPage)

  },

  {
    path: 'user-detail/:id',
    loadComponent: () =>

      import('./pages/user-detail/user-detail.page')

        .then(m => m.UserDetailPage)

  },

  // ESTADISTICAS
  {
    path: 'stats',
    loadComponent: () =>

      import('./pages/stats/stats.page')

        .then(m => m.StatsPage)

  },

  // EVENTOS
  {
    path: 'events',
    loadComponent: () =>

      import('./pages/events/events.page')

        .then(m => m.EventsPage)

  }

];