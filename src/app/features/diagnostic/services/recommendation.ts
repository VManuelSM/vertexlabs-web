import { findPackage } from '../../packages/data/catalog';
import { formatPrice } from '../../packages/models/web-package';
import {
  type DiagnosticAnswers,
  GOAL_CHOICES,
  type Recommendation,
  type RecommendationId,
  WEBSITE_CHOICES,
} from '../models/diagnostic';

const REASONS: Record<Exclude<RecommendationId, 'landing' | 'catalog' | 'maintenance'>, string> = {
  custom:
    'Lo que describes es más que una página: es un sistema. Te conviene una evaluación a la medida antes de cotizar —justo lo que mejor hacemos.',
  ecommerce:
    'Quieres cobrar en línea, así que necesitas carrito y pasarela de pago. El E-commerce es tu punto de partida; si aún no cobras en línea, el Sitio + catálogo es una versión más ligera.',
  presence:
    'Empiezas desde cero y lo urgente es existir en línea. Presencia PyME te pone visible rápido y barato; desde ahí puedes escalar cuando el negocio lo pida.',
  site: 'Ya tienes página pero no rinde. Un Sitio PyME completo, con SEO y diseño UX, convierte esa presencia en algo que sí te trae clientes.',
};

/**
 * Regla del diagnóstico (doc 23 §3.2): recomienda el punto de partida correcto, no el paquete
 * más caro. El objetivo manda sobre el estado de la página actual.
 */
export function recommend({
  goal,
  website,
}: Pick<DiagnosticAnswers, 'goal' | 'website'>): Recommendation {
  const id =
    goal === 'organize'
      ? 'custom'
      : goal === 'sell-online'
        ? 'ecommerce'
        : website === 'none'
          ? 'presence'
          : 'site';

  if (id === 'custom') {
    return {
      id,
      name: 'Proyecto a la medida',
      price: 'cotización tras evaluación',
      reason: REASONS.custom,
    };
  }
  const pkg = findPackage(id);
  return { id, name: pkg.name, price: `${formatPrice(pkg.price)} MXN`, reason: REASONS[id] };
}

/** Mensaje precargado: el lead llega pre-calificado y atribuido al diagnóstico (doc 23 §6.4). */
export function diagnosticMessage(
  answers: DiagnosticAnswers,
  recommendation: Recommendation,
): string {
  const goal = GOAL_CHOICES.find((c) => c.value === answers.goal)?.phrase ?? '—';
  const website = WEBSITE_CHOICES.find((c) => c.value === answers.website)?.phrase ?? '—';
  const business = answers.business.trim();
  return [
    `Hola, vengo del diagnóstico del sitio de VertexLabs. Quiero ${goal}, ${website}.`,
    business ? `Mi negocio: ${business}.` : '',
    `Me recomendaron el paquete ${recommendation.name}. ¿Podemos platicar?`,
  ]
    .filter(Boolean)
    .join(' ');
}
