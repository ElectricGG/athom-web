import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, ExpenseDistribution, BalanceSummary, TendenciaMensual, TendenciaDiaria } from '../models/transaction.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly baseUrl = `${environment.apiUrl}/Transacciones`;

  constructor(private http: HttpClient) { }

  getRecentTransactions(cantidad: number = 10): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/recientes`, {
      params: { cantidad: cantidad.toString() }
    });
  }

  getExpenseDistribution(meses: number = 1): Observable<ExpenseDistribution[]> {
    return this.http.get<ExpenseDistribution[]>(`${this.baseUrl}/gastos/distribucion`, {
      params: { meses: meses.toString() }
    });
  }

  getBalanceSummary(): Observable<BalanceSummary> {
    return this.http.get<BalanceSummary>(`${this.baseUrl}/resumen/balance`);
  }

  getMonthlyTrend(meses: number = 12, anio?: number): Observable<TendenciaMensual[]> {
    const params: Record<string, string> = { meses: meses.toString() };
    if (anio !== undefined) {
      params['anio'] = anio.toString();
    }
    return this.http.get<TendenciaMensual[]>(`${this.baseUrl}/tendencia-mensual`, { params });
  }

  getDailyTrend(mes?: number, anio?: number): Observable<TendenciaDiaria[]> {
    const params: Record<string, string> = {};
    if (mes !== undefined) {
      params['mes'] = mes.toString();
    }
    if (anio !== undefined) {
      params['anio'] = anio.toString();
    }
    return this.http.get<TendenciaDiaria[]>(`${this.baseUrl}/tendencia-diaria`, { params });
  }
}
