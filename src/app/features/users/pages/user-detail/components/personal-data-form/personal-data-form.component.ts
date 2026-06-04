import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. IMPORTAMOS MapboxService DESDE TU CORE
import { normalizeName, formatDNI, UserDetail, MapboxService } from 'shared-core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { addIcons } from 'ionicons';
import {
  imagesOutline, cameraOutline, checkmarkOutline,
  closeOutline, personOutline, informationCircleOutline,
  createOutline, saveOutline, searchOutline, lockClosedOutline
} from 'ionicons/icons';

// 2. IMPORTACIONES DE RXJS PARA LA BÚSQUEDA PREDICTIVA
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-personal-data-form',
  standalone: true,
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule, ImageCropperComponent]
})
export class PersonalDataFormComponent implements OnChanges, OnInit { // Añadimos OnInit

  @Input() user!: any;
  @Input() imageChangedEvent: any = null;
  @Input() croppedImage = '';
  @Input() mostrarCropper = false;
  @Input() isEditMode = false;
  @Input() editing = false;
  @Input() canEdit = false;
  @Input() simpleMode = false;

  internalImageEvent: any = null;
  internalImageBase64: string = '';

  latestCroppedEvent: any = null;
  transform: any = { scale: 1 };

  @Output() selectPhoto = new EventEmitter<void>();
  @Output() takePhoto = new EventEmitter<void>();
  @Output() imageCropped = new EventEmitter<any>();
  @Output() applyCropper = new EventEmitter<void>();
  @Output() cancelCropper = new EventEmitter<void>();
  @Output() toggleEdit = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  // ==========================================
  // VARIABLES MAPBOX
  // ==========================================
  private mapboxService = inject(MapboxService);
  direccionSubject = new Subject<string>(); // Escucha las pulsaciones de teclado
  sugerencias: any[] = []; // Guarda los resultados de la API
  mostrarSugerencias = false; // Controla si se ve la lista flotante

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({
      imagesOutline, cameraOutline, checkmarkOutline,
      closeOutline, personOutline, informationCircleOutline,
      createOutline, saveOutline, searchOutline, lockClosedOutline
    });
  }

  // ==========================================
  // INICIALIZACIÓN DE LA BÚSQUEDA REACTIVA
  // ==========================================
  ngOnInit() {
    this.direccionSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 3) {
          // Volvemos a usar el environment oficial
          return this.mapboxService.buscarDireccion(query, environment.mapboxToken);
        } else {
          this.mostrarSugerencias = false;
          return of([]);
        }
      })
    ).subscribe(resultados => {
      this.sugerencias = resultados;
      this.mostrarSugerencias = this.sugerencias.length > 0;
      this.cdr.detectChanges();
    });
  }

  // ==========================================
  // MÉTODOS DE MAPBOX
  // ==========================================
  onDireccionChange(nuevaDireccion: string) {
    if (!this.user) return;
    this.user.direccion = nuevaDireccion;
    this.direccionSubject.next(nuevaDireccion);
  }

  seleccionarDireccion(sugerencia: any) {
    // Une el nombre de la calle y la localidad
    this.user.direccion = sugerencia.place_formatted;
    this.mostrarSugerencias = false;
    this.sugerencias = [];
    this.cdr.detectChanges();
  }

  ocultarSugerencias() {
    // Retardo para dar tiempo a que el clic en la lista se registre antes de desaparecer
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.cdr.detectChanges();
    }, 200);
  }

  // ==========================================
  // MÉTODOS EXISTENTES (CROPPER, DNI, ETC)
  // ==========================================
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageChangedEvent']) {
      this.procesarEventoEntrada(changes['imageChangedEvent'].currentValue);
    }
  }

  procesarEventoEntrada(val: any) {
    if (typeof val === 'string') {
      this.internalImageBase64 = val;
      this.internalImageEvent = null;
    } else if (val && typeof val === 'object') {
      this.internalImageEvent = val;
      this.internalImageBase64 = '';
    } else {
      this.internalImageEvent = null;
      this.internalImageBase64 = '';
    }
    this.transform = { scale: 1 };
    this.latestCroppedEvent = null;
  }

  zoomIn() {
    this.transform = { ...this.transform, scale: (this.transform.scale || 1) + 0.15 };
  }

  zoomOut() {
    if ((this.transform.scale || 1) > 0.3) {
      this.transform = { ...this.transform, scale: (this.transform.scale || 1) - 0.15 };
    }
  }

  onImageCropped(event: any) {
    this.latestCroppedEvent = event;
  }

  onAceptarRecorte() {
    if (!this.latestCroppedEvent) {
      this.cerrarCropper();
      return;
    }

    const aplicarFotoRenderizable = (base64String: string) => {
      this.user.foto = base64String;
      this.latestCroppedEvent.base64 = base64String;
      this.imageCropped.emit(this.latestCroppedEvent);
      this.cerrarCropper();
    };

    if (typeof this.latestCroppedEvent === 'string') {
      aplicarFotoRenderizable(this.latestCroppedEvent);
    } else if (this.latestCroppedEvent.base64 && this.latestCroppedEvent.base64.startsWith('data:image')) {
      aplicarFotoRenderizable(this.latestCroppedEvent.base64);
    } else if (this.latestCroppedEvent.blob) {
      const reader = new FileReader();
      reader.readAsDataURL(this.latestCroppedEvent.blob);
      reader.onloadend = () => aplicarFotoRenderizable(reader.result as string);
    } else if (this.latestCroppedEvent.objectUrl) {
      this.user.foto = this.latestCroppedEvent.objectUrl;
      this.imageCropped.emit(this.latestCroppedEvent);
      this.cerrarCropper();
    }
  }

  private cerrarCropper() {
    this.applyCropper.emit();
    this.mostrarCropper = false;
    this.transform = { scale: 1 };
    this.latestCroppedEvent = null;
    this.cdr.detectChanges();
  }

  onCapitalizeName(): void {
    if (!this.user) return;
    this.user.nombre = normalizeName(this.user?.nombre || '');
  }

  // ==========================================
  // LÓGICA DE DNI ESTRICTO (8 NÚMEROS + LETRA)
  // ==========================================

  // Ayudante para saber si estamos en modo lectura
  get isReadonlyMode(): boolean {
    return !this.canEdit || (this.isEditMode && !this.editing);
  }

  // Define lo que se ve DENTRO de la caja de texto
  get dniParaMostrar(): string {
    if (!this.user || !this.user.dni) return '';
    
    // Si la ficha está guardada/bloqueada, mostramos el DNI completo con letra (Ej: 12345678Z)
    if (this.isReadonlyMode) {
      return this.user.dni;
    }
    
    // Si está editando, extraemos y le mostramos ÚNICAMENTE los números (máximo 8)
    return this.user.dni.replace(/\D/g, '').substring(0, 8);
  }

  // Extrae solo la letra para mostrarla como un badge visual al lado del campo
  get letraDni(): string {
    if (!this.user || !this.user.dni) return '';
    const char = this.user.dni.slice(-1);
    return isNaN(Number(char)) ? char : '';
  }

  // Captura cada pulsación del usuario y construye el DNI real por debajo
  onDniChange(valor: string): void {
    if (!this.user) return;

    // 1. Limpiamos cualquier letra que intente colar y cortamos al 8º dígito
    let numeros = valor.replace(/\D/g, '').substring(0, 8);

    if (numeros.length === 0) {
      this.user.dni = '';
      return;
    }

    // 2. Calculamos la letra exacta
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letra = letras[parseInt(numeros, 10) % 23];

    // 3. Guardamos en el modelo el DNI completo (Números + Letra) listo para Firebase
    this.user.dni = numeros + letra;
  }

  async fastProcessImage(file: File): Promise<string> {
    try {
      const bitmap = await createImageBitmap(file, { resizeWidth: 800 });
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(bitmap, 0, 0);
      bitmap.close();
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (err) {
      throw err;
    }
  }

  fileChangeEvent(event: any): void {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.match('image.*')) {
        this.fastProcessImage(file).then(base64 => {
          this.internalImageBase64 = base64;
          this.internalImageEvent = null;
          this.mostrarCropper = true;
          this.cdr.detectChanges();
        }).catch(err => {
          console.warn("Fallo en hardware, usando método nativo", err);
          this.internalImageEvent = event;
          this.internalImageBase64 = '';
          this.mostrarCropper = true;
          this.cdr.detectChanges();
        });
      } else {
        this.limpiarCropper();
      }
    } else {
      this.limpiarCropper();
    }
  }

  limpiarCropper(): void {
    this.imageChangedEvent = null;
    this.internalImageEvent = null;
    this.internalImageBase64 = '';
    this.mostrarCropper = false;
    this.transform = { scale: 1 };
    this.latestCroppedEvent = null;
    this.cdr.detectChanges();
  }
}