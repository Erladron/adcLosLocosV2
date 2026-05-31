import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.page.html',
  styleUrl: './success.page.scss'
})
export class SuccessComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  logoUrl = 'assets/img/escudo.png';
  token = '';

  ngOnInit() {
    // Capturamos el token que viene de la pantalla de registro para no perderlo
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  // Modificamos el método para arrastrar el token de vuelta al inicio
  irAlInicio() {
    this.router.navigate(['/welcome'], {
      queryParams: { token: this.token }
    });
  }
}