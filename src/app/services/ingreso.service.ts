import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Ingreso,
  CrearIngresoRequest,
  ActualizarIngresoRequest,
  DistribucionIngresoCategoria,
  ResumenIngresos,
  CategoriaIngreso
} from '../models/ingreso.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Ingresos`;

  /**
   * Obtiene los ingresos del usuario para un mes y año específico.
   */
  getIngresos(mes?: number, anio?: number): Observable<Ingreso[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes.toString());
    if (anio) params = params.set('anio', anio.toString());

    return this.http.get<Ingreso[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un ingreso por su ID.
   */
  getIngreso(id: number): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo ingreso.
   */
  crear(request: CrearIngresoRequest): Observable<Ingreso> {
    return this.http.post<Ingreso>(this.apiUrl, request);
  }

  /**
   * Actualiza un ingreso existente.
   */
  actualizar(id: number, request: ActualizarIngresoRequest): Observable<Ingreso> {
    return this.http.put<Ingreso>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Elimina un ingreso.
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene la distribución de ingresos por categoría.
   */
  getDistribucion(meses: number = 1): Observable<DistribucionIngresoCategoria[]> {
    const params = new HttpParams().set('meses', meses.toString());
    return this.http.get<DistribucionIngresoCategoria[]>(`${this.apiUrl}/distribucion`, { params });
  }

  /**
   * Obtiene el resumen de ingresos del mes actual.
   */
  getResumen(): Observable<ResumenIngresos> {
    return this.http.get<ResumenIngresos>(`${this.apiUrl}/resumen`);
  }

  /**
   * Obtiene las categorías de tipo Ingreso del usuario.
   */
  getCategorias(): Observable<CategoriaIngreso[]> {
    return this.http.get<CategoriaIngreso[]>(`${this.apiUrl}/categorias`);
  }
}
