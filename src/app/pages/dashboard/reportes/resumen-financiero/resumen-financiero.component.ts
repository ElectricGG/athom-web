import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TransactionService } from '../../../../services/transaction.service';
import { ReporteService } from '../../../../services/reporte.service';
import { PerfilService } from '../../../../services/perfil.service';
import { CurrencyService } from '../../../../services/currency.service';
import { TendenciaMensual } from '../../../../models/transaction.model';

@Component({
  selector: 'app-resumen-financiero',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, DatePickerModule, ButtonModule, SkeletonModule],
  templateUrl: './resumen-financiero.component.html',
  styles: [`
    ::ng-deep .date-sm .p-datepicker .p-datepicker-input {
      padding: 0.4rem 0.65rem;
      font-size: 0.8125rem;
      height: 2.25rem;
    }
    ::ng-deep .date-sm .p-datepicker .p-datepicker-dropdown {
      height: 2.25rem;
      width: 2.25rem;
    }
  `]
})
export class ResumenFinancieroComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private reporteService = inject(ReporteService);
  private perfilService = inject(PerfilService);
  private currencyService = inject(CurrencyService);

  currencySymbol = 'S/';
  currencyLocale = 'es-PE';

  loading = signal(true);
  fechaDesde: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1);
  fechaHasta: Date = new Date();

  chartData: any = {};
  chartOptions: any = {};

  // KPIs
  balanceTotal = 0;
  ratioAhorro = 0;
  promedioDiarioGastos = 0;
  mejorMes = '';
  peorMes = '';

  tendencia: TendenciaMensual[] = [];

  ngOnInit(): void {
    this.perfilService.getPerfil().subscribe(perfil => {
      const config = this.currencyService.getConfig(perfil.codigoPais);
      this.currencySymbol = config.symbol;
      this.currencyLocale = config.locale;
    });

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);

    // Calculate how many months from fechaDesde to today to cover the full range
    const now = new Date();
    const diffMonths = (now.getFullYear() - this.fechaDesde.getFullYear()) * 12
      + (now.getMonth() - this.fechaDesde.getMonth()) + 1;
    const meses = Math.max(diffMonths, 1);

    this.transactionService.getMonthlyTrend(meses).subscribe({
      next: (data) => {
        // Filter to only include months within the selected range
        const desdeYear = this.fechaDesde.getFullYear();
        const desdeMonth = this.fechaDesde.getMonth() + 1;
        const hastaYear = this.fechaHasta.getFullYear();
        const hastaMonth = this.fechaHasta.getMonth() + 1;

        const filtered = data.filter(d => {
          const val = d.anio * 100 + d.mes;
          return val >= desdeYear * 100 + desdeMonth && val <= hastaYear * 100 + hastaMonth;
        });

        this.tendencia = filtered;
        this.calcularKPIs(filtered);
        this.buildChart(filtered);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private calcularKPIs(data: TendenciaMensual[]): void {
    const totalIngresos = data.reduce((s, d) => s + d.totalIngresos, 0);
    const totalGastos = data.reduce((s, d) => s + d.totalGastos, 0);
    this.balanceTotal = totalIngresos - totalGastos;
    this.ratioAhorro = totalIngresos > 0 ? Math.round((totalIngresos - totalGastos) / totalIngresos * 100) : 0;

    const diasConDatos = data.length * 30;
    this.promedioDiarioGastos = diasConDatos > 0 ? Math.round(totalGastos / diasConDatos * 100) / 100 : 0;

    let mejorBalance = -Infinity;
    let peorBalance = Infinity;
    data.forEach(m => {
      const balance = m.totalIngresos - m.totalGastos;
      if (balance > mejorBalance) {
        mejorBalance = balance;
        this.mejorMes = `${m.etiqueta} ${m.anio}`;
      }
      if (balance < peorBalance) {
        peorBalance = balance;
        this.peorMes = `${m.etiqueta} ${m.anio}`;
      }
    });
  }

  private buildChart(data: TendenciaMensual[]): void {
    const labels = data.map(d => `${d.etiqueta} ${d.anio}`);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: data.map(d => d.totalIngresos),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Gastos',
          data: data.map(d => d.totalGastos),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Balance',
          data: data.map(d => d.totalIngresos - d.totalGastos),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.dataset.label}: ${this.currencySymbol} ${ctx.raw.toLocaleString(this.currencyLocale, { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value: number) => `${this.currencySymbol} ${(value / 1000).toFixed(0)}k`
          }
        }
      }
    };
  }

  exportarExcel(): void {
    const desde = this.fechaDesde.toISOString().split('T')[0];
    const hasta = this.fechaHasta.toISOString().split('T')[0];
    this.reporteService.exportarResumen(desde, hasta);
  }

  formatCurrency(value: number): string {
    return `${this.currencySymbol} ${value.toLocaleString(this.currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
