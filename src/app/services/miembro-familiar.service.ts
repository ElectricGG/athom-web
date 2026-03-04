import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MiembroFamiliar, CrearMiembroFamiliarRequest, ActualizarMiembroFamiliarRequest } from '../models/miembro-familiar.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MiembroFamiliarService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Perfil/miembros-familiares`;

  getMiembros(): Observable<MiembroFamiliar[]> {
    return this.http.get<MiembroFamiliar[]>(this.apiUrl);
  }

  crear(request: CrearMiembroFamiliarRequest): Observable<MiembroFamiliar> {
    return this.http.post<MiembroFamiliar>(this.apiUrl, request);
  }

  actualizar(miembroId: number, request: ActualizarMiembroFamiliarRequest): Observable<MiembroFamiliar> {
    return this.http.put<MiembroFamiliar>(`${this.apiUrl}/${miembroId}`, request);
  }

  eliminar(miembroId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${miembroId}`);
  }
}
