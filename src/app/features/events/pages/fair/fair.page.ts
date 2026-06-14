import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';
import { doc, deleteDoc, Firestore } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  peopleOutline,
  ticketOutline,
  alertCircleOutline,
  sendOutline,
  checkmarkCircleOutline,
  closeOutline,
  idCardOutline,
  timeOutline,
  personOutline,
  wineOutline,
  sparklesOutline,
  searchOutline,
  trashOutline
} from 'ionicons/icons';

import {
  PageHeaderComponent,
  AuthService,
  FairService,
  NotificationService,
  LoadingService,
  DialogService,
  ErrorHandlerService,
  User,
  FairAccess,
  AppMessageCode,
  APP_MESSAGES,
  UserRole,
  UserStatus
} from 'shared-core';

@Component({
  selector: 'app-fair',
  templateUrl: './fair.page.html',
  styleUrls: ['./fair.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    PageHeaderComponent
  ]
})
export class FairPage implements OnInit {
  private authService = inject(AuthService);
  private fairService = inject(FairService);
  private firestore = inject(Firestore);
  private notification = inject(NotificationService);
  private loading = inject(LoadingService);
  private dialogService = inject(DialogService);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  currentUserId: string | null = null;
  currentUserData: any = null;
  isInvitado: boolean = false;
  hoyFormateado: string = '';
  
  anioActual: number = new Date().getFullYear();
  antiguedadAnio: number = this.anioActual;

  miPaseHoy: FairAccess | null = null;
  invitacionesEnviadasHoy: number = 0;
  limiteInvitaciones: number = 6;

  misInvitadosHoy: FairAccess[] = [];
  usuariosActivos: User[] = [];
  usuariosFiltrados: User[] = [];
  
  nombreBusqueda: string = '';
  invitadoSeleccionadoId: string = '';
  nombreInvitadoManual: string = '';
  
  qrPayload: string | null = null;
  isQrModalOpen: boolean = false;

  constructor() {
    addIcons({
      qrCodeOutline,
      peopleOutline,
      ticketOutline,
      alertCircleOutline,
      sendOutline,
      checkmarkCircleOutline,
      closeOutline,
      idCardOutline,
      timeOutline,
      personOutline,
      wineOutline,
      sparklesOutline,
      searchOutline,
      trashOutline
    });
    
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    this.hoyFormateado = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
  }

  async ngOnInit() {
    await this.authService.waitForUserData();
    this.currentUserId = this.authService.getUid();
    this.isInvitado = this.authService.isInvitado();
    this.currentUserData = this.authService.currentUserData;

    if (this.currentUserId) {
      if (this.currentUserData?.createdAt) {
        try {
          if (typeof this.currentUserData.createdAt.toDate === 'function') {
            this.antiguedadAnio = this.currentUserData.createdAt.toDate().getFullYear();
          } else if (this.currentUserData.createdAt.seconds) {
            this.antiguedadAnio = new Date(this.currentUserData.createdAt.seconds * 1000).getFullYear();
          } else {
            this.antiguedadAnio = new Date(this.currentUserData.createdAt).getFullYear();
          }
        } catch (e) {
          this.antiguedadAnio = this.anioActual;
        }
      }

      await this.cargarDatosFeria();
    }
  }

