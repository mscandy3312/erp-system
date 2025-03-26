export interface ProyectoBase {
  id?: number;
  nombre: string;
  descripcion: string;
  estado: 'PLANEADO' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  fechaInicio: string;
  fechaFin: string | null;
}

export interface Proyecto extends ProyectoBase {
  id: number;
} 