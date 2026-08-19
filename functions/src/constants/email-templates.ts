/**
 * @const EmailTemplates
 * @description Diccionario centralizado de plantillas HTML corporativas para la distribución 
 * de correspondencia electrónica (Email) oficial de la A.C.D. Los Locos a través de extensiones SMTP.
 */
export const EmailTemplates = {

  /**
   * @method getLayout
   * @private
   * @description Envoltura HTML base reusable (Layout) que consolida la estructura visual,
   * colores corporativos, isotipo de la peña y pie de página para cualquier plantilla de correo.
   * 
   * @param {string} contentHtml - Cuerpo del mensaje específico maquetado en HTML.
   * @returns {string} Estructura HTML completa reutilizable.
   */
  getLayout: (contentHtml: string): string => {
    /** @description URL estática del imagotipo oficial del club almacenada en Firebase Storage. */
    const urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad';

    return `
      <div style="background-color: #f4f6f9; padding: 40px 10px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; min-height: 100vh;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-collapse: separate;">
          <!-- CABECERA CORPORATIVA UNIFICADA -->
          <tr>
            <td align="center" style="background-color: #1c3f7c; background-image: linear-gradient(135deg, #18366b 0%, #224d96 100%); padding: 45px 20px;">
              <img src="${urlEscudo}" alt="ACD Los Locos" style="width: 100px; height: auto; display: block; margin-bottom: 15px;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 1px; text-transform: uppercase;">A.C.D. Los Locos</h1>
              <p style="color: #93c5fd; font-size: 14px; margin-top: 8px; margin-bottom: 0; font-style: italic; font-weight: 500; letter-spacing: 0.5px;">"Yo no estoy loco, vivo la locura"</p>
            </td>
          </tr>
          
          <!-- CUERPO DINÁMICO INYECTADO -->
          <tr>
            <td style="padding: 40px 35px; background-color: #ffffff;">
              ${contentHtml}
            </td>
          </tr>

          <!-- PIE DE PÁGINA UNIFICADO -->
          <tr>
            <td align="center" style="background-color: #f8fafc; padding: 25px 20px; border-top: 1px solid #f1f5f9;">
              <p style="color: #64748b; font-size: 11px; margin: 0; letter-spacing: 0.5px; font-weight: 500;">© 2026 ACD Los Locos. Todos los derechos reservados.</p>
              <p style="color: #94a3b8; font-size: 10px; margin-top: 6px; margin-bottom: 0;">Este es un mensaje automático del club. Por favor, no respondas a este correo.</p>
            </td>
          </tr>
        </table>
      </div>
    `;
  },

  /**
   * @method getPasswordResetTemplate
   * @description Plantilla maquetada para los flujos de restablecimiento de contraseña.
   */
  getPasswordResetTemplate: (email: string, resetLink: string): string => {
    const content = `
      <h2 style="color: #1c3f7c; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: center;">Configuración de contraseña</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">¡Hola!</p>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">Hemos recibido una solicitud para configurar o restablecer la contraseña de acceso de tu cuenta asociada a <strong>${email}</strong>.</p>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 35px;">Para mantener tu cuenta segura, por favor haz clic en el botón inferior. Podrás elegir una nueva contraseña privada y recuperar el acceso a la plataforma del club.</p>
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <a href="${resetLink}" style="background-color: #1c3f7c; color: #ffffff; padding: 15px 32px; display: inline-block; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(28, 63, 124, 0.25);">Configurar mi contraseña</a>
          </td>
        </tr>
      </table>

      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-top: 40px; margin-bottom: 0; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
        Si no has solicitado este cambio, por favor ignora este correo. El enlace caducará por seguridad en unas horas. Si tienes cualquier problema con el botón, puedes copiar y pegar esta dirección directamente en tu navegador:
        <br>
        <a href="${resetLink}" style="color: #2563eb; word-break: break-all; text-decoration: underline; display: block; margin-top: 8px;">${resetLink}</a>
      </p>
    `;

    return EmailTemplates.getLayout(content);
  },

  /**
   * @method getWelcomeCredentialsTemplate
   * @description Plantilla maquetada para notificaciones de bienvenida y clave temporal en altas administrativas.
   */
  getWelcomeCredentialsTemplate: (nombre: string, email: string, tempPassword: string, welcomeLink: string): string => {
    const content = `
      <h2 style="color: #1c3f7c; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: center;">¡Bienvenido a la Asociación!</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">¡Hola <strong>${nombre}</strong>!</p>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">Te informamos de que tu ficha de socio ha sido activada correctamente en nuestro sistema. A continuación encontrarás tus datos de acceso iniciales:</p>
      
      <!-- Cajas con Credenciales -->
      <div style="background-color: #f1f5f9; border-left: 4px solid #1c3f7c; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #334155;"><strong>Usuario:</strong> ${email}</p>
        <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Contraseña temporal:</strong> <code style="background-color: #e2e8f0; color: #1e3a8a; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 15px; font-weight: bold;">${tempPassword}</code></p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 30px;">Para ingresar por primera vez, configurar tu clave personal e instalar la aplicación en tu dispositivo móvil, haz clic en el siguiente botón:</p>

      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <a href="${welcomeLink}" style="background-color: #1c3f7c; color: #ffffff; padding: 15px 32px; display: inline-block; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(28, 63, 124, 0.25);">Acceder a la Plataforma</a>
          </td>
        </tr>
      </table>

      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-top: 35px; margin-bottom: 0; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
        🔒 Por razones de seguridad, la aplicación te solicitará actualizar esta clave temporal en cuanto inicies sesión por primera vez.
      </p>
    `;

    return EmailTemplates.getLayout(content);
  }
};