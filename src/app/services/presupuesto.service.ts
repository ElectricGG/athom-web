import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PresupuestoEstimado,
  PresupuestoCategoria,
  ResumenPresupuesto,
  CrearPresupuestoRequest,
  ActualizarPresupuestoRequest,
  CrearPresupuestoCategoriaRequest,
  ActualizarPresupuestoCategoriaRequest,
  CategoriaDisponible
} from '../models/presupuesto.model';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5041/api/Presupuestos';

  // =====================
  // PRESUPUESTOS MENSUALES
  // =====================

  /**
   * Obtiene todos los presupuestos del usuario
   */
  getPresupuestos(): Observable<PresupuestoEstimado[]> {
    return this.http.get<PresupuestoEstimado[]>(this.apiUrl);
  }

  /**
   * Obtiene un presupuesto por ID con sus categorias
   */
  getPresupuestoById(id: number): Observable<PresupuestoEstimado> {
    return this.http.get<PresupuestoEstimado>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo presupuesto mensual
   */
  crearPresupuesto(request: CrearPresupuestoRequest): Observable<PresupuestoEstimado> {
    return this.http.post<PresupuestoEstimado>(this.apiUrl, request);
  }

  /**
   * Actualiza un presupuesto existente
   */
  actualizarPresupuesto(id: number, request: ActualizarPresupuestoRequest): Observable<PresupuestoEstimado> {
    return this.http.put<PresupuestoEstimado>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Elimina un presupuesto
   */
  eliminarPresupuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =====================
  // CATEGORIAS DEL PRESUPUESTO
  // =====================

  /**
   * Obtiene las categorias de un presupuesto especifico
   */
  getCategoriasPresupuesto(presupuestoId: number): Observable<PresupuestoCategoria[]> {
    return this.http.get<PresupuestoCategoria[]>(`${this.apiUrl}/${presupuestoId}/categorias`);
  }

  /**
   * Obtiene el resumen de un presupuesto
   */
  getResumen(presupuestoId: number): Observable<ResumenPresupuesto> {
    return this.http.get<ResumenPresupuesto>(`${this.apiUrl}/${presupuestoId}/resumen`);
  }

  /**
   * Obtiene categorias disponibles para un presupuesto especifico
   */
  getCategoriasDisponibles(presupuestoId: number): Observable<CategoriaDisponible[]> {
    return this.http.get<CategoriaDisponible[]>(`${this.apiUrl}/${presupuestoId}/categorias-disponibles`);
  }

  /**
   * Agrega una categoria al presupuesto
   */
  agregarCategoria(presupuestoId: number, request: CrearPresupuestoCategoriaRequest): Observable<PresupuestoCategoria> {
    return this.http.post<PresupuestoCategoria>(`${this.apiUrl}/${presupuestoId}/categorias`, request);
  }

  /**
   * Actualiza una categoria del presupuesto
   */
  actualizarCategoria(presupuestoId: number, categoriaId: number, request: ActualizarPresupuestoCategoriaRequest): Observable<PresupuestoCategoria> {
    return this.http.put<PresupuestoCategoria>(`${this.apiUrl}/${presupuestoId}/categorias/${categoriaId}`, request);
  }

  /**
   * Elimina una categoria del presupuesto
   */
  eliminarCategoria(presupuestoId: number, categoriaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${presupuestoId}/categorias/${categoriaId}`);
  }
}
