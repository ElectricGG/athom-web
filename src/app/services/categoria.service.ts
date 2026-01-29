import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CrearCategoriaRequest, ActualizarCategoriaRequest } from '../models/categoria.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5041/api/Categorias';

    getAll(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.apiUrl);
    }

    getById(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
    }

    crear(request: CrearCategoriaRequest): Observable<Categoria> {
        return this.http.post<Categoria>(this.apiUrl, request);
    }

    actualizar(id: number, request: ActualizarCategoriaRequest): Observable<Categoria> {
        return this.http.put<Categoria>(`${this.apiUrl}/${id}`, request);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
