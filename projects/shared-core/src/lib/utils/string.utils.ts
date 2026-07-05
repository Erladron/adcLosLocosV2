// src/app/core/utils/string.utils.ts

/**
 * @function normalizeName
 * @description Normaliza nombres propios o apellidos completos aplicando formato PascalCase.
 * Elimina espacios redundantes iniciales, intermedios o finales de la cadena.
 * @example "jUAN jEsUs" => "Juan Jesus"
 * @param {string} value Cadena de texto bruta introducida por el usuario.
 * @returns {string} Cadena normalizada resultante.
 */
export function normalizeName(value: string): string {
  if (!value) {
    return '';
  }

  return value
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(word => !!word)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * @function capitalize
 * @description Modifica una cadena de texto transformando exclusivamente su primer carácter en mayúscula.
 * @param {string} value Cadena de texto.
 * @returns {string}
 */
export function capitalize(value: string): string {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * @function normalizeSpaces
 * @description Escanea la cadena y colapsa cualquier ocurrencia de espacios en blanco duplicados o tabulaciones en un único espacio simple.
 * @param {string} value Cadena de texto sujeta a limpieza.
 * @returns {string}
 */
export function normalizeSpaces(value: string): string {
  if (!value) {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim();
}

/**
 * @function validatePhone
 * @description Valida la estructura telefónica basándose en la longitud estándar de territorio español (9 dígitos numéricos correlativos).
 * @param {string} phone Cadena del teléfono.
 * @returns {boolean} True si es opcional/vacío o si cumple la expresión regular regular de 9 dígitos.
 */
export function validatePhone(phone: string): boolean {
  if (!phone || phone.trim() === '') {
    return true;
  }

  return /^[0-9]{9}$/.test(phone);
}

/**
 * @function formatDNI
 * @description Filtra caracteres alfanuméricos espurios, extrae los dígitos y calcula síncronamente la letra de control.
 * oficial del Ministerio del Interior mediante el algoritmo de residuo módulo 23.
 * @param {string} dni Cadena con el documento sucio o incompleto.
 * @returns {string} Cadena formateada de 8 números junto a su letra de validación exacta.
 */
export function formatDNI(dni: string): string {
  if (!dni) {
    return '';
  }

  const cleanDni = dni.toUpperCase().replace(/[^0-9A-Z]/g, '');
  const numbers = cleanDni.replace(/[A-Z]/g, '');

  if (numbers.length < 8) {
    return numbers;
  }

  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const letter = letters[parseInt(numbers, 10) % 23];

  return numbers.substring(0, 8) + letter;
}

/**
 * @function validateDNI
 * @description Comprueba la integridad física de un DNI/NIE contrastando el dígito verificador final contra la matriz de la peña.
 * @param {string} dni Cadena con el documento de identidad completo.
 * @returns {boolean} True si el formato matemático es estrictamente solvente.
 */
export function validateDNI(dni: string): boolean {
  if (!dni) {
    return false;
  }

  const cleanDni = dni.toUpperCase().trim();
  const regex = /^([0-9]{8})([A-Z])$/;
  const match = cleanDni.match(regex);

  if (!match) {
    return false;
  }

  const number = parseInt(match[1], 10);
  const letter = match[2];
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

  return letters[number % 23] === letter;
}

/**
 * @function validateEmail
 * @description 🚀 REFACTORIZADO: Motor evaluador sintáctico de correos electrónicos.
 * Saneado por completo: Se elimina el cortocircuito inalcanzable y se parametriza el repeatEmail opcional para reutilizar la lógica en todo el ecosistema.
 * @param {string} email Dirección de correo electrónico principal.
 * @param {string} [repeatEmail] Opcional; dirección de validación espejo para doble check de confirmación en altas.
 * @returns {boolean} True si la sintaxis es correcta y (si se facilita) ambos correos son idénticos.
 */
export function validateEmail(email: string, repeatEmail?: string): boolean {
  if (!email) {
    return false;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidSyntax = regex.test(email);

  if (!isValidSyntax) {
    return false;
  }

  // Si se inyecta el parámetro espejo de confirmación, validamos la simetría absoluta de las cadenas
  if (repeatEmail !== undefined) {
    return email.trim().toLowerCase() === repeatEmail.trim().toLowerCase();
  }

  return true;
}

/**
 * @function validatePassword
 * @description Evalúa los requisitos mínimos de robustez exigidos por Firebase Authentication para claves de acceso.
 * @param {string} password Cadena de la contraseña.
 * @returns {boolean} True si la longitud cumple el umbral de seguridad de 6 caracteres.
 */
export function validatePassword(password: string): boolean {
  if (!password) {
    return false;
  }

  return password.length >= 6;
}

/**
 * @function passwordsMatch
 * @description Doble verificación formal que ratifica la exacta coincidencia de la contraseña y su caja espejo.
 * @param {string} password Contraseña primaria.
 * @param {string} repeatPassword Contraseña de confirmación.
 * @returns {boolean}
 */
export function passwordsMatch(password: string, repeatPassword: string): boolean {
  return password === repeatPassword;
}

/**
 * @function validateMemberNumber
 * @description Valida sintácticamente que el número de socio introducido por la directiva consista exclusivamente en caracteres numéricos.
 * @param {string} numero Cadena bajo escrutinio.
 * @returns {boolean}
 */
export function validateMemberNumber(numero: string): boolean {
  if (!numero) {
    return false;
  }

  return /^[0-9]+$/.test(numero);
}

/**
 * @class DateEsUtils
 * @description Utilidad core especializada en la normalización, conversión y estandarización
 * de objetos temporales bajo el huso horario oficial de España (Europe/Madrid).
 * Sanea desfases UTC en entornos distribuidos, emuladores y consultas NoSQL de la peña.
 */
export class DateEsUtils {

  /**
   * @method obtenerFechaActualEs
   * @description Genera una instancia Date sincronizada con la hora civil oficial de España.
   * @returns {Date} Objeto Date ajustado al huso de la península.
   */
  public static obtenerFechaActualEs(): Date {
    const ahora = new Date();
    const stringEs = ahora.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
    return new Date(stringEs);
  }

  /**
   * @method normalizarADate
   * @description Helper defensivo que asimila Timestamps de Firebase, cadenas ISO o Date nativos, devolviendo un Date limpio.
   * @param {any} valor - El dato temporal bruto procedente de la UI o de Firestore.
   * @returns {Date} Instancia de fecha normalizada.
   */
  public static normalizarADate(valor: any): Date {
    if (!valor) return new Date();
    if (valor && typeof valor === 'object' && 'toDate' in valor) {
      return valor.toDate();
    }
    return new Date(valor);
  }

  /**
   * @method formatearFechaCortaEs
   * @description Convierte una fecha al estándar corto de almacenamiento e indexación NoSQL (YYYY-MM-DD).
   * @param {any} valor - Fecha en cualquier formato legible.
   * @returns {string} Cadena formateada (ej: "2026-06-30").
   */
  public static formatearFechaCortaEs(valor: any): string {
    const d = this.normalizarADate(valor);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  /**
   * @method formatearFechaLargaEs
   * @description Convierte una fecha al estándar de visualización civil con granularidad de horas y minutos (DD/MM/YYYY HH:mm).
   * @param {any} valor - Fecha en cualquier formato legible.
   * @param {boolean} [incluirSegundos=false] - Flag opcional para activar precisión de picaje en portería.
   * @returns {string} Cadena formateada (ej: "30/06/2026 18:45").
   */
  public static formatearFechaLargaEs(valor: any, incluirSegundos: boolean = false): string {
    const d = this.normalizarADate(valor);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    
    if (incluirSegundos) {
      const segundos = String(d.getSeconds()).padStart(2, '0');
      return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
    }
    
    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  }

  /**
   * @method estaEnRangoDiarioEs
   * @description Regla de negocio ferial de la peña. Evalúa si el día de hoy cae dentro de la vigencia de un abono o evento de la peña.
   * @param {any} fechaInicio - Límite inferior del evento.
   * @param {any} fechaFin - Límite superior del evento.
   * @returns {boolean} True si el pase es válido hoy.
   */
  public static estaEnRangoDiarioEs(fechaInicio: any, fechaFin: any): boolean {
    const hoyStr = this.formatearFechaCortaEs(this.obtenerFechaActualEs());
    const inicioStr = this.formatearFechaCortaEs(fechaInicio);
    const finStr = this.formatearFechaCortaEs(fechaFin || fechaInicio);

    return (hoyStr >= inicioStr && hoyStr <= finStr);
  }
}