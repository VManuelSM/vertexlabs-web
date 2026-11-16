import type { Score } from './axes';
import { RECOMMEND_CASES, recommend, toScores } from './recommend';

const scores = (...answers: Score[]) => toScores(answers);

describe('recommend()', () => {
  describe('los 7 casos de la especificación', () => {
    for (const c of RECOMMEND_CASES) {
      it(`${c.answers.join(' · ')} → ${c.plan} / ${c.focus}`, () => {
        const r = recommend(toScores(c.answers));
        expect(r.plan).toBe(c.plan);
        expect(r.focus).toBe(c.focus);
      });
    }
  });

  it('recomienda por el punto más débil, no por promedio', () => {
    // Promedio alto (3.5), pero lo digital está en 2: Para empezar.
    expect(recommend(scores(4, 4, 4, 4, 2, 3)).plan).toBe('empezar');
  });

  it('lo digital manda aunque otro eje esté más bajo', () => {
    expect(recommend(scores(1, 1, 1, 1, 2, 1))).toMatchObject({ plan: 'empezar', focus: 'D' });
  });

  it('rompe empates con la prioridad D, V, C, F, N, P', () => {
    expect(recommend(scores(4, 2, 2, 4, 4, 4)).focus).toBe('C');
    expect(recommend(scores(2, 4, 2, 4, 4, 4)).focus).toBe('V');
    expect(recommend(scores(4, 4, 4, 2, 4, 2)).focus).toBe('N');
  });

  it('elige el más bajo dentro del grupo, antes que la prioridad', () => {
    expect(recommend(scores(2, 4, 1, 4, 4, 4)).focus).toBe('F');
    expect(recommend(scores(4, 4, 4, 2, 4, 1)).focus).toBe('P');
  });

  it('"Después" es el siguiente eje ≤ 2 sin contar el foco', () => {
    expect(recommend(scores(4, 4, 4, 2, 1, 4)).next).toBe('N');
    expect(recommend(scores(2, 1, 4, 4, 4, 2)).next).toBe('V');
    expect(recommend(scores(4, 4, 4, 4, 1, 4)).next).toBeNull();
  });

  it('"Lo que ya tienes bien" es el eje más alto si es ≥ 3', () => {
    expect(recommend(scores(3, 4, 2, 2, 1, 1)).best).toBe('C');
    expect(recommend(scores(4, 4, 4, 4, 4, 4)).best).toBe('D');
    expect(recommend(scores(2, 2, 1, 2, 1, 2)).best).toBeNull();
  });
});
