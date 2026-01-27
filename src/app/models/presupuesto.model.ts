/**
 * Presupuesto mensual - contenedor principal
 */
export interface PresupuestoEstimado {
  presupuestoId: number;
  codigo: string;
  nombre: string;
  mes: number;
  anio: number;
  fechaCreacion: string;
  totalPresupuestado: number;
  totalGastado: number;
  cantidadCategorias: number;
  categorias?: PresupuestoCategoria[];
}

/**
 * Presupuesto por categoría - montos específicos
 */
export interface PresupuestoCategoria {
  presupuestoCategoriaId: number;
  presupuestoId: number | null;
  categoriaId: number;
  categoriaNombre: string;
  categoriaColor: string | null;
  categoriaIcono: string | null;
  descripcion: string;
  monto: number;
  montoGastado: number;
  fechaRegistro: string;
}

/**
 * Resumen del presupuesto mensual
 */
export interface ResumenPresupuesto {
  totalPresupuestado: number;
  totalGastado: number;
  disponible: number;
  porcentajeUtilizado: number;
  categoriasConPresupuesto: number;
  categoriasSinPresupuesto: number;
}

/**
 * Request para crear presupuesto mensual
 */
export interface CrearPresupuestoRequest {
  mes: number;
  anio: number;
  nombre?: string;
}

/**
 * Request para actualizar presupuesto mensual
 */
export interface ActualizarPresupuestoRequest {
  nombre: string;
  mes: number;
  anio: number;
}

/**
 * Request para crear presupuesto de categoría
 */
export interface CrearPresupuestoCategoriaRequest {
  categoriaId: number;
  descripcion: string;
  monto: number;
}

export interface ActualizarPresupuestoCategoriaRequest {
  descripcion: string;
  monto: number;
}

/**
 * Categoría disponible para presupuestar (solo las que tienen gastos reales)
 */
export interface CategoriaDisponible {
  categoriaId: number;
  nombreCategoria: string;
  color: string | null;
  icono: string | null;
  tienePresupuesto: boolean;
  montoGastado: number;
}
