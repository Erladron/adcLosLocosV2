import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { normalizeName, formatDNI, UserDetail, MapboxService, UserRole } from 'shared-core'; // 🚀 Importado UserRole
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { addIcons } from 'ionicons';
import {
  imagesOutline, cameraOutline, checkmarkOutline,
  closeOutline, personOutline, informationCircleOutline,
  createOutline, saveOutline, searchOutline, lockClosedOutline,
  shieldCheckmarkOutline // 🚀 Añadido icono para la empresa
} from 'ionicons/icons';

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
export class PersonalDataFormComponent implements OnChanges, OnInit {

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

  private mapboxService = inject(MapboxService);
  direccionSubject = new Subject<string>();
  sugerencias: any[] = [];
  mostrarSugerencias = false;

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({
      imagesOutline, cameraOutline, checkmarkOutline,
      closeOutline, personOutline, informationCircleOutline,
      createOutline, saveOutline, searchOutline, lockClosedOutline, shieldCheckmarkOutline
    });
  }

  // 🚀 HELPER PARA EL HTML
  get isPortero(): boolean {
    return this.user?.tipo === UserRole.PORTERO;
  }

  ngOnInit() {
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

  onDireccionChange(nuevaDireccion: string) {
    if (!this.user) return;
    this.user.direccion = nuevaDireccion;
    this.direccionSubject.next(nuevaDireccion);
  }

  seleccionarDireccion(sugerencia: any) {
    this.user.direccion = sugerencia.place_formatted;
    this.mostrarSugerencias = false;
    this.sugerencias = [];
    this.cdr.detectChanges();
  }

  ocultarSugerencias() {
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.cdr.detectChanges();
    }, 200);
  }

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

  zoomIn() { this.transform = { ...this.transform, scale: (this.transform.scale || 1) + 0.15 }; }
  zoomOut() { if ((this.transform.scale || 1) > 0.3) this.transform = { ...this.transform, scale: (this.transform.scale || 1) - 0.15 }; }

  onImageCropped(event: any) { this.latestCroppedEvent = event; }

  onAceptarRecorte() {
    if (!this.latestCroppedEvent) { this.cerrarCropper(); return; }

    const aplicarFotoRenderizable = (base64String: string) => {
      this.user.foto = base64String;
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

  onDniChange(valor: string): void {
    if (!this.user) return;
    let numeros = valor.replace(/\D/g, '').substring(0, 8);
    if (numeros.length === 0) { this.user.dni = ''; return; }
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letra = letras[parseInt(numeros, 10) % 23];
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
    } catch (err) { throw err; }
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
          console.warn("Fallo en hardware", err);
          this.internalImageEvent = event;
          this.internalImageBase64 = '';
          this.mostrarCropper = true;
          this.cdr.detectChanges();
        });
      } else this.limpiarCropper();
    } else this.limpiarCropper();
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