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
    'Uso extendido de Mia',
    'Memoria extendida e inteligente',
    'Registro de gastos con foto de boletas (IA Vision)',
    'Registro de gastos por voz (audio a texto)',
    'Reportes avanzados y exportables',
    'Búsqueda y comparación de precios',
    'Soporte prioritario'
  ];

  maxFeatures = [
    'Todo lo de Premium incluido',
    'Agente de compras inteligente con IA',
    'Historial y seguimiento de precios',
    'Alertas automáticas de mejores precios',
    'Predicción de próximas compras',
    '2x más mensajes diarios que Premium',
    '3x más búsquedas de productos que Premium'
  ];

  togglePlan(annual: boolean): void {
    this.isAnnual = annual;
  }
}
