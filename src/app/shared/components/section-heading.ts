import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Reveal } from '@shared/lib/reveal';

/** Encabezado centrado de sección: etiqueta, título y bajada opcional. */
@Component({
  selector: 'app-section-heading',
  imports: [Reveal],
  host: { class: 'block' },
  template: `
    <div class="mx-auto mb-7.5 max-w-155 text-center sm:mb-11" appReveal>
      <p class="eyebrow text-lg text-ink-2 sm:text-2xl">{{ eyebrow() }}</p>
      <h2 [id]="titleId()" class="mt-3.5 mb-3 text-section-compact sm:text-section">
        {{ title() }}
      </h2>
      @if (lead(); as lead) {
        <p class="text-lg text-ink-2 sm:text-2xl">{{ lead }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  /** Id del h2, para que la sección lo use en aria-labelledby. */
  readonly titleId = input<string>();
}
