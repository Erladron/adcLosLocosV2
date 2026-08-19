import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonSpinner, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, briefcaseOutline, scanOutline, shieldCheckmarkOutline,
  cardOutline, qrCodeOutline, calendarOutline, checkmarkDoneCircleOutline,
  walletOutline, settingsOutline, peopleOutline, arrowBackOutline,
  chevronForwardOutline, alertCircleOutline, informationCircleOutline,
  ticketOutline, closeOutline, menuOutline
} from 'ionicons/icons';
import { UserRole } from 'shared-core';
import { marked } from 'marked';

/**
 * Interfaz que define la estructura de cada guía dentro del manual de uso.
 */
export interface GuiaItem {
  /** Identificador único para el control de navegación */
  id: string;
  /** Título descriptivo de la tarjeta y sidebar */
  title: string;
  /** Breve descripción del contenido funcional */
  description: string;
  /** Nombre del icono de Ionic (`ionicons`) asignado */
  icon: string;
  /** Lista de roles con permisos para visualizar la guía */
  roles: UserRole[];
  /** Ruta relativa del archivo .md en assets */
  mdPath: string;
}

/**
 * Interfaz para las píldoras de filtrado de roles.
 */
export interface RolPildora {
  /** Clave del rol basada en el Enum `UserRole` */
  key: UserRole;
  /** Etiqueta visible en el botón */
  label: string;
  /** Icono representativo del rol */
  icon: string;
}

/**
 * @component ManualUsoPage
 * @description Vista interactiva del Manual de Uso con sincronización con el historial de navegación nativo,
 * filtrado por roles, ordenación alfabética automática (A-Z) y renderizado de Markdown.
 */
@Component({
  selector: 'app-manual-uso',
  templateUrl: './manual-uso.page.html',
  styleUrls: ['./manual-uso.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonSpinner, IonButtons, IonButton
  ]
})
export class ManualUsoPage implements OnInit, OnDestroy {
  /** @private Inyección del lector de parámetros de ruta de Angular */
  private route = inject(ActivatedRoute);
  /** @private Inyección del servicio de gestión del historial de navegación nativo */
  private location = inject(Location);
  /** @private Inyección del cliente HTTP para la descarga de archivos Markdown */
  private http = inject(HttpClient);
  /** @private Inyección del higienizador HTML para bypass de seguridad */
  private sanitizer = inject(DomSanitizer);

  /** Subscripción para la escucha de eventos del botón "Atrás" del navegador */
  private popStateSub: Subscription | null = null;

  /** Rol activo para el filtrado de guías. Por defecto: SOCIO. */
  public rolSeleccionado: UserRole = UserRole.SOCIO;

  /** Identificador de la guía activa o 'indice' para la vista de cuadrícula. */
  public seccionActiva: string = 'indice';

  /** Guía actualmente seleccionada para la lectura. */
  public guiaActual: GuiaItem | null = null;

  /** Contenido HTML procesado desde Markdown y saneado. */
  public contenidoHtml: SafeHtml = '';

  /** Indicador de estado de carga durante las peticiones HTTP. */
  public cargando: boolean = false;

  public menuColapsado: boolean = true;

  /** Configuración de las píldoras de filtrado por rol. */
  public rolesDisponibles: RolPildora[] = [
    { key: UserRole.SOCIO, label: 'Socio', icon: 'person-outline' },
    { key: UserRole.DIRECTIVA, label: 'Directiva', icon: 'briefcase-outline' },
    { key: UserRole.PORTERO, label: 'Portería', icon: 'scan-outline' },
    { key: UserRole.ADMINISTRADOR, label: 'Administrador', icon: 'shield-checkmark-outline' }
  ];

