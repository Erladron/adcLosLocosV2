import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular/standalone';
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
  AuthService,
  FcmService,
  User,
  PasseService
} from 'shared-core';
import { environment } from '@env/environment';

/**
 * @class HomePage
 * @description Componente controlador de la pantalla de bienvenida principal de la aplicación.
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
  // 📥 INFRAESTRUCTURA INYECTADA
  // =========================================================================
  private authService = inject(AuthService);
  private fcmService = inject(FcmService);
  private paseService = inject(PasseService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private menuCtrl = inject(MenuController);

  // =========================================================================
  // 📋 PROPIEDADES REACTIVAS
  // =========================================================================

  /** 
   * @description Variable local donde almacenaremos el usuario de forma estricta para forzar el repintado
   */
  public currentUser: User | null = null;

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

  public async ngOnInit(): Promise<void> {
    console.log('🏠 [HOME] Inicializando flujos de la pantalla principal.');

    try {
      await this.fcmService.inicializarFCM(environment);
    } catch (error) {
      console.error('🚨 [HOME] Error al inicializar el ecosistema de notificaciones push:', error);
    }

    await this.actualizarDatosPantalla();
  }

  /**
   * @method ionViewWillEnter
   * @description Se ejecuta cada vez que la página vuelve a estar en primer plano (crucial tras el login)
   */
  public async ionViewWillEnter(): Promise<void> {
    console.log('🛡️ [HOME] Ejecutando salvaguarda estructural de interfaz.');
    try {
      this.menuCtrl.enable(true);
      this.menuCtrl.close();
    } catch (uiError) {
      console.warn('⚠️ [HOME] No se pudo restaurar el estado del MenuController:', uiError);
    }

    // 🛠️ ACCIÓN RADICAL ANTI-CONGELACIÓN: Vaciamos el usuario actual e informamos al árbol de Angular.
    // Esto obliga al *NgIf del HTML a limpiar instantáneamente los restos de la sesión anterior.
    this.currentUser = null;
    this.cdr.detectChanges();

    // Volvemos a sincronizar los datos frescos del usuario entrante
    await this.actualizarDatosPantalla();
  }

  /**
   * @method actualizarDatosPantalla
   * @private
   * @description Sincroniza y fuerza el ciclo de renderizado de Angular en el hilo principal
   */
  private async actualizarDatosPantalla(): Promise<void> {
    this.ngZone.run(async () => {
      try {
        console.log('⏳ [HOME] Esperando datos de usuario con salvaguarda de tiempo...');

        // Creamos un timeout de 1.5 segundos para que la app NUNCA se quede congelada
        const timeoutSec = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout de autenticación superado')), 1500)
        );

        try {
          // Ponemos a competir la carga de datos contra el reloj
          await Promise.race([
            this.authService.waitForUserData(),
            timeoutSec
          ]);
          console.log('✅ [HOME] waitForUserData resolvió a tiempo.');
        } catch (timeoutError) {
          console.warn('⚠️ [HOME] La promesa de Auth se atascó, liberando hilo principal:', timeoutError.message);
          // Al saltar aquí, liberamos el hilo principal y evitamos la congelación
        }

        // Intentamos recuperar lo que haya en el almacenamiento síncrono del servicio
        this.currentUser = this.authService.currentUserData;
        console.log('🍏 [HOME] Datos asignados tras salvaguarda:', this.currentUser?.id);

        if (this.currentUser) {
          await this.paseService.verificarYGenerarPaseSocioLogueado(this.currentUser);
        } else {
          console.warn('🚨 [HOME] Ojo: Se liberó la UI pero currentUser sigue siendo NULL. Revisa el AuthSessionService.');
        }

        // Forzar el redibujado inmediato de la interfaz
        this.cdr.markForCheck();
        this.cdr.detectChanges();

      } catch (feriaError) {
        console.error('🚨 [HOME] Error crítico en el flujo de actualización:', feriaError);
      }
    });
  }

  // =========================================================================
  // 🔀 NAVEGACIÓN MANUAL
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