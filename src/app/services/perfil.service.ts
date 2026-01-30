import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil, ActualizarPerfilRequest } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5041/api/Perfil';

  getPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(this.apiUrl);
  }

  updatePerfil(request: ActualizarPerfilRequest): Observable<Perfil> {
    return this.http.put<Perfil>(this.apiUrl, request);
  }
}
