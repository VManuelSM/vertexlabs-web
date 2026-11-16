import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Opción de respuesta del diagnóstico: botón con punto. Elegida, se invierte a azul marino con el
 * punto en rosa. `aria-pressed` comunica la selección.
 */
@Component({
  selector: 'button[appAnswerOption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    class:
      'group flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-md border border-input bg-white px-4 py-3 text-start text-base leading-snug text-navy transition hover:border-navy active:scale-98 aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white',
    '[attr.aria-pressed]': 'pressed()',
  },
  template: `
    <span
      aria-hidden="true"
      class="size-5 shrink-0 rounded-pill border-2 border-current transition-colors group-aria-pressed:border-pink group-aria-pressed:bg-pink"
    ></span>
    <span><ng-content /></span>
  `,
})
export class AnswerOption {
  readonly pressed = input(false, { transform: booleanAttribute });
}
