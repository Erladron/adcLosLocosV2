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
    User
} from '@users/models/users.models';

import {
    UserStatus
} from '@users/models/user-status.enum';

import {
    AuthService
} from '@auth/services/auth.service';

import {
    UserService
} from '@users/services/user.service';

import {
    LoadingService
} from '@core/services/loading.service';

import {
    NotificationService
} from '@core/services/notification.service';

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
    UserDetailFacadeService
} from '@users/services/user-detail-facade.service';


@Component({

    selector: 'app-complete-profile',

    templateUrl:
        './complete-profile.page.html',

    styleUrls: [
        './complete-profile.page.scss'
    ],

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

    // ============================================
    // USER
    // ============================================

    user!: User;

    // ============================================
    // IMAGE
    // ============================================

    imageChangedEvent: any = null;

    croppedImage = '';

    mostrarCropper = false;

    // ============================================
    // EDIT
    // ============================================

    editing = true;

    constructor(

        private authService:
            AuthService,

        private userService:
            UserService,

        private loading:
            LoadingService,

        private notification:
            NotificationService,

        private router:
            Router,

        private facade:
            UserDetailFacadeService

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

    // ============================================
    // INIT
    // ============================================

    async ngOnInit(): Promise<void> {

        const currentUser =

            this.authService
                .currentUserData;

        console.log(
            'COMPLETE PROFILE USER',
            currentUser
        );

        if (!currentUser) {

            return;

        }

        this.user = {

            ...currentUser

        };

    }

    // ============================================
    // SAVE
    // ============================================

    async save(): Promise<void> {

        try {

            await this.loading.wrap(

                async () => {

                    // ====================================
                    // UPDATE STATUS
                    // ====================================

                    this.user.estado =

                        UserStatus
                            .PENDING_APPROVAL;

                    // ====================================
                    // SAVE USER
                    // ====================================

                    await this.userService.update(

                        this.user.id!,
                        this.user

                    );

                },

                'Guardando perfil...'

            );

            // ========================================
            // SUCCESS
            // ========================================

            await this.notification.success(

                'Perfil completado correctamente'

            );

            // ========================================
            // GO PENDING APPROVAL
            // ========================================

            await this.router.navigate([
                '/pending-approval'
            ]);

        }

        catch (error) {

            console.error(error);

        }

    }

    // ============================================
    // IMAGE EVENTS
    // ============================================

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

    // ============================================
    // LOGOUT
    // ============================================

    async logout() {

        await this.authService.logout();

    }

}