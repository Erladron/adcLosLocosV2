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

import { PageHeaderComponent } from 'shared-core';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';

// 🚀 INYECCIÓN DEL SERVICIO DE NOTIFICACIONES PUSH
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
    return this.authService.currentUserData;
  }

  // =========================================
  // CONSTRUCTOR
  // =========================================
  constructor(
    private authService: AuthService,
    private fcmService: FcmService // Inyectamos el servicio de alertas
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
    console.log('🏠 [HOME] Inicializando flujos de la pantalla principal.');
    
    // Disparamos la petición de permisos y registro de hardware de forma asíncrona
    try {
      await this.fcmService.inicializarFCM();
    } catch (error) {
      console.error('🚨 [HOME] Error al inicializar el ecosistema de notificaciones push:', error);
    }
  }
}