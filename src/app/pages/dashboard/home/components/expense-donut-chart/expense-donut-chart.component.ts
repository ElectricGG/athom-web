import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ExpenseDistribution } from '../../../../../models/transaction.model';
import { PerfilService } from '../../../../../services/perfil.service';
import { CurrencyService } from '../../../../../services/currency.service';

const MAX_VISIBLE = 5;
const OTROS_COLOR = '#9ca3af';

@Component({
  selector: 'app-expense-donut-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, DecimalPipe],
  template: `
    <div class="w-full">
      @if (data && data.length > 0) {
        <div class="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <!-- Compact Chart Container -->
          <div class="relative w-full max-w-[200px] sm:max-w-[240px] aspect-square flex items-center justify-center shrink-0">
            <p-chart
              type="doughnut"
              [data]="chartData"
              [options]="chartOptions"
              class="w-full h-full"
            ></p-chart>

            <!-- Center Text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total</span>
              <span class="text-xl font-black text-gray-900 leading-tight">
                {{ currencySymbol }} {{ totalExpenses | number:'1.2-2' }}
              </span>
            </div>
          </div>

          <!-- Ultra-Compact Grid with Interactive Indicators -->
          <div class="flex-1 w-full">
            <div class="grid grid-cols-1 gap-y-1 max-h-[260px] overflow-y-auto pr-1">
              @for (item of displayData; track item.nombre; let i = $index) {
                <div
                  class="relative flex items-center py-1.5 px-3 rounded-lg overflow-hidden"
                >
                  <!-- Solid Color Indicator -->
                  <div
                    class="absolute left-0 top-1 bottom-1 w-[4px] rounded-r-full"
                    [style.backgroundColor]="item.color || getDefaultColor(i)"
                  ></div>

                  <!-- Minimal Icon -->
                  <div
                    class="w-6 h-6 rounded-md mr-2.5 shrink-0 flex items-center justify-center text-xs shadow-sm"
                    [style.backgroundColor]="(item.color || getDefaultColor(i)) + '15'"
                    [style.color]="item.color || getDefaultColor(i)"
                  >
                    {{ item.icono || getDefaultIcon(item.nombre) }}
                  </div>

                  <!-- Info -->
                  <div class="flex flex-1 min-w-0 items-center justify-between gap-2">
                    <div class="flex items-center min-w-0 flex-1">
                      <span class="text-[11px] font-bold text-gray-700 truncate mr-1.5">{{ item.nombre }}</span>
                      <span class="text-[9px] font-bold text-gray-400 shrink-0">{{ item.porcentaje }}%</span>
                    </div>
                    <span class="text-[11px] font-black text-gray-900 shrink-0">{{ currencySymbol }}{{ item.monto | number:'1.2-2' }}</span>
                  </div>
                </div>
              }
            </div>

            <!-- Ver más / Ver menos button -->
            @if (hasOtros) {
              <div class="mt-3 text-center">
                <button
                  (click)="toggleShowAll()"
                  class="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-1"
                >
                  @if (showAll) {
                    <i class="pi pi-chevron-up text-[10px]"></i>
                    Ver menos
                  } @else {
                    <i class="pi pi-chevron-down text-[10px]"></i>
                    Ver más ({{ otrosCount }} categorías)
                  }
                </button>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-10 text-gray-400">
           <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
             <i class="pi pi-chart-pie text-xl opacity-30"></i>
           </div>
           <p class="text-xs font-semibold text-gray-500">Sin movimientos</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-chart {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class ExpenseDonutChartComponent implements OnInit, OnChanges {
  private perfilService = inject(PerfilService);
  private currencyService = inject(CurrencyService);

  currencySymbol = 'S/';
  currencyLocale = 'es-PE';

  @Input() data: ExpenseDistribution[] = [];

  chartData: any;
  chartOptions: any;
  totalExpenses: number = 0;
  showAll = false;
  hasOtros = false;
  otrosCount = 0;

  /** Data currently shown in the list and chart */
  displayData: ExpenseDistribution[] = [];

  ngOnInit() {
    this.perfilService.getPerfil().subscribe(perfil => {
      const config = this.currencyService.getConfig(perfil.codigoPais);
      this.currencySymbol = config.symbol;
      this.currencyLocale = config.locale;
      this.buildDisplay();
    });

    this.buildDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.showAll = false;
      this.calculateTotal();
      this.buildDisplay();
    }
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
    this.buildDisplay();
  }

  private calculateTotal() {
    this.totalExpenses = this.data.reduce((sum, item) => sum + item.monto, 0);
  }

  /**
   * Sort by monto desc, take top 5, group rest as "Otros".
   * When showAll=true, show all individual categories.
   */
  private buildDisplay(): void {
    const sorted = [...this.data].sort((a, b) => b.monto - a.monto);
    this.otrosCount = Math.max(0, sorted.length - MAX_VISIBLE);
    this.hasOtros = this.otrosCount > 0;

    if (this.showAll || !this.hasOtros) {
      this.displayData = sorted;
    } else {
      const top = sorted.slice(0, MAX_VISIBLE);
      const rest = sorted.slice(MAX_VISIBLE);
      const otrosMonto = rest.reduce((sum, item) => sum + item.monto, 0);
      const otrosPorcentaje = this.totalExpenses > 0
        ? Math.round((otrosMonto / this.totalExpenses) * 100)
        : 0;

      const otrosItem: ExpenseDistribution = {
        categoriaId: null,
        nombre: 'Otros',
        icono: '📊',
        color: OTROS_COLOR,
        monto: otrosMonto,
        porcentaje: otrosPorcentaje
      };

      this.displayData = [...top, otrosItem];
    }

    this.initChart();
  }

  private initChart() {
    this.chartData = {
      labels: this.displayData.map(d => d.nombre),
      datasets: [
        {
          data: this.displayData.map(d => d.monto),
          backgroundColor: this.displayData.map((d, i) => d.color || this.getDefaultColor(i)),
          hoverBackgroundColor: this.displayData.map((d, i) => this.lightenColor(d.color || this.getDefaultColor(i), 15)),
          borderWidth: 0,
          borderRadius: 4,
          spacing: 2,
          hoverOffset: 8
        }
      ]
    };

    this.chartOptions = {
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          padding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#111827',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            label: (context: any) => {
              const value = context.raw as number;
              return ` ${this.currencySymbol} ${value.toLocaleString(this.currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 750,
        easing: 'easeOutQuart'
      }
    };
  }

  getDefaultColor(index: number): string {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    return colors[index % colors.length];
  }

  getDefaultIcon(nombre: string): string {
    const iconMap: Record<string, string> = {
      'alimentación': '🍔', 'transporte': '🚗', 'entretenimiento': '🎬',
      'servicios': '💡', 'salud': '💊', 'educación': '📚', 'vivienda': '🏠', 'ropa': '👕',
      'otros': '📊'
    };
    return iconMap[nombre.toLowerCase()] ?? '📦';
  }

  private lightenColor(hex: string, percent: number): string {
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }
    return hex;
  }
}
