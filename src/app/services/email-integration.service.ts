import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  EmailIntegrationStatusResponse,
  EmailConnectResponse,
  ProveedorEmail
} from '../models/email-integration.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailIntegrationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/email-integration`;

  private readonly statusSubject = new BehaviorSubject<EmailIntegrationStatusResponse | null>(null);
  public readonly status$ = this.statusSubject.asObservable();

  /**
   * Obtiene el estado actual de todas las cuentas vinculadas
   */
  getStatus(): Observable<EmailIntegrationStatusResponse> {
    return this.http.get<EmailIntegrationStatusResponse>(`${this.apiUrl}/status`).pipe(
      tap(status => this.statusSubject.next(status))
    );
  }

  /**
   * Inicia el proceso de vinculación OAuth con Microsoft
   */
  connect(): Observable<EmailConnectResponse> {
    return this.http.get<EmailConnectResponse>(`${this.apiUrl}/connect`);
  }

  /**
   * Inicia el proceso de vinculación OAuth con Gmail
   */
  connectGmail(): Observable<EmailConnectResponse> {
    return this.http.get<EmailConnectResponse>(`${this.apiUrl}/connect-gmail`);
  }

  /**
   * Desvincula una cuenta de email por proveedor
   */
  disconnect(proveedor: ProveedorEmail): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/disconnect/${proveedor}`,
      {}
    );
  }

  /**
   * Limpia el estado cacheado
   */
  clearCache(): void {
    this.statusSubject.next(null);
  }
}
