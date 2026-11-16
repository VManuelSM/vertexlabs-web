import { Directive } from '@angular/core';

/*
 * Átomos de texto del manual. Se aplican sobre la etiqueta semántica que toque (h1, h2, p…), así la
 * jerarquía de títulos la decide la página y el aspecto lo decide el átomo.
 */

/** Etiqueta de sección con el remate "__" del manual ("Planes y precios __"). */
@Directive({
  selector: '[appEyebrow]',
  host: {
    class:
      'block text-xs font-bold tracking-eyebrow text-plum uppercase after:tracking-normal after:content-(--eyebrow-mark) on-dark:text-sand',
  },
})
export class Eyebrow {}

/** Título del hero: Good Timing, el único lugar del sitio (además del logo) donde va. */
@Directive({
  selector: '[appH1]',
  host: { class: 'font-brand text-h1 font-bold text-balance' },
})
export class Heading1 {}

@Directive({
  selector: '[appH2]',
  host: { class: 'max-w-heading text-h2 font-bold text-balance' },
})
export class Heading2 {}

@Directive({
  selector: '[appH3]',
  host: { class: 'text-h3 font-bold text-balance' },
})
export class Heading3 {}

/** Subtítulo de sección. */
@Directive({
  selector: '[appLead]',
  host: { class: 'max-w-lead text-lg text-muted-foreground on-dark:text-sand on-sand:text-navy' },
})
export class Lead {}

/** Nota de 15 px. */
@Directive({
  selector: '[appNote]',
  host: { class: 'text-sm text-muted-foreground on-dark:text-sand on-sand:text-navy' },
})
export class Note {}

export const TextImports = [Eyebrow, Heading1, Heading2, Heading3, Lead, Note] as const;
