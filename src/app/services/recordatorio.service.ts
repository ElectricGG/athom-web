import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Recordatorio,
  ResumenRecordatorios,
  CrearRecordatorioRequest,
  ActualizarRecordatorioRequest
} from '../models/recordatorio.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  private readonly baseUrl = `${environment.apiUrl}/Recordatorios`;

  constructor(private http: HttpClient) { }

  getAll(completado?: boolean): Observable<Recordatorio[]> {
    const params: Record<string, string> = {};
    if (completado !== undefined) {
      params['completado'] = completado.toString();
    }
    return this.http.get<Recordatorio[]>(this.baseUrl, { params });
  }

  getResumen(): Observable<ResumenRecordatorios> {
    return this.http.get<ResumenRecordatorios>(`${this.baseUrl}/resumen`);
  }

  getById(id: number): Observable<Recordatorio> {
    return this.http.get<Recordatorio>(`${this.baseUrl}/${id}`);
  }

  crear(request: CrearRecordatorioRequest): Observable<Recordatorio> {
    return this.http.post<Recordatorio>(this.baseUrl, request);
  }

  actualizar(id: number, request: ActualizarRecordatorioRequest): Observable<Recordatorio> {
    return this.http.put<Recordatorio>(`${this.baseUrl}/${id}`, request);
  }

  toggleCompletado(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/toggle`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
