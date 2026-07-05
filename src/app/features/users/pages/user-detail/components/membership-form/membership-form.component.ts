import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonButton, 
  IonIcon,
  IonToggle, // 🚀 FIJADO: Importado el componente independiente
  Platform 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, saveOutline, closeOutline, cashOutline } from 'ionicons/icons';

// Importaciones unificadas del dominio compartido de shared-core
import { User } from 'shared-core';

/**
 * @class MembershipFormComponent
 * @description Componente de formulario secundario especializado en la visualización y edición de los parámetros jerárquicos
 * de membresía, números de socio y el estado financiero crítico del usuario frente a las cuotas del club.
 */
@Component({
  selector: 'app-membership-form',
  standalone: true,
  templateUrl: './membership-form.component.html',
  styleUrls: ['./membership-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonToggle // 🚀 FIJADO: Registrado para dar soporte definitivo a [(ngModel)]
  ]
})
export class MembershipFormComponent {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private platform = inject(Platform);

  // =========================================================================
  // 📥 VARIABLES DE ENTRADA (INPUTS) Y PROPIEDADES PÚBLICAS
  // =========================================================================
  public selectInterface: 'popover' | 'action-sheet' = 'popover';

  @Input() public user: Partial<User> | null = null;
  @Input() public tiposDisponibles: string[] = [];

  private _isEditMode = false;

  @Input() set isEditMode(value: boolean) {
    this._isEditMode = value;
    console.log('MEMBERSHIP isEditMode', value);
  }
  get isEditMode(): boolean {
    return this._isEditMode;
  }

  @Input() public editing = false;

  private _canEditMembership = false;

  @Input() set canEditMembership(value: boolean) {
    console.log('MEMBERSHIP canEditMembership', value);
    this._canEditMembership = value;
  }
  get canEditMembership(): boolean {
    return this._canEditMembership;
  }

  // =========================================================================
  // 📤 CANALES DE SALIDA (OUTPUTS)
  // =========================================================================
  @Output() public toggleEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() public cancelEdit: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    addIcons({
      createOutline,
      saveOutline,
      closeOutline,
      cashOutline
    });

    this.selectInterface = this.platform.is('mobile') ? 'action-sheet' : 'popover';
  }
}