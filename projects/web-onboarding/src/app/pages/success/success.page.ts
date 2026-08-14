import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, homeOutline, rocketOutline } from 'ionicons/icons';
import { environment } from '../../../environments/environment';

/**
 * @class SuccessComponent
 * @description Componente standalone de la interfaz de usuario que actúa como pantalla de aterrizaje de éxito.
 * Informa al socio que su pre-registro o activación de cuenta ha concluido satisfactoriamente,
 * elimina la dependencia de tiendas de aplicaciones nativas promocionando el uso de la PWA del club
 * y gestiona el retorno seguro hacia la raíz preservando el contexto a través del token de sesión.
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
   * Proporciona un mecanismo de contingencia si el parámetro no se encuentra declarado explícitamente en el environment.
   * @type {string}
   */
  public mainAppUrl: string = environment.mainAppUrl || 'https://acdloslocos-app-desa.web.app';

  /**
   * @constructor
   * @description Registra de forma atómica los iconos vectoriales utilizados en la UI para optimizar el árbol de dependencias (Tree Shaking).
   */
  constructor() {
    addIcons({
      checkmarkCircleOutline,
      homeOutline,
      rocketOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular encargado de capturar el hash del token de la query string de forma reactiva.
   * Evita que los datos de inicialización se volatilicen ante eventuales refrescos de la interfaz de usuario.
   * @returns {void}
   */
  public ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
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