import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ReporteService } from '../../../../services/reporte.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { TransactionService } from '../../../../services/transaction.service';
import { Categoria } from '../../../../models/categoria.model';
import { ExpenseDistribution, TendenciaDiaria } from '../../../../models/transaction.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analisis-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, DatePickerModule, MultiSelectModule, ButtonModule, SkeletonModule],
  templateUrl: './analisis-gastos.component.html'
})
export class AnalisisGastosComponent implements OnInit {
  private reporteService = inject(ReporteService);
  private categoriaService = inject(CategoriaService);
  private transactionService = inject(TransactionService);

  loading = signal(true);
  fechaDesde: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  fechaHasta: Date = new Date();
  categorias: Categoria[] = [];
  categoriasSeleccionadas: Categoria[] = [];

  donutData: any = {};
  donutOptions: any = {};
  areaData: any = {};
  areaOptions: any = {};

  distribucion: ExpenseDistribution[] = [];

  private defaultColors = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'];

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (cats) => {
        this.categorias = cats.filter(c => c.tipoCategoria === 'Gasto');
        this.cargarDatos();
      },
      error: () => this.cargarDatos()
    });
  }

  cargarDatos(): void {
    this.loading.set(true);
    const desde = this.fechaDesde.toISOString().split('T')[0];
    const hasta = this.fechaHasta.toISOString().split('T')[0];
    const catIds = this.categoriasSeleccionadas.map(c => c.categoriaId);

    const mes = this.fechaDesde.getMonth() + 1;
    const anio = this.fechaDesde.getFullYear();

    forkJoin({
      distribucion: this.reporteService.getDistribucionGastosRango(desde, hasta, catIds.length ? catIds : undefined),
      diaria: this.transactionService.getDailyTrend(mes, anio)
    }).subscribe({
      next: ({ distribucion, diaria }) => {
        this.distribucion = distribucion;
        this.buildDonutChart(distribucion);
        this.buildAreaChart(diaria);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private buildDonutChart(data: ExpenseDistribution[]): void {
    this.donutData = {
      labels: data.map(d => d.nombre),
      datasets: [{
        data: data.map(d => d.monto),
        backgroundColor: data.map((d, i) => d.color || this.defaultColors[i % this.defaultColors.length]),
        hoverOffset: 8,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    this.donutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { position: 'right', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const total = ctx.dataset.data.reduce((s: number, v: number) => s + v, 0);
              const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : '0';
              return `${ctx.label}: S/ ${ctx.raw.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (${pct}%)`;
            }
          }
        }
      }
    };
  }

  private buildAreaChart(data: TendenciaDiaria[]): void {
    const acumulado: number[] = [];
    let sum = 0;
    data.forEach(d => {
      sum += d.totalGastos;
      acumulado.push(sum);
    });

    this.areaData = {
      labels: data.map(d => d.etiqueta),
      datasets: [{
        label: 'Gasto Acumulado',
        data: acumulado,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    };

    this.areaOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `Acumulado: S/ ${ctx.raw.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value: number) => `S/ ${(value / 1000).toFixed(0)}k`
          }
        }
      }
    };
  }

  exportarExcel(): void {
    const desde = this.fechaDesde.toISOString().split('T')[0];
    const hasta = this.fechaHasta.toISOString().split('T')[0];
    const catIds = this.categoriasSeleccionadas.map(c => c.categoriaId);
    this.reporteService.exportarGastosRango(desde, hasta, catIds.length ? catIds : undefined);
  }

  totalGastos(): number {
    return this.distribucion.reduce((s, d) => s + d.monto, 0);
  }

  formatCurrency(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
