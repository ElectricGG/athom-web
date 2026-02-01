export interface PreferenciaNotificacion {
  preferenciaNotificacionId: number;
  notificacionesWhatsApp: boolean;
  notificacionesEmail: boolean;
  alertasPresupuesto: boolean;
  recordatoriosPago: boolean;
  consejosFinancieros: boolean;
}

export interface ActualizarPreferenciaNotificacionRequest {
  notificacionesWhatsApp: boolean;
  notificacionesEmail: boolean;
  alertasPresupuesto: boolean;
  recordatoriosPago: boolean;
  consejosFinancieros: boolean;
}
