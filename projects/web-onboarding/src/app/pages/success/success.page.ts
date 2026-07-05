import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonText, 
  IonFooter 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, homeOutline } from 'ionicons/icons';

/**
 * @class SuccessComponent
 * @description Componente standalone de UI que actúa como pantalla de aterrizaje de éxito.
 * Informa al socio que su pre-registro ha concluido satisfactoriamente y gestiona el retorno seguro
 * hacia la raíz arrastrando las credenciales del token de siembra.
 */
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonText,
    IonFooter
  ],
  templateUrl: './success.page.html',
  styleUrl: './success.page.scss'
})
export class SuccessComponent implements OnInit {
  
  /** @description Instancia inyectada del orquestador de rutas de Angular. @private */
  private router = inject(Router);
  /** @description Instancia inyectada del extractor de parámetros url del navegador. @private */
  private route = inject(ActivatedRoute);

  /** @description Ruta física homologada del asset del escudo oficial de la peña. */
  public logoUrl = 'assets/img/escudo.png';
  /** @description Token alfanumérico persistido para mitigar la pérdida de contexto del socio. */
  public token = '';

  /**
   * @constructor
   * @description Registra de forma atómica los iconos vectoriales de la pantalla para optimizar el árbol de dependencias.
   */
  constructor() {
    addIcons({
      checkmarkCircleOutline,
      homeOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Captura el hash del token de la query string para evitar que se volatilice al refrescar la UI.
   */
  public ngOnInit(): void {
    // Capturamos el token que viene de la pantalla de registro para no perderlo
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  /**
   * @method irAlInicio
   * @description Ejecuta una redirección controlada de vuelta a la pantalla de bienvenida, arrastrando el token.
   */
  public irAlInicio(): void {
    this.router.navigate(['/welcome'], {
      queryParams: { token: this.token }
    });
  }
}