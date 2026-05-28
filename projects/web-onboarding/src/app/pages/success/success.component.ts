import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {
  private router = inject(Router);

  // 1. Declaramos la propiedad que te pide el HTML
  logoUrl = 'assets/img/escudo.png';

  // 2. Declaramos el método para redirigir que te pide el HTML
  irAlInicio() {
    this.router.navigate(['/welcome']);
  }
}