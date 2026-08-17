import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { 
  arrowForwardOutline, 
  alertCircleOutline, 
  checkmarkCircleOutline,
  logoAndroid,
  logoApple,
  rocketOutline
} from 'ionicons/icons';

import { TokenService } from '../../core/services/token.service';
import { environment } from '../../../environments/environment';

/**
 * @class WelcomeComponent
 * @description Componente standalone que actúa como puerta de acceso y control de identidad en el Onboarding.
 * Intercepta de forma asíncrona los tokens de la URL, visa su vigencia contra Firestore y decide de forma inteligente
 * si da paso al formulario de alta, detecta el dispositivo para entregar el ejecutable/PWA si el token ya fue consumido
 * o presenta la guía adaptada por plataforma (Android/iOS) si se accede sin token.
 */
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
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

  /**
   * @description Dirección URL base de la aplicación principal recuperada del entorno activo.
   * @type {string}
   */
  public mainAppUrl: string = environment.mainAppUrl || 'https://adcloslocos-app-desa.web.app';

  /**
   * @description Ruta relativa pública hacia el binario APK alojado en los assets del hosting.
   * @type {string}
   */
  public apkUrl: string = 'assets/apk/adc-loslocos-desa.apk';

  // =========================================================================
  // ⚙️ ESTADOS DE LA INTERFAZ DE USUARIO (UI)
  // =========================================================================
  
  /** @description Controla el renderizado del spinner de carga inicial en la pantalla. */
  public isLoading: boolean = true;
  /** @description Flag que habilita los contenedores y el botón de acceso al formulario de registro. */
  public isValidToken: boolean = false;
  /** @description Bandera inteligente para controlar el retorno amigable si el token ya fue consumido con anterioridad. */
  public isAlreadyRegistered: boolean = false; 
  /** @description Mensaje literal que se muestra en los flujos de exclusión o error. */
  public errorMessage: string = '';
  /** @description Hash alfanumérico único extraído de la query string. */
  public token: string = '';

  /** @description Ruta física del asset del escudo oficial unificado de la peña. */
  public logoUrl: string = 'assets/img/escudo.png';

  /** @description Indicador reactivo de acceso desde sistema operativo Android. */
  public isAndroid: boolean = false;
  /** @description Indicador reactivo de acceso desde sistema operativo iOS (iPhone/iPad). */
  public isIOS: boolean = false;

  /**
   * @constructor
   * @description Registra de forma atómica los iconos vectoriales necesarios para la vista del componente.
   */
  constructor() {
    addIcons({
      arrowForwardOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      logoAndroid,
      logoApple,
      rocketOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Captura el token de la URL, evalúa la plataforma del navegador y dispara la validación en Firestore.
   * Si no se provee token, desactiva la carga y ofrece las opciones adaptadas según el dispositivo.
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    this.detectarPlataforma();

    // Capturamos el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.isLoading = false;
      return;
    }

    // Llamamos a Firebase a través del servicio
    const result = await this.tokenService.validateInvitation(this.token);
    this.isLoading = false;

    if (result.isValid) {
      this.isValidToken = true;
    } else {
      const errorMsg = result.error || '';
      
      if (errorMsg.toLowerCase().includes('utilizada') || errorMsg.toLowerCase().includes('caducado')) {
        this.isAlreadyRegistered = true;
      } else {
        this.errorMessage = errorMsg || 'La invitación no es válida.';
      }
    }
  }

  /**
   * @method detectarPlataforma
   * @private
   * @description Analiza el User Agent del dispositivo para determinar si la navegación es Android o iOS.
   * @returns {void}
   */
  private detectarPlataforma(): void {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    this.isAndroid = /android/i.test(userAgent);
    this.isIOS = /ipad|iphone|ipod/i.test(userAgent) && !(window as any).MSStream;
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

  /**
   * @method irAlLogin
   * @description Redirige al socio directamente hacia la aplicación principal.
   * @returns {void}
   */
  public irAlLogin(): void {
    window.location.href = this.mainAppUrl;
  }
}