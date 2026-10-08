import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAccordionImports } from '@ui/accordion';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { FAQS } from '../data/content';

/** Objeciones frecuentes (doc 23 §4, Sec 9). La primera respuesta va abierta. */
@Component({
  selector: 'app-faq-section',
  imports: [HlmAccordionImports, Reveal, SectionHeading],
  template: `
    <section id="faq" class="py-12.5 sm:py-19.5" aria-labelledby="faq-title">
      <div class="wrap">
        <app-section-heading
          titleId="faq-title"
          eyebrow="Antes de escribirnos"
          title="Lo que la gente nos pregunta."
        />
        <div
          hlmAccordion
          type="multiple"
          class="glass mx-auto max-w-200 px-5 py-1 sm:px-7.5 sm:py-2"
          appReveal
        >
          @for (faq of faqs; track faq.question; let first = $first) {
            <div hlmAccordionItem [isOpened]="first" class="data-open:bg-transparent">
              <hlm-accordion-trigger [triggerClass]="triggerClass">
                {{ faq.question }}
                <span
                  class="flex-none font-mono text-4xl font-regular text-brand transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45"
                  aria-hidden="true"
                  >+</span
                >
              </hlm-accordion-trigger>
              <hlm-accordion-content class="px-0 text-base">
                <p class="pb-1.5 font-regular text-ink-2">{{ faq.answer }}</p>
              </hlm-accordion-content>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSection {
  protected readonly faqs = FAQS;
  protected readonly triggerClass =
    'items-center gap-5 rounded-md px-0 py-4.5 text-lg leading-body font-emphasis tracking-title hover:no-underline focus-visible:ring-3 focus-visible:ring-ring/50 sm:py-5.5 sm:text-2xl **:data-[slot=accordion-trigger-icon]:hidden';
}
