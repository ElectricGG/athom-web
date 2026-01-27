import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Transaction, TransactionType, ExpenseDistribution, BalanceSummary, TendenciaMensual } from '../../../models/transaction.model';
import { ResumenMetaAhorro } from '../../../models/meta-ahorro.model';
import { TransactionService } from '../../../services/transaction.service';
import { MetaAhorroService } from '../../../services/meta-ahorro.service';
import { ExpenseDonutChartComponent } from './components/expense-donut-chart/expense-donut-chart.component';
import { MonthlyTrendChartComponent } from './components/monthly-trend-chart/monthly-trend-chart.component';

interface PeriodOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, DatePipe, DecimalPipe, FormsModule, ExpenseDonutChartComponent, MonthlyTrendChartComponent],
  templateUrl: './home.component.html'
})
export class DashboardHomeComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private metaAhorroService = inject(MetaAhorroService);

  userName = 'Juan';
  recentTransactions: Transaction[] = [];
  expenseDistribution: ExpenseDistribution[] = [];
  monthlyTrend: TendenciaMensual[] = [];
  balanceSummary: BalanceSummary | null = null;
  savingGoals: ResumenMetaAhorro[] = [];
  isLoadingTransactions = false;
  isLoadingDistribution = false;
  isLoadingMonthlyTrend = false;
  isLoadingBalance = false;
  isLoadingSavingGoals = false;
  selectedPeriod = 1;

  periodOptions: PeriodOption[] = [
    { label: 'Este mes', value: 1 },
    { label: 'Últimos 2 meses', value: 2 },
    { label: 'Últimos 3 meses', value: 3 }
  ];

  ngOnInit(): void {
    this.loadBalanceSummary();
    this.loadRecentTransactions();
    this.loadExpenseDistribution();
    this.loadMonthlyTrend();
    this.loadSavingGoals();
  }

  isIncome(transaction: Transaction): boolean {
    return transaction.tipo === TransactionType.Ingreso;
  }

  onPeriodChange(): void {
    this.loadExpenseDistribution();
  }


  private loadRecentTransactions(): void {
    this.isLoadingTransactions = true;
    this.transactionService.getRecentTransactions(5).subscribe({
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

  private loadMonthlyTrend(): void {
    this.isLoadingMonthlyTrend = true;
    this.transactionService.getMonthlyTrend(12).subscribe({
      next: (trend) => {
        this.monthlyTrend = trend;
        this.isLoadingMonthlyTrend = false;
      },
      error: () => {
        this.isLoadingMonthlyTrend = false;
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

  private loadSavingGoals(): void {
    this.isLoadingSavingGoals = true;
    this.metaAhorroService.getResumen(5).subscribe({
      next: (goals) => {
        this.savingGoals = goals;
        this.isLoadingSavingGoals = false;
      },
      error: () => {
        this.isLoadingSavingGoals = false;
      }
    });
  }
}
