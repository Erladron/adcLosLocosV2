import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importaciones de tu librería shared-core
import { AuthService } from 'shared-core';
import { NotificationService } from 'shared-core';
import { AppMessageCode } from 'shared-core';

// Servicio del token
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private tokenService = inject(TokenService);

  // Variables de Estado
  registerForm!: FormGroup;
  token = '';
  invitationData: any = null;

  // Variables de UI
  showPassword = false;
  showPasswordConfirm = false;
  cargando = false;

  // Ruta del escudo local oficial unificada
  logoUrl = 'assets/img/escudo.png';

  async ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // Inicializamos el formulario solo con el nombre y las contraseñas
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator.bind(this) });

    if (!this.token) {
      this.router.navigate(['/welcome']);
      return;
    }

    // Esperamos la validación de Firebase
    const validation = await this.tokenService.validateInvitation(this.token);

    if (!validation.isValid) {
      await this.notification.error(validation.error || 'Token inválido');
      this.router.navigate(['/welcome']);
      return;
    }

    // Guardamos los datos del invitado
    this.invitationData = validation.data;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  async onSubmit() {
    if (!this.invitationData || !this.invitationData.email) {
      await this.notification.error('No se han podido cargar los datos de la invitación.');
      this.router.navigate(['/welcome']);
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      this.cargando = true;

      // Mapeamos el nombre que el usuario ha escrito en el input
      const userDataToRegister = {
        nombre: this.registerForm.value.nombre.trim(),
        email: this.invitationData.email,
        password: this.registerForm.value.password
      };

      // Llamada al servicio original de registro
      const registeredUser = await this.authService.register(userDataToRegister);
      console.log('REGISTERED USER', registeredUser);

      await new Promise(resolve => setTimeout(resolve, 800));

      if (registeredUser?.id) {
        await this.authService.reloadUserData(registeredUser.id);
      }

      // Lanzamos la carga de datos sin bloquear el hilo asíncrono
      this.authService.waitForUserData();
      console.log('SESSION USER DATA FORZADO - CONTINUANDO FLUJO');

      // 1. Apagamos el estado de carga del botón inmediatamente
      this.cargando = false;

      // 2. Lanzamos el mensaje de éxito (sin bloquear con await)
      this.notification.success(AppMessageCode.ADC_AUTH_INF_0001);

      // 3. Redirección directa y absoluta a la pantalla de éxito
      await this.router.navigate(['/success']);

    } catch (error: any) {
      console.error('REGISTER ERROR', error);
      this.cargando = false; // Si hay error, liberamos el botón siempre para evitar congelaciones

      if (error?.message) {
        await this.notification.error(error.message);
      } else {
        await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0006 || 'Error al registrar.');
      }
    }
  }
}