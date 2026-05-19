import { Injectable } from '@angular/core';

import {

    Auth,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    verifyBeforeUpdateEmail

} from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})

export class AuthCredentialsService {

    constructor(

        private auth: Auth

    ) { }

    // ============================================
    // REAUTHENTICATE USER
    // ============================================

    /**
     * Reautentica al usuario actual.
     * Firebase exige esto para operaciones sensibles:
     * - cambiar email
     * - cambiar password
     */
    async reauthenticate(

        currentEmail: string,

        currentPassword: string

    ) {

        // ============================================
        // CHECK USER AUTH
        // ============================================

        if (!this.auth.currentUser) {

            throw new Error(
                'Usuario no autenticado'
            );

        }

        // ============================================
        // CREATE FIREBASE CREDENTIAL
        // ============================================

        const credential =

            EmailAuthProvider.credential(

                currentEmail,

                currentPassword

            );

        // ============================================
        // FIREBASE REAUTH
        // ============================================

        await reauthenticateWithCredential(

            this.auth.currentUser,

            credential

        );

    }

    // ============================================
    // UPDATE EMAIL
    // ============================================

    /**
     * Actualiza email usuario.
     *
     * Firebase envía automáticamente
     * email de verificación.
     */
    async updateEmail(

        currentEmail: string,

        currentPassword: string,

        newEmail: string

    ) {

        // ============================================
        // VALIDATION
        // ============================================

        if (

            !newEmail ||

            newEmail.trim() === ''

        ) {

            return;

        }

        // ============================================
        // USER AUTH
        // ============================================

        if (!this.auth.currentUser) {

            throw new Error(
                'Usuario no autenticado'
            );

        }

        // ============================================
        // SAME EMAIL
        // ============================================

        if (

            newEmail.trim().toLowerCase()

            ===

            currentEmail.trim().toLowerCase()

        ) {

            return;

        }

        // ============================================
        // REAUTHENTICATE
        // ============================================

        await this.reauthenticate(

            currentEmail,

            currentPassword

        );

        // ============================================
        // LANGUAGE EMAIL FIREBASE
        // ============================================

        this.auth.languageCode = 'es';

        // ============================================
        // VERIFY BEFORE UPDATE EMAIL
        // ============================================

        await verifyBeforeUpdateEmail(

            this.auth.currentUser,

            newEmail.trim().toLowerCase()

        );

    }

    // ============================================
    // UPDATE PASSWORD
    // ============================================

    /**
     * Cambia password usuario actual.
     */
    async updateUserPassword(

        currentEmail: string,

        currentPassword: string,

        newPassword: string

    ) {

        // ============================================
        // VALIDATION
        // ============================================

        if (

            !newPassword ||

            newPassword.trim() === ''

        ) {

            return;

        }

        // ============================================
        // USER AUTH
        // ============================================

        if (!this.auth.currentUser) {

            throw new Error(
                'Usuario no autenticado'
            );

        }

        // ============================================
        // REAUTHENTICATE
        // ============================================

        await this.reauthenticate(

            currentEmail,

            currentPassword

        );

        // ============================================
        // UPDATE PASSWORD
        // ============================================

        await updatePassword(

            this.auth.currentUser,

            newPassword

        );

    }

    // ============================================
    // UPDATE CREDENTIALS
    // ============================================

    /**
     * Método principal unificado.
     *
     * Gestiona:
     * - cambio email
     * - cambio password
     */
    async updateCredentials(

        currentEmail: string,

        currentPassword: string,

        newEmail: string,

        newPassword: string

    ) {

        // ============================================
        // UPDATE EMAIL
        // ============================================

        await this.updateEmail(

            currentEmail,

            currentPassword,

            newEmail

        );

        // ============================================
        // UPDATE PASSWORD
        // ============================================

        await this.updateUserPassword(

            currentEmail,

            currentPassword,

            newPassword

        );

    }

}