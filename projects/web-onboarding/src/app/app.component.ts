import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonText, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowForwardOutline, 
  alertCircleOutline, 
  checkmarkCircleOutline 
} from 'ionicons/icons';

import { TokenService } from '../../core/services/token.service';

/**
 * @class WelcomeComponent
 * @description Componente standalone que actúa como puerta de acceso y control de identidad en el Onboarding.
 * Intercepta de forma asíncrona los tokens de la URL, visa su vigencia contra Firestore y decide de forma inteligente
 * si da paso al formulario de alta, bloquea el acceso o gestiona un retorno amigable para socios ya registrados.
 */
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner
  ],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomeComponent implements OnInit {
  
  /** @description Instancia inyectada del lector de parámetros url del navegador. @private */
  private route = inject(ActivatedRoute);
  /** @description Instancia inyectada del orquestador de rutas de Angular. @private */
  private router = inject(Router);
  /** @description Instancia inyectada del servicio verificador de pases e invitaciones NoSQL. @private */
  private tokenService = inject(TokenService);

  // =========================================================================
  // ⚙️ ESTADOS DE LA INTERFAZ DE USUARIO (UI)
  // =========================================================================
  
  /** @description Controla el renderizado del spinner de carga inicial en la pantalla. */
  public isLoading = true;
  /** @description Flag que habilita los contenedores y el botón de acceso al formulario de registro. */
  public isValidToken = false;
  /** @description Bandera inteligente para controlar el retorno amigable si el token ya fue consumido con anterioridad. */
  public isAlreadyRegistered = false; 
  /** @description Mensaje literal que se muestra en los flujos de exclusión o error. */
  public errorMessage = '';
  /** @description Hash alfanumérico único extraído de la query string. */
  public token = '';

  /** @description Ruta física del asset del escudo oficial unificado de la peña. */
  public logoUrl = 'assets/img/escudo.png';

  /**
   * @constructor
   * @description Registra de forma atómica los iconos vectoriales necesarios para la vista del componente.
   */
  constructor() {
    addIcons({
      arrowForwardOutline,
      alertCircleOutline,
      checkmarkCircleOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Captura el token de la URL y dispara de forma imperativa la validación de integridad en Firestore.
   * Resuelve el desvío amigable si detecta que la cuenta asociada ya completó su onboarding.
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    // Capturamos el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.isLoading = false;
      this.errorMessage = 'Acceso denegado. No se ha proporcionado un token de invitación válido.';
      return;
    }

    // Llamamos a Firebase a través del servicio
    const result = await this.tokenService.validateInvitation(this.token);
    this.isLoading = false;

    if (result.isValid) {
      this.isValidToken = true;
    } else {
      // Analizamos el mensaje de error del servicio para saber si el motivo es que ya se usó
      const errorMsg = result.error || '';
      
      if (errorMsg.toLowerCase().includes('utilizada') || errorMsg.toLowerCase().includes('caducado')) {
        // En lugar de romper la pantalla, marcamos que el flujo se completó con éxito previamente
        this.isAlreadyRegistered = true;
      } else {
        // Si es un token inventado o falso, sí mostramos el error de acceso denegado
        this.errorMessage = errorMsg || 'La invitación no es válida.';
      }
    }
  }

  /**
   * @method goToRegister
   * @description Redirige al formulario de registro avanzado arrastrando de forma segura el token de confirmación.
   * @returns {void}
   */
  public goToRegister(): void {
    this.router.navigate(['/register'], {
      queryParams: { token: this.token }
    });
  }
}