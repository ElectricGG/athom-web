export interface PreferenciaNotificacion {
  preferenciaNotificacionId: number;
  alertasConsumo: boolean;
  recordatoriosPago: boolean;
  boletinSemanal: boolean;
  ofertasDescuentos: boolean;
}

export interface ActualizarPreferenciaNotificacionRequest {
  alertasConsumo: boolean;
  recordatoriosPago: boolean;
  boletinSemanal: boolean;
  ofertasDescuentos: boolean;
}
