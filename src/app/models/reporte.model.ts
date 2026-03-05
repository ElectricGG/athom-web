export interface TendenciaCategoriaMensual {
  categoriaId: number | null;
  nombreCategoria: string;
  color: string | null;
  icono: string | null;
  meses: MontoMensual[];
}

export interface MontoMensual {
  etiqueta: string;
  anio: number;
  mes: number;
  monto: number;
}
