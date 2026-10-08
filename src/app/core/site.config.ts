import { InjectionToken } from '@angular/core';

export interface SiteConfig {
  /** Número de WhatsApp en formato internacional sin "+": 52 + 10 dígitos. */
  readonly whatsappNumber: string;
  /** Mensaje precargado de los botones genéricos de WhatsApp (barra y botón flotante). */
  readonly whatsappGreeting: string;
  readonly email: string;
  /**
   * Revisión interna del mockup (doc 23 §8): muestra la franja "MOCKUP" y la nota del pie.
   * Se apaga antes de publicar.
   */
  readonly reviewMode: boolean;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // Pendiente doc 23 §9 #8: número oficial. Mientras tanto los enlaces abren un chat de demostración.
  whatsappNumber: '52XXXXXXXXXX',
  whatsappGreeting: 'Hola, vengo del sitio de VertexLabs y quiero platicar sobre mi negocio.',
  email: 'hola@vertexlabs.mx',
  reviewMode: true,
};

export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_SITE_CONFIG,
});
