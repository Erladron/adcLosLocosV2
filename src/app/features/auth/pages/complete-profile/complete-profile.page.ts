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

import {
    UserService
} from 'projects/shared-core/src/lib/services/user.service';

import { AppMessageCode } from 'shared-core';

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

    user: User = {} as User;
    imageChangedEvent: any = null;
    croppedImage = '';
    mostrarCropper = false;
    editing = true;

    constructor(
        private authService: AuthService,
        private loading: LoadingService,
        private notification: NotificationService,
        private router: Router,
        private facade: UserDetailFacadeService,
        private userService: UserService
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

    get canSave(): boolean {
        return !!(this.user?.nombre?.trim() && this.user?.dni?.trim());
    }

    async save(): Promise<void> {
        try {
            await this.loading.wrap(
                async () => {
                    console.log('Enviando paquete transaccional a la Cloud Function...');
                    
                    // 🚀 UNICA LLAMADA ACCIÓN: Le pasamos los datos del formulario y la foto a la función
                    // Tu Cloud Function se encargará de:
                    //   1. Validar la petición.
                    //   2. Subir la imagen al Storage internamente.
                    //   3. Actualizar el documento en Firestore cambiando el estado a PENDING_APPROVAL.
                    //   4. Notificar a la directiva de la Peña Los Locos.
                    // Todo empaquetado en el servidor de forma atómica.
                    await this.userService.requestUserApproval({
                        ...this.user,
                        croppedImage: this.croppedImage
                    });

                    // Forzamos la recarga del estado local una vez que el servidor ha dado el OK transaccional
                    if (this.user.id) {
                        await this.authService.reloadUserData(this.user.id);
                    }

                    // 🟢 ÉXITO: El servidor completó la transacción sin caídas
                    await this.notification.success('Perfil completado correctamente');
                    await this.router.navigate(['/pending-approval']);
                },
                'Procesando perfil y notificando...'
            );
        }
        catch (error) {
            console.error('Error en la transacción del Onboarding:', error);
            
            // Si la Cloud Function revienta con el error 500 simulado por el interceptor del test,
            // el catch captura el problema, pinta el Toast controlado y el usuario no se mueve.
            await this.notification.error(AppMessageCode.ADC_SYS_ERR_0001);
        }
    }

    imageCropped(event: any): void {
        this.croppedImage = event.base64;
        this.user.foto = event.base64;
    }

    applyCropper(): void {
        this.mostrarCropper = false;
    }

    cancelCropper(): void {
        this.mostrarCropper = false;
    }

    async selectPhoto(): Promise<void> {
        this.imageChangedEvent = await this.facade.selectPhoto();
        this.mostrarCropper = true;
    }

    async takePhoto(): Promise<void> {
        const result = await this.facade.takePhoto();
        if (!result) return;
        this.imageChangedEvent = result;
        this.mostrarCropper = true;
    }

    async logout() {
        await this.authService.logout();
        await this.router.navigate(['/login']);
    }
}