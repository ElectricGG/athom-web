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
    'Uso semanal estándar de Mia',
    'Memoria de corto plazo',
    'Registro de gastos en texto (manual)',
    'Reportes con resumen básico visual',
    'Ofertas y descuentos estándar',
    'Soporte estándar'
  ];

  premiumFeatures = [
    'Uso extendido de Mia',
    'Memoria extendida e inteligente',
    'Registro de gastos con foto de boletas (IA Vision)',
    'Registro de gastos por voz (audio a texto)',
    'Reportes avanzados y exportables',
    'Búsqueda y comparación de precios (individual y por lista)',
    'Soporte prioritario'
  ];

  maxFeatures = [
    'Todo lo de Premium incluido',
    'Uso máximo de Mia (mensajes, fotos, audios y más)',
    'Agente de compras inteligente con IA',
    'Historial y seguimiento de compras',
    'Predicción de próximas compras'
  ];

  togglePlan(annual: boolean): void {
    this.isAnnual = annual;
  }
}
