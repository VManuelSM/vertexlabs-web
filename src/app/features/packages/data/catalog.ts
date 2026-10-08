import { type PackageId, type WebPackage, formatPrice } from '../models/web-package';

/*
 * Catálogo de paquetes (doc 23 §4, Sec 4 y doc 22). Precios y alcances sujetos a validación:
 * IVA incluido o no, alcance topado por paquete (doc 23 §9 #4–#6). Es la única fuente de precios:
 * tarjetas, diagnóstico y mensajes de WhatsApp leen de aquí.
 */

type PackageInput = Omit<WebPackage, 'cta'> & { ctaLabel?: string; ctaVerb?: string };

/** El mensaje de WhatsApp se arma con el precio del catálogo para que nunca diverjan. */
const pkg = ({
  ctaLabel = 'Me interesa',
  ctaVerb = 'me interesa el paquete',
  ...p
}: PackageInput): WebPackage => ({
  ...p,
  cta: { label: ctaLabel, message: `Hola, ${ctaVerb} ${p.name} (${formatPrice(p.price)}).` },
});

export const PACKAGES: readonly WebPackage[] = [
  pkg({
    id: 'presence',
    name: 'Presencia PyME',
    audience: 'Para existir en internet, ya.',
    price: { from: 5900 },
    features: [
      '1 página profesional y responsiva',
      'Botón de WhatsApp y contacto',
      'Optimización básica para Google',
      'Dominio + hosting primer año',
    ],
    delivery: 'Entrega ~1.5 semanas',
  }),
  pkg({
    id: 'landing',
    name: 'Landing de conversión',
    audience: 'Para que tus anuncios sí vendan.',
    price: { from: 8450 },
    features: [
      'Página única enfocada a una acción',
      'Copy orientado a resultados',
      'Formulario + pixel de seguimiento',
      'Lista para conectar a tu pauta',
    ],
    delivery: 'Entrega ~1.5 semanas',
  }),
  pkg({
    id: 'site',
    name: 'Sitio PyME completo',
    audience: 'Para verte serio y profesional.',
    price: { from: 16900 },
    features: [
      '5 a 8 secciones a la medida',
      'SEO intermedio y correos corporativos',
      'Diseño UX por especialista',
      'Evaluación técnica previa incluida',
    ],
    delivery: 'Entrega ~3 semanas',
    featured: true,
  }),
  pkg({
    id: 'catalog',
    name: 'Sitio + catálogo',
    audience: 'Para mostrar tus productos (sin cobrar en línea).',
    price: { from: 21125 },
    features: [
      'Todo lo del Sitio PyME',
      'Catálogo de productos navegable',
      'Formularios de pedido / cotización',
      'Panel para actualizar tu catálogo',
    ],
    delivery: 'Entrega ~4 semanas',
  }),
  pkg({
    id: 'ecommerce',
    name: 'E-commerce con pasarela',
    audience: 'Para vender y cobrar en internet.',
    price: { from: 28000, to: 35000 },
    features: [
      'Carrito y pasarela (Stripe / Mercado Pago)',
      'Gestión de productos, stock y pedidos',
      'Diseño UX de la experiencia de compra',
      'Capacitación de tu equipo',
    ],
    delivery: 'Entrega 6–10 semanas',
    ctaVerb: 'me interesa desarrollar un',
  }),
  pkg({
    id: 'maintenance',
    name: 'Plan de mantenimiento',
    audience: 'Se suma a cualquier paquete.',
    price: { from: 350, to: 900, period: 'mes' },
    features: [
      'Hosting, respaldos y SSL gestionados',
      'Pequeños cambios de contenido',
      'Monitoreo y actualizaciones',
      'No desaparecemos después de entregar',
    ],
    delivery: 'Servicio continuo',
    recurring: true,
    ctaLabel: 'Saber más',
    ctaVerb: 'quiero saber más del',
  }),
];

export function findPackage(id: PackageId): WebPackage {
  const found = PACKAGES.find((p) => p.id === id);
  if (!found) throw new Error(`Paquete desconocido: ${id}`);
  return found;
}
