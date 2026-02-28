import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Gasto,
  CrearGastoRequest,
  ActualizarGastoRequest,
  DistribucionGastoCategoria,
  ResumenGastos,
  CategoriaGasto
} from '../models/gasto.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Gastos`;

  /**
   * Obtiene los gastos del usuario para un mes y año específico.
   */
  getGastos(mes?: number, anio?: number): Observable<Gasto[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes.toString());
    if (anio) params = params.set('anio', anio.toString());

    return this.http.get<Gasto[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un gasto por su ID.
   */
  getGasto(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo gasto.
   */
  crear(request: CrearGastoRequest): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, request);
  }

  /**
   * Actualiza un gasto existente.
   */
  actualizar(id: number, request: ActualizarGastoRequest): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Elimina un gasto.
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene la distribución de gastos por categoría.
   */
  getDistribucion(meses: number = 1): Observable<DistribucionGastoCategoria[]> {
    const params = new HttpParams().set('meses', meses.toString());
    return this.http.get<DistribucionGastoCategoria[]>(`${this.apiUrl}/distribucion`, { params });
  }

  /**
   * Obtiene el resumen de gastos del mes actual.
   */
  getResumen(): Observable<ResumenGastos> {
    return this.http.get<ResumenGastos>(`${this.apiUrl}/resumen`);
  }

  /**
   * Obtiene las categorías de tipo Gasto del usuario.
   */
  getCategorias(): Observable<CategoriaGasto[]> {
    return this.http.get<CategoriaGasto[]>(`${this.apiUrl}/categorias`);
  }
}
