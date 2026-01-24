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
  balance: number;
  promedioDiarioGastos: number;
  porcentajeCambioIngresos: number;
  porcentajeCambioGastos: number;
  porcentajeCambioBalance: number;
}

export enum TransactionType {
  Ingreso = 0,
  Gasto = 1
}
