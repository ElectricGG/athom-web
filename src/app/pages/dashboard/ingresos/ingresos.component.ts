import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    InputNumberModule,
    DatePickerModule
  ],
  templateUrl: './ingresos.component.html'
})
export class IngresosComponent {
  showDialog = false;
  searchTerm = '';
  selectedCategory: string | null = null;
  selectedMonth: string | null = null;

  categories = [
    { label: 'Sueldo', value: 'sueldo' },
    { label: 'Freelance', value: 'freelance' },
    { label: 'Inversiones', value: 'inversiones' },
    { label: 'Ventas', value: 'ventas' },
    { label: 'Otros', value: 'otros' }
  ];

  months = [
    { label: 'Enero 2026', value: '01-2026' },
    { label: 'Diciembre 2025', value: '12-2025' },
    { label: 'Noviembre 2025', value: '11-2025' }
  ];

  incomes = [
    { id: 1, description: 'Sueldo mensual', category: 'Sueldo', date: '15 Ene 2026', amount: '3,500.00' },
    { id: 2, description: 'Proyecto freelance', category: 'Freelance', date: '13 Ene 2026', amount: '500.00' },
    { id: 3, description: 'Dividendos acciones', category: 'Inversiones', date: '10 Ene 2026', amount: '250.00' },
    { id: 4, description: 'Venta artículo usado', category: 'Ventas', date: '08 Ene 2026', amount: '150.00' },
    { id: 5, description: 'Bono navideño', category: 'Sueldo', date: '24 Dic 2025', amount: '1,000.00' },
    { id: 6, description: 'Trabajo extra', category: 'Freelance', date: '20 Dic 2025', amount: '300.00' }
  ];
}
