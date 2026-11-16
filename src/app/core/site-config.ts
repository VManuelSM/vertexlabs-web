import { InjectionToken } from '@angular/core';

/**
 * Datos del sitio que todavía no existen o no se han elegido. Mientras sean `null`, el sitio lo
 * muestra como dato por confirmar y no inventa nada. Llenarlos es parte de la etapa 5.
 */
export interface SiteConfig {
  readonly name: string;
  /** TODO(dato): número de WhatsApp Business, solo dígitos con lada de país (52…). */
  readonly whatsappNumber: string | null;
  /** Correo de contacto con dominio propio. */
  readonly email: string | null;
  /**
   * Dominio final, sin barra al final. La versión sin www es la canónica: el hosting debe redirigir
   * www.vertexlabs.mx hacia aquí (TODO(dato): hosting por decidir, Firebase o Cloudflare).
   */
  readonly siteUrl: string | null;
  /** TODO(dato): razón social para el pie y el aviso de privacidad. */
  readonly legalName: string | null;
  /**
   * TODO(dato): servicio de formularios (se elige con Víctor). Recibe un POST con JSON.
   * Sin él, el formulario muestra el estado de error en lugar de fingir que envió.
   */
  readonly leadEndpoint: string | null;
  /**
   * Imagen para compartir de 1200 × 630 en `public/`, generada con `pnpm share-image`. Solo se
   * anuncia en el <head> cuando existe `siteUrl` (Open Graph pide una URL absoluta).
   */
  readonly shareImage: string | null;
}

export const SITE: SiteConfig = {
  name: 'Vertex Labs',
  whatsappNumber: null,
  email: 'hola@vertexlabs.mx',
  siteUrl: 'https://vertexlabs.mx',
  legalName: null,
  leadEndpoint: null,
  shareImage: '/og-1200x630.jpg',
};

export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG', {
  providedIn: 'root',
  factory: () => SITE,
});
