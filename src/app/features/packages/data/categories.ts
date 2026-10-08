/** Accesos por categoría sobre la rejilla de paquetes (doc 23 §4, Sec 4). */
export interface CategoryTile {
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly tone: 1 | 2 | 3;
  /** Ancla interna o, si no hay, mensaje de WhatsApp. */
  readonly href?: string;
  readonly whatsapp?: string;
}

export const CATEGORY_TILES: readonly CategoryTile[] = [
  {
    kicker: 'Lo más pedido',
    title: 'Páginas web',
    body: 'Presencia, landing o sitio completo para que te encuentren y confíen en ti.',
    tone: 1,
    href: '#paquetes',
  },
  {
    kicker: 'Vende en línea',
    title: 'Tiendas en línea',
    body: 'Catálogo o e-commerce con carrito y pago, listo para vender por internet.',
    tone: 2,
    href: '#paquetes',
  },
  {
    kicker: 'Algo más grande',
    title: 'A la medida',
    body: 'Sistemas y automatizaciones con IA, hechos para tu operación.',
    tone: 3,
    whatsapp: 'Hola, necesito algo a la medida (más que una página o tienda). ¿Lo vemos?',
  },
];
