export interface DetalleFactura {
  idDetalle?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Factura {
  idFactura?: number;
  fechaEmision?: string;
  total?: number;
  estado?: string;
  reserva?: any;
  detalles?: DetalleFactura[];
}

export interface Pago {
  idPago?: number;
  monto: number;
  fecha?: string;
  metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
}
