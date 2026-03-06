import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TendenciaCategoriaMensual } from '../models/reporte.model';
import { ExpenseDistribution } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly baseUrl = `${environment.apiUrl}/Transacciones`;

  constructor(private http: HttpClient) {}

  getTendenciaCategoria(
    fechaDesde: string,
    fechaHasta: string,
    categoriaIds?: number[]
  ): Observable<TendenciaCategoriaMensual[]> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    if (categoriaIds?.length) {
      categoriaIds.forEach(id => {
        params = params.append('categoriaIds', id.toString());
      });
    }

    return this.http.get<TendenciaCategoriaMensual[]>(`${this.baseUrl}/tendencia-categoria`, { params });
  }

  getDistribucionGastosRango(
    fechaDesde: string,
    fechaHasta: string,
    categoriaIds?: number[]
  ): Observable<ExpenseDistribution[]> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    if (categoriaIds?.length) {
      categoriaIds.forEach(id => {
        params = params.append('categoriaIds', id.toString());
      });
    }

    return this.http.get<ExpenseDistribution[]>(`${this.baseUrl}/gastos/distribucion-rango`, { params });
  }

  exportarResumen(fechaDesde: string, fechaHasta: string): void {
    const params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);
    this.descargar(`${this.baseUrl}/exportar/resumen`, params, 'ResumenFinanciero.xlsx');
  }

  exportarIngresosRango(fechaDesde: string, fechaHasta: string): void {
    const params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);
    this.descargar(`${this.baseUrl}/exportar/ingresos-rango`, params, 'Ingresos.xlsx');
  }

  exportarGastosRango(fechaDesde: string, fechaHasta: string, categoriaIds?: number[]): void {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);
    if (categoriaIds?.length) {
      categoriaIds.forEach(id => {
        params = params.append('categoriaIds', id.toString());
      });
    }
    this.descargar(`${this.baseUrl}/exportar/gastos-rango`, params, 'AnalisisGastos.xlsx');
  }

  exportarPresupuestoVsReal(presupuestoId: number): void {
    const params = new HttpParams().set('presupuestoId', presupuestoId.toString());
    this.descargar(`${this.baseUrl}/exportar/presupuesto-vs-real`, params, 'PresupuestoVsReal.xlsx');
  }

  exportarTendenciaCategoria(fechaDesde: string, fechaHasta: string, categoriaIds?: number[]): void {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);
    if (categoriaIds?.length) {
      categoriaIds.forEach(id => {
        params = params.append('categoriaIds', id.toString());
      });
    }
    this.descargar(`${this.baseUrl}/exportar/tendencia-categoria`, params, 'TendenciaCategoria.xlsx');
  }

  private descargar(url: string, params: HttpParams, defaultFileName: string): void {
    this.http.get(url, { params, responseType: 'blob', observe: 'response' }).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) return;

        const contentDisposition = response.headers.get('Content-Disposition');
        const fileName = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') ?? defaultFileName
          : defaultFileName;

        const a = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => console.error('Error downloading export:', err)
    });
  }
}
