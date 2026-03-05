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
import { Categoria } from '../../../../models/categoria.model';
import { TendenciaCategoriaMensual } from '../../../../models/reporte.model';

@Component({
  selector: 'app-tendencia-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, DatePickerModule, MultiSelectModule, ButtonModule, SkeletonModule],
  templateUrl: './tendencia-categoria.component.html',
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
export class TendenciaCategoriaComponent implements OnInit {
  private reporteService = inject(ReporteService);
  private categoriaService = inject(CategoriaService);

  loading = signal(true);
  fechaDesde: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
  fechaHasta: Date = new Date();
  categorias: Categoria[] = [];
  categoriasSeleccionadas: Categoria[] = [];

  tendencia: TendenciaCategoriaMensual[] = [];
  chartData: any = {};
  chartOptions: any = {};

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

    this.reporteService.getTendenciaCategoria(desde, hasta, catIds.length ? catIds : undefined).subscribe({
      next: (data) => {
        this.tendencia = data;
        this.buildChart(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private buildChart(data: TendenciaCategoriaMensual[]): void {
    if (data.length === 0) return;

    const labels = data[0].meses.map(m => `${m.etiqueta} ${m.anio}`);

    const datasets = data.map((cat, i) => ({
      label: cat.nombreCategoria,
      data: cat.meses.map(m => m.monto),
      backgroundColor: cat.color || this.defaultColors[i % this.defaultColors.length],
      borderRadius: 4
    }));

    this.chartData = { labels, datasets };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.dataset.label}: S/ ${ctx.raw.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          ticks: {
            callback: (value: number) => `S/ ${(value / 1000).toFixed(0)}k`
          }
        }
      }
    };
  }

  getTotal(cat: TendenciaCategoriaMensual): number {
    return cat.meses.reduce((s, m) => s + m.monto, 0);
  }

  getTotalMes(index: number): number {
    return this.tendencia.reduce((s, cat) => s + (cat.meses[index]?.monto ?? 0), 0);
  }

  getTotalGeneral(): number {
    return this.tendencia.reduce((s, cat) => s + this.getTotal(cat), 0);
  }

  exportarExcel(): void {
    const desde = this.fechaDesde.toISOString().split('T')[0];
    const hasta = this.fechaHasta.toISOString().split('T')[0];
    const catIds = this.categoriasSeleccionadas.map(c => c.categoriaId);
    this.reporteService.exportarTendenciaCategoria(desde, hasta, catIds.length ? catIds : undefined);
  }

  formatCurrency(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
