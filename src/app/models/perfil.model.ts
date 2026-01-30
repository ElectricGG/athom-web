export interface Perfil {
  usuarioId: number;
  nombreUsuario: string;
  email: string;
  codigoPais: string;
  telefono: string;
  numeroWhatsApp: string;
  fechaRegistro: string;
  emailVerificado: boolean;
}

export interface ActualizarPerfilRequest {
  nombreUsuario: string;
}
