import { InjectionToken } from '@angular/core';

/**
 * Datos del sitio que todavía no existen o no se han elegido. Mientras sean `null`, el sitio lo
 * muestra como dato por confirmar y no inventa nada. Llenarlos es parte de la etapa 5.
 */
export interface SiteConfig {
  readonly name: string;
  /** TODO(dato): número de WhatsApp Business, solo dígitos con lada de país (52…). */
  readonly whatsappNumber: string | null;
  /** TODO(dato): correo con dominio propio. */
  readonly email: string | null;
  /** TODO(dato): dominio final, sin barra al final (https://…). */
  readonly siteUrl: string | null;
  /** TODO(dato): razón social para el pie y el aviso de privacidad. */
  readonly legalName: string | null;
  /**
   * TODO(dato): servicio de formularios (se elige con Víctor). Recibe un POST con JSON.
   * Sin él, el formulario muestra el estado de error en lugar de fingir que envió.
   */
  readonly leadEndpoint: string | null;
}

export const SITE: SiteConfig = {
  name: 'Vertex Labs',
  whatsappNumber: null,
  email: null,
  siteUrl: null,
  legalName: null,
  leadEndpoint: null,
};

export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG', {
  providedIn: 'root',
  factory: () => SITE,
});
