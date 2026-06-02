export interface Servicio {
  idServicio?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo?: boolean;
}

export interface ReservaServicio {
  idReservaServicio?: number;
  reserva: { idReserva: number };
  servicio: { idServicio: number };
  cantidad: number;
  subtotal?: number;
}
