import { Component } from '@angular/core';

@Component({
  selector: 'app-expenses',
  standalone: true,
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent {
  expenseExamples = [
    {
      message: 'Gasté 35 soles en comida',
      response: '✅ Registrado: S/ 35.00 en Comida'
    },
    {
      message: 'Café 12 soles',
      response: '✅ Registrado: S/ 12.00 en Cafetería'
    },
    {
      message: 'Supermercado 180',
      response: '✅ Registrado: S/ 180.00 en Supermercado'
    }
  ];
}
