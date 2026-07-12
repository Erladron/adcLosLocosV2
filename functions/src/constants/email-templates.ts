/**
 * @const EmailTemplates
 * @description Diccionario centralizado de plantillas HTML corporativas para la distribución 
 * de correspondencia electrónica (Email) oficial de la A.D.C. Los Locos a través de extensiones SMTP.
 */
export const EmailTemplates = {
  
  /**
   * @method getPasswordResetTemplate
   * @description Renderiza una maqueta HTML adaptiva y estilizada con la identidad corporativa 
   * del club para los flujos de configuración inicial o restablecimiento seguro de contraseñas.
   * Incluye un botón de redirección con el token único operacional (oobCode) inyectado.
   * 
   * @param {string} email - Dirección de correo electrónico del usuario destinatario de la alerta.
   * @param {string} resetLink - Enlace personalizado premium de la aplicación web que gestiona el cambio.
   * 
   * @returns {string} Bloque de código HTML5 en bruto listo para su procesamiento e inserción en la cola de envío.
   */
  getPasswordResetTemplate: (email: string, resetLink: string): string => {
    /** @description URL estática del imagotipo oficial del club almacenada en Firebase Storage. */
    const urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad'; //
    
    return `
      <div style="background-color: #f4f6f9; padding: 40px 10px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; min-height: 100vh;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-collapse: separate;">
          <tr>
            <td align="center" style="background-color: #1c3f7c; background-image: linear-gradient(135deg, #18366b 0%, #224d96 100%); padding: 45px 20px;">
              <img src="${urlEscudo}" alt="ADC Los Locos" style="width: 100px; height: auto; display: block; margin-bottom: 15px;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 1px; text-transform: uppercase;">A.D.C. Los Locos</h1>
              <p style="color: #93c5fd; font-size: 14px; margin-top: 8px; margin-bottom: 0; font-style: italic; font-weight: 500; letter-spacing: 0.5px;">"Yo no estoy loco, vivo la locura"</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 35px; background-color: #ffffff;">
              <h2 style="color: #1c3f7c; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: center;">Configuración de contraseña</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; text-align: justify;">¡Hola!</p>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px; text-align: justify;">Hemos recibido una solicitud para configurar o restablecer la contraseña de acceso de tu cuenta asociada a <strong>${email}</strong>.</p>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 35px; text-align: justify;">Para mantener tu cuenta segura, por favor haz clic en el botón inferior. Podrás elegir una nueva contraseña privada y recuperar el acceso a la plataforma del club.</p>
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
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #f8fafc; padding: 25px 20px; border-top: 1px solid #f1f5f9;">
              <p style="color: #64748b; font-size: 11px; margin: 0; letter-spacing: 0.5px; font-weight: 500;">© 2026 ADC Los Locos. Todos los derechos reservados.</p>
              <p style="color: #94a3b8; font-size: 10px; margin-top: 6px; margin-bottom: 0;">Este es un mensaje automático del club. Por favor, no respondas a este correo.</p>
            </td>
          </tr>
        </table>
      </div>
    `; //
  }
};