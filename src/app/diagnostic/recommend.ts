import type { PlanId } from '@app/content/plans';
import { AXES, type AxisKey, type FocusKey, type Score } from './axes';

/** Respuestas del diagnóstico, una por eje (1 a 4). */
export type Scores = Readonly<Record<AxisKey, Score>>;

export interface Recommendation {
  readonly plan: PlanId;
  readonly focus: FocusKey;
  /** "Después": el siguiente eje ≤ 2 sin contar el foco. */
  readonly next: AxisKey | null;
  /** "Lo que ya tienes bien": el eje más alto, si es ≥ 3. */
  readonly best: AxisKey | null;
}

/** Desempate: D, V, C, F, N, P. */
export const PRIORITY: readonly AxisKey[] = ['D', 'V', 'C', 'F', 'N', 'P'];

const rank = (key: AxisKey) => PRIORITY.indexOf(key);
const lowest = (s: Scores, keys: readonly AxisKey[]): AxisKey =>
  [...keys].sort((a, b) => s[a] - s[b] || rank(a) - rank(b))[0];
const weak = (s: Scores, keys: readonly AxisKey[]) => keys.some((k) => s[k] <= 2);

/**
 * Recomienda por el punto más débil, nunca por promedio.
 * 1. D ≤ 2 → Para empezar, foco D.
 * 2. Si no, alguno de V, C, F ≤ 2 → Para crecer, foco en el más bajo de ellos.
 * 3. Si no, alguno de N, P ≤ 2 → A la medida, foco en el más bajo de ellos.
 * 4. Si no → A la medida, foco "Automatizar y escalar".
 * Cambiar esta regla es cambiar el negocio: requiere aprobación.
 */
export const recommend = (s: Scores): Recommendation => {
  let plan: PlanId;
  let focus: FocusKey;
  if (s.D <= 2) {
    plan = 'empezar';
    focus = 'D';
  } else if (weak(s, ['V', 'C', 'F'])) {
    plan = 'crecer';
    focus = lowest(s, ['V', 'C', 'F']);
  } else if (weak(s, ['N', 'P'])) {
    plan = 'medida';
    focus = lowest(s, ['N', 'P']);
  } else {
    plan = 'medida';
    focus = 'AUTO';
  }
  const rest = PRIORITY.filter((k) => k !== focus && s[k] <= 2);
  const next = rest.length ? lowest(s, rest) : null;
  const top = [...PRIORITY].sort((a, b) => s[b] - s[a] || rank(a) - rank(b))[0];
  return { plan, focus, next, best: s[top] >= 3 ? top : null };
};

/** Convierte las respuestas en el orden de las preguntas (V, C, F, N, D, P) en puntajes por eje. */
export const toScores = (answers: readonly Score[]): Scores =>
  Object.fromEntries(AXES.map((axis, i) => [axis.key, answers[i]])) as Record<AxisKey, Score>;

/** Los 7 casos de la especificación: respuestas V · C · F · N · D · P → plan / foco. */
export const RECOMMEND_CASES: readonly {
  readonly answers: readonly [Score, Score, Score, Score, Score, Score];
  readonly plan: PlanId;
  readonly focus: FocusKey;
}[] = [
  { answers: [4, 4, 4, 4, 1, 4], plan: 'empezar', focus: 'D' },
  { answers: [1, 4, 4, 4, 4, 4], plan: 'crecer', focus: 'V' },
  { answers: [4, 1, 4, 4, 4, 4], plan: 'crecer', focus: 'C' },
  { answers: [4, 4, 1, 4, 4, 4], plan: 'crecer', focus: 'F' },
  { answers: [4, 4, 4, 1, 4, 4], plan: 'medida', focus: 'N' },
  { answers: [4, 4, 4, 4, 4, 1], plan: 'medida', focus: 'P' },
  { answers: [4, 4, 4, 4, 4, 4], plan: 'medida', focus: 'AUTO' },
];
