import {
    Component,
    OnInit
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    FormsModule
} from '@angular/forms';

import {
    Router
} from '@angular/router';

import {
    IonContent,
    IonButton
} from '@ionic/angular/standalone';

import {
    PersonalDataFormComponent
} from '@users/pages/user-detail/components/personal-data-form/personal-data-form.component';

import {
    User, 
    UserStatus
} from 'shared-core';

import {
    AuthService
} from 'projects/shared-core/src/lib/services/auth.service';

import {
    LoadingService
} from 'projects/shared-core/src/lib/services/loading.service';

import {
    NotificationService
} from 'projects/shared-core/src/lib/services/notification.service';

import {
    addIcons
} from 'ionicons';

import {
    imagesOutline,
    cameraOutline,
    checkmarkOutline,
    closeOutline,
    personOutline,
    informationCircleOutline
} from 'ionicons/icons';

import {
    normalizeName
} from 'shared-core';

import {
    UserDetailFacadeService
} from 'projects/shared-core/src/lib/services/user-detail-facade.service';

// 👇 IMPORTAMOS EL USER SERVICE PARA PODER HACER LA LLAMADA A LA NUBE
import {
    UserService
} from 'projects/shared-core/src/lib/services/user.service';

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
export class CompleteProfilePage
    implements OnInit {

    user: User = {} as User;
    imageChangedEvent: any = null;
    croppedImage = '';
    mostrarCropper = false;
    editing = true;

    constructor(
        private authService:
            AuthService,
        private loading:
            LoadingService,
        private notification:
            NotificationService,
        private router:
            Router,
        private facade:
            UserDetailFacadeService,
        // 👇 INYECTAMOS EL SERVICIO DE USUARIOS EN EL CONSTRUCTOR
        private userService:
            UserService
    ) {
        addIcons({
            imagesOutline,
            cameraOutline,
            checkmarkOutline,
            closeOutline,
            personOutline,
            informationCircleOutline
        });
    }

    async ngOnInit(): Promise<void> {
        // ====================================
        // ESPERAR USUARIO AUTH
        // ====================================
        while (
            !this.authService.currentUser?.uid
        ) {
            await new Promise(
                resolve => setTimeout(resolve, 100)
            );
        }

        // ====================================
        // RECARGAR FIRESTORE USER
        // ====================================
        await this.authService
            .reloadUserData(
                this.authService.currentUser.uid
            );

        // ====================================
        // ESPERAR SESSION DATA REAL
        // ====================================
        while (
            !this.authService.currentUserData
        ) {
            await new Promise(
                resolve => setTimeout(resolve, 100)
            );
        }

        const currentUser =
            this.authService
                .currentUserData;

        console.log(
            'COMPLETE PROFILE USER:',
            currentUser
        );

        // ====================================
        // USER
        // ====================================
        this.user = {
            ...(currentUser || {}),
            nombre:
                normalizeName(
                    currentUser?.nombre ||
                    ''
                ),
            email:
                currentUser?.email ||
                ''
        } as User;
    }

    get canSave(): boolean {
        return !!(
            this.user?.nombre?.trim()
            &&
            this.user?.dni?.trim()
        );
    }

    async save(): Promise<void> {
        try {
            await this.loading.wrap(
                async () => {
                    // ====================================
                    // SAVE PERSONAL DATA
                    // ====================================
                    const success =
                        await this.facade
                            .updatePersonalData({
                                user: {
                                    ...this.user,
                                    estado:
                                        UserStatus
                                            .PENDING_APPROVAL
                                },
                                userId:
                                    this.user.id || null,
                                croppedImage:
                                    this.croppedImage
                            });

                    if (!success) {
                        return;
                    }

                    // ====================================
                    // RELOAD SESSION
                    // ====================================
                    await this.authService
                        .reloadUserData(
                            this.user.id
                        );

                    // ====================================
                    // 🔥 LLAMADA AUTOMÁTICA A LA CLOUD FUNCTION
                    // ====================================
                    console.log('📡 Disparando solicitud en la nube para alertar a la directiva...');
                    await this.userService
                        .requestUserApproval();
                },
                'Guardando perfil y notificando...'
            );

            await this.notification.success(
                'Perfil completado correctamente'
            );

            await this.router.navigate([
                '/pending-approval'
            ]);
        }
        catch (error) {
            console.error('🚨 Error al procesar el guardado automático:', error);
        }
    }

    imageCropped(event: any): void {
        this.croppedImage =
            event.base64;
        this.user.foto =
            event.base64;
    }

    applyCropper(): void {
        this.mostrarCropper =
            false;
    }

    cancelCropper(): void {
        this.mostrarCropper =
            false;
    }

    async selectPhoto(): Promise<void> {
        this.imageChangedEvent =
            await this.facade
                .selectPhoto();
        this.mostrarCropper = true;
    }

    async takePhoto(): Promise<void> {
        const result =
            await this.facade
                .takePhoto();

        if (!result) {
            return;
        }

        this.imageChangedEvent =
            result;
        this.mostrarCropper = true;
    }

    async logout() {
        await this.authService.logout();
        await this.router.navigate([
            '/login'
        ]);
    }
}