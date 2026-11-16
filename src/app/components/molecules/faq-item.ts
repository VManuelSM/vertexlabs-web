import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import {
  BrnAccordionContent,
  BrnAccordionHeader,
  BrnAccordionItem,
  BrnAccordionTrigger,
} from '@spartan-ng/brain/accordion';
import { type Copy } from '@app/content/copy';
import { CopyText } from '../atoms/copy';

/**
 * Pregunta frecuente: pregunta + respuesta en acordeón. Usa el brain de Spartan (teclado,
 * `aria-expanded`, región enlazada) y va dentro de un contenedor con `brnAccordion`. La respuesta
 * sale en el HTML prerenderizado aunque esté cerrada; se oculta sin animar la altura.
 */
@Component({
  selector: 'app-faq-item',
  imports: [BrnAccordionHeader, BrnAccordionTrigger, BrnAccordionContent, CopyText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnAccordionItem, inputs: ['isOpened'] }],
  host: { class: 'block border-b border-border' },
  template: `
    <h3 brnAccordionHeader class="text-base">
      <button
        brnAccordionTrigger
        type="button"
        class="group/faq flex min-h-tap w-full cursor-pointer items-center justify-between gap-4 py-4 text-start font-bold transition-colors hover:text-plum"
        (click)="touched.set(true)"
      >
        <span>{{ question() }}</span>
        <!-- "+" que gira a "–": la barra vertical rota y se encima en la horizontal. -->
        <span aria-hidden="true" class="relative grid size-6 shrink-0 place-items-center text-plum">
          <span class="absolute h-0.5 w-4 rounded-pill bg-current"></span>
          <span
            class="absolute h-4 w-0.5 rounded-pill bg-current transition-transform duration-(--motion-base)"
            [class.rotate-90]="item.state() === 'open'"
          ></span>
        </span>
      </button>
    </h3>
    <div brnAccordionContent [class.hidden]="item.state() === 'closed'">
      <p class="max-w-copy pb-6 text-muted-foreground" [class.animate-enter]="touched()">
        <app-copy [value]="answer()" />
      </p>
    </div>
  `,
})
export class FaqItem {
  readonly question = input.required<string>();
  readonly answer = input.required<Copy>();
  protected readonly item = inject(BrnAccordionItem);
  /** La respuesta entra con movimiento solo cuando la persona la abre (no al cargar). */
  protected readonly touched = signal(false);
}
