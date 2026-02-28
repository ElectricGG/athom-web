import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MetaAhorro,
  ResumenMetaAhorro,
  CrearMetaAhorroRequest,
  ActualizarMetaAhorroRequest,
  EstadoMeta
} from '../models/meta-ahorro.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaAhorroService {
  private readonly baseUrl = `${environment.apiUrl}/MetasAhorro`;

  constructor(private http: HttpClient) { }

  getAll(estado?: EstadoMeta): Observable<MetaAhorro[]> {
    const params: Record<string, string> = {};
    if (estado !== undefined) {
      params['estado'] = estado.toString();
    }
    return this.http.get<MetaAhorro[]>(this.baseUrl, { params });
  }

  getResumen(limite: number = 5): Observable<ResumenMetaAhorro[]> {
    return this.http.get<ResumenMetaAhorro[]>(`${this.baseUrl}/resumen`, {
      params: { limite: limite.toString() }
    });
  }

  getById(id: number): Observable<MetaAhorro> {
    return this.http.get<MetaAhorro>(`${this.baseUrl}/${id}`);
  }

  crear(request: CrearMetaAhorroRequest): Observable<MetaAhorro> {
    return this.http.post<MetaAhorro>(this.baseUrl, request);
  }

  actualizar(id: number, request: ActualizarMetaAhorroRequest): Observable<MetaAhorro> {
    return this.http.put<MetaAhorro>(`${this.baseUrl}/${id}`, request);
  }

  completar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/completar`, {});
  }

  pausar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/pausar`, {});
  }

  reactivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/reactivar`, {});
  }

  cancelar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
