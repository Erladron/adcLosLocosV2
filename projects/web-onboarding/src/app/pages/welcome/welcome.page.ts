import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  // Estados de la interfaz
  isLoading = true;
  isValidToken = false;
  isAlreadyRegistered = false; // Nueva bandera para controlar el retorno amigable
  errorMessage = '';
  token = '';

  // Apunta directamente a los recursos locales de la web
  logoUrl = 'assets/img/escudo.png';

  async ngOnInit() {
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
   * Redirige al formulario de registro arrastrando el token de seguridad
   */
  goToRegister() {
    this.router.navigate(['/register'], {
      queryParams: { token: this.token }
    });
  }
}