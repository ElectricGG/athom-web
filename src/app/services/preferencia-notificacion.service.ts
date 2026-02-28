import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PreferenciaNotificacion,
  ActualizarPreferenciaNotificacionRequest
} from '../models/preferencia-notificacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreferenciaNotificacionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/PreferenciasNotificacion`;

  getPreferencias(): Observable<PreferenciaNotificacion> {
    return this.http.get<PreferenciaNotificacion>(this.apiUrl);
  }

  updatePreferencias(request: ActualizarPreferenciaNotificacionRequest): Observable<PreferenciaNotificacion> {
    return this.http.put<PreferenciaNotificacion>(this.apiUrl, request);
  }
}
