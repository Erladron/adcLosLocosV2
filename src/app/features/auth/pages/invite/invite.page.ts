import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOpenOutline } from 'ionicons/icons';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

// Importaciones unificadas del dominio y utilidades compartidas de shared-core
import { 
  NotificationService, 
  AppMessageCode, 
  InvitedUserService, 
  EmailTemplates, 
  PageHeaderComponent, 
  ErrorHandlerService, 
  LoadingService, 
  AuthService, 
  UserService 
} from 'shared-core';

/**
 * @class InvitePage
 * @description Pantalla controladora encargada de la gestión operativa de invitaciones para nuevos miembros.
 * Valida la existencia previa en el censo, genera un token estructurado y despacha correos automáticos mediante Firestore Mail.
 */
@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    PageHeaderComponent
  ]
})
export class InvitePage implements OnInit {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private invitedUserService = inject(InvitedUserService);
  private notification = inject(NotificationService);
  private loading = inject(LoadingService);
  private errorHandler = inject(ErrorHandlerService);
  private firestore = inject(Firestore);

  // =========================================================================
  // 📋 ESTADOS DEL FORMULARIO
  // =========================================================================
  public email = '';

  /**
   * @constructor
   * @description Inicializa la pantalla y registra el icono de mensajería.
   */
  constructor() {
    addIcons({ mailOpenOutline });
  }

  public ngOnInit(): void { }

  /**
   * @method invitar
   * @description Normaliza, valida y despacha la invitación al correo electrónico proporcionado.
   */
  public async invitar(): Promise<void> {
    if (!this.email) {
      await this.notification.error(AppMessageCode.ADC_INV_ERR_0001);
      return;
    }

    const emailClean = this.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailClean)) {
      await this.notification.error(AppMessageCode.ADC_INV_ERR_0002);
      return;
    }

    try {
      await this.loading.wrap(
        async () => {
          // Check de usuario existente en el censo
          const canContinue = await this.validateExisting(emailClean);
          if (!canContinue) return;

          // Check de invitación pendiente duplicada
          const existingInvitation = await this.invitedUserService.getInvitationByEmail(emailClean);
          if (existingInvitation && !existingInvitation.usado) {
            await this.notification.warning(AppMessageCode.ADC_INV_ERR_0005);
            return;
          }

          const currentUser = this.authService.currentUserData;

          // Registro de la invitación en la base de datos
          await this.invitedUserService.createInvitation({
            nombre: '',
            email: emailClean,
            telefono: '',
            invitadoPor: currentUser?.nombre || 'Administrador',
            invitadoPorUid: currentUser?.id || '',
            fechaInvitacion: null,
            usado: false
          });

          // Recuperación del documento para extraer el ID que actúa como Token de Onboarding
          const nuevaInvitacion = await this.invitedUserService.getInvitationByEmail(emailClean);
          const htmlTemplate = EmailTemplates.getInvitationTemplate(nuevaInvitacion.id);

          // Envío de correo mediante trigger de la colección mail en Firestore (API Modular)
          const mailCollection = collection(this.firestore, 'mail');
          await addDoc(mailCollection, {
            to: emailClean,
            message: {
              subject: '¡Bienvenido! Completa tu inscripción - ADC Los Locos',
              html: htmlTemplate
            }
          });

          await this.notification.success(AppMessageCode.ADC_INV_INF_0001);
          this.email = '';
        },
        'Enviando invitación...'
      );
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_INV_ERR_0003);
    }
  }

  /**
   * @method validateExisting
   * @description Verifica de forma asíncrona si el correo ya pertenece a un usuario registrado.
   */
  public async validateExisting(email: string): Promise<boolean> {
    const existing = await this.userService.existsByEmail(email);
    if (existing.exists) {
      await this.notification.warning(AppMessageCode.ADC_INV_ERR_0004);
      return false;
    }
    return true;
  }
}