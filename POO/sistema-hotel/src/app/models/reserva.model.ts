export interface Reserva {
  idReserva?: number;
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
  fechaCreacion?: string;
  totalEstimado?: number;
  huesped: { idHuesped?: number; nombre?: string; [key: string]: any };
  habitacion: { idHabitacion?: number; numero?: string; tipo?: string; precioBase?: number; [key: string]: any };
}

// ENCAPSULAMIENTO — DTO con solo los IDs necesarios para crear una reserva.
// Evita exponer entidades completas al backend; el backend busca las entidades por ID.
export interface ReservaRequest {
  fechaInicio: string;
  fechaFin: string;
  idHuesped: number;
  idHabitacion: number;
}
