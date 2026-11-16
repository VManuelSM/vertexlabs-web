import { type Copy, tbd } from './copy';

/*
 * Planes y precios: única fuente. Las tarjetas de planes, el resultado del diagnóstico, la línea del
 * hero y los mensajes de WhatsApp se derivan de aquí. Nunca se escribe un precio en una plantilla.
 * Cambiar precios o planes requiere aprobación de Víctor.
 */

export const IVA_RATE = 0.16;

export type PlanId = 'empezar' | 'crecer' | 'medida';

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly audience: string;
  /** Precio base en MXN antes de IVA; `null` cuando se cotiza. */
  readonly price: number | null;
  /** Para los planes sin precio fijo: texto en lugar del monto y su nota. */
  readonly quote?: { readonly amount: string; readonly note: string };
  readonly badge?: string;
  readonly includes: readonly Copy[];
  readonly delivery: Copy;
  readonly payment: Copy;
  readonly cta: string;
  readonly whatsapp: string;
  /** Aspecto de la tarjeta: la del centro es la destacada. */
  readonly tone: 'light' | 'dark' | 'sand';
}

export const PLANS: readonly Plan[] = [
  {
    id: 'empezar',
    name: 'Para empezar',
    audience: 'El negocio que necesita verse profesional en internet.',
    price: 5900,
    includes: [
      ['Sitio de ', tbd('[N]'), ' secciones'],
      'Botón de WhatsApp y formulario',
      'Diseño pensado para celular',
      'Revisión de tu diagnóstico con nosotros',
    ],
    delivery: tbd('unas 2 semanas'),
    payment: tbd('por confirmar'),
    cta: 'Quiero este plan',
    whatsapp: 'Hola, me interesa el plan Para empezar.',
    tone: 'light',
  },
  {
    id: 'crecer',
    name: 'Para crecer',
    audience: 'El negocio que ya vende y quiere más clientes.',
    price: 16900,
    badge: 'Recomendado si ya vendes',
    includes: [
      'Todo lo de Para empezar',
      [tbd('[N]'), ' páginas de servicios'],
      'Textos pensados para vender',
      'Medición de visitas y mensajes',
      ['Acompañamiento de ', tbd('[N]'), ' semanas'],
    ],
    delivery: tbd('por confirmar'),
    payment: tbd('por confirmar'),
    cta: 'Quiero este plan',
    whatsapp: 'Hola, me interesa el plan Para crecer.',
    tone: 'dark',
  },
  {
    id: 'medida',
    name: 'A la medida',
    audience: 'El negocio que necesita algo que no existe en una plantilla.',
    price: null,
    quote: { amount: 'Lo cotizamos juntos', note: 'Según el alcance de tu proyecto' },
    includes: [
      'Tienda en línea con pagos',
      'Sistemas de inventario, citas o cotizaciones',
      'Automatización e inteligencia artificial aplicada',
    ],
    delivery: 'según alcance, en la propuesta',
    payment: ['en mensualidades ', tbd('[número]')],
    cta: 'Cotizar mi proyecto',
    whatsapp: 'Hola, quiero cotizar un proyecto a la medida.',
    tone: 'sand',
  },
];

export const planById = (id: PlanId): Plan => {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan desconocido: ${id}`);
  return plan;
};

const MXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  currencyDisplay: 'narrowSymbol',
  maximumFractionDigits: 0,
});

/** "$5,900" */
export const formatMXN = (amount: number): string => MXN.format(amount);

/** Total con IVA, redondeado a pesos. */
export const withIva = (amount: number): number => Math.round(amount * (1 + IVA_RATE));

export interface PriceView {
  /** "Desde" o "Precio". */
  readonly label: string;
  /** "$5,900" o "Lo cotizamos juntos". */
  readonly amount: string;
  /** "+ IVA" cuando hay precio. */
  readonly tax: string | null;
  /** "$6,844 con IVA" o "Según el alcance de tu proyecto". */
  readonly total: string;
}

export const priceView = (plan: Plan): PriceView =>
  plan.price === null
    ? {
        label: 'Precio',
        amount: plan.quote?.amount ?? '',
        tax: null,
        total: plan.quote?.note ?? '',
      }
    : {
        label: 'Desde',
        amount: formatMXN(plan.price),
        tax: '+ IVA',
        total: `${formatMXN(withIva(plan.price))} con IVA`,
      };

/** Precio en una línea para el resultado del diagnóstico: "Desde $5,900 + IVA". */
export const priceLine = (plan: Plan): { readonly main: string; readonly note: string } => {
  const view = priceView(plan);
  const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
  return view.tax
    ? { main: `${view.label} ${view.amount} ${view.tax}`, note: view.total }
    : { main: view.amount, note: lower(view.total) };
};

/** "Desde $5,900 + IVA": el precio de entrada, para la línea del hero. */
export const startingPrice = (): string => {
  const prices = PLANS.flatMap((p) => (p.price === null ? [] : [p.price]));
  return `Desde ${formatMXN(Math.min(...prices))} + IVA`;
};
