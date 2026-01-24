import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Transaction, TransactionType, ExpenseDistribution, BalanceSummary } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';

interface PeriodOption {
  label: string;
  value: number;
}

const VISIBLE_CATEGORIES_LIMIT = 7;

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './home.component.html'
})
export class DashboardHomeComponent implements OnInit {
  private transactionService = inject(TransactionService);

  userName = 'Juan';
  recentTransactions: Transaction[] = [];
  expenseDistribution: ExpenseDistribution[] = [];
  balanceSummary: BalanceSummary | null = null;
  isLoadingTransactions = false;
  isLoadingDistribution = false;
  isLoadingBalance = false;
  selectedPeriod = 1;
  showAllCategories = false;

  periodOptions: PeriodOption[] = [
    { label: 'Este mes', value: 1 },
    { label: 'Últimos 2 meses', value: 2 },
    { label: 'Últimos 3 meses', value: 3 }
  ];

  savingGoals = [
    { name: 'Fondo de emergencia', current: '2,500', target: '5,000', percentage: 50 },
    { name: 'Vacaciones', current: '800', target: '2,000', percentage: 40 },
    { name: 'Laptop nueva', current: '1,200', target: '4,000', percentage: 30 }
  ];

  get visibleCategories(): ExpenseDistribution[] {
    if (this.showAllCategories) {
      return this.expenseDistribution;
    }
    return this.expenseDistribution.slice(0, VISIBLE_CATEGORIES_LIMIT);
  }

  get hasMoreCategories(): boolean {
    return this.expenseDistribution.length > VISIBLE_CATEGORIES_LIMIT;
  }

  get hiddenCategoriesCount(): number {
    return this.expenseDistribution.length - VISIBLE_CATEGORIES_LIMIT;
  }

  ngOnInit(): void {
    this.loadBalanceSummary();
    this.loadRecentTransactions();
    this.loadExpenseDistribution();
  }

  isIncome(transaction: Transaction): boolean {
    return transaction.tipo === TransactionType.Ingreso;
  }

  onPeriodChange(): void {
    this.showAllCategories = false;
    this.loadExpenseDistribution();
  }

  toggleShowAllCategories(): void {
    this.showAllCategories = !this.showAllCategories;
  }

  getDefaultIcon(nombre: string): string {
    const iconMap: Record<string, string> = {
      'alimentación': '🍔',
      'transporte': '🚗',
      'entretenimiento': '🎬',
      'servicios': '💡',
      'salud': '💊',
      'educación': '📚',
      'vivienda': '🏠',
      'ropa': '👕'
    };
    return iconMap[nombre.toLowerCase()] ?? '📦';
  }

  getDefaultColor(index: number): string {
    const colors = ['#f97316', '#3b82f6', '#8b5cf6', '#eab308', '#ef4444', '#10b981', '#06b6d4', '#6b7280'];
    return colors[index % colors.length];
  }

  private loadRecentTransactions(): void {
    this.isLoadingTransactions = true;
    this.transactionService.getRecentTransactions(10).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
        this.isLoadingTransactions = false;
      },
      error: () => {
        this.isLoadingTransactions = false;
      }
    });
  }

  private loadExpenseDistribution(): void {
    this.isLoadingDistribution = true;
    this.transactionService.getExpenseDistribution(this.selectedPeriod).subscribe({
      next: (distribution) => {
        this.expenseDistribution = distribution;
        this.isLoadingDistribution = false;
      },
      error: () => {
        this.isLoadingDistribution = false;
      }
    });
  }

  private loadBalanceSummary(): void {
    this.isLoadingBalance = true;
    this.transactionService.getBalanceSummary().subscribe({
      next: (summary) => {
        this.balanceSummary = summary;
        this.isLoadingBalance = false;
      },
      error: () => {
        this.isLoadingBalance = false;
      }
    });
  }
}
