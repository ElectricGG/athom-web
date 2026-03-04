export interface MiembroFamiliar {
  miembroFamiliarId: number;
  numeroWhatsApp: string;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface CrearMiembroFamiliarRequest {
  numeroWhatsApp: string;
  nombre: string;
}

export interface ActualizarMiembroFamiliarRequest {
  nombre: string;
}
