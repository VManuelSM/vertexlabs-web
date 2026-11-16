/*
 * Ejes del diagnóstico (Radar). Son estos 6 y solo estos; cada respuesta vale de 1 a 4.
 * Textos tal cual del prototipo v1. Cambiarlos es cambiar el negocio: requiere aprobación.
 */

export type AxisKey = 'V' | 'C' | 'F' | 'N' | 'D' | 'P';
export type FocusKey = AxisKey | 'AUTO';
export type Score = 1 | 2 | 3 | 4;

export interface Axis {
  readonly key: AxisKey;
  /** Nombre del eje ("Por qué te compran"). */
  readonly name: string;
  /** Etiqueta corta para el radar ("Tu gancho"). */
  readonly short: string;
  readonly question: string;
  /** Cuatro opciones, de la que vale 1 a la que vale 4. */
  readonly options: readonly [string, string, string, string];
}

/** En el orden de las preguntas y de los vértices del radar. */
export const AXES: readonly Axis[] = [
  {
    key: 'V',
    name: 'Por qué te compran',
    short: 'Tu gancho',
    question: '¿Sabes explicar en una frase por qué te compran a ti?',
    options: [
      'No sabría cómo decirlo',
      'Tengo una idea, pero no la tengo clara',
      'La sé, pero no la comunico igual en todos lados',
      'Sí, y se nota en todo mi negocio',
    ],
  },
  {
    key: 'C',
    name: 'Tu cliente ideal',
    short: 'Tu cliente',
    question: '¿Qué tan bien conoces a tu cliente ideal?',
    options: [
      'No lo tengo definido',
      'Me lo imagino, pero no lo confirmo',
      'Lo conozco por experiencia',
      'Lo tengo definido y registro quién me compra',
    ],
  },
  {
    key: 'F',
    name: 'Lo que te hace diferente',
    short: 'Diferencia',
    question: '¿Tus clientes ven claro por qué elegirte a ti y no a otro?',
    options: [
      'Me veo igual que mi competencia',
      'Soy distinto, pero no lo demuestro',
      'Lo digo en redes o en el local',
      'Se nota en mi marca y en todo lo que hago',
    ],
  },
  {
    key: 'N',
    name: 'De dónde entra el dinero',
    short: 'Ingresos',
    question: '¿De cuántas formas le entra dinero a tu negocio?',
    options: [
      'De un solo canal, y es frágil',
      'Casi todo viene de un canal',
      'De un par de canales',
      'De varias líneas de ingreso sólidas',
    ],
  },
  {
    key: 'D',
    name: 'Qué tan digital eres',
    short: 'Digital',
    question: '¿Qué tan presente y digital es tu operación hoy?',
    options: [
      'No existo en línea y opero a mano',
      'Solo tengo redes sociales',
      'Tengo algo en línea, pero desactualizado',
      'Tengo presencia y herramientas al día',
    ],
  },
  {
    key: 'P',
    name: 'Precios y control',
    short: 'Precios',
    question: '¿Qué tan claro tienes tus precios y el control del dinero?',
    options: [
      'No sé bien cómo cobrar ni llevo control',
      'Cobro de memoria, sin control',
      'Tengo precios, pero el control es básico',
      'Tengo precios claros y control al día',
    ],
  },
];

export interface Focus {
  readonly name: string;
  /** Qué está pasando, en una frase. */
  readonly line: string;
  /** Lo primero que haríamos: acompañamiento + lo digital. */
  readonly actions: readonly [string, string];
}

export const FOCUS: Readonly<Record<FocusKey, Focus>> = {
  V: {
    name: 'Por qué te compran',
    line: 'No queda claro por qué comprarte a ti.',
    actions: [
      'una sesión corta contigo para definir por qué te compran',
      'un mensaje y una página que lo digan con claridad',
    ],
  },
  C: {
    name: 'Tu cliente ideal',
    line: 'No tienes claro quién es tu cliente ni cómo llega.',
    actions: [
      'definir a tu cliente ideal contigo',
      'captura de prospectos y medición para saber de dónde vienen',
    ],
  },
  F: {
    name: 'Lo que te hace diferente',
    line: 'Te ves igual que tu competencia.',
    actions: [
      'definir contigo lo que te hace diferente',
      'identidad visual y un sitio que te haga ver distinto',
    ],
  },
  N: {
    name: 'De dónde entra el dinero',
    line: 'Dependes de un solo canal o de un ingreso frágil.',
    actions: [
      'revisar contigo de dónde entra el dinero y abrir una nueva línea (tienda, membresía o cotizador)',
      'construir el canal digital que la sostenga',
    ],
  },
  D: {
    name: 'Qué tan digital eres',
    line: 'Casi no existes en línea y operas a mano.',
    actions: [
      'una presencia web clara con tus servicios, precios y WhatsApp',
      'tu ficha de Google y automatizar lo que haces a mano',
    ],
  },
  P: {
    name: 'Precios y control',
    line: 'No tienes control claro de cobros y precios.',
    actions: [
      'una estrategia de precios y rentabilidad contigo',
      'un cotizador o panel para cobrar y controlar',
    ],
  },
  AUTO: {
    name: 'Automatizar y escalar',
    line: 'Tu base está sólida; el siguiente salto es escalar y ahorrar tiempo.',
    actions: [
      'automatizar tareas y aplicar inteligencia artificial a tu operación',
      'conectar tus sistemas',
    ],
  },
};
