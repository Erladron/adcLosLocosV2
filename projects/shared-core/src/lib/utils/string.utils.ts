// src/app/core/utils/string.utils.ts

/**
 * Normaliza nombres propios.
 * Ejemplo:
 * "jUAN jEsUs" => "Juan Jesus"
 */
export function normalizeName(
    value: string
): string {

    // ============================================
    // EMPTY
    // ============================================

    if (!value) {

        return '';

    }

    // ============================================
    // NORMALIZE
    // ============================================

    return value

        .trim()

        .toLowerCase()

        .split(' ')

        .filter(
            word => !!word
        )

        .map(

            word =>

                word.charAt(0)
                    .toUpperCase()

                +

                word.slice(1)

        )

        .join(' ');

}

/**
 * Capitaliza primera letra.
 */
export function capitalize(
    value: string
): string {

    if (!value) {

        return '';

    }

    return value.charAt(0)
        .toUpperCase()

        +

        value.slice(1);

}

/**
 * Elimina espacios duplicados.
 */
export function normalizeSpaces(
    value: string
): string {

    if (!value) {

        return '';

    }

    return value
        .replace(/\s+/g, ' ')
        .trim();

}

// =========================================
// VALIDAR TELEFONO
// =========================================

export function validatePhone(phone: string): boolean {

    if (!phone || phone.trim() === '') {
        return true;
    }

    return /^[0-9]{9}$/.test(phone);
}

// =========================================
// FORMATEAR DNI
// =========================================

export function formatDNI(dni: string): string {

    if (!dni) {
        return '';
    }

    let cleanDni = dni
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, '');

    const numbers = cleanDni.replace(/[A-Z]/g, '');

    if (numbers.length < 8) {
        return numbers;
    }

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    const letter = letters[
        parseInt(numbers, 10) % 23
    ];

    return numbers.substring(0, 8) + letter;
}

// =========================================
// VALIDAR DNI
// =========================================

export function validateDNI(dni: string): boolean {

    if (!dni) {
        return false;
    }

    dni = dni.toUpperCase().trim();

    const regex = /^([0-9]{8})([A-Z])$/;

    const match = dni.match(regex);

    if (!match) {
        return false;
    }

    const number = parseInt(match[1], 10);

    const letter = match[2];

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    return letters[number % 23] === letter;
}

// =========================================
// VALIDAR EMAIL
// =========================================

export function validateEmail(email: string, repeatEmail: string): boolean {

    if (!email) {
        return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

    if (
        email.trim().toLowerCase() !==
        repeatEmail.trim().toLowerCase()
    ) {
        return false;
    }
}

// =========================================
// VALIDAR PASSWORD
// =========================================

export function validatePassword(password: string): boolean {

    if (!password) {
        return false;
    }

    return password.length >= 6;
}

// =========================================
// VALIDAR PASSWORDS IGUALES
// =========================================

export function passwordsMatch(
    password: string,
    repeatPassword: string
): boolean {

    return password === repeatPassword;
}

// =========================================
// VALIDAR NUMERO SOCIO
// =========================================

export function validateMemberNumber(numero: string): boolean {

    if (!numero) {
        return false;
    }

    return /^[0-9]+$/.test(numero);
}