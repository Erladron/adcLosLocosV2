import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonList,
  IonToggle // 🚀 FIJADO: Importado el componente independiente
} from '@ionic/angular/standalone';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { addIcons } from 'ionicons';
import {
  imagesOutline, cameraOutline, checkmarkOutline,
  closeOutline, personOutline, informationCircleOutline,
  createOutline, saveOutline, searchOutline, lockClosedOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// Importaciones unificadas del dominio compartido de shared-core
import { 
  normalizeName, 
  User, 
  MapboxService, 
  UserRole, 
  AppMessageCode, 
  ErrorHandlerService 
} from 'shared-core';
import { environment } from '../../../../../../../environments/environment';

/**
 * @class PersonalDataFormComponent
 * @description Componente secundario de presentación encargado del formulario de datos civiles,
 * geolocalización predictiva mediante la API de Mapbox e integración de flujos multimedia de captura de avatar.
 */
@Component({
  selector: 'app-personal-data-form',
  standalone: true,
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss'],
  imports: [
    CommonModule, 
    FormsModule, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonList, 
    IonToggle, // 🚀 FIJADO: Registrado para dar soporte definitivo a los toggles de privacidad
    ImageCropperComponent
  ]
})
export class PersonalDataFormComponent implements OnChanges, OnInit {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private cdr = inject(ChangeDetectorRef);
  private mapboxService = inject(MapboxService);
  private errorHandler = inject(ErrorHandlerService);

  // =========================================================================
  // 📥 VARIABLES DE ENTRADA (INPUTS)
  // =========================================================================
  @Input() public user!: Partial<User>;
  @Input() public imageChangedEvent: any = null;
  @Input() public croppedImage = '';
  @Input() public mostrarCropper = false;
  @Input() public isEditMode = false;
  @Input() public editing = false;
  @Input() public canEdit = false;
  @Input() public simpleMode = false;

  // =========================================================================
  // 📦 ESTADOS INTERNOS DEL SUBFORMULARIO
  // =========================================================================
  public internalImageEvent: any = null;
  public internalImageBase64 = '';
  public latestCroppedEvent: any = null;
  public transform: any = { scale: 1 };

  @Output() public selectPhoto = new EventEmitter<void>();
  @Output() public takePhoto = new EventEmitter<void>();
  @Output() public imageCropped = new EventEmitter<any>();
  @Output() public applyCropper = new EventEmitter<void>();
  @Output() public cancelCropper = new EventEmitter<void>();
  @Output() public toggleEdit = new EventEmitter<void>();
  @Output() public cancelEdit = new EventEmitter<void>();

  public direccionSubject: Subject<string> = new Subject<string>();
  public sugerencias: any[] = [];
  public mostrarSugerencias = false;

  constructor() {
    addIcons({
      imagesOutline, cameraOutline, checkmarkOutline,
      closeOutline, personOutline, informationCircleOutline,
      createOutline, saveOutline, searchOutline, lockClosedOutline, shieldCheckmarkOutline
    });
  }

  get isPortero(): boolean {
    return this.user?.tipo === UserRole.PORTERO;
  }

  public ngOnInit(): void {
    this.direccionSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 3) {
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

  public onDireccionChange(nuevaDireccion: string): void {
    if (!this.user) return;
    this.user.direccion = nuevaDireccion;
    this.direccionSubject.next(nuevaDireccion);
  }

  public seleccionarDireccion(sugerencia: any): void {
    this.user.direccion = sugerencia.place_formatted;
    this.mostrarSugerencias = false;
    this.sugerencias = [];
    this.cdr.detectChanges();
  }

  public ocultarSugerencias(): void {
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.cdr.detectChanges();
    }, 200);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageChangedEvent']) {
      this.procesarEventoEntrada(changes['imageChangedEvent'].currentValue);
    }
  }

  public procesarEventoEntrada(val: any): void {
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

  public zoomIn(): void { this.transform = { ...this.transform, scale: (this.transform.scale || 1) + 0.15 }; }
  public zoomOut(): void { if ((this.transform.scale || 1) > 0.3) this.transform = { ...this.transform, scale: (this.transform.scale || 1) - 0.15 }; }

  public onImageCropped(event: any): void { this.latestCroppedEvent = event; }

  public onAceptarRecorte(): void {
    if (!this.latestCroppedEvent) { this.cerrarCropper(); return; }

    const aplicarFotoRenderizable = (base64String: string) => {
      if (this.user) this.user.foto = base64String;
      this.latestCroppedEvent.base64 = base64String;
      this.imageCropped.emit(this.latestCroppedEvent);
      this.cerrarCropper();
    };

    if (typeof this.latestCroppedEvent === 'string') aplicarFotoRenderizable(this.latestCroppedEvent);
    else if (this.latestCroppedEvent.base64 && this.latestCroppedEvent.base64.startsWith('data:image')) aplicarFotoRenderizable(this.latestCroppedEvent.base64);
    else if (this.latestCroppedEvent.blob) {
      const reader = new FileReader();
      reader.readAsDataURL(this.latestCroppedEvent.blob);
      reader.onloadend = () => aplicarFotoRenderizable(reader.result as string);
    } else if (this.latestCroppedEvent.objectUrl) {
      if (this.user) this.user.foto = this.latestCroppedEvent.objectUrl;
      this.imageCropped.emit(this.latestCroppedEvent);
      this.cerrarCropper();
    }
  }

  private cerrarCropper(): void {
    this.applyCropper.emit();
    this.mostrarCropper = false;
    this.transform = { scale: 1 };
    this.latestCroppedEvent = null;
    this.cdr.detectChanges();
  }

  public onCapitalizeName(): void {
    if (!this.user) return;
    this.user.nombre = normalizeName(this.user?.nombre || '');
  }

  get isReadonlyMode(): boolean { return !this.canEdit || (this.isEditMode && !this.editing); }

  get dniParaMostrar(): string {
    if (!this.user || !this.user.dni) return '';
    if (this.isReadonlyMode) return this.user.dni;
    return this.user.dni.replace(/\D/g, '').substring(0, 8);
  }

  get letraDni(): string {
    if (!this.user || !this.user.dni) return '';
    const char = this.user.dni.slice(-1);
    return isNaN(Number(char)) ? char : '';
  }

  public onDniChange(valor: string): void {
    if (!this.user) return;
    const numeros = valor.replace(/\D/g, '').substring(0, 8);
    if (numeros.length === 0) { this.user.dni = ''; return; }
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letra = letras[parseInt(numeros, 10) % 23];
    this.user.dni = numeros + letra;
  }

  public async fastProcessImage(file: File): Promise<string> {
    try {
      const bitmap = await createImageBitmap(file, { resizeWidth: 800 });
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(bitmap, 0, 0);
      bitmap.close();
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (err) { throw err; }
  }

  public fileChangeEvent(event: any): void {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.match('image.*')) {
        this.fastProcessImage(file).then(base64 => {
          this.internalImageBase64 = base64;
          this.internalImageEvent = null;
          this.mostrarCropper = true;
          this.cdr.detectChanges();
        }).catch(err => {
          this.errorHandler.handle(err, AppMessageCode.ADC_SYS_ERR_0005);
          this.internalImageEvent = event;
          this.internalImageBase64 = '';
          this.mostrarCropper = true;
          this.cdr.detectChanges();
        });
      } else this.limpiarCropper();
    } else this.limpiarCropper();
  }

  public limpiarCropper(): void {
    this.imageChangedEvent = null;
    this.internalImageEvent = null;
    this.internalImageBase64 = '';
    this.mostrarCropper = false;
    this.transform = { scale: 1 };
    this.latestCroppedEvent = null;
    this.cdr.detectChanges();
  }
}