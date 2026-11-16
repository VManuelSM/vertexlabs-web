import type { SiteConfig } from '@app/core/site-config';
import { startingPrice } from './plans';

/*
 * Textos del <head>, tal cual del prototipo v1. El precio sale de content/plans.ts.
 * TODO(dato): el título de la página de inicio no está en el prototipo ("Vertex Labs v1"); se arma
 * con el título del hero hasta que la especificación diga otro.
 */

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export const HOME_HEAD = {
  title: 'Tu negocio, listo para vender en internet · Vertex Labs',
  description: `Hacemos sitios, tiendas en línea y sistemas para PyMEs de todo México. Diagnóstico gratis y precios claros ${lowerFirst(startingPrice())}.`,
  ogTitle: 'Tu negocio, listo para vender en internet',
  ogDescription: 'Diagnóstico gratis en 3 minutos. Precios claros y un equipo real, desde Pachuca.',
} as const;

/** JSON-LD del prototipo (ProfessionalService es un tipo de LocalBusiness). Sin datos inventados. */
export const businessJsonLd = (site: SiteConfig): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  ...(site.siteUrl ? { url: `${site.siteUrl}/` } : {}),
  ...(site.email ? { email: site.email } : {}),
  ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
  areaServed: 'MX',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pachuca',
    addressRegion: 'Hidalgo',
    addressCountry: 'MX',
  },
});
