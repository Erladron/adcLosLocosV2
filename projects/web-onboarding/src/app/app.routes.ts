import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirección por defecto a la pantalla de bienvenida
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  
  // 🚀 OPTIMIZACIÓN LAZY LOADING (Con las clases exactas de tu proyecto)
  { 
    path: 'welcome', 
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomeComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterComponent) 
  },
  { 
    path: 'politica-privacidad', 
    loadComponent: () => import('./pages/politica-privacidad/politica-privacidad.page').then(m => m.PoliticaPrivacidadComponent) 
  },
  { 
    path: 'success', 
    loadComponent: () => import('./pages/success/success.page').then(m => m.SuccessComponent) 
  },
  { 
    path: 'reset-password', 
    loadComponent: () => import('./pages/reset-password/reset-password.page').then(m => m.ResetPasswordComponent) 
  },
  
  // Ruta comodín para capturar URLs inválidas y mandarlos al inicio
  { path: '**', redirectTo: 'welcome' }
];