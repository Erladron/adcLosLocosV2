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

// Importaciones nativas de Firebase para validación atómica en Portería General
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

// Importaciones unificadas del dominio compartido de shared-core
import {
  PageHeaderComponent,
  AuthService,
  EventsService,
  NotificationService,
  LoadingService,
  ErrorHandlerService
} from 'shared-core';

/**
 * @class FairScanPage
 * @description Pantalla controladora para el personal de portería y seguridad.
 * Controla el hardware de cámara mediante Capacitor para escanear y quemar pases digitales QR.
 */
@Component({
  selector: 'app-fair-scan',
  templateUrl: './fair-scan.page.html',
  styleUrls: ['./fair-scan.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    PageHeaderComponent
  ]
})
export class FairScanPage implements OnInit, OnDestroy {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private eventsService = inject(EventsService);
  private firestore = inject(Firestore); 
  private notification = inject(NotificationService);
  private loading = inject(LoadingService);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  // =========================================================================
  // 📋 VARIABLES DE CONTROL Y ESTADO DE PORTERÍA
  // =========================================================================
  public currentPorteroId: string | null = null;
  public isScanning = false;
  public scanStatus: 'idle' | 'success' | 'error' = 'idle';
  public manualPaseId = '';
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

  public async ngOnInit(): Promise<void> {
    await this.authService.waitForUserData();
    this.currentPorteroId = this.authService.getUid();
  }

  public ngOnDestroy(): void {
    this.forzarLimpiezaEscaner();
  }

  public ionViewWillLeave(): void {
    this.forzarLimpiezaEscaner();
  }

  /**
   * @method activarEscaner
   * @description Verifica permisos de cámara nativos y activa el lector en segundo plano transparentando la vista.
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
      this.forzarLimpiezaEscaner();
    }
  }

  public async detenerEscaner(): Promise<void> {
    document.body.classList.remove('scanner-active');
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
    this.forzarLimpiezaEscaner();
  }

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
   * @description Motor transaccional de validación en puerta. Analiza la procedencia del QR y registra el acceso.
   */
  public async procesarAcceso(rawPayload: string): Promise<void> {
    if (!this.currentPorteroId) return;
    
    console.log("🔍 [PORTERÍA] TEXTO LEÍDO EN EL QR:", rawPayload);
    await this.forzarLimpiezaEscaner(); 
    
    try {
      this.scanStatus = 'idle';

      await this.loading.wrap(async () => {
        
        // Caso A: El código QR pertenece a un abono o pase interno de un Socio
        if (rawPayload.startsWith('SOCIO:')) {
          const partes = rawPayload.split(':');
          if (partes.length < 3) throw new Error('Formato de credencial corrupto o ilegible.');

          const socioId = partes[1];
          const eventId = partes[2].replace('EVENTO-', '');

          const paseIdCompuesto = `${socioId}_${eventId}`;
          const socioPaseRef = doc(this.firestore, 'fair-access', paseIdCompuesto);
          const snapPase = await getDoc(socioPaseRef);

          if (!snapPase.exists()) {
            throw new Error('Acceso Denegado: Este Socio no está registrado en la convocatoria de hoy.');
          }

          const datosPase = snapPase.data();
          
          if (datosPase['scannedAt']) {
            throw new Error(`Acceso Denegado: Este pase de Socio ya entró a las ${new Date(datosPase['scannedAt']).toLocaleTimeString('es-ES')}.`);
          }

          await updateDoc(socioPaseRef, {
            scannedAt: new Date().toISOString(),
            porteroId: this.currentPorteroId
          });

          this.notification.success(`¡Acceso Permitido! Bienvenido Socio: ${datosPase['userName'] || 'Verificado'}`);
        }
        
        // Caso B: El código QR pertenece a un pase de Invitado externo
        else {
          const invitadoPaseRef = doc(this.firestore, 'fair-access', rawPayload);
          const snapInvitado = await getDoc(invitadoPaseRef);

          if (!snapInvitado.exists()) {
            throw new Error('Acceso Denegado: Credencial inexistente o pase de invitado anulado.');
          }

          const datosInvitado = snapInvitado.data();

          if (datosInvitado) {
            if (datosInvitado['date'] !== this.hoyFormateado) {
              throw new Error(`Acceso Denegado: Este pase expiró. Era válido para el día: ${datosInvitado['date']}.`);
            }

            if (datosInvitado['scannedAt']) {
              throw new Error(`Acceso Denegado: El invitado "${datosInvitado['userName']}" ya cruzó la portería.`);
            }

            await updateDoc(invitadoPaseRef, {
              scannedAt: new Date().toISOString(),
              porteroId: this.currentPorteroId
            });

            this.notification.success(`¡Acceso Permitido! Invitado: ${datosInvitado['userName']} (Anfitrión: ${datosInvitado['invitedByName']})`);
          }
        }

      }, 'Verificando credencial universal en el sistema...');

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
