import { Component } from '@angular/core';

@Component({
  selector: 'app-income',
  standalone: true,
  templateUrl: './income.component.html'
})
export class IncomeComponent {
  incomeExamples = [
    {
      message: 'Ingreso 1500 sueldo',
      response: '✅ Registrado ingreso: S/ 1,500.00 - Sueldo'
    },
    {
      message: 'Recibí 300 freelance',
      response: '✅ Registrado ingreso: S/ 300.00 - Freelance'
    },
    {
      message: 'Venta 250 hoy',
      response: '✅ Registrado ingreso: S/ 250.00 - Venta'
    }
  ];
}
