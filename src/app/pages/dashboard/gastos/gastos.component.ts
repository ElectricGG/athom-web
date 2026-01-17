import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-gastos',
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
  templateUrl: './gastos.component.html'
})
export class GastosComponent {
  showDialog = false;
  searchTerm = '';
  selectedCategory: string | null = null;
  selectedMonth: string | null = null;

  categories = [
    { label: 'Alimentación', value: 'alimentacion' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Entretenimiento', value: 'entretenimiento' },
    { label: 'Servicios', value: 'servicios' },
    { label: 'Salud', value: 'salud' },
    { label: 'Educación', value: 'educacion' },
    { label: 'Otros', value: 'otros' }
  ];

  months = [
    { label: 'Enero 2026', value: '01-2026' },
    { label: 'Diciembre 2025', value: '12-2025' },
    { label: 'Noviembre 2025', value: '11-2025' }
  ];

  expenses = [
    { id: 1, description: 'Supermercado Wong', category: 'Alimentación', date: '14 Ene 2026', amount: '185.50', icon: '🛒' },
    { id: 2, description: 'Uber al trabajo', category: 'Transporte', date: '14 Ene 2026', amount: '25.00', icon: '🚗' },
    { id: 3, description: 'Netflix', category: 'Entretenimiento', date: '12 Ene 2026', amount: '44.90', icon: '🎬' },
    { id: 4, description: 'Recibo de luz', category: 'Servicios', date: '10 Ene 2026', amount: '95.00', icon: '💡' },
    { id: 5, description: 'Almuerzo restaurante', category: 'Alimentación', date: '09 Ene 2026', amount: '45.00', icon: '🍽️' },
    { id: 6, description: 'Gasolina', category: 'Transporte', date: '08 Ene 2026', amount: '120.00', icon: '⛽' },
    { id: 7, description: 'Farmacia', category: 'Salud', date: '07 Ene 2026', amount: '65.00', icon: '💊' },
    { id: 8, description: 'Curso online', category: 'Educación', date: '05 Ene 2026', amount: '99.00', icon: '📚' }
  ];
}
