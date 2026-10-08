/*
 * Copy de la landing (doc 23 §4). Textos sujetos a validación con Alex: se editan aquí, no en
 * las plantillas. Tono: tuteo, claro y sin humo (doc 23 §5.1).
 */

export interface Metric {
  readonly value: string;
  readonly label: string;
}

export interface NumberedItem {
  readonly title: string;
  readonly body: string;
  /** Palabra del cuerpo que se resalta con el color de acento. */
  readonly emphasis?: string;
}

export interface ProcessStep {
  readonly title: string;
  readonly duration: string;
  readonly body: string;
  readonly outcome: string;
}

export interface TeamMember {
  readonly initial: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
}

export interface Faq {
  readonly question: string;
  readonly answer: string;
}

export const TRUST_SEALS = ['En todo México', 'Precio cerrado', 'Te acompañamos después'] as const;

export const METRICS: readonly Metric[] = [
  { value: '2', label: 'productos propios en producción' },
  { value: '100%', label: 'remoto, en todo México' },
  { value: '$0', label: 'cuesta la primera plática' },
  { value: '1', label: 'precio cerrado, sin sorpresas' },
];

export const PROBLEMS: readonly NumberedItem[] = [
  {
    title: '"No me encuentran"',
    body: 'No tienes página, o la que tienes no te trae ni un cliente. Estás invisible justo donde te buscan.',
  },
  {
    title: '"Ya me quedaron mal"',
    body: 'Pagaste por adelantado, entregaron tarde —o nunca— y luego desaparecieron. No quieres repetirlo.',
  },
  {
    title: '"No sé qué pedir ni qué cuesta"',
    body: 'Cotizaciones que no entiendes y precios de $3,000 a $50,000. Nadie te ha hablado claro.',
  },
];

export const DIFFERENTIATORS: readonly NumberedItem[] = [
  {
    title: 'Primero entendemos, luego cotizamos',
    body: 'Antes de cobrarte, vemos qué necesitas de verdad. Si te sirve algo más barato, te lo decimos.',
  },
  {
    title: 'Que funcione y que se vea bien',
    body: 'Un ingeniero de software y una diseñadora, en el mismo equipo. Tu página trabaja y además se ve profesional.',
    emphasis: 'trabaja',
  },
  {
    title: 'Hablas directo con nosotros',
    body: 'Sin intermediarios ni "ejecutivos de cuenta". Quien te atiende es quien construye tu proyecto.',
  },
  {
    title: 'Tenemos nuestro propio producto',
    body: 'Operamos Kindu, nuestra app con usuarios reales. Sabemos hacer software que aguanta el día a día.',
  },
  {
    title: 'No desaparecemos',
    body: 'Con el plan de mantenimiento, tu página sigue viva, actualizada y respaldada. No queda abandonada.',
  },
  {
    title: 'Un solo precio, cerrado',
    body: 'Sabes cuánto y cuándo desde el principio. Si algo cambia, lo acordamos por escrito antes de hacerlo.',
  },
];

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    title: 'Nos cuentas qué necesitas',
    duration: '~15 min · gratis',
    body: 'Platicamos por WhatsApp o llamada (o usas el diagnóstico de arriba). Queremos entender tu negocio antes de hablar de dinero.',
    outcome: 'claridad sobre qué te conviene —aunque no nos contrates.',
  },
  {
    title: 'Revisamos y te decimos la verdad',
    duration: '1–2 días',
    body: 'Analizamos qué se puede hacer de verdad en tiempo y presupuesto. Si algo no conviene, te lo decimos —y buscamos una mejor opción.',
    outcome: 'el paquete recomendado y qué incluye, con letra clara.',
  },
  {
    title: 'Te pasamos un precio cerrado',
    duration: 'mismo día',
    body: 'Un solo precio, con fecha de entrega. Firmas, das un anticipo y arrancamos. Nada de cobros por hora ni sorpresas.',
    outcome: 'propuesta y contrato claros, con todo por escrito.',
  },
  {
    title: 'Lo construimos y te vamos mostrando',
    duration: '1–4 semanas',
    body: 'Trabajamos por etapas y te enseñamos avances. Tú revisas y opinas; no esperas a ciegas hasta el final.',
    outcome: 'avances que puedes ver y comentar en el camino.',
  },
  {
    title: 'Entregamos y seguimos contigo',
    duration: 'soporte incluido',
    body: 'Publicamos tu sitio, te enseñamos a usarlo y te damos soporte. Con el plan de mantenimiento, tu página sigue viva y respaldada.',
    outcome: 'tu sitio funcionando y a alguien que responde después.',
  },
];

export const TEAM: readonly TeamMember[] = [
  {
    initial: 'V',
    name: 'Victor',
    role: 'Ingeniería de Software · Maestría en IA',
    bio: 'Responsable de que lo prometido sea técnicamente posible —y de construirlo. Arquitectura, desarrollo e infraestructura.',
  },
  {
    initial: 'A',
    name: 'Alex',
    role: 'Experiencia de Usuario · Maestría en Innovación',
    bio: 'Responsable de entender tu negocio y de que la solución sea la correcta. Diseño UX, relación con el cliente y estrategia.',
  },
];

export const FAQS: readonly Faq[] = [
  {
    question: '¿Por qué cuestan más que otros?',
    answer:
      'Porque no es lo mismo. Antes de cobrarte revisamos tu caso, trabajan un ingeniero y una diseñadora juntos, hablas directo con nosotros, y tu página no queda abandonada. Una web barata que nadie mantiene sale más cara a la larga.',
  },
  {
    question: '¿Cuánto cuesta y cuánto tarda?',
    answer:
      'Cada paquete trae su precio y su tiempo estimado aquí mismo. Tras una plática corta te confirmamos el alcance y una fecha real. Un solo precio, cerrado desde el inicio.',
  },
  {
    question: '¿Y después de que entregan?',
    answer:
      'Te damos soporte incluido al entregar. Después, con el plan de mantenimiento ($350–900/mes) nos encargamos del hosting, los respaldos, los cambios chicos y el monitoreo. Si quieres funciones nuevas, se cotizan aparte.',
  },
  {
    question: '¿La página es mía?',
    answer:
      'Te lo dejamos claro desde el contrato. Podemos operarla nosotros o pasártela a tu nombre —lo acordamos por escrito desde el principio, sin sorpresas.',
  },
  {
    question: '¿Trabajan fuera de Hidalgo?',
    answer:
      'Sí. Trabajamos en línea con todo México. Estamos en Pachuca, pero atendemos proyectos en cualquier estado.',
  },
  {
    question: '¿Necesito saber de tecnología?',
    answer:
      'Para nada. Todo está pensado para dueños de negocio, no para ingenieros. Te explicamos las cosas en palabras que sí se entienden.',
  },
];
