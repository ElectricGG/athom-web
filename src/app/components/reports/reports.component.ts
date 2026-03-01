import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  reportExamples = [
    {
      message: 'Resumen del mes',
      response: '📊 Resumen Enero 2026\n\n💰 Ingresos: S/ 3,500.00\n💸 Gastos: S/ 2,180.00\n✅ Balance: +S/ 1,320.00\n\nTop gastos:\n• Comida: S/ 850\n• Transporte: S/ 420\n• Servicios: S/ 380'
    },
    {
      message: '¿Cuánto gasté en comida?',
      response: '🍔 Gastos en Comida (Enero):\n\nTotal: S/ 850.00\nTransacciones: 24\nPromedio diario: S/ 27.42'
    },
    {
      message: 'Reporte semanal',
      response: '📅 Semana del 6-12 Ene\n\nGastos: S/ 485.00\nIngresos: S/ 300.00'
    }
  ];
}
