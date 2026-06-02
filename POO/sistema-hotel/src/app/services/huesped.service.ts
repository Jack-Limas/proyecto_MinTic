import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Huesped } from '../models/huesped.model';

@Injectable({ providedIn: 'root' })
export class HuespedService {
  // URL relativa — proxy redirige /api → http://localhost:8080/api (evita CORS)
  private readonly baseUrl = '/api/huespedes';
  private readonly http = inject(HttpClient);

  listar(): Observable<Huesped[]> {
    return this.http.get<Huesped[]>(this.baseUrl);
  }

  obtener(id: number): Observable<Huesped> {
    return this.http.get<Huesped>(`${this.baseUrl}/${id}`);
  }

  crear(huesped: Huesped): Observable<Huesped> {
    return this.http.post<Huesped>(this.baseUrl, huesped);
  }

  actualizar(id: number, huesped: Huesped): Observable<Huesped> {
    return this.http.put<Huesped>(`${this.baseUrl}/${id}`, huesped);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