  /** Catálogo general de guías asignadas a cada módulo del sistema. */
  public guias: GuiaItem[] = [
    {
      id: 'socio-carnet',
      title: 'Carnet Digital y Perfil',
      description: 'Gestión de ficha personal, foto e identificación oficial.',
      icon: 'card-outline',
      roles: [UserRole.SOCIO, UserRole.DIRECTIVA],
      mdPath: 'assets/docs/socio/01-carnet-y-perfil.md'
    },
    {
      id: 'socio-pases',
      title: 'Pases y Códigos QR',
      description: 'Consulta de pases activos y códigos de acceso a eventos.',
      icon: 'qr-code-outline',
      roles: [UserRole.SOCIO, UserRole.DIRECTIVA],
      mdPath: 'assets/docs/socio/02-pases-y-qr.md'
    },
    {
      id: 'socio-invitar',
      title: 'Invitaciones a Acompañantes',
      description: 'Gestión y asignación de pases para invitados.',
      icon: 'ticket-outline',
      roles: [UserRole.SOCIO, UserRole.DIRECTIVA],
      mdPath: 'assets/docs/socio/03-invitar-acompanantes.md'
    },
    {
      id: 'portero-escanear',
      title: 'Control de Accesos y Escaneo QR',
      description: 'Validación en tiempo real de entradas y consola manual.',
      icon: 'scan-outline',
      roles: [UserRole.PORTERO, UserRole.DIRECTIVA, UserRole.ADMINISTRADOR],
      mdPath: 'assets/docs/porteria/01-escanear-qr.md'
    },
    {
      id: 'directiva-eventos',
      title: 'Creación de Eventos',
      description: 'Configuración de aforos, entradas y convocatorias.',
      icon: 'calendar-outline',
      roles: [UserRole.DIRECTIVA, UserRole.ADMINISTRADOR],
      mdPath: 'assets/docs/directiva/01-crear-eventos.md'
    },
    {
      id: 'directiva-aprobar',
      title: 'Aprobación de Socios',
      description: 'Validación de solicitudes de registro pendientes.',
      icon: 'checkmark-done-circle-outline',
      roles: [UserRole.DIRECTIVA, UserRole.ADMINISTRADOR],
      mdPath: 'assets/docs/directiva/02-aprobar-socios.md'
    },
    {
      id: 'directiva-cuotas',
      title: 'Gestión de Cuotas',
      description: 'Estado de membresía y regularización de cobros.',
      icon: 'wallet-outline',
      roles: [UserRole.DIRECTIVA, UserRole.ADMINISTRADOR],
      mdPath: 'assets/docs/directiva/03-gestion-cuotas.md'
    },
    {
      id: 'admin-global',
      title: 'Gestión Global',
      description: 'Ajustes generales del sistema y parámetros.',
      icon: 'settings-outline',
      roles: [UserRole.ADMINISTRADOR, UserRole.DIRECTIVA],
      mdPath: 'assets/docs/admin/01-gestion-global.md'
    },
    {
      id: 'admin-altas-bajas',
      title: 'Altas y Bajas',
      description: 'Administración de la base de datos de usuarios.',
      icon: 'people-outline',
      roles: [UserRole.ADMINISTRADOR, UserRole.DIRECTIVA],
      mdPath: 'assets/docs/admin/02-altas-y-bajas.md'
    }
  ];

  /** Colección de guías resultantes del filtro por rol ordenadas de la A a la Z. */
  public guiasFiltradas: GuiaItem[] = [];

  /**
   * @constructor
   * @description Registra la iconografía vectorial de Ionicons requerida por los componentes de la vista.
   */
  constructor() {
    addIcons({
      'person-outline': personOutline,
      'briefcase-outline': briefcaseOutline,
      'scan-outline': scanOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'card-outline': cardOutline,
      'qr-code-outline': qrCodeOutline,
      'calendar-outline': calendarOutline,
      'checkmark-done-circle-outline': checkmarkDoneCircleOutline,
      'wallet-outline': walletOutline,
      'settings-outline': settingsOutline,
      'people-outline': peopleOutline,
      'arrow-back-outline': arrowBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'alert-circle-outline': alertCircleOutline,
      'information-circle-outline': informationCircleOutline,
      'ticket-outline': ticketOutline,
      'menu-outline': menuOutline,   // <-- REGISTRAR
      'close-outline': closeOutline  // <-- REGISTRAR
    });
  }

  /**
   * @method ngOnInit
   * @description Inicializa los parámetros de rol y suscribe el interceptor del botón "Atrás" del navegador/dispositivo.
   * @returns {void}
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const paramRol = params['rol']?.toLowerCase() as UserRole;
      if (paramRol && Object.values(UserRole).includes(paramRol)) {
        this.rolSeleccionado = paramRol;
      }
      this.filtrarGuias();

      // Si viene con un ID de guía específico por QueryParam, abrirlo de entrada
      const guiaIdParam = params['doc'];
      if (guiaIdParam) {
        this.abrirGuia(guiaIdParam, false);
      }
    });

    // Interceptor del historial del navegador (Paso atrás nativo)
    this.popStateSub = this.location.subscribe((event) => {
      if (this.seccionActiva !== 'indice') {
        this.seccionActiva = 'indice';
        this.guiaActual = null;
        this.contenidoHtml = '';
      }
    }) as Subscription;
  }

  /**
   * @method ngOnDestroy
   * @description Limpia las subscripciones abiertas al destruir el componente.
   * @returns {void}
   */
  public ngOnDestroy(): void {
    if (this.popStateSub) {
      this.popStateSub.unsubscribe();
    }
  }

