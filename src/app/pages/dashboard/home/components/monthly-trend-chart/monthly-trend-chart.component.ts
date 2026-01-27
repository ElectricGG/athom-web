import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TendenciaMensual } from '../../../../../models/transaction.model';

@Component({
    selector: 'app-monthly-trend-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, DecimalPipe],
    template: `
    <div class="w-full">
      @if (data && data.length > 0) {
        <div class="w-full" style="height: 320px;">
          <p-chart
            type="bar"
            [data]="chartData"
            [options]="chartOptions"
            class="w-full h-full"
          ></p-chart>
        </div>

        <!-- Resumen debajo del gráfico -->
        <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <div>
              <p class="text-[11px] text-gray-500">Total ingresos</p>
              <p class="text-sm font-bold text-gray-900">S/ {{ totalIngresos | number:'1.0-0' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div>
              <p class="text-[11px] text-gray-500">Total gastos</p>
              <p class="text-sm font-bold text-gray-900">S/ {{ totalGastos | number:'1.0-0' }}</p>
            </div>
          </div>
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
export class MonthlyTrendChartComponent implements OnChanges {
    @Input() data: TendenciaMensual[] = [];

    chartData: unknown;
    chartOptions: unknown;
    totalIngresos = 0;
    totalGastos = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.calculateTotals();
            this.initChart();
        }
    }

    private calculateTotals(): void {
        this.totalIngresos = this.data.reduce((sum, item) => sum + item.totalIngresos, 0);
        this.totalGastos = this.data.reduce((sum, item) => sum + item.totalGastos, 0);
    }

    private initChart(): void {
        const labels = this.data.map(d => d.etiqueta);

        this.chartData = {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: this.data.map(d => d.totalIngresos),
                    backgroundColor: '#10b981',
                    hoverBackgroundColor: '#059669',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.6
                },
                {
                    label: 'Gastos',
                    data: this.data.map(d => d.totalGastos),
                    backgroundColor: '#f87171',
                    hoverBackgroundColor: '#ef4444',
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.6
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        font: { size: 11, weight: '600' },
                        color: '#6b7280'
                    }
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
                        font: { size: 11, weight: '500' },
                        color: '#9ca3af'
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
