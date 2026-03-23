import { Injectable } from '@angular/core';

const COUNTRY_CURRENCIES: Record<string, { symbol: string; code: string; locale: string }> = {
  '+51': { symbol: 'S/', code: 'PEN', locale: 'es-PE' },
  '+52': { symbol: '$', code: 'MXN', locale: 'es-MX' },
  '+57': { symbol: '$', code: 'COP', locale: 'es-CO' },
  '+56': { symbol: '$', code: 'CLP', locale: 'es-CL' },
  '+54': { symbol: '$', code: 'ARS', locale: 'es-AR' },
  '+593': { symbol: '$', code: 'USD', locale: 'es-EC' },
  '+591': { symbol: 'Bs', code: 'BOB', locale: 'es-BO' },
  '+595': { symbol: 'Gs', code: 'PYG', locale: 'es-PY' },
  '+598': { symbol: '$', code: 'UYU', locale: 'es-UY' },
  '+507': { symbol: '$', code: 'USD', locale: 'es-PA' },
  '+506': { symbol: '₡', code: 'CRC', locale: 'es-CR' },
  '+502': { symbol: 'Q', code: 'GTQ', locale: 'es-GT' },
  '+503': { symbol: '$', code: 'USD', locale: 'es-SV' },
  '+504': { symbol: 'L', code: 'HNL', locale: 'es-HN' },
  '+505': { symbol: 'C$', code: 'NIO', locale: 'es-NI' },
  '+809': { symbol: 'RD$', code: 'DOP', locale: 'es-DO' },
};

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  getConfig(codigoPais: string | null | undefined) {
    const code = codigoPais?.startsWith('+') ? codigoPais : '+' + (codigoPais ?? '51');
    return COUNTRY_CURRENCIES[code] ?? COUNTRY_CURRENCIES['+51'];
  }
}
