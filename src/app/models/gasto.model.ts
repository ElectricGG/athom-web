export interface Gasto {
  gastoRealId: number;
  categoriaId: number;
  categoriaNombre: string;
  categoriaColor: string | null;
  categoriaIcono: string | null;
  descripcion: string;
  monto: number;
  fechaGasto: string;
  notas: string | null;
}

export interface CrearGastoRequest {
  descripcion: string;
  monto: number;
  categoriaId?: number;
  categoriaNombre?: string;
  fechaGasto?: string;
  notas?: string;
}

export interface ActualizarGastoRequest {
  descripcion: string;
  monto: number;
  categoriaId: number;
  fechaGasto: string;
  notas?: string;
}

export interface DistribucionGastoCategoria {
  categoriaId: number | null;
  nombre: string;
  icono: string | null;
  color: string | null;
  monto: number;
  porcentaje: number;
}

export interface ResumenGastos {
  totalMesActual: number;
  totalMesAnterior: number;
  porcentajeCambio: number;
  cantidadGastos: number;
  promedioGasto: number;
  promedioDiario: number;
}

export interface CategoriaGasto {
  categoriaId: number;
  nombreCategoria: string;
  color: string | null;
  icono: string | null;
}
