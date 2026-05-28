import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { RegisterComponent } from './pages/register/register.component';
import { SuccessComponent } from './pages/success/success.component';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';

export const routes: Routes = [
  // Redirección por defecto a la pantalla de bienvenida
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  
  // Nuestras tres pantallas principales
  { path: 'welcome', component: WelcomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'politica-privacidad', component: PoliticaPrivacidadComponent },
  { path: 'success', component: SuccessComponent },
  
  // Ruta comodín para capturar URLs inválidas y mandarlos al inicio
  { path: '**', redirectTo: 'welcome' }
]; 