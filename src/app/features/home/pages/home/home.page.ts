import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  calendarOutline,
  statsChartOutline,
  chevronForwardOutline,
  personOutline,
  checkmarkCircle,
  createOutline
} from 'ionicons/icons';

// Importaciones unificadas de la API Pública e infraestructura de shared-core
import { 
  PageHeaderComponent, 
  FairService, 
  AuthService, 
  FcmService,
  User
} from 'shared-core';
import { environment } from '@env/environment';

/**
 * @class HomePage
 * @description Componente controlador de la pantalla de bienvenida principal de la aplicación.
 * Inicializa los servicios push con Capacitor e inyecta proactivamente las credenciales feriales del socio.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    PageHeaderComponent
  ]
})
export class HomePage implements OnInit {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private fcmService = inject(FcmService);
  private fairService = inject(FairService);
  private router = inject(Router);

  // =========================================================================
  // 📋 PROPIEDADES Y MÉTODOS DE ACCESO
  // =========================================================================
  
  /** @description Vinculación directa con los datos del perfil hidratados desde Firestore. */
  public get currentUser(): User | null {
    return this.authService.currentUserData;
  }

  /**
   * @constructor
   * @description Registra de forma atómica e independiente la colección de iconos vectoriales.
   */
  constructor() {
    addIcons({
      peopleOutline,
      calendarOutline,
      statsChartOutline,
      chevronForwardOutline,
      personOutline,
      checkmarkCircle,
      createOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Inicializa el sistema de notificaciones masivas y valida el circuito de acceso automático.
   */
  public async ngOnInit(): Promise<void> {
    console.log('🏠 [HOME] Inicializando flujos de la pantalla principal.'); 
    
    // 1. Ecosistema de notificaciones push asíncrono
    try {
      await this.fcmService.inicializarFCM(environment); 
    } catch (error) {
      console.error('🚨 [HOME] Error al inicializar el ecosistema de notificaciones push:', error); 
    }

    // 2. Circuito de entrada automática de Feria
    try {
      // Esperamos a que el AuthService termine de hidratar al usuario de Firestore
      await this.authService.waitForUserData();

      if (this.currentUser) {
        // El servicio decide de forma interna si genera el pase o no.
        await this.fairService.verificarYGenerarPaseSocioLogueado(this.currentUser);
      }
    } catch (feriaError) {
      console.error('🚨 [HOME] Error en la verificación del pase automático de feria:', feriaError);
    }
  }

  // =========================================================================
  // 🔀 NAVEGACIÓN MANUAL (Previene warnings de foco/activeElement)
  // =========================================================================

  public irAEventos(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/events']);
  }

  public irAUsuarios(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/gest-user']);
  }

  public irAPerfil(userId: string | undefined): void {
    if (!userId) return;
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/user-detail', userId]);
  }
}