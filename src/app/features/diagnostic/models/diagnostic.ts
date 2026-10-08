import type { PackageId } from '../../packages/models/web-package';

/** Pregunta 1: ¿qué quieres lograr? */
export type Goal = 'be-found' | 'sell-online' | 'organize';

/** Pregunta 2: ¿ya tienes página web? */
export type WebsiteStatus = 'none' | 'underperforming' | 'improve';

export interface DiagnosticAnswers {
  readonly goal: Goal | null;
  readonly website: WebsiteStatus | null;
  /** Pregunta 3 (opcional): qué vende el negocio. */
  readonly business: string;
}

export type RecommendationId = PackageId | 'custom';

export interface Recommendation {
  readonly id: RecommendationId;
  readonly name: string;
  readonly price: string;
  readonly reason: string;
}

export interface Choice<T> {
  readonly value: T;
  readonly icon: string;
  readonly label: string;
  readonly hint: string;
  /** Cómo se lee la respuesta dentro del mensaje de WhatsApp. */
  readonly phrase: string;
}

export const GOAL_CHOICES: readonly Choice<Goal>[] = [
  {
    value: 'be-found',
    icon: '🔍',
    label: 'Que me encuentren',
    hint: 'Aparecer cuando me buscan en Google y redes.',
    phrase: 'que me encuentren',
  },
  {
    value: 'sell-online',
    icon: '🛒',
    label: 'Vender en línea',
    hint: 'Cobrar y despachar pedidos por internet.',
    phrase: 'vender en línea',
  },
  {
    value: 'organize',
    icon: '⚙️',
    label: 'Ordenar mi operación',
    hint: 'Un sistema, no solo una página.',
    phrase: 'ordenar mi operación',
  },
];

export const WEBSITE_CHOICES: readonly Choice<WebsiteStatus>[] = [
  {
    value: 'none',
    icon: '✳️',
    label: 'No tengo',
    hint: 'Empiezo desde cero.',
    phrase: 'no tengo web',
  },
  {
    value: 'underperforming',
    icon: '🩹',
    label: 'Sí, pero no funciona',
    hint: 'La tengo pero no me trae clientes.',
    phrase: 'tengo web pero no funciona',
  },
  {
    value: 'improve',
    icon: '📈',
    label: 'Quiero mejorarla',
    hint: 'Funciona, pero puede dar más.',
    phrase: 'quiero mejorar mi web',
  },
];

/** Límite de la respuesta libre: el mensaje de WhatsApp debe seguir siendo corto. */
export const BUSINESS_MAX_LENGTH = 120;
