import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @class PoliticaPrivacidadComponent
 * @description Componente standalone de soporte legal encargado de renderizar el marco regulatorio,
 * las cláusulas de protección de datos (RGPD) y el tratamiento de la información de los nuevos socios.
 */
@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.page.html',
  styleUrls: ['./politica-privacidad.page.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class PoliticaPrivacidadComponent {

  /**
   * @constructor
   * @description Inicializa el componente de políticas de privacidad.
   */
  constructor() { }

}