export const EmailTemplates = {

  getInvitationTemplate: (tokenGenerado: string): string => {
    // IMPORTANTE: Sustituye esta URL de ejemplo por la URL pública real de tu escudo de Firebase Storage
    const urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad';

    return `
      <div style="background-color: #f4f6f9; padding: 40px 10px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; min-height: 100vh;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-collapse: separate;">
          
          <tr>
            <td align="center" style="background-color: #1c3f7c; background-image: linear-gradient(135deg, #18366b 0%, #224d96 100%); padding: 45px 20px;">
              <img src="${urlEscudo}" alt="ADC Los Locos" style="width: 100px; height: auto; display: block; margin-bottom: 15px;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                A.D.C. Los Locos
              </h1>
              <p style="color: #93c5fd; font-size: 14px; margin-top: 8px; margin-bottom: 0; font-style: italic; font-weight: 500; letter-spacing: 0.5px;">
                "Yo no estoy loco, vivo la locura"
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 35px; background-color: #ffffff;">
              <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: center; color: #1c3f7c;">
                ¡Te damos la bienvenida a la Peña!
              </h2>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; text-align: justify;">
                ¡Hola!
              </p>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px; text-align: justify;">
                Ya está todo listo para que te unas oficialmente al ecosistema digital de la <strong>Asociación Deportiva Cultural Los Locos</strong>. Queremos que formes parte activa de nuestra comunidad, sigas de cerca cada paso del club y no te pierdas ni un solo momento con nosotros.
              </p>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 35px; text-align: justify;">
                Tu cuenta ya ha sido pre-configurada en el sistema de forma segura. Ahora solo falta que accedas a través del botón de abajo para validar tu contraseña privada y completar tu registro. ¡Nos vemos dentro!
              </p>

              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="http://localhost:4200/welcome?token=${tokenGenerado}" 
                       style="background-color: #1c3f7c; color: #ffffff; padding: 15px 32px; display: inline-block; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(28, 63, 124, 0.25);">
                       Activar mi cuenta de Socio
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-top: 40px; margin-bottom: 0; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
                Por seguridad, este enlace es de uso exclusivo para tu registro. Si tienes cualquier problema con el botón, puedes copiar y pegar esta dirección directamente en tu navegador:
                <br>
                <a href="http://localhost:4200/welcome?token=${tokenGenerado}" style="color: #2563eb; word-break: break-all; text-decoration: underline; display: block; margin-top: 8px;">
                  http://localhost:4200/welcome?token=${tokenGenerado}
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color: #f8fafc; padding: 25px 20px; border-top: 1px solid #f1f5f9;">
              <p style="color: #64748b; font-size: 11px; margin: 0; letter-spacing: 0.5px; font-weight: 500;">
                © 2026 ADC Los Locos. Todos los derechos reservados.
              </p>
              <p style="color: #94a3b8; font-size: 10px; margin-top: 6px; margin-bottom: 0;">
                Este es un mensaje automático del club, ¡nos vemos muy pronto!
              </p>
            </td>
          </tr>

        </table>
      </div>
    `;
  }

};