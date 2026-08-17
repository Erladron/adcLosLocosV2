import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanOutline, checkmarkCircleOutline, closeCircleOutline, keyOutline } from 'ionicons/icons';

import { Haptics, NotificationType } from '@capacitor/haptics';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

// Importaciones unificadas del dominio compartido de shared-core
import {
  PageHeaderComponent,
  AuthService,
  EventsService,
  PasseService,
  NotificationService,
  LoadingService,
  ErrorHandlerService
} from 'shared-core';

/**
 * @class PasseScanPage
 * @description Pantalla controladora para el personal de portería y seguridad.
 * Controla el hardware de cámara mediante Capacitor para escanear, validar y quemar pases digitales QR.
 * Cumple con el aislamiento arquitectónico estricto: la lógica NoSQL se delega en PasseService.
 */
@Component({
  selector: 'app-event-scan',
  templateUrl: './event-scan.page.html',
  styleUrls: ['./event-scan.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    PageHeaderComponent
  ]
})
export class PasseScanPage implements OnInit, OnDestroy {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  /** @description Instancia inyectada del servicio core de sesión y credenciales. @private */
  private authService = inject(AuthService);
  /** @description Instancia inyectada del servicio de gestión de convocatorias. @private */
  private eventsService = inject(EventsService);
  /** @description Instancia inyectada del servicio satélite de validación y control de pases. @private */
  private passeService = inject(PasseService);
  /** @description Instancia inyectada del despachador de alertas Toast de la interfaz. @private */
  private notification = inject(NotificationService);
  /** @description Instancia inyectada del servicio visual de bloqueo y spinners. @private */
  private loading = inject(LoadingService);
  /** @description Instancia inyectada del interceptor centralizado de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);
  /** @description Instancia inyectada para forzar la detección de cambios en el ciclo de Angular. @private */
  private cdr = inject(ChangeDetectorRef);

  // =========================================================================
  // 📋 VARIABLES DE CONTROL Y ESTADO DE PORTERÍA
  // =========================================================================
  /** @description Identificador único (UID) del usuario con rol Portero autenticado. */
  public currentPorteroId: string | null = null;
  /** @description Flag indicador del estado activo del visor transparente de la cámara. */
  public isScanning = false;
  /** @description Estado reactivo del proceso de picaje ('idle' | 'success' | 'error') para feedback visual. */
  public scanStatus: 'idle' | 'success' | 'error' = 'idle';
  /** @description Cadena reactiva vinculada al input de validación manual de credenciales. */
  public manualPaseId = '';
  /** @description Fecha actual formateada en huso local (YYYY-MM-DD) para auditorías de acceso. */
  public hoyFormateado = '';

  /**
   * @constructor
   * @description Inicializa la colección atómica de iconos vectoriales e interpreta el huso horario local.
   */
  constructor() {
    addIcons({ scanOutline, checkmarkCircleOutline, closeCircleOutline, keyOutline });
    
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    this.hoyFormateado = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
  }

  /**
   * @method ngOnInit
   * @description Ciclo de vida inicial. Hidrata las credenciales del portero autenticado.
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    await this.authService.waitForUserData();
    this.currentPorteroId = this.authService.getUid();
  }

  /**
   * @method ngOnDestroy
   * @description Ciclo de vida de destrucción. Fuerza la detención de la cámara y restaura el DOM.
   * @returns {void}
   */
  public ngOnDestroy(): void {
    this.forzarLimpiezaEscaner();
  }

  /**
   * @method ionViewWillLeave
   * @description Ciclo de vida de salida de vista en Ionic. Previene cámaras colgadas en segundo plano.
   * @returns {void}
   */
  public ionViewWillLeave(): void {
    this.forzarLimpiezaEscaner();
  }

  /**
   * @method activarEscaner
   * @description Verifica permisos de cámara nativos y activa el lector transparentando el fondo de la pantalla.
   * Garantiza mediante bloque finally la limpieza incondicional del visor.
   * @returns {Promise<void>}
   */
  public async activarEscaner(): Promise<void> {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        this.notification.warning('Concede permisos de cámara en los ajustes del terminal.');
        return;
      }

