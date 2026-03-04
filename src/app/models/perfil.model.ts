export interface Perfil {
  usuarioId: number;
  nombreUsuario: string;
  email: string;
  codigoPais: string;
  telefono: string;
  numeroWhatsApp: string;
  fechaRegistro: string;
  emailVerificado: boolean;
  planNombre: string | null;
  esPlanGratuito: boolean;
  precioMensual: number | null;
  fechaProximoCobro: string | null;
}

export interface ActualizarPerfilRequest {
  nombreUsuario: string;
}
