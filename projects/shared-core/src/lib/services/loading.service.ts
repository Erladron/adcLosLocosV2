import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  // ============================================
  // SHOW
  // ============================================

  /**
   * Mostrar loading.
   */
  async show(message = 'Cargando...') {
    // PREVENT DUPLICATES
    if (this.loading) {
      return this.loading;
    }

    // CREATE LOADER
    this.loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
      backdropDismiss: false
    });

    await this.loading.present();
    return this.loading;
  }

  // ============================================
  // HIDE
  // ============================================

  /**
   * Ocultar loading.
   */
  async hide() {
    if (!this.loading) {
      return;
    }

    await this.loading.dismiss();
    this.loading = null;
  }

  // ============================================
  // WRAP (Ejecutar async con protección Offline)
  // ============================================

  /**
   * Ejecutar async con loading y protección contra pérdida de red (Timeout).
   */
  async wrap<T>(callback: () => Promise<T>, message = 'Cargando...'): Promise<T> {
    try {
      await this.show(message);

      // Creamos un cronómetro de 10 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT_OFFLINE')), 10000);
      });

      // Carrera entre tu petición a Firebase y el cronómetro
      const result = await Promise.race([callback(), timeoutPromise]);
      return result;

    } catch (error: any) {
      // Si el error es nuestro timeout por mala cobertura
      if (error.message === 'TIMEOUT_OFFLINE') {
        this.mostrarAvisoOffline();
        return null as any; // Devolvemos null para que el flujo no se rompa de golpe
      }

      // Si es un error real del backend u otra cosa, lo dejamos pasar al errorHandler
      throw error;

    } finally {
      await this.hide();
    }
  }

  // ============================================
  // AVISO OFFLINE
  // ============================================

  private async mostrarAvisoOffline() {
    const toast = await this.toastController.create({
      message: 'Conexión inestable. Los cambios se guardarán automáticamente en segundo plano.',
      duration: 4000,
      position: 'bottom',
      color: 'warning',
      icon: 'cloud-offline-outline'
    });
    await toast.present();
  }
}