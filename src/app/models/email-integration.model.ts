/**
 * Respuesta del endpoint de estado con todas las cuentas vinculadas
 */
export interface EmailIntegrationStatusResponse {
  cuentas: EmailVinculadoInfo[];
}

/**
 * Información de la cuenta de email vinculada
 */
export interface EmailVinculadoInfo {
  cuentaEmailVinculadaId: number;
  proveedor: ProveedorEmail;
  email: string;
  activo: boolean;
  subscriptionActiva: boolean;
  subscriptionExpiration: string | null;
  fechaVinculacion: string;
}

/**
 * Respuesta al iniciar el proceso de vinculación OAuth
 */
export interface EmailConnectResponse {
  authorizationUrl: string;
  state: string;
}

/**
 * Proveedor de email
 */
export enum ProveedorEmail {
  Outlook = 1,
  Gmail = 2
}

/**
 * Helper para obtener el nombre del proveedor
 */
export function getProveedorNombre(proveedor: ProveedorEmail): string {
  switch (proveedor) {
    case ProveedorEmail.Outlook:
      return 'Microsoft Outlook';
    case ProveedorEmail.Gmail:
      return 'Gmail';
    default:
      return 'Desconocido';
  }
}
