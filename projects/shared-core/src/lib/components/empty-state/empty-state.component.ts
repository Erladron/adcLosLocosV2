import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

/**
 * @class EmptyStateComponent
 * @description Componente de presentación reutilizable (Dumb Component) encargado de renderizar
 * un lienzo unificado con iconografía, títulos descriptivos y mensajes de error o ausencia de registros.
 * Refactorizado con ciclo de vida reactivo para asegurar el registro dinámico de IonIcons por hardware en Ionic Standalone.
 */
@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class EmptyStateComponent implements OnChanges {

  /**
   * @description Identificador alfanumérico en formato kebab-case del icono de Ionicons que se pretende inyectar.
   * @type {string}
   * @default 'alert-circle-outline'
   */
  @Input() public icon: string = 'alert-circle-outline';

  /**
   * @description Título principal de la advertencia o estado vacío que se imprimirá en la cabecera del lienzo.
   * @type {string}
   * @default 'Sin datos'
   */
  @Input() public title: string = 'Sin datos';

  /**
   * @description Mensaje aclaratorio o de soporte descriptivo extendido en lenguaje natural.
   * @type {string}
   * @default 'No hay información disponible'
   */
  @Input() public message: string = 'No hay información disponible';

  /**
   * @constructor
   * @description Inicializa el componente registrando el icono de contingencia por defecto.
   */
  constructor() {
    addIcons({ alertCircleOutline: allIcons.alertCircleOutline });
  }

  /**
   * @method ngOnChanges
   * @description Ciclo de vida de Angular que intercepta las mutaciones sobre las propiedades de entrada (@Input).
   * Convierte dinámicamente el string en formato kebab-case recibido a camelCase para localizarlo
   * en el mapa de IonIcons y registrarlo al vuelo en el motor standalone, evitando renderizados en blanco.
   * @param {SimpleChanges} changes Mapa de propiedades que han sufrido modificaciones en el ciclo.
   * @returns {void}
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon'] && this.icon) {
      this.registrarIconoDinamico(this.icon);
    }
  }

  /**
   * @method registrarIconoDinamico
   * @description Transforma sintácticamente la cadena kebab-case e inyecta el icono en el registro global de Ionic.
   * @param {string} iconName Nombre descriptivo del icono (ej. 'cash-outline').
   * @private
   */
  private registrarIconoDinamico(iconName: string): void {
    try {
      // Conversor: 'cash-outline' -> 'cashOutline'
      const camelCaseName = iconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const iconData = (allIcons as any)[camelCaseName];

      if (iconData) {
        addIcons({ [iconName]: iconData });
      } else {
        console.warn(`⚠️ [EmptyStateComponent] El icono solicitado "${iconName}" no se localiza en el diccionario global de IonIcons.`);
      }
    } catch (error) {
      console.error('🚨 Error en el registro dinámico de iconografía standalone:', error);
    }
  }
}