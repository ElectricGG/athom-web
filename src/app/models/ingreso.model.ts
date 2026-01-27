export interface Ingreso {
  ingresoId: number;
  categoriaId: number;
  categoriaNombre: string;
  categoriaColor: string | null;
  categoriaIcono: string | null;
  descripcion: string;
  monto: number;
  fechaRegistro: string;
}

export interface CrearIngresoRequest {
  descripcion: string;
  monto: number;
  categoriaId?: number;
  categoriaNombre?: string;
  fechaRegistro?: string;
}

export interface ActualizarIngresoRequest {
  descripcion: string;
  monto: number;
  categoriaId: number;
  fechaRegistro: string;
}

export interface DistribucionIngresoCategoria {
  categoriaId: number;
  nombreCategoria: string;
  icono: string | null;
  color: string | null;
  monto: number;
  porcentaje: number;
}

export interface ResumenIngresos {
  totalMesActual: number;
  totalMesAnterior: number;
  porcentajeCambio: number;
  cantidadIngresos: number;
  promedioIngreso: number;
}

export interface CategoriaIngreso {
  categoriaId: number;
  nombreCategoria: string;
  color: string | null;
  icono: string | null;
}
