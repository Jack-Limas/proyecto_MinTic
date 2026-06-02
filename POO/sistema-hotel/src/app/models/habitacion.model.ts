export interface Habitacion {
  idHabitacion?: number;
  numero: string;
  piso: number;
  capacidad: number;
  descripcion: string;
  disponible: boolean;
  tipo: 'SUITE' | 'ESTANDAR' | 'FAMILIAR' | 'EJECUTIVA';
  precioBase: number;
  incluyeDesayuno?: boolean;
  vistaAlMar?: boolean;
  pisoEjecutivo?: boolean;
  numeroCamas?: number;
}
