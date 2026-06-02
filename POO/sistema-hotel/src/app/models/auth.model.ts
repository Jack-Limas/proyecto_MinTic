export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { token: string; rol: string; username: string; }
export interface RegisterRequest {
  username: string; password: string; rol: string;
  nombre: string; correo: string; telefono: string;
  tipoDocumento: string; numeroDocumento: string;
}
