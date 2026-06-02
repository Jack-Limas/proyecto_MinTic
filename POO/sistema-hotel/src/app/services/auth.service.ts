import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

// ENCAPSULAMIENTO — el token JWT se almacena de forma privada
// en localStorage y solo se accede mediante métodos públicos
// getToken(), getRol(), getUsername(), saveSession()

// MODULARIDAD — AuthService centraliza toda la lógica de
// autenticación. Los componentes no manejan tokens directamente

// URL relativa — el proxy (proxy.conf.json) redirige /auth → http://localhost:8080/auth
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/auth';
  private readonly http = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/signin`, request);
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('rol', response.rol);
    localStorage.setItem('username', response.username);
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ?? null;
    } catch {
      return null;
    }
  }

  getRemainingTime(): number {
    const exp = this.getTokenExpiration();
    if (!exp) return 0;
    return Math.max(0, exp * 1000 - Date.now());
  }

  // Llama al backend POST /auth/refresh con el token actual y devuelve uno nuevo
  renovarSesion(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/refresh', {});
  }
}
