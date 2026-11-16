import { type IconName } from '@app/components/atoms/icon';
import { type Copy, tbd } from './copy';

/* Contenido en lista de la página de inicio, tal cual del prototipo v1. */

export const TRUST = {
  clients: [
    'Planifica Tu Vivienda',
    'Toastmasters Pachuca',
    tbd('[Despacho contable]', 'Por confirmar en la hoja de hechos'),
  ] as readonly Copy[],
  facts: [
    { icon: 'pin', text: 'Desde Pachuca para todo México' },
    { icon: 'receipt', text: 'Facturamos' },
    {
      icon: 'clock',
      text: tbd('Te respondemos en menos de 1 día hábil', 'Por confirmar en la hoja de hechos'),
    },
  ] as readonly { readonly icon: IconName; readonly text: Copy }[],
};

export const PROBLEMS: readonly {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}[] = [
  {
    icon: 'search',
    title: 'No te encuentran',
    text: 'Alguien busca lo que vendes y aparece tu competencia, o aparecen tus datos de hace años.',
  },
  {
    icon: 'chat',
    title: 'Todo es por WhatsApp, a mano',
    text: 'Contestas precios, horarios y pedidos uno por uno. Mientras, se te van clientes.',
  },
  {
    icon: 'grid',
    title: 'Tu operación vive en Excel',
    text: 'Inventario, citas o cotizaciones en hojas sueltas. Funciona, hasta que deja de funcionar.',
  },
];

export const STEPS: readonly { readonly title: string; readonly text: Copy }[] = [
  {
    title: 'Diagnóstico',
    text: ['Revisamos juntos tu resultado en una llamada de ', tbd('20 minutos'), ', sin costo.'],
  },
  {
    title: 'Propuesta',
    text: 'Te mandamos por escrito qué haremos, en cuánto tiempo y cuánto cuesta.',
  },
  {
    title: 'Construcción',
    text: 'Avanzamos por etapas y ves cada avance en tu portal de cliente.',
  },
  {
    title: 'Lanzamiento',
    text: 'Publicamos, te enseñamos a usarlo y, si quieres, lo mantenemos mes a mes.',
  },
];

/** Vista ilustrativa del portal. TODO(dato): reemplazar por la captura real del portal. */
export const PORTAL = {
  project: 'Proyecto: sitio del plan Para crecer',
  progress: 60,
  rows: [
    { label: 'Diagnóstico', status: 'Listo', tone: 'done' },
    { label: 'Propuesta', status: 'Aprobada', tone: 'done' },
    { label: 'Diseño', status: 'En revisión', tone: 'doing' },
    { label: 'Lanzamiento', status: 'Pendiente', tone: 'todo' },
  ] as const,
};

/** TODO(dato): fotos reales, nombres y roles del equipo. */
export const TEAM: readonly { readonly name: Copy; readonly role: Copy }[] = Array.from(
  { length: 3 },
  () => ({
    name: tbd('[Nombre]', 'Pendiente'),
    role: tbd('[Rol] · [Qué hace en tu proyecto]', 'Pendiente'),
  }),
);

export const FAQ: readonly { readonly question: string; readonly answer: Copy }[] = [
  { question: '¿El sitio y el dominio son míos?', answer: tbd('Sí, quedan a tu nombre.') },
  { question: '¿Facturan?', answer: 'Sí. Los precios son más IVA y te damos factura.' },
  {
    question: '¿Cuánto tarda?',
    answer: [
      'El plan Para empezar, ',
      tbd('unas 2 semanas'),
      ' desde que tenemos tu información. Lo hecho a la medida depende del alcance; el plazo va en la propuesta.',
    ],
  },
  {
    question: '¿Qué necesito para empezar?',
    answer:
      'Hacer el diagnóstico o escribirnos. Después te pedimos logo, fotos y datos básicos; si no los tienes, te ayudamos.',
  },
  {
    question: '¿Puedo pagar a meses?',
    answer: [
      'Los proyectos a la medida, sí. Para los otros planes, ',
      tbd('[esquema de pago por confirmar]'),
      '.',
    ],
  },
  { question: '¿Incluye dominio y hosting?', answer: tbd('[Por confirmar]') },
  {
    question: '¿Trabajan fuera de Pachuca?',
    answer:
      'Sí. Trabajamos con negocios de todo México por videollamada, y el avance lo ves en tu portal.',
  },
  {
    question: '¿Qué pasa después de entregar?',
    answer:
      'Te enseñamos a usar tu sitio. Si quieres que lo mantengamos y mejoremos, tenemos un servicio mensual que se cotiza según tu proyecto.',
  },
];

/** Opciones de "¿Qué necesitas?" en el formulario de contacto. */
export const NEEDS = [
  'Sitio web',
  'Tienda en línea',
  'Sistema a la medida',
  'Todavía no sé',
] as const;
