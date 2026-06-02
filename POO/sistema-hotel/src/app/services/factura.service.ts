import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura, Pago } from '../models/factura.model';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  // URL relativa — proxy redirige /api → http://localhost:8080/api (evita CORS)
  private readonly baseUrl = '/api/facturas';
  private readonly http = inject(HttpClient);

  obtener(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseUrl}/${id}`);
  }

  generar(idReserva: number): Observable<Factura> {
    return this.http.post<Factura>(`${this.baseUrl}/generar/${idReserva}`, {});
  }

  registrarPago(idFactura: number, pago: Pago): Observable<Factura> {
    return this.http.post<Factura>(`${this.baseUrl}/${idFactura}/pago`, pago);
  }
}
