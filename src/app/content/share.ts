/*
 * Textos al compartir el enlace (Open Graph y Twitter), tal cual del prototipo v1. Sin imports: el
 * generador de la imagen para compartir (scripts/share-image.mjs) también los lee.
 */
export const SHARE = {
  title: 'Tu negocio, listo para vender en internet',
  description: 'Diagnóstico gratis en 3 minutos. Precios claros y un equipo real, desde Pachuca.',
  /** Capturas del hero que se repiten en la imagen: la de atrás y la de enfrente. */
  captures: ['/images/planifica-tu-vivienda.jpg', '/images/toastmasters-pachuca.jpg'],
} as const;
