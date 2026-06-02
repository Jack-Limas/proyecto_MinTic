import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva, ReservaRequest } from '../models/reserva.model';

// POLIMORFISMO — cuando el backend crea una reserva llama
// habitacion.calcularPrecio() que se comporta diferente según
// el tipo: HabitacionEstandar retorna precioBase,
// HabitacionSuite suma desayuno y vista al mar,
// HabitacionFamiliar multiplica por número de camas,
// HabitacionEjecutiva suma desayuno y piso ejecutivo
// El frontend recibe el totalEstimado ya calculado

// URL relativa — proxy redirige /api → http://localhost:8080/api (evita CORS)
@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly baseUrl = '/api/reservas';
  private readonly http = inject(HttpClient);

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  obtener(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}/${id}`);
  }

  listarPorHuesped(idHuesped: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/huesped/${idHuesped}`);
  }

  crear(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.baseUrl, reserva);
  }

  // ENCAPSULAMIENTO — usamos ReservaRequest para no exponer
  // la entidad completa al backend, solo los IDs necesarios
  crearConDTO(request: ReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(this.baseUrl, request);
  }

  hacerCheckin(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}/checkin`, {});
  }

  hacerCheckout(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}/checkout`, {});
  }

  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
