import { InjectionToken } from '@angular/core';

export interface SiteConfig {
  /** Número de WhatsApp en formato internacional sin "+": 52 + 10 dígitos. */
  readonly whatsappNumber: string;
  /** Mensaje precargado de los botones genéricos de WhatsApp (barra y botón flotante). */
  readonly whatsappGreeting: string;
  readonly email: string;
  /**
   * Revisión interna del mockup (doc 23 §8): muestra la franja "MOCKUP" y la nota del pie.
   * Apagado desde la publicación del 2026-10-07; se enciende solo para revisar una propuesta.
   */
  readonly reviewMode: boolean;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // Número oficial (+52 771 229 1403), en el formato de wa.me.
  whatsappNumber: '527712291403',
  whatsappGreeting: 'Hola, vengo del sitio de VertexLabs y quiero platicar sobre mi negocio.',
  email: 'hola@vertexlabs.mx',
  reviewMode: false,
};

export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_SITE_CONFIG,
});
