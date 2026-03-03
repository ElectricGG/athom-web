import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ChatRequest, ChatResponse, ChatHistoryItem } from '../models/chat.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = `${environment.apiUrl}/Chat`;

  constructor(private http: HttpClient) { }

  getHistory(count: number = 50): Observable<ChatHistoryItem[]> {
    return this.http.get<ChatHistoryItem[]>(`${this.baseUrl}/history`, {
      params: { count: count.toString() }
    });
  }

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.baseUrl, request);
  }

  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/history`);
  }

  downloadExport(exportUrl: string, fileName: string): void {
    const fullUrl = `${environment.apiUrl}${exportUrl.replace('/api/', '/')}`;
    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading export:', err)
    });
  }

  getChartBlobUrl(chartUrl: string): Observable<string> {
    const fullUrl = `${environment.apiUrl}${chartUrl.replace('/api/', '/')}`;
    return this.http.get(fullUrl, { responseType: 'blob' }).pipe(
      map(blob => window.URL.createObjectURL(blob))
    );
  }

  downloadChart(chartUrl: string, fileName: string): void {
    const fullUrl = `${environment.apiUrl}${chartUrl.replace('/api/', '/')}`;
    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading chart:', err)
    });
  }
}
