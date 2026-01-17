import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule
  ],
  templateUrl: './metas.component.html'
})
export class MetasComponent {
  showDialog = false;

  colors = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#eab308'];

  goals = [
    {
      id: 1,
      name: 'Fondo de emergencia',
      icon: '🛡️',
      current: '2,500.00',
      target: '5,000.00',
      percentage: 50,
      deadline: 'Dic 2026',
      color: '#22c55e'
    },
    {
      id: 2,
      name: 'Vacaciones en Cancún',
      icon: '✈️',
      current: '1,200.00',
      target: '3,000.00',
      percentage: 40,
      deadline: 'Jul 2026',
      color: '#3b82f6'
    },
    {
      id: 3,
      name: 'Laptop nueva',
      icon: '💻',
      current: '800.00',
      target: '4,000.00',
      percentage: 20,
      deadline: 'Mar 2026',
      color: '#8b5cf6'
    },
    {
      id: 4,
      name: 'Curso de inglés',
      icon: '📚',
      current: '500.00',
      target: '500.00',
      percentage: 100,
      deadline: 'Completado',
      color: '#22c55e'
    }
  ];
}
