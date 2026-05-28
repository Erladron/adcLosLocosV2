import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  // Estados de la interfaz
  isLoading = true;
  isValidToken = false;
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
      this.errorMessage = result.error || 'La invitación ha caducado o ya ha sido utilizada.';
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