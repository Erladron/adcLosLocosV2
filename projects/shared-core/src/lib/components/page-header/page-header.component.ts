import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonMenuButton
} from '@ionic/angular/standalone';

/**
 * @class PageHeaderComponent
 * @description Cabecera de página unificada y reutilizable (Dumb Component) para el ecosistema ADC Los Locos V2.
 * Encapsula la barra de herramientas superior expuesta en las vistas, abstrayendo las condicionales visuales
 * del botón de retroceso nativo de Ionic y las compuertas de activación del menú lateral izquierdo.
 */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonMenuButton
  ]
})
export class PageHeaderComponent {

  /**
   * @description Cadena de caracteres que define el título textual en español que se renderizará en el centro de la cabecera.
   * @type {string}
   * @default ''
   */
  @Input() public title: string = '';

  /**
   * @description Flag condicional booleano que determina si se debe renderizar e inyectar el botón de retroceso automático.
   * @type {boolean}
   * @default false
   */
  @Input() public showBack: boolean = false;

  /**
   * @description Ruta o path de fallback por defecto hacia la que navegará el stack si no hay historial previo en la sesión.
   * @type {string}
   * @default '/home'
   */
  @Input() public backUrl: string = '/home';

  /**
   * @description Flag condicional booleano que habilita o destruye visualmente el botón disparador del menú hamburguesa lateral.
   * @type {boolean}
   * @default false
   */
  @Input() public showMenu: boolean = false;

  /**
   * @constructor
   * @description Inicializa la estructura base del componente de cabecera común.
   */
  constructor() { }
}