      this.isScanning = true;
      this.scanStatus = 'idle';

      await BarcodeScanner.hideBackground();
      document.body.classList.add('scanner-active');
      
      const elementosOpaquidad = document.querySelectorAll('ion-app, ion-router-outlet, ion-content, .ion-page, .scanner-content, .scanner-container');
      elementosOpaquidad.forEach((el: any) => {
        el.style.setProperty('background', 'transparent', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('--background', 'transparent', 'important');
      });

      this.cdr.detectChanges();
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        await this.procesarAcceso(result.content);
      }

    } catch (error) {
      console.error('Error crítico en escáner nativo:', error);
      this.notification.error('Se produjo un error al iniciar el escáner de la cámara.');
    } finally {
      // 🚀 LIMPIEZA GARANTIZADA: Apaga el escáner y restaura la interfaz siempre
      await this.forzarLimpiezaEscaner();
    }
  }

  /**
   * @method detenerEscaner
   * @description Cancela la sesión de escaneo activa y restaura la opacidad visual del DOM.
   * @returns {Promise<void>}
   */
  public async detenerEscaner(): Promise<void> {
    await this.forzarLimpiezaEscaner();
  }

  /**
   * @method forzarLimpiezaEscaner
   * @private
   * @async
   * @description Método auxiliar defensivo. Apaga el sensor por hardware de la cámara y remueve 
   * las clases transparentes del DOM para evitar que la interfaz quede inusable.
   * @returns {Promise<void>}
   */
  private async forzarLimpiezaEscaner(): Promise<void> {
    this.isScanning = false;
    document.body.classList.remove('scanner-active');
    
    const elementosOpaquidad = document.querySelectorAll('ion-app, ion-router-outlet, ion-content, .ion-page, .scanner-content, .scanner-container');
    elementosOpaquidad.forEach((el: any) => {
      el.style.removeProperty('background');
      el.style.removeProperty('background-color');
      el.style.removeProperty('--background');
    });

    try {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    } catch (error) {
      console.log('El escáner nativo ya se encontraba apagado de forma segura.');
    }

    this.cdr.detectChanges();
  }

  /**
   * @method validarEntradaManual
   * @description Valida la entrada de un código de pase introducido mediante teclado en la interfaz.
   * @returns {Promise<void>}
   */
  public async validarEntradaManual(): Promise<void> {
    if (!this.manualPaseId.trim()) {
      this.notification.warning('Por favor, introduce el ID del pase.');
      return;
    }
    await this.procesarAcceso(this.manualPaseId.trim());
    this.manualPaseId = ''; 
  }

  /**
   * @method procesarAcceso
   * @description Motor de validación en portería. Delega el picaje y la verificación atómica 
   * del payload en la capa de servicios centralizada (PasseService) emitiendo feedback háptico.
   * @param {string} rawPayload Cadena alfanumérica o formato compuesto leído desde el código QR.
   * @returns {Promise<void>}
   */
  public async procesarAcceso(rawPayload: string): Promise<void> {
    if (!this.currentPorteroId) return;
    
    console.log("🔍 [PORTERÍA] TEXTO LEÍDO EN EL QR:", rawPayload);
    await this.forzarLimpiezaEscaner(); 
    
    try {
      this.scanStatus = 'idle';

      await this.loading.wrap(async () => {
        // 🚀 DELEGACIÓN EN SERVICIO: Transmisión limpia delegada en PasseService
        await this.passeService.registrarEscaneoPortero(rawPayload, this.currentPorteroId!);
        this.notification.success('¡Acceso Validado Correctamente!');
      }, 'Verificando credencial en el sistema...');

      this.scanStatus = 'success';
      await Haptics.notification({ type: NotificationType.Success });

    } catch (error: any) {
      this.scanStatus = 'error';
      await Haptics.notification({ type: NotificationType.Error });
      if (error && error.message) {
        this.notification.error(error.message);
      } else {
        this.errorHandler.handle(error);
      }
    }

    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.scanStatus = 'idle';
      this.cdr.detectChanges();
    }, 2500);
  }
}