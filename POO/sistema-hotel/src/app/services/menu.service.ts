import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpcionMenu } from '../models/menu.model';

// RECURSIVIDAD — getMenu() obtiene del backend la estructura
// de árbol construida recursivamente por MenuService.java
// El backend recorre OpcionMenu padre->hijos recursivamente
// y devuelve el árbol completo en un solo endpoint GET /api/menu

// URL relativa — proxy redirige /api → http://localhost:8080/api (evita CORS)
@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly baseUrl = '/api/menu';
  private readonly http = inject(HttpClient);

  getMenu(): Observable<OpcionMenu[]> {
    return this.http.get<OpcionMenu[]>(this.baseUrl);
  }
}
