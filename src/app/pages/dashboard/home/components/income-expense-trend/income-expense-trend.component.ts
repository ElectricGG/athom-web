import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TransactionService } from '../../../../../services/transaction.service';
import { TendenciaMensual, TendenciaDiaria } from '../../../../../models/transaction.model';

type TabType = 'mensual' | 'diario';

interface MonthOption {
  label: string;
  mes: number;
  anio: number;
}

@Component({
  selector: 'app-income-expense-trend',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, DecimalPipe],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 class="font-semibold text-gray-900">Ingresos vs Gastos</h3>

        <!-- Tab pills -->
        <div class="flex items-center gap-2">
          <div class="flex bg-gray-100 rounded-lg p-0.5">
            <button
              (click)="onTabChange('mensual')"
              [class]="activeTab === 'mensual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
            >
              Mensual
            </button>
            <button
              (click)="onTabChange('diario')"
              [class]="activeTab === 'diario'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
            >
              Diario
            </button>
          </div>
        </div>
      </div>

      <!-- Filters row -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-4">
        <!-- Mensual filter -->
        @if (activeTab === 'mensual') {
          <div class="flex bg-gray-100 rounded-lg p-0.5">
            <button
              (click)="onMonthlyFilterChange('anio')"
              [class]="monthlyFilter === 'anio'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              class="px-3 py-1 text-[11px] font-medium rounded-md transition-all"
            >
              Año en curso
            </button>
            <button
              (click)="onMonthlyFilterChange('rolling')"
              [class]="monthlyFilter === 'rolling'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              class="px-3 py-1 text-[11px] font-medium rounded-md transition-all"
            >
              Últimos 12 meses
            </button>
          </div>
        }

        <!-- Diario filter -->
        @if (activeTab === 'diario') {
          <select
            [(ngModel)]="selectedMonthIndex"
            (ngModelChange)="onDailyMonthChange()"
            class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            @for (opt of monthOptions; track opt.label) {
              <option [ngValue]="$index">{{ opt.label }}</option>
            }
          </select>
        }

        <!-- Toggle chips -->
        <div class="flex gap-1.5 mx-auto">
          <button
            (click)="toggleSeries('ingresos')"
            [class]="showIngresos
              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
              : 'bg-gray-50 text-gray-400 border-gray-200'"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all flex items-center gap-1"
          >
            <span class="w-2 h-2 rounded-full" [class]="showIngresos ? 'bg-emerald-500' : 'bg-gray-300'"></span>
            Ingresos
          </button>
          <button
            (click)="toggleSeries('gastos')"
            [class]="showGastos
              ? 'bg-red-100 text-red-700 border-red-300'
              : 'bg-gray-50 text-gray-400 border-gray-200'"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all flex items-center gap-1"
          >
            <span class="w-2 h-2 rounded-full" [class]="showGastos ? 'bg-red-400' : 'bg-gray-300'"></span>
            Gastos
          </button>
        </div>
      </div>

      <!-- Chart -->
      <div>
        @if (isLoading) {
          <div class="flex flex-col items-center justify-center py-20">
            <i class="pi pi-spin pi-spinner text-3xl text-green-500 mb-4"></i>
            <p class="text-gray-500 animate-pulse text-sm">Cargando tendencia...</p>
          </div>
        } @else if (hasData) {
          <div class="w-full" style="height: 320px;">
            <p-chart
              type="bar"
              [data]="chartData"
              [options]="chartOptions"
              class="w-full h-full"
            ></p-chart>
          </div>

          <!-- Summary -->
          <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            @if (showIngresos) {
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                <div>
                  <p class="text-[11px] text-gray-500">Total ingresos</p>
                  <p class="text-sm font-bold text-gray-900">S/ {{ totalIngresos | number:'1.0-0' }}</p>
                </div>
              </div>
            }
            @if (showGastos) {
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div>
                  <p class="text-[11px] text-gray-500">Total gastos</p>
                  <p class="text-sm font-bold text-gray-900">S/ {{ totalGastos | number:'1.0-0' }}</p>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-16 text-gray-400">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
              <i class="pi pi-chart-bar text-xl opacity-30"></i>
            </div>
            <p class="text-xs font-semibold text-gray-500">Sin datos de tendencia</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-chart {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  `]
})
export class IncomeExpenseTrendComponent implements OnInit {
  private transactionService = inject(TransactionService);

  activeTab: TabType = 'mensual';
  monthlyFilter: 'anio' | 'rolling' = 'anio';
  selectedMonthIndex = 0;
  showIngresos = true;
  showGastos = true;
  isLoading = false;
  hasData = false;

  monthlyData: TendenciaMensual[] = [];
  dailyData: TendenciaDiaria[] = [];

  chartData: unknown;
  chartOptions: unknown;
  totalIngresos = 0;
  totalGastos = 0;

  monthOptions: MonthOption[] = [];

  private static readonly MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  ngOnInit(): void {
    this.buildMonthOptions();
    this.loadData();
  }

  onTabChange(tab: TabType): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.loadData();
  }

  onMonthlyFilterChange(filter: 'anio' | 'rolling'): void {
    if (this.monthlyFilter === filter) return;
    this.monthlyFilter = filter;
    this.loadData();
  }

  onDailyMonthChange(): void {
    this.loadData();
  }

  toggleSeries(series: 'ingresos' | 'gastos'): void {
    if (series === 'ingresos') {
      if (this.showIngresos && !this.showGastos) return;
      this.showIngresos = !this.showIngresos;
    } else {
      if (this.showGastos && !this.showIngresos) return;
      this.showGastos = !this.showGastos;
    }
    this.buildChart();
  }

  private buildMonthOptions(): void {
    const now = new Date();
    this.monthOptions = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      this.monthOptions.push({
        label: `${IncomeExpenseTrendComponent.MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        mes: d.getMonth() + 1,
        anio: d.getFullYear()
      });
    }
  }

  private loadData(): void {
    this.isLoading = true;
    if (this.activeTab === 'mensual') {
      this.loadMonthly();
    } else {
      this.loadDaily();
    }
  }

  private loadMonthly(): void {
    const now = new Date();
    if (this.monthlyFilter === 'anio') {
      this.transactionService.getMonthlyTrend(12, now.getFullYear()).subscribe({
        next: (data) => {
          this.monthlyData = data;
          this.hasData = data.length > 0;
          this.calculateTotalsMonthly();
          this.buildChart();
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
    } else {
      this.transactionService.getMonthlyTrend(12).subscribe({
        next: (data) => {
          this.monthlyData = data;
          this.hasData = data.length > 0;
          this.calculateTotalsMonthly();
          this.buildChart();
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  private loadDaily(): void {
    const opt = this.monthOptions[this.selectedMonthIndex];
    this.transactionService.getDailyTrend(opt.mes, opt.anio).subscribe({
      next: (data) => {
        this.dailyData = data;
        this.hasData = data.length > 0;
        this.calculateTotalsDaily();
        this.buildChart();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private calculateTotalsMonthly(): void {
    this.totalIngresos = this.monthlyData.reduce((s, d) => s + d.totalIngresos, 0);
    this.totalGastos = this.monthlyData.reduce((s, d) => s + d.totalGastos, 0);
  }

  private calculateTotalsDaily(): void {
    this.totalIngresos = this.dailyData.reduce((s, d) => s + d.totalIngresos, 0);
    this.totalGastos = this.dailyData.reduce((s, d) => s + d.totalGastos, 0);
  }

  private buildChart(): void {
    const isMonthly = this.activeTab === 'mensual';
    const labels = isMonthly
      ? this.monthlyData.map(d => d.etiqueta)
      : this.dailyData.map(d => d.etiqueta);

    const ingresosData = isMonthly
      ? this.monthlyData.map(d => d.totalIngresos)
      : this.dailyData.map(d => d.totalIngresos);

    const gastosData = isMonthly
      ? this.monthlyData.map(d => d.totalGastos)
      : this.dailyData.map(d => d.totalGastos);

    const datasets: unknown[] = [];
    if (this.showIngresos) {
      datasets.push({
        label: 'Ingresos',
        data: ingresosData,
        backgroundColor: '#10b981',
        hoverBackgroundColor: '#059669',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: isMonthly ? 0.7 : 0.8,
        categoryPercentage: isMonthly ? 0.6 : 0.7
      });
    }
    if (this.showGastos) {
      datasets.push({
        label: 'Gastos',
        data: gastosData,
        backgroundColor: '#f87171',
        hoverBackgroundColor: '#ef4444',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: isMonthly ? 0.7 : 0.8,
        categoryPercentage: isMonthly ? 0.6 : 0.7
      });
    }

    this.chartData = { labels, datasets };

    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#111827',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: (context: { dataset: { label: string }; raw: number }) => {
              return ` ${context.dataset.label}: S/ ${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: isMonthly ? 11 : 9, weight: '500' },
            color: '#9ca3af',
            maxRotation: 0,
            autoSkip: !isMonthly
          },
          border: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6',
            drawBorder: false
          },
          ticks: {
            font: { size: 10 },
            color: '#9ca3af',
            callback: (value: number) => {
              if (value >= 1000) {
                return `S/${(value / 1000).toFixed(1)}k`;
              }
              return `S/${value}`;
            }
          },
          border: { display: false }
        }
      },
      animation: {
        duration: 750,
        easing: 'easeOutQuart'
      }
    };
  }
}
