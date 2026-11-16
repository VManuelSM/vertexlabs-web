import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ISOTYPE, LOGO_VIEWBOX, WORDMARK } from './logo-paths';

/**
 * Logo horizontal o solo isotipo. Decorativo: el enlace o el texto que lo rodea lo nombra. El color
 * sale de `currentColor` (tabla de usos cromáticos del manual: azul marino sobre claro, blanco sobre
 * oscuro).
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex', 'aria-hidden': 'true' },
  template: `
    <svg
      class="block h-full w-auto"
      [attr.viewBox]="viewBox()"
      fill="currentColor"
      focusable="false"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Logo {
  readonly variant = input<'horizontal' | 'isotype'>('horizontal');

  protected readonly paths = computed(() =>
    this.variant() === 'isotype' ? ISOTYPE : [...WORDMARK, ...ISOTYPE],
  );
  protected readonly viewBox = computed(() => LOGO_VIEWBOX[this.variant()]);
}
