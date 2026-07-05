import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    imagesOutline,
    cameraOutline,
    checkmarkOutline,
    closeOutline,
    personOutline,
    informationCircleOutline
} from 'ionicons/icons';

// Importaciones atómicas y optimizadas desde el paquete central de shared-core
import {
    User,
    UserStatus,
    AuthService,
    LoadingService,
    NotificationService,
    UserDetailFacadeService,
    UserService,
    AppMessageCode,
    ErrorHandlerService,
    normalizeName
} from 'shared-core';

import { PersonalDataFormComponent } from '@users/pages/user-detail/components/personal-data-form/personal-data-form.component';

/**
 * @class CompleteProfilePage
 * @description Pantalla controladora para el flujo autónomo de onboarding y completado
 * pos-registro de datos civiles de los nuevos miembros de la Peña.
 */
@Component({
    selector: 'app-complete-profile',
    templateUrl: './complete-profile.page.html',
    styleUrls: ['./complete-profile.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonButton,
        PersonalDataFormComponent
    ]
})
export class CompleteProfilePage implements OnInit {

    // =========================================================================
    // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
    // =========================================================================
    private authService = inject(AuthService);
    private loading = inject(LoadingService);
    private notification = inject(NotificationService);
    private router = inject(Router);
    private facade = inject(UserDetailFacadeService);
    private userService = inject(UserService);
    private errorHandler = inject(ErrorHandlerService);

    // =========================================================================
    // 📋 VARIABLES DE ESTADO Y MODELOS
    // =========================================================================
    public user: User = {} as User;
    public imageChangedEvent: any = null;
    public croppedImage = '';
    public mostrarCropper = false;
    public editing = true;

    /**
     * @constructor
     * @description Registra la colección de iconos vectoriales necesarios para el Onboarding.
     */
    constructor() {
        addIcons({
            imagesOutline,
            cameraOutline,
            checkmarkOutline,
            closeOutline,
            personOutline,
            informationCircleOutline
        });
    }

    /**
     * @method ngOnInit
     * @description Ciclo de vida inicial. Gestiona la espera activa del estado de sesión 
     * en Firebase y normaliza las propiedades de identidad del usuario.
     */
    public async ngOnInit(): Promise<void> {
        while (!this.authService.currentUser?.uid) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await this.authService.reloadUserData(this.authService.currentUser.uid);

        while (!this.authService.currentUserData) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const currentUser = this.authService.currentUserData;

        console.log('COMPLETE PROFILE USER:', currentUser);

        this.user = {
            publicarTelefono: false,
            publicarEmail: false,
            profesion: '',
            ...(currentUser || {}),
            nombre: normalizeName(currentUser?.nombre || ''),
            email: currentUser?.email || ''
        } as User;
    }

    /** @description Valida los requisitos de campos civiles mínimos antes de habilitar la persistencia. */
    get canSave(): boolean {
        return !!(this.user?.nombre?.trim() && this.user?.dni?.trim());
    }

    /**
     * @method save
     * @description Empaqueta los cambios y despacha la transacción hacia el servidor para solicitar aprobación.
     */
    public async save(): Promise<void> {
        try {
            await this.loading.wrap(
                async () => {
                    console.log('Enviando paquete transaccional a la Cloud Function...');
                    
                    await this.userService.requestUserApproval({
                        ...this.user,
                        croppedImage: this.croppedImage
                    });

                    if (this.user.id) {
                        await this.authService.reloadUserData(this.user.id);
                    }

                    await this.notification.success('Perfil completado correctamente');
                    await this.router.navigate(['/pending-approval']);
                },
                'Procesando perfil y notificando...'
            );
        }
        catch (error) {
            await this.errorHandler.handle(error);
            await this.notification.error(AppMessageCode.ADC_SYS_ERR_0001);
        }
    }

    public imageCropped(event: any): void {
        this.croppedImage = event.base64;
        this.user.foto = event.base64;
    }

    public applyCropper(): void {
        this.mostrarCropper = false;
    }

    public cancelCropper(): void {
        this.mostrarCropper = false;
    }

    public async selectPhoto(): Promise<void> {
        this.imageChangedEvent = await this.facade.selectPhoto();
        this.mostrarCropper = true;
    }

    public async takePhoto(): Promise<void> {
        const result = await this.facade.takePhoto();
        if (!result) return;
        this.imageChangedEvent = result;
        this.mostrarCropper = true;
    }

    public async logout(): Promise<void> {
        await this.authService.logout();
        await this.router.navigate(['/login']);
    }
}