export interface Transaction {
  id: number;
  descripcion: string;
  categoria: string;
  fecha: string;
  monto: number;
  tipo: TransactionType;
  tipoNombre: string;
}

export interface ExpenseDistribution {
  categoriaId: number | null;
  nombre: string;
  icono: string | null;
  color: string | null;
  monto: number;
  porcentaje: number;
}

export interface BalanceSummary {
  totalIngresos: number;
  totalGastos: number;
  totalAhorros: number;
  balance: number;
  disponible: number;
  promedioDiarioGastos: number;
  porcentajeCambioIngresos: number;
  porcentajeCambioGastos: number;
  porcentajeCambioBalance: number;
}

export interface TendenciaMensual {
  etiqueta: string;
  anio: number;
  mes: number;
  totalIngresos: number;
  totalGastos: number;
}

export enum TransactionType {
  Gasto = 1,
  Ingreso = 2
}
