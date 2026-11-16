import { NgOptimizedImage } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Captura real de un proyecto en un marco de celular (átomo "Imagen"). Las capturas miden
 * 492 × 668; el texto alternativo describe lo que se ve.
 */
@Component({
  selector: 'app-phone-frame',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden rounded-lg border-6 border-navy bg-navy shadow-md',
  },
  template: `
    <img
      class="block h-auto w-full rounded-md"
      [ngSrc]="src()"
      width="492"
      height="668"
      [alt]="alt()"
      [priority]="priority()"
    />
  `,
})
export class PhoneFrame {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly priority = input(false, { transform: booleanAttribute });
}
