import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './home.component.html'
})
export class DashboardHomeComponent {
  userName = 'Juan';

  expenseCategories = [
    { name: 'Alimentación', icon: '🍔', amount: '450.00', percentage: 36, color: '#f97316' },
    { name: 'Transporte', icon: '🚗', amount: '280.00', percentage: 22, color: '#3b82f6' },
    { name: 'Entretenimiento', icon: '🎬', amount: '200.00', percentage: 16, color: '#8b5cf6' },
    { name: 'Servicios', icon: '💡', amount: '180.00', percentage: 14, color: '#eab308' },
    { name: 'Otros', icon: '📦', amount: '140.00', percentage: 12, color: '#6b7280' }
  ];

  savingGoals = [
    { name: 'Fondo de emergencia', current: '2,500', target: '5,000', percentage: 50 },
    { name: 'Vacaciones', current: '800', target: '2,000', percentage: 40 },
    { name: 'Laptop nueva', current: '1,200', target: '4,000', percentage: 30 }
  ];

  recentTransactions = [
    { id: 1, description: 'Sueldo mensual', category: 'Sueldo', date: '15 Ene', amount: '3,500.00', type: 'income' },
    { id: 2, description: 'Supermercado Wong', category: 'Alimentación', date: '14 Ene', amount: '185.50', type: 'expense' },
    { id: 3, description: 'Uber', category: 'Transporte', date: '14 Ene', amount: '25.00', type: 'expense' },
    { id: 4, description: 'Freelance diseño', category: 'Freelance', date: '13 Ene', amount: '500.00', type: 'income' },
    { id: 5, description: 'Netflix', category: 'Entretenimiento', date: '12 Ene', amount: '44.90', type: 'expense' }
  ];
}
