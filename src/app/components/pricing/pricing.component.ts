import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink, ButtonModule, CommonModule],
  templateUrl: './pricing.component.html'
})
export class PricingComponent {
  isAnnual = false;

  freeFeatures = [
    'Uso diario estándar de Mia',
    'Memoria de corto plazo',
    'Registro de gastos en texto (manual)',
    'Reportes con resumen básico visual',
    'Ofertas y descuentos estándar',
    'Soporte estándar'
  ];

  premiumFeatures = [
    'Uso extendido ilimitado de Mia*',
    'Memoria extendida e inteligente',
    'Registro de gastos con foto de boletas (IA Vision)',
    'Registro de gastos por voz (audio a texto)',
    'Reportes avanzados y exportables',
    'Soporte prioritario'
  ];

  togglePlan(annual: boolean): void {
    this.isAnnual = annual;
  }
}
