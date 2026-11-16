import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SITE_CONFIG } from './site-config';

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = 'vl-utm';

/** Lee los UTM de la URL de llegada y los conserva durante la visita (sessionStorage). */
export const readUtm = (search: string, stored: string | null): Utm => {
  const params = new URLSearchParams(search);
  const fromUrl: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value.slice(0, 200);
  }
  if (Object.keys(fromUrl).length) return fromUrl;
  try {
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return {};
  }
};

export interface Lead {
  readonly origen: 'cierre' | 'diagnostico';
  readonly nombre: string;
  readonly negocio: string;
  readonly contacto: string;
  readonly correo?: string;
  readonly necesidad?: string;
  readonly plan?: string | null;
  /** Resultado del diagnóstico: respuestas, plan y foco. */
  readonly diagnostico?: string;
  readonly utm: Utm;
}

export class LeadError extends Error {
  constructor(readonly reason: 'sin-servicio' | 'red' | 'rechazado') {
    super(reason);
  }
}

/**
 * Envía los contactos al servicio de formularios (POST con JSON). TODO(dato): el servicio se elige
 * con Víctor; mientras `leadEndpoint` sea `null`, el envío falla con `sin-servicio` y el formulario
 * muestra su estado de error. Nunca se finge un envío.
 */
@Injectable({ providedIn: 'root' })
export class Leads {
  private readonly site = inject(SITE_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** UTM de la visita (vacío al prerenderizar). */
  utm(): Utm {
    if (!this.isBrowser) return {};
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(STORAGE_KEY);
    } catch {
      /* almacenamiento bloqueado */
    }
    const utm = readUtm(location.search, stored);
    try {
      if (Object.keys(utm).length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    } catch {
      /* almacenamiento bloqueado */
    }
    return utm;
  }

  async send(lead: Lead): Promise<void> {
    const endpoint = this.site.leadEndpoint;
    if (!endpoint) throw new LeadError('sin-servicio');
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch {
      throw new LeadError('red');
    }
    if (!response.ok) throw new LeadError('rechazado');
  }
}

/** Validaciones de los formularios, como el prototipo. */
export const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
export const isWhatsapp = (value: string) => value.replace(/\D/g, '').length >= 10;
