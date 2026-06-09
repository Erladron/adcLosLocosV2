import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanOutline, checkmarkCircleOutline, closeCircleOutline, keyOutline } from 'ionicons/icons';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import {
  PageHeaderComponent,
  AuthService,
  FairService,
  NotificationService,
  LoadingService,
  ErrorHandlerService
} from 'shared-core';

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
  private authService = inject(AuthService);
  private fairService = inject(FairService);
  private notification = inject(NotificationService);
  private loading = inject(LoadingService);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  currentPorteroId: string | null = null;
  isScanning: boolean = false;
  scanStatus: 'idle' | 'success' | 'error' = 'idle';
  manualPaseId: string = '';

  constructor() {
    addIcons({ scanOutline, checkmarkCircleOutline, closeCircleOutline, keyOutline });
  }

  async ngOnInit() {
    await this.authService.waitForUserData();
    this.currentPorteroId = this.authService.getUid();
  }

  ngOnDestroy() {
    this.forzarLimpiezaEscaner();
  }

  ionViewWillLeave() {
    this.forzarLimpiezaEscaner();
  }

  async activarEscaner() {
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

  async detenerEscaner() {
    this.forzarLimpiezaEscaner();
  }

  private async forzarLimpiezaEscaner() {
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

  async validarEntradaManual() {
    if (!this.manualPaseId.trim()) {
      this.notification.warning('Por favor, introduce el ID del pase.');
      return;
    }
    await this.procesarAcceso(this.manualPaseId.trim());
    this.manualPaseId = ''; 
  }

  async procesarAcceso(rawPayload: string) {
    if (!this.currentPorteroId) return;
    
    console.log("🔍 TEXTO LEÍDO EN EL QR ACTUAL:", rawPayload);

    await this.forzarLimpiezaEscaner(); 
    
    try {
      await this.loading.wrap(async () => {
        await this.fairService.registrarEscaneoPortero(rawPayload, this.currentPorteroId!);
      }, 'Verificando credencial en el sistema...');

      this.scanStatus = 'success';
      this.notification.success('¡Acceso Permitido! Credencial verificada correctamente.');

    } catch (error: any) {
      this.scanStatus = 'error';
      
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