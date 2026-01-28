export interface Recordatorio {
  recordatorioId: number;
  titulo: string;
  descripcion: string | null;
  monto: number;
  fechaVencimiento: string;
  icono: string | null;
  frecuencia: FrecuenciaRecordatorio;
  frecuenciaNombre: string;
  completado: boolean;
  fechaCompletado: string | null;
  fechaCreacion: string;
  estado: string; // 'overdue' | 'upcoming' | 'pending' | 'completed'
}

export interface ResumenRecordatorios {
  vencidos: number;
  proximosSieteDias: number;
  completadosEsteMes: number;
}

export interface CrearRecordatorioRequest {
  titulo: string;
  monto: number;
  fechaVencimiento: string;
  descripcion?: string;
  icono?: string;
  frecuencia?: FrecuenciaRecordatorio;
}

export interface ActualizarRecordatorioRequest {
  titulo: string;
  monto: number;
  fechaVencimiento: string;
  descripcion?: string;
  icono?: string;
  frecuencia?: FrecuenciaRecordatorio;
}

export enum FrecuenciaRecordatorio {
  Ninguna = 0,
  Diario = 1,
  Semanal = 2,
  Mensual = 3,
  Anual = 4
}