  async cargarDatosFeria() {
    try {
      const eventoFeriaActivo = await this.fairService.obtenerEventoFeriaActivo();

      if (!this.isInvitado) {
        if (eventoFeriaActivo?.limiteInvitadosPorSocio) {
          this.limiteInvitaciones = eventoFeriaActivo.limiteInvitadosPorSocio;
        }

        if (eventoFeriaActivo?.startDate) {
          const anyoFeria = eventoFeriaActivo.startDate.split('-')[0];
          this.qrPayload = `SOCIO:${this.currentUserId}:FERIA-${anyoFeria}`;
        } else {
          this.qrPayload = null;
        }

        this.misInvitadosHoy = await this.fairService.obtenerInvitadosDelSocio(this.currentUserId!, this.hoyFormateado);
        this.invitacionesEnviadasHoy = this.misInvitadosHoy.length;
        this.usuariosActivos = await this.fairService.obtenerCandidatosInvitadosDisponibles(this.currentUserId!, this.hoyFormateado);

      } else {
        this.miPaseHoy = await this.fairService.obtenerPaseDiarioUsuario(this.currentUserId!, this.hoyFormateado);
        if (this.miPaseHoy) {
          this.qrPayload = this.miPaseHoy.id;
        }
      }
      this.cdr.detectChanges();
    } catch (error) {
      this.errorHandler.handle(error);
    }
  }

  filtrarUsuarios(event: any) {
    const termino = event.target.value.toLowerCase();
    this.nombreBusqueda = termino;
    this.invitadoSeleccionadoId = ''; 

    if (!termino.trim()) {
      this.usuariosFiltrados = [];
      return;
    }

    this.usuariosFiltrados = this.usuariosActivos.filter(user => 
      user.nombre.toLowerCase().includes(termino) || 
      (user.dni && user.dni.toLowerCase().includes(termino))
    );
  }

  seleccionarUsuario(user: User) {
    this.invitadoSeleccionadoId = user.id;
    this.nombreBusqueda = user.nombre; 
    this.usuariosFiltrados = []; 
  }

  limpiarBusqueda() {
    this.nombreBusqueda = '';
    this.invitadoSeleccionadoId = '';
    this.nombreInvitadoManual = '';
    this.usuariosFiltrados = [];
  }

  async enviarInvitacion() {
    if (!this.invitadoSeleccionadoId && !this.nombreInvitadoManual.trim()) {
      this.notification.warning(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0006]);
      return;
    }

    let usuarioFinal: User | null = null;

    if (this.invitadoSeleccionadoId) {
      usuarioFinal = this.usuariosActivos.find(u => u.id === this.invitadoSeleccionadoId) || null;
    } else if (this.nombreInvitadoManual.trim()) {
      usuarioFinal = {
        id: 'MANUAL-' + crypto.randomUUID().substring(0, 6).toUpperCase(),
        nombre: this.nombreInvitadoManual.trim(),
        tipo: UserRole.INVITADO 
      } as User;
    }

    if (!usuarioFinal) return;

    try {
      await this.loading.wrap(async () => {
        await this.fairService.crearInvitacion(
          this.currentUserData!,
          usuarioFinal!,
          this.hoyFormateado
        );
      }, 'Generando credencial de acceso...');

      this.notification.success(APP_MESSAGES[AppMessageCode.ADC_FAIR_INF_0001]);
      this.limpiarBusqueda();
      
      await this.cargarDatosFeria();
    } catch (error: any) {
      this.errorHandler.handle(error);
    }
  }

  async eliminarPase(pase: FairAccess) {
    const confirmado = await this.dialogService.confirm({
      header: 'Anular Pase Diario',
      message: `¿Estás seguro de que deseas anular la invitación ferial de "${pase.userName}"?`,
      confirmText: 'Sí, Anular',
      cancelText: 'Cancelar'
    });

    if (!confirmado) return;

    try {
      await this.loading.wrap(async () => {
        const paseRef = doc(this.firestore, 'fair-access', pase.id);
        await deleteDoc(paseRef);
      }, 'Anulando invitación...');

      this.notification.success(APP_MESSAGES[AppMessageCode.ADC_FAIR_INF_0002]);
      await this.cargarDatosFeria(); 
    } catch (error: any) {
      this.errorHandler.handle(error);
    }
  }

  setQrModal(open: boolean) {
    if (open && !this.qrPayload) {
      this.notification.warning(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0007]);
      return;
    }
    this.isQrModalOpen = open;
    this.cdr.detectChanges();
  }
}