  /**
   * @method cambiarRol
   * @description Cambia el rol seleccionado en las píldoras, resetea la vista al índice general y refiltra las guías.
   * @param {UserRole} nuevoRol El rol a activar
   * @returns {void}
   */
  public cambiarRol(nuevoRol: UserRole): void {
    this.rolSeleccionado = nuevoRol;
    this.seccionActiva = 'indice';
    this.guiaActual = null;
    this.filtrarGuias();

    // Actualizamos los QueryParams en la URL sin refrescar
    this.location.go(`/manual-uso?rol=${this.rolSeleccionado}`);
  }

  /**
   * @method filtrarGuias
   * @description Aplica el filtro de guías por el rol activo y ORDENA el catálogo alfabéticamente (A-Z) por título.
   * @returns {void}
   */
  public filtrarGuias(): void {
    let lista: GuiaItem[] = [];

    if (this.rolSeleccionado === UserRole.ADMINISTRADOR) {
      lista = [...this.guias];
    } else {
      lista = this.guias.filter(g => g.roles.includes(this.rolSeleccionado));
    }

    this.guiasFiltradas = lista.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
  }

  /**
   * @method abrirGuia
   * @description Descarga mediante HTTP el archivo `.md` de la guía seleccionada y empuja un nuevo estado al historial del navegador.
   * @param {GuiaItem | string} guiaTarget ID o instancia de la guía elegida
   * @param {boolean} pushHistory Determina si registra una entrada en el historial del navegador (por defecto true)
   * @returns {void}
   */
  public abrirGuia(guiaTarget: GuiaItem | string, pushHistory: boolean = true): void {
    let guiaEncontrada: GuiaItem | undefined;
    this.menuColapsado = true;

    if (typeof guiaTarget === 'string') {
      guiaEncontrada = this.guias.find(g => g.id === guiaTarget);
    } else {
      guiaEncontrada = guiaTarget;
    }

    if (!guiaEncontrada) return;

    this.guiaActual = guiaEncontrada;
    this.seccionActiva = guiaEncontrada.id;
    this.cargando = true;
    this.contenidoHtml = '';

    // Si viene de una acción de usuario, empujamos la URL al historial
    if (pushHistory) {
      this.location.go(`/manual-uso?rol=${this.rolSeleccionado}&doc=${guiaEncontrada.id}`);
    }

    this.http.get(guiaEncontrada.mdPath, { responseType: 'text' }).subscribe({
      next: async (mdContent: string) => {
        try {
          const rawHtml = await marked.parse(mdContent);
          this.contenidoHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
        } catch (err) {
          this.contenidoHtml = '<div class="error-box">Error al procesar el archivo de documentación.</div>';
        }
        this.cargando = false;
      },
      error: () => {
        this.contenidoHtml = `<div class="error-box">
          <p><strong>No se pudo cargar la guía:</strong> ${guiaEncontrada?.title}</p>
          <small>Comprueba que existe el archivo: <code>${guiaEncontrada?.mdPath}</code></small>
        </div>`;
        this.cargando = false;
      }
    });
  }

  /**
   * @method volverAlIndice
   * @description Cierra la lectura activa de la guía, retrocede el historial del navegador y vuelve al índice.
   * @returns {void}
   */
  public volverAlIndice(): void {
    this.seccionActiva = 'indice';
    this.guiaActual = null;
    this.contenidoHtml = '';

    // Si la URL actual contenía el parámetro 'doc', retrocedemos en el historial
    if (window.location.search.includes('doc=')) {
      this.location.back();
    }
  }

  /**
   * @method obtenerIconoRolActivo
   * @description Devuelve el icono de Ionicons correspondiente al rol seleccionado en pantalla.
   * @returns {string} Nombre del icono asignado al rol
   */
  public obtenerIconoRolActivo(): string {
    const pildora = this.rolesDisponibles.find(r => r.key === this.rolSeleccionado);
    return pildora ? pildora.icon : 'person-outline';
  }

  /**
 * @method toggleMenuMobile
 * @description Alterna la visibilidad del menú en vistas móviles.
 */
  public toggleMenuMobile(): void {
    this.menuColapsado = !this.menuColapsado;
  }
}