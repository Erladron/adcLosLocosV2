import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
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

// IMPORTACIÓN DE TUS SERVICIOS DEL CORE COMPARTIDO
import { PageHeaderComponent, FairService } from 'shared-core';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { FcmService } from 'projects/shared-core/src/lib/services/fcm.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    RouterLink,
    PageHeaderComponent
  ]
})
export class HomePage implements OnInit {

  // =========================================
  // CURRENT USER
  // =========================================
  get currentUser() {
    return this.authService.currentUserData; // Vinculación directa con tu perfil[cite: 12]
  }

  // =========================================
  // CONSTRUCTOR
  // =========================================
  constructor(
    private authService: AuthService,
    private fcmService: FcmService,
    private fairService: FairService // Inyectamos el motor ferial de la librería
  ) {
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

  // =========================================
  // NATIVE INITIALIZATION
  // =========================================
  async ngOnInit() {
    console.log('🏠 [HOME] Inicializando flujos de la pantalla principal.'); //[cite: 12]
    
    // 1. Ecosistema de notificaciones push asíncrono
    try {
      await this.fcmService.inicializarFCM(); //[cite: 12]
    } catch (error) {
      console.error('🚨 [HOME] Error al inicializar el ecosistema de notificaciones push:', error); //[cite: 12]
    }

    // 2. CIRCUITO DE ENTRADA AUTOMÁTICA DE FERIA
    try {
      // Esperamos a que el AuthService termine de hidratar al usuario de Firestore[cite: 12]
      await this.authService.waitForUserData();

      if (this.currentUser) {
        // Ejecutamos el inyector silencioso. El servicio decide de forma interna si genera el pase o no.
        await this.fairService.verificarYGenerarPaseSocioLogueado(this.currentUser);
      }
    } catch (feriaError) {
      console.error('🚨 [HOME] Error en la verificación del pase automático de feria:', feriaError);
    }
  }
}