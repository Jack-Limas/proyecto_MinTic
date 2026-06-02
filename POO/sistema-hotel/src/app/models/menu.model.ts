export interface OpcionMenu {
  id: number;
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
  activo: boolean;
  rol: string;
  padre?: any;
  hijos?: OpcionMenu[];
}
