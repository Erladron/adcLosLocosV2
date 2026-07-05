import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cashOutline, searchOutline, filterOutline, checkmarkCircleOutline, closeCircleOutline, checkboxOutline, saveOutline } from 'ionicons/icons';

import { User, AppMessageCode } from 'shared-core';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { LoadingService } from 'projects/shared-core/src/lib/services/loading.service';
import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';
import { UserService } from 'projects/shared-core/src/lib/services/user.service';
import { UserFeesService } from 'projects/shared-core/src/lib/services/user-fees.service';
import { PageHeaderComponent } from 'shared-core';
import { EmptyStateComponent } from 'shared-core';

@Component({
  selector: 'app-mantenimiento-cuotas',
  templateUrl: './mantenimiento-cuotas.page.html',
  styleUrls: ['./mantenimiento-cuotas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderComponent,
    EmptyStateComponent
  ]
})
export class MantenimientoCuotasPage implements OnInit {

  private userFeesService: UserFeesService = inject(UserFeesService);

  public users: User[] = [];
  public filteredUsers: User[] = [];
  public searchText: string = '';
  public filtroEstado: string = 'todos';

  // 👥 ESTADO PARA LA SELECCIÓN MÚLTIPLE DE TU NEGOCIO
  public modoMasivoActivo: boolean = false;
  // Guardamos temporalmente los cambios en caliente: { [socioId]: nuevoEstadoBooleano }
  public sociosModificadosTemporalmente: { [key: string]: boolean } = {};

  constructor(
    private authService: AuthService,
    private loading: LoadingService,
    private notification: NotificationService,
    private errorHandler: ErrorHandlerService,
    private userService: UserService
  ) {
    addIcons({ cashOutline, searchOutline, filterOutline, checkmarkCircleOutline, closeCircleOutline, checkboxOutline, saveOutline });
  }

  public async ngOnInit(): Promise<void> {
    await this.loadSocios();
  }

  public async loadSocios(): Promise<void> {
    try {
      this.users = await this.userService.getSociosActivosParaMantenimiento();
      this.aplicarFiltros();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  public aplicarFiltros(): void {
    let resultado = [...this.users];
    const limpiarTexto = (texto: any): string => {
      if (!texto) return '';
      return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    };

    const textoBusqueda = limpiarTexto(this.searchText);

    if (textoBusqueda !== '') {
      resultado = resultado.filter((user: any) => {
        if (!user) return false;
        const nombre = limpiarTexto(user.nombre);
        const nombreSocio = limpiarTexto(user.nombreSocio);
        const numSocio = limpiarTexto(user.numeroSocio);
        const dniSocio = limpiarTexto(user.dni);

        return nombre.includes(textoBusqueda) ||
               nombreSocio.includes(textoBusqueda) ||
               numSocio.includes(textoBusqueda) ||
               dniSocio.includes(textoBusqueda);
      });
    }

    if (this.filtroEstado === 'al_corriente') {
      resultado = resultado.filter(user => this.obtenerEstadoCuotaActual(user) === true);
    } else if (this.filtroEstado === 'pendiente') {
      resultado = resultado.filter(user => !this.obtenerEstadoCuotaActual(user));
    }

    this.filteredUsers = [...resultado];
  }

  /**
   * @method obtenerEstadoCuotaActual
   * @description Devuelve el estado de la cuota teniendo en cuenta si hay cambios temporales sin aplicar en la UI.
   */
  public obtenerEstadoCuotaActual(user: User): boolean {
    if (user.id && this.sociosModificadosTemporalmente[user.id] !== undefined) {
      return this.sociosModificadosTemporalmente[user.id];
    }
    return user.cuotaAlCorriente || false;
  }

  /**
   * @method toggleCuotaSocio
   * @description Modificado para interceptar si estamos en edición masiva o en guardado directo e individual.
   */
  public async toggleCuotaSocio(user: User, event: any): Promise<void> {
    const nuevoEstado = event.detail.checked;
    if (!user.id) return;

    // Caso A: Si el modo masivo está activo, guardamos el cambio solo en memoria temporal
    if (this.modoMasivoActivo) {
      this.sociosModificadosTemporalmente[user.id] = nuevoEstado;
      this.aplicarFiltros(); // Refrescamos por si cambia la fila de categoría visualmente
      return;
    }

    // Caso B: Modo normal uno a uno (Guarda directo en Firebase al instante)
    try {
      const adminUid = this.authService.getUid();
      const adminNombre = this.authService.currentUserData?.nombre || 'Administración';

      await this.loading.wrap(async () => {
        await this.userFeesService.updateCuotaStatus(user.id!, nuevoEstado, adminUid, adminNombre);
        user.cuotaAlCorriente = nuevoEstado;
        user.cuotaActualizadaPorNombre = adminNombre;
        user.cuotaActualizadaAt = new Date();
      }, 'Actualizando estado de cuenta...');

      this.notification.success(`La cuota de ${user.nombre} se ha actualizado correctamente.`);
    } catch (error) {
      event.target.checked = !nuevoEstado;
      await this.errorHandler.handle(error, AppMessageCode.ADC_FEES_ERR_0003);
    }
  }

  /**
   * @method tieneCambiosPendientesMasivos
   * @description Devuelve un booleano para saber si el botón flotante de actualizar cuotas debe mostrarse.
   */
  get tieneCambiosPendientesMasivos(): boolean {
    return Object.keys(this.sociosModificadosTemporalmente).length > 0;
  }

  /**
   * @method procesarActualizacionMasiva
   * @description 🚀 EL BOTÓN MÁGICO SOLICITADO. Envía en lote a Firebase todos los toggles alterados.
   */
  public async procesarActualizacionMasiva(): Promise<void> {
    const idsParaModificar = Object.keys(this.sociosModificadosTemporalmente);
    if (idsParaModificar.length === 0) return;

    try {
      const adminUid = this.authService.getUid();
      const adminNombre = this.authService.currentUserData?.nombre || 'Administración';

      await this.loading.wrap(async () => {
        const promesas = idsParaModificar.map(async (idSocio) => {
          const nuevoEstado = this.sociosModificadosTemporalmente[idSocio];
          
          // 1. Guardamos de verdad en Firestore mediante tu servicio satélite
          await this.userFeesService.updateCuotaStatus(idSocio, nuevoEstado, adminUid, adminNombre);
          
          // 2. Buscamos el socio en nuestro array local para consolidar sus datos de auditoría
          const socioLocal = this.users.find(u => u.id === idSocio);
          if (socioLocal) {
            socioLocal.cuotaAlCorriente = nuevoEstado;
            socioLocal.cuotaActualizadaPorNombre = adminNombre;
            socioLocal.cuotaActualizadaAt = new Date();
          }
        });

        await Promise.all(promesas);
      }, 'Guardando cambios múltiples en Firebase...');

      this.notification.success(`Se han actualizado las cuotas de ${idsParaModificar.length} socios.`);
      
      // Limpiamos los estados temporales una vez guardados con éxito
      this.sociosModificadosTemporalmente = {};
      this.modoMasivoActivo = false;
      this.aplicarFiltros();

    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  /**
   * @method cancelarModoMasivo
   * @description Cancela la selección múltiple y borra todos los movimientos temporales de la pantalla.
   */
  public cancelarModoMasivo(): void {
    this.sociosModificadosTemporalmente = {};
    this.modoMasivoActivo = false;
    this.aplicarFiltros();
  }
}