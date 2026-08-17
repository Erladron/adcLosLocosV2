import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, homeOutline, rocketOutline, logoAndroid, logoApple } from 'ionicons/icons';
import { environment } from '../../../environments/environment';

/**
 * @class SuccessComponent
 * @description Componente standalone de la interfaz de usuario que actúa como pantalla de aterrizaje de éxito en el onboarding.
 * Identifica dinámicamente el entorno de ejecución (Android vs. iOS / Escritorio) mediante el User Agent para guiar la distribución:
 * suministra la descarga directa de la APK de desarrollo en Android o despliega las instrucciones de instalación PWA en Safari para dispositivos iOS.
 */
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './success.page.html',
  styleUrl: './success.page.scss'
})
export class SuccessComponent implements OnInit {
  
  /** 
   * @description Instancia inyectada del orquestador de enrutamiento global de Angular. 
   * @private 
   */
  private router = inject(Router);

  /** 
   * @description Instancia inyectada del extractor de parámetros activos de la URL del navegador. 
   * @private 
   */
  private route = inject(ActivatedRoute);

  /** 
   * @description Ruta física homologada del recurso gráfico del escudo oficial de la peña. 
   * @type {string}
   */
  public logoUrl: string = 'assets/img/escudo.png';

  /** 
   * @description Token alfanumérico recuperado de la query string para mitigar la pérdida de contexto del socio. 
   * @type {string}
   */
  public token: string = '';

  /** 
   * @description Dirección URL base de la aplicación principal recuperada dinámicamente según el entorno activo.
   * @type {string}
   */
  public mainAppUrl: string = environment.mainAppUrl || 'https://adcloslocos-desa.web.app';

  /** 
   * @description Ruta relativa pública hacia el binario APK alojado en los assets del hosting de desarrollo.
   * @type {string}
   */
  public apkUrl: string = 'assets/apk/adc-loslocos-desa.apk';

  /** 
   * @description Indicador reactivo que confirma si el acceso proviene de un dispositivo con SO Android.
   * @type {boolean}
   */
  public isAndroid: boolean = false;

  /** 
   * @description Indicador reactivo que confirma si el acceso proviene de un dispositivo Apple (iPhone, iPad, iPod).
   * @type {boolean}
   */
  public isIOS: boolean = false;

  /**
   * @constructor
   * @description Registra de forma atómica los iconos vectoriales utilizados en la UI para optimizar el árbol de dependencias (Tree Shaking).
   */
  constructor() {
    addIcons({
      checkmarkCircleOutline,
      homeOutline,
      rocketOutline,
      logoAndroid,
      logoApple
    });
  }

  /**
   * @method ngOnInit
   * @description Ciclo de vida inicial. Recupera el token activo de la URL e inicia la evaluación defensiva de la plataforma.
   * @returns {void}
   */
  public ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.detectarPlataforma();
  }

  /**
   * @method detectarPlataforma
   * @private
   * @description Evalúa la cadena `userAgent` del navegador para bifurcar la experiencia de instalación entre Android e iOS/Escritorio.
   * @returns {void}
   */
  private detectarPlataforma(): void {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    this.isAndroid = /android/i.test(userAgent);
    this.isIOS = /ipad|iphone|ipod/i.test(userAgent) && !(window as any).MSStream;
  }

  /**
   * @method irAlInicio
   * @description Ejecuta una redirección controlada y segura de vuelta hacia la pantalla de bienvenida, 
   * arrastrando los parámetros del token para su persistencia.
   * @returns {void}
   */
  public irAlInicio(): void {
    this.router.navigate(['/welcome'], {
      queryParams: { token: this.token }
    });
  }
}