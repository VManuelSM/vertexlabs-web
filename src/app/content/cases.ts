import { type Copy, tbd } from './copy';

/** Ficha de un caso real. Lo pendiente llega marcado; los testimonios solo con permiso por escrito. */
export interface CaseStudy {
  readonly id: string;
  readonly tag: string;
  readonly name: Copy;
  readonly challenge: Copy;
  readonly done: Copy;
  readonly result: Copy;
  readonly quote: Copy;
  readonly author: Copy;
  readonly url?: string;
  readonly image?: { readonly src: string; readonly alt: string };
}

const PENDING_RESULT = tbd('[Dato con número]', 'Pendiente: dato con número');
const PENDING_QUOTE = tbd('[Cita del cliente]', 'Pendiente');
const PENDING_AUTHOR = tbd('[Nombre, cargo]', 'Pendiente');

export const CASES: readonly CaseStudy[] = [
  {
    id: 'planifica',
    tag: 'Diseño de vivienda en línea',
    name: 'Planifica Tu Vivienda',
    challenge: tbd('Vender planos y cotizaciones a todo el país sin visitas presenciales.'),
    done: 'Un sitio donde el cliente arma su proyecto en cuatro pasos y recibe su paquete arquitectónico.',
    result: PENDING_RESULT,
    quote: PENDING_QUOTE,
    author: PENDING_AUTHOR,
    url: 'https://planificatuvivienda.com/',
    image: {
      src: '/images/planifica-tu-vivienda.jpg',
      alt: 'Portada del sitio de Planifica Tu Vivienda en celular.',
    },
  },
  {
    id: 'toastmasters',
    tag: 'Club de oratoria',
    name: 'Toastmasters Pachuca',
    challenge: tbd('Recibir visitantes nuevos y organizar a sus miembros.'),
    done: 'Un sitio con registro de visitantes y área de miembros, conectado a su programa de formación.',
    result: PENDING_RESULT,
    quote: PENDING_QUOTE,
    author: PENDING_AUTHOR,
    url: 'https://toastmasters-pachuca.web.app/',
    image: {
      src: '/images/toastmasters-pachuca.jpg',
      alt: 'Portada del sitio de Toastmasters Pachuca en celular.',
    },
  },
  {
    // TODO(dato): nombre real del despacho, reto, lo que hicimos, captura y permiso para mostrarlo.
    id: 'despacho',
    tag: 'Contabilidad',
    name: tbd('[Despacho contable]'),
    challenge: tbd('[Pendiente]', 'Pendiente'),
    done: tbd('[Pendiente]', 'Pendiente'),
    result: PENDING_RESULT,
    quote: PENDING_QUOTE,
    author: PENDING_AUTHOR,
  },
];
