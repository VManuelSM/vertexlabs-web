import { hlm } from './hlm';

describe('hlm (tailwind-merge con el vocabulario del manual)', () => {
  it('no confunde los tamaños del manual con colores', () => {
    expect(hlm('text-primary-foreground text-btn')).toBe('text-primary-foreground text-btn');
    expect(hlm('text-navy text-h2')).toBe('text-navy text-h2');
  });

  it('resuelve conflictos entre tamaños del manual', () => {
    expect(hlm('text-base text-btn')).toBe('text-btn');
    expect(hlm('rounded-sm rounded-pill')).toBe('rounded-pill');
    expect(hlm('min-h-tap min-h-14')).toBe('min-h-14');
  });
});
