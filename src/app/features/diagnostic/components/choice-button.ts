import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Choice } from '../models/diagnostic';

/** Opción de respuesta del diagnóstico: tarjeta pulsable con estado seleccionado accesible. */
@Component({
  selector: 'button[appChoice]',
  host: {
    type: 'button',
    class:
      'flex flex-col gap-1.75 rounded-lg border border-glass-border bg-glass-strong p-4.5 text-left text-base text-ink shadow-inset transition duration-150 hover:-translate-y-0.75 hover:border-brand aria-pressed:border-brand aria-pressed:ring-3 aria-pressed:ring-brand/20',
    '[attr.aria-pressed]': 'selected()',
  },
  template: `
    <span class="text-4xl leading-none" aria-hidden="true">{{ choice().icon }}</span>
    {{ choice().label }}
    <small class="text-sm leading-compact text-ink-3">{{ choice().hint }}</small>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceButton {
  readonly choice = input.required<Choice<string>>({ alias: 'appChoice' });
  readonly selected = input(false);
}
