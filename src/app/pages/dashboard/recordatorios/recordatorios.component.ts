import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule
  ],
  templateUrl: './recordatorios.component.html'
})
export class RecordatoriosComponent {
  showDialog = false;

  repeatOptions = [
    { label: 'No repetir', value: 'none' },
    { label: 'Diario', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'yearly' }
  ];

  reminders = [
    {
      id: 1,
      title: 'Pago de luz',
      description: 'Recibo mensual de electricidad',
      amount: '95.00',
      date: '10 Ene 2026',
      icon: '💡',
      status: 'overdue',
      completed: false
    },
    {
      id: 2,
      title: 'Internet',
      description: 'Servicio de internet fibra óptica',
      amount: '89.00',
      date: '12 Ene 2026',
      icon: '🌐',
      status: 'overdue',
      completed: false
    },
    {
      id: 3,
      title: 'Tarjeta de crédito',
      description: 'Pago mínimo tarjeta VISA',
      amount: '450.00',
      date: '18 Ene 2026',
      icon: '💳',
      status: 'upcoming',
      completed: false
    },
    {
      id: 4,
      title: 'Agua',
      description: 'Recibo de agua Sedapal',
      amount: '45.00',
      date: '20 Ene 2026',
      icon: '💧',
      status: 'upcoming',
      completed: false
    },
    {
      id: 5,
      title: 'Gas',
      description: 'Recibo de gas natural',
      amount: '35.00',
      date: '22 Ene 2026',
      icon: '🔥',
      status: 'upcoming',
      completed: false
    },
    {
      id: 6,
      title: 'Gimnasio',
      description: 'Membresía mensual',
      amount: '150.00',
      date: '28 Ene 2026',
      icon: '🏋️',
      status: 'pending',
      completed: false
    }
  ];

  toggleReminder(reminder: any): void {
    reminder.completed = !reminder.completed;
  }
}
