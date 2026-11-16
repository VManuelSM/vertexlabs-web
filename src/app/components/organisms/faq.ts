import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { FAQ } from '@app/content/home';
import { WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { SectionHead, Wrap } from '../atoms/layout';
import { LinkArrow } from '../atoms/link-arrow';
import { TextImports } from '../atoms/text';
import { FaqItem } from '../molecules/faq-item';

/** Preguntas frecuentes en acordeón (varias abiertas a la vez). */
@Component({
  selector: 'app-faq',
  imports: [BrnAccordion, FaqItem, LinkArrow, SectionHead, TextImports, WhatsappLink, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="preguntas" aria-labelledby="preguntas-title" class="py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>Preguntas</p>
          <h2 appH2 id="preguntas-title">Preguntas frecuentes</h2>
        </header>
        <div brnAccordion type="multiple" class="max-w-head border-t border-border">
          @for (item of faq; track item.question) {
            <app-faq-item [question]="item.question" [answer]="item.answer" />
          }
        </div>
        <p class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span>¿Tienes otra pregunta?</span>
          <a appLinkArrow [appWhatsapp]="messages.team" location="preguntas"
            >Pregúntanos por WhatsApp</a
          >
        </p>
      </div>
    </section>
  `,
})
export class Faq {
  protected readonly faq = FAQ;
  protected readonly messages = WHATSAPP_MESSAGES;
}
