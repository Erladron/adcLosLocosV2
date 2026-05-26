import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon

} from '@ionic/angular/standalone';

import {
    addIcons
} from 'ionicons';

import {

    trashOutline,
    refreshOutline,
    checkmarkCircleOutline,
    closeCircleOutline,
    timeOutline,
    personOutline,
    personAddOutline,
    mailOpenOutline,
    alertCircleOutline

} from 'ionicons/icons';

import {
    User
} from '@users/models/users.models';

import {
    UserStatus
} from '@users/models/user-status.enum';

@Component({

    selector:
        'app-user-audit-form',

    templateUrl:
        './user-audit-form.component.html',

    styleUrls:
        ['./user-audit-form.component.scss'],

    standalone: true,

    imports: [

        CommonModule,

        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonButton,
        IonIcon

    ]

})

export class UserAuditFormComponent {

    // ============================================
    // INPUTS
    // ============================================

    @Input()
    user!: User;

    @Input()
    canDeactivate = false;

    @Input()
    canReactivate = false;
    

    // ============================================
    // OUTPUTS
    // ============================================

    @Output()
    deactivate =
        new EventEmitter<void>();

    @Output()
    reactivate =
        new EventEmitter<void>();

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() {

        addIcons({

            trashOutline,
            refreshOutline,
            checkmarkCircleOutline,
            closeCircleOutline,
            timeOutline,
            personOutline,
            personAddOutline,
            mailOpenOutline,
            alertCircleOutline

        });

    }

    // ============================================
    // STATUS HELPERS
    // ============================================

    get isActive(): boolean {

        return this.user?.estado
            === UserStatus.ACTIVE;

    }

    get isInactive(): boolean {

        return this.user?.estado
            === UserStatus.INACTIVE;

    }

    get isPending(): boolean {

        return this.user?.estado
            === UserStatus.PENDING_APPROVAL
            ||
            this.user?.estado
            === UserStatus.PENDING_DATA;

    }

    // ============================================
    // STATUS LABEL
    // ============================================

    get statusLabel(): string {

        switch (this.user?.estado) {

            case UserStatus.ACTIVE:

                return 'Activo';

            case UserStatus.INACTIVE:

                return 'Inactivo';

            case UserStatus.PENDING_APPROVAL:

                return 'Pendiente aprobación';

            case UserStatus.PENDING_DATA:

                return 'Datos pendientes';

            case UserStatus.REJECTED:

                return 'Rechazado';

            default:

                return 'Desconocido';

        }

    }

    // ============================================
    // ACTIONS
    // ============================================

    onDeactivate(): void {

        this.deactivate.emit();

    }

    onReactivate(): void {

        this.reactivate.emit();

    }

    // ============================================
    // FORMATTERS
    // ============================================

    formatDeactivatedAt(): any {

        if (!this.user?.deactivatedAt) {

            return null;

        }

        return this.user.deactivatedAt.toDate
            ? this.user.deactivatedAt.toDate()
            : this.user.deactivatedAt;

    }

    formatReactivatedAt(): any {

        if (!this.user?.reactivatedAt) {

            return null;

        }

        return this.user.reactivatedAt.toDate
            ? this.user.reactivatedAt.toDate()
            : this.user.reactivatedAt;

    }

}