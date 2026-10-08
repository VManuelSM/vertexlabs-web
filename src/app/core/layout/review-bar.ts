import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Franja de revisión interna (solo con SiteConfig.reviewMode). */
@Component({
  selector: 'app-review-bar',
  host: {
    class:
      'block border-b border-line bg-glass px-3 py-2 text-center font-mono text-2xs text-ink-2 backdrop-blur-chip sm:px-4 sm:py-2.25 sm:text-xs sm:tracking-mono',
    role: 'note',
  },
  template: `
    MOCKUP v0.2 · <b class="font-semibold text-brand">liquid glass</b> · propuesta interna para
    revisión con Victor · precios y marca sujetos a validación · no es el sitio final
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewBar {}
