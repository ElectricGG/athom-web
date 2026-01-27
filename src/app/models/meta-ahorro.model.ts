export interface MetaAhorro {
  metaAhorroId: number;
  categoriaId: number;
  nombre: string;
  descripcion: string | null;
  montoObjetivo: number;
  montoActual: number;
  porcentaje: number;
  fechaLimite: string | null;
  prioridad: number;
  estado: EstadoMeta;
  estadoNombre: string;
  color: string | null;
  icono: string | null;
  fechaCreacion: string;
  fechaCompletada: string | null;
}

export interface ResumenMetaAhorro {
  metaAhorroId: number;
  nombre: string;
  montoActual: number;
  montoObjetivo: number;
  porcentaje: number;
  color: string | null;
  icono: string | null;
}

export interface CrearMetaAhorroRequest {
  nombre: string;
  montoObjetivo: number;
  descripcion?: string;
  fechaLimite?: string;
  prioridad?: number;
  color?: string;
  icono?: string;
}

export interface ActualizarMetaAhorroRequest {
  nombre: string;
  montoObjetivo: number;
  descripcion?: string;
  fechaLimite?: string;
  prioridad?: number;
  color?: string;
  icono?: string;
}

export enum EstadoMeta {
  Activa = 1,
  Completada = 2,
  Pausada = 3,
  Cancelada = 4
}
