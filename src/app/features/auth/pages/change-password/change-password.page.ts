import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, keyOutline, checkmarkCircleOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

import {
    AuthService,
    AuthCredentialsService,
    UserService,
    LoadingService,
    NotificationService,
    ErrorHandlerService
} from 'shared-core';

/**
 * @class ChangePasswordPage
 * @description Pantalla obligatoria para la actualización de la clave temporal en el primer acceso del socio.
 * Incluye trazado exhaustivo de consola para depurar mutaciones en Firebase Auth y Firestore.
 */
@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonButton,
        IonIcon,
        IonItem,
        IonInput,
        IonInputPasswordToggle
    ],
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage {

    /**
     * @description Servicio de autenticación perimetral de Firebase y contexto de sesión.
     * @private
     */
    private authService: AuthService = inject(AuthService);

    /**
     * @description Servicio especializado en la mutación transaccional de credenciales (email y clave).
     * @private
     */
    private authCredentialsService: AuthCredentialsService = inject(AuthCredentialsService);

    /**
     * @description Servicio de persistencia NoSQL de la colección de usuarios.
     * @private
     */
    private userService: UserService = inject(UserService);

    /**
     * @description Servicio de feedback visual para superposición de estados de carga.
     * @private
     */
    private loading: LoadingService = inject(LoadingService);

    /**
     * @description Servicio despachador de notificaciones y alertas flotantes (toasts).
     * @private
     */
    private notification: NotificationService = inject(NotificationService);

    /**
     * @description Gestor e interceptor unificado de errores del cliente.
     * @private
     */
    private errorHandler: ErrorHandlerService = inject(ErrorHandlerService);

    /**
     * @description Orquestador de navegación entre pantallas del cliente Angular.
     * @private
     */
    private router: Router = inject(Router);

    /**
     * @description Lector de parámetros y estados de la ruta activa.
     * @private
     */
    private route: ActivatedRoute = inject(ActivatedRoute);

    /**
     * @description Contraseña temporal activa con la que el socio ha iniciado sesión.
     * @type {string}
     */
    public currentPassword: string = '';

    /**
     * @description Almacén temporal para la nueva contraseña personal definida por el socio.
     * @type {string}
     */
    public newPassword: string = '';

    /**
     * @description Campo espejo para la confirmación y verificación de la nueva contraseña.
     * @type {string}
     */
    public confirmPassword: string = '';

    /**
     * @description Determina si la navegación ha sido forzada por el guard de seguridad al detectar 'requiereCambioClave'.
     * @type {boolean}
     */
    public isForced: boolean = false;

    /**
     * @constructor
     * @description Inicializa los iconos vectoriales e íconos de visibilidad de contraseña.
     */
    constructor() {
        addIcons({ lockClosedOutline, keyOutline, checkmarkCircleOutline, eyeOutline, eyeOffOutline });
        this.isForced = this.route.snapshot.queryParamMap.get('forced') === 'true';
    }

    /**
     * @method updatePassword
     * @description Ejecuta y traza la mutación de credenciales en Firebase Auth y la actualización de Firestore.
     * @returns {Promise<void>}
     */
    public async updatePassword(): Promise<void> {
        console.log('🔍 [DEBUG-PASS] 1. Inicio de updatePassword()');
        console.log('🔍 [DEBUG-PASS] Valores de entrada:', {
            newPasswordLength: this.newPassword ? this.newPassword.length : 0,
            confirmPasswordLength: this.confirmPassword ? this.confirmPassword.length : 0,
            coinciden: this.newPassword === this.confirmPassword
        });

        if (!this.newPassword || this.newPassword.length < 6) {
            console.warn('⚠️ [DEBUG-PASS] Fallo de validación: Clave menor a 6 caracteres.');
            await this.notification.warning('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            console.warn('⚠️ [DEBUG-PASS] Fallo de validación: Las claves no coinciden.');
            await this.notification.warning('Las nuevas contraseñas no coinciden.');
            return;
        }

        try {
            await this.loading.wrap(
                async () => {
                    const currentUser = this.authService.currentUserData;
                    console.log('🔍 [DEBUG-PASS] 2. Perfil de usuario en memoria:', currentUser);

                    if (!currentUser || !currentUser.email) {
                        throw new Error('No se encontró el perfil o correo del usuario activo en la sesión.');
                    }

                    console.log('🚀 [DEBUG-PASS] 3. Invocando AuthCredentialsService.updateUserPassword con bypassReauth=true...');
                    
                    // 1. Mutación de credencial en Firebase Auth
                    await this.authCredentialsService.updateUserPassword(
                        currentUser.email,
                        '',
                        this.newPassword,
                        true
                    );

                    console.log('✅ [DEBUG-PASS] 4. Éxito al actualizar contraseña en Firebase Auth');

                    // 2. Remoción de la marca 'requiereCambioClave' en Firestore
                    if (currentUser.id) {
                        console.log('🚀 [DEBUG-PASS] 5. Actualizando Firestore requiereCambioClave=false para UID:', currentUser.id);
                        await this.userService.update(currentUser.id, {
                            requiereCambioClave: false
                        } as any);

                        currentUser.requiereCambioClave = false;
                        console.log('✅ [DEBUG-PASS] 6. Éxito al actualizar documento en Firestore');
                    }
                },
                'Actualizando contraseña...'
            );

            await this.notification.success('¡Contraseña actualizada con éxito! Bienvenido a la App.');
            console.log('🚀 [DEBUG-PASS] 7. Redirigiendo a /home');
            this.router.navigate(['/home'], { replaceUrl: true });

        } catch (error: any) {
            console.error('❌ [DEBUG-PASS] ERROR CRÍTICO CAPTURADO EN CATCH:', error);
            console.error('❌ [DEBUG-PASS] Código de Error:', error?.code);
            console.error('❌ [DEBUG-PASS] Mensaje de Error:', error?.message);
            await this.errorHandler.handle(error);
        }
    }
}