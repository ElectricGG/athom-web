import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface CheckoutResponse {
  sessionId: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Suscripciones`;

  crearCheckout(planId: number, periodoCobro: number = 0): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, { planId, periodoCobro });
  }

  cancelar(inmediataCancelacion: boolean = false): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cancelar`, { inmediataCancelacion });
  }
}
