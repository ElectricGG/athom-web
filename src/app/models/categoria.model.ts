export interface Categoria {
  categoriaId: number;
  usuarioId: number;
  tipoGastoId?: number;
  nombreCategoria: string;
  tipoCategoria: 'Gasto' | 'Ingreso' | 'Ahorro';
  color?: string;
  icono?: string;
  fechaCreacion: string;
  activo: boolean;
  etiqueta?: string;
  // Navigation properties optional
  tipoGasto?: {
    tipoGastoId: number;
    nombre: string;
  };
}

export interface CrearCategoriaRequest {
  nombreCategoria: string;
  tipoCategoria: 'Gasto' | 'Ingreso' | 'Ahorro';
  tipoGastoId?: number;
  color?: string;
  icono?: string;
  etiqueta?: string;
}

export interface ActualizarCategoriaRequest {
  nombreCategoria: string;
  tipoCategoria: 'Gasto' | 'Ingreso' | 'Ahorro';
  tipoGastoId?: number;
  color?: string;
  icono?: string;
  etiqueta?: string;
}
