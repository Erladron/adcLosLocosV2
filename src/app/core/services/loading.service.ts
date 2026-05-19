import { Injectable }
from '@angular/core';

import {

  LoadingController

} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  private loading:
    HTMLIonLoadingElement
    | null = null;

  constructor(

    private loadingController:
      LoadingController

  ) { }

  // ============================================
  // SHOW
  // ============================================

  /**
   * Mostrar loading.
   */
  async show(

    message = 'Cargando...'

  ) {

    // ============================================
    // PREVENT DUPLICATES
    // ============================================

    if (this.loading) {

      return this.loading;

    }

    // ============================================
    // CREATE LOADER
    // ============================================

    this.loading =

      await this.loadingController
        .create({

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
  // WRAP
  // ============================================

  /**
   * Ejecutar async con loading.
   */
  async wrap<T>(

    callback: () => Promise<T>,

    message = 'Cargando...'

  ): Promise<T> {

    try {

      await this.show(message);

      return await callback();

    }

    finally {

      await this.hide();

    }

  }

}