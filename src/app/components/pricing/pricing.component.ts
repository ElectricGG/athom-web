import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './pricing.component.html'
})
export class PricingComponent {
  freeFeatures = [
    'Registro de gastos e ingresos',
    'Categorías limitadas',
    'Inteligencia básica de clasificación',
    'Envío de audio o imagen para registros',
    'Reportes básicos'
  ];

  premiumFeatures = [
    'Todo lo del plan gratis',
    'Mensajes ilimitados',
    'Inteligencia avanzada en reportes',
    'Categorías personalizadas ilimitadas',
    'Reportes avanzados y exportables',
    'Alertas de presupuesto personalizadas'
  ];
}
