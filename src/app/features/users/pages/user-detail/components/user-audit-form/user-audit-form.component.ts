import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, refreshOutline, checkmarkCircleOutline, closeCircleOutline,
  timeOutline, personOutline, personAddOutline, mailOpenOutline, alertCircleOutline
} from 'ionicons/icons';
import { User, UserStatus } from 'shared-core';

/**
 * @class UserAuditFormComponent
 * @description Formulario consultor de auditorías de marcas de tiempo del servidor y control de bajas/reactivaciones.
 */
@Component({
  selector: 'app-user-audit-form',
  templateUrl: './user-audit-form.component.html',
  styleUrls: ['./user-audit-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon]
})
export class UserAuditFormComponent {

  @Input() public user!: User;
  @Input() public canDeactivate: boolean = false;
  @Input() public canReactivate: boolean = false;

  @Output() public deactivate: EventEmitter<void> = new EventEmitter<void>();
  @Output() public reactivate: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    addIcons({
      trashOutline, refreshOutline, checkmarkCircleOutline, closeCircleOutline,
      timeOutline, personOutline, personAddOutline, mailOpenOutline, alertCircleOutline
    });
  }

  get isActive(): boolean { return this.user?.estado === UserStatus.ACTIVE; }
  get isInactive(): boolean { return this.user?.estado === UserStatus.INACTIVE; }
  get isPending(): boolean { return this.user?.estado === UserStatus.PENDING_APPROVAL || this.user?.estado === UserStatus.PENDING_DATA; }

  /** @description Traductor semántico de Enums de estado a lenguaje natural para el Badge de interfaz. @returns {string} */
  get statusLabel(): string {
    switch (this.user?.estado) {
      case UserStatus.ACTIVE: return 'Activo';
      case UserStatus.INACTIVE: return 'Inactivo';
      case UserStatus.PENDING_APPROVAL: return 'Pendiente aprobación';
      case UserStatus.PENDING_DATA: return 'Datos pendientes';
      case UserStatus.REJECTED: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  public onDeactivate(): void { this.deactivate.emit(); }
  public onReactivate(): void { this.reactivate.emit(); }

  /** @description Sanea objetos de tipo Timestamp de Firebase convirtiéndolos de forma segura a objetos Date. */
  public formatDeactivatedAt(): any {
    const val: any = this.user?.deactivatedAt;
    if (!val) return null;
    return (val && typeof val === 'object' && 'toDate' in val) ? val.toDate() : new Date(val);
  }

  /** @description Sanea el Timestamp de reactivación a Date para formateadores Pipes. */
  public formatReactivatedAt(): any {
    const val: any = this.user?.reactivatedAt;
    if (!val) return null;
    return (val && typeof val === 'object' && 'toDate' in val) ? val.toDate() : new Date(val);
  }
}