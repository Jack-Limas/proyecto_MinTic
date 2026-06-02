import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  // URL relativa — proxy redirige /api → http://localhost:8080/api (evita CORS)
  private readonly baseUrl = '/api/habitaciones';
  private readonly http = inject(HttpClient);

  listar(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.baseUrl);
  }

  listarDisponibles(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/disponibles`);
  }

  obtener(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.baseUrl}/${id}`);
  }

  crear(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.baseUrl, habitacion);
  }

  actualizar(id: number, habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.baseUrl}/${id}`, habitacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
