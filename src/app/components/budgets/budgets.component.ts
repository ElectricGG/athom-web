import { Component } from '@angular/core';

@Component({
  selector: 'app-budgets',
  standalone: true,
  templateUrl: './budgets.component.html'
})
export class BudgetsComponent {
  budgetExamples = [
    {
      message: 'Presupuesto comida 600 mensual',
      response: '✅ Presupuesto creado: Comida - S/ 600.00/mes'
    },
    {
      message: 'Límite transporte 200',
      response: '✅ Presupuesto creado: Transporte - S/ 200.00/mes'
    }
  ];
}
