import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, ExpenseDistribution, BalanceSummary, TendenciaMensual } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly baseUrl = 'http://localhost:5041/api/Transacciones';

  constructor(private http: HttpClient) {}

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

  getMonthlyTrend(meses: number = 12): Observable<TendenciaMensual[]> {
    return this.http.get<TendenciaMensual[]>(`${this.baseUrl}/tendencia-mensual`, {
      params: { meses: meses.toString() }
    });
  }
}
