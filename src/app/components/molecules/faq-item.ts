import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
        class="flex min-h-tap w-full cursor-pointer items-center justify-between gap-4 py-4 text-start font-bold transition-colors hover:text-plum"
      >
        <span>{{ question() }}</span>
        <span
          aria-hidden="true"
          class="w-6 shrink-0 text-center text-h3 leading-none font-normal text-plum"
          >{{ item.state() === 'open' ? '–' : '+' }}</span
        >
      </button>
    </h3>
    <div brnAccordionContent [class.hidden]="item.state() === 'closed'">
      <p class="max-w-copy pb-6 text-muted-foreground"><app-copy [value]="answer()" /></p>
    </div>
  `,
})
export class FaqItem {
  readonly question = input.required<string>();
  readonly answer = input.required<Copy>();
  protected readonly item = inject(BrnAccordionItem);
}
