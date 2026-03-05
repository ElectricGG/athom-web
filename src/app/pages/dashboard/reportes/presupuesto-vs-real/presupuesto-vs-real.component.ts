import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { PresupuestoService } from '../../../../services/presupuesto.service';
import { ReporteService } from '../../../../services/reporte.service';
import { PresupuestoEstimado, PresupuestoCategoria, ResumenPresupuesto } from '../../../../models/presupuesto.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-presupuesto-vs-real',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, SelectModule, ButtonModule, SkeletonModule],
  templateUrl: './presupuesto-vs-real.component.html'
})
export class PresupuestoVsRealComponent implements OnInit {
  private presupuestoService = inject(PresupuestoService);
  private reporteService = inject(ReporteService);

  loading = signal(true);
  loadingDetalle = signal(false);

  presupuestos: PresupuestoEstimado[] = [];
  presupuestoSeleccionado: PresupuestoEstimado | null = null;

  categorias: PresupuestoCategoria[] = [];
  resumen: ResumenPresupuesto | null = null;

  chartData: any = {};
  chartOptions: any = {};
  chartHeight = 200;

  ngOnInit(): void {
    this.presupuestoService.getPresupuestos().subscribe({
      next: (data) => {
        this.presupuestos = data;
        if (data.length > 0) {
          this.presupuestoSeleccionado = data[0];
          this.cargarDetalle();
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  cargarDetalle(): void {
    if (!this.presupuestoSeleccionado) return;
    this.loadingDetalle.set(true);

    const id = this.presupuestoSeleccionado.presupuestoId;
    forkJoin({
      categorias: this.presupuestoService.getCategoriasPresupuesto(id),
      resumen: this.presupuestoService.getResumen(id)
    }).subscribe({
      next: ({ categorias, resumen }) => {
        this.categorias = categorias;
        this.resumen = resumen;
        this.buildChart(categorias);
        this.loading.set(false);
        this.loadingDetalle.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadingDetalle.set(false);
      }
    });
  }

  private buildChart(categorias: PresupuestoCategoria[]): void {
    this.chartHeight = Math.max(categorias.length * 60, 200);
    const labels = categorias.map(c => c.categoriaNombre);
    const presupuestado = categorias.map(c => c.monto);
    const gastado = categorias.map(c => c.montoGastado);

    const coloresGastado = categorias.map(c => {
      const pct = c.monto > 0 ? (c.montoGastado / c.monto) * 100 : 0;
      if (pct > 100) return '#ef4444';
      if (pct >= 80) return '#f59e0b';
      return '#22c55e';
    });

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Presupuestado',
          data: presupuestado,
          backgroundColor: '#d1d5db',
          borderRadius: 6
        },
        {
          label: 'Gastado',
          data: gastado,
          backgroundColor: coloresGastado,
          borderRadius: 6
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.dataset.label}: S/ ${ctx.raw.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: (value: number) => `S/ ${value.toLocaleString('es-PE')}`
          }
        }
      }
    };
  }

  getSemaforoClass(monto: number, gastado: number): string {
    const pct = monto > 0 ? (gastado / monto) * 100 : 0;
    if (pct > 100) return 'bg-red-100 text-red-700';
    if (pct >= 80) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  }

  getSemaforoLabel(monto: number, gastado: number): string {
    const pct = monto > 0 ? (gastado / monto) * 100 : 0;
    if (pct > 100) return 'Excedido';
    if (pct >= 80) return 'Alerta';
    return 'OK';
  }

  exportarExcel(): void {
    if (!this.presupuestoSeleccionado) return;
    this.reporteService.exportarPresupuestoVsReal(this.presupuestoSeleccionado.presupuestoId);
  }

  formatCurrency(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getPorcentaje(monto: number, gastado: number): number {
    return monto > 0 ? Math.round((gastado / monto) * 100) : 0;
  }
}
