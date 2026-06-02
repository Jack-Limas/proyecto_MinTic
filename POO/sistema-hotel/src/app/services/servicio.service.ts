import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio, ReservaServicio } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  // URL relativa — proxy redirige /api → http://localhost:8080/api (evita CORS)
  private readonly baseUrl = '/api/servicios';
  private readonly http = inject(HttpClient);

  listar(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.baseUrl);
  }

  listarActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/activos`);
  }

  crear(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.baseUrl, servicio);
  }

  agregarAReserva(rs: ReservaServicio): Observable<ReservaServicio> {
    return this.http.post<ReservaServicio>('/api/reserva-servicios', rs);
  }
}
