import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { type CaseStudy } from '@app/content/cases';
import { BrandGradient } from '../atoms/brand-gradient';
import { CopyText } from '../atoms/copy';
import { LinkArrow } from '../atoms/link-arrow';
import { PhoneFrame } from '../atoms/phone-frame';
import { Heading3 } from '../atoms/text';
import { Testimonial } from './testimonial';

/** Ficha de caso: captura real sobre el degradado de marca, datos del proyecto, cita y enlace. */
@Component({
  selector: 'article[appCaseCard]',
  imports: [BrandGradient, CopyText, Heading3, LinkArrow, PhoneFrame, Testimonial],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-white',
  },
  template: `
    @let study = case();
    @if (study.image; as image) {
      <div class="relative isolate h-56 overflow-hidden">
        <app-brand-gradient />
        <app-phone-frame
          class="absolute start-1/2 top-6 w-1/2 -translate-x-1/2"
          [src]="image.src"
          [alt]="image.alt"
        />
      </div>
    } @else {
      <div
        class="grid h-56 place-items-center border-b-2 border-dashed border-input bg-surface p-4 text-center text-sm font-semibold text-muted-foreground"
      >
        <p>Captura del proyecto<br />por agregar</p>
      </div>
    }
    <div class="grid flex-1 content-start gap-4 p-6">
      <p class="text-xs font-bold tracking-eyebrow text-plum uppercase">{{ study.tag }}</p>
      <h3 appH3><app-copy [value]="study.name" /></h3>
      <dl class="grid gap-3">
        <div>
          <dt class="text-xs font-bold text-muted-foreground">El reto</dt>
          <dd class="text-base leading-snug"><app-copy [value]="study.challenge" /></dd>
        </div>
        <div>
          <dt class="text-xs font-bold text-muted-foreground">Lo que hicimos</dt>
          <dd class="text-base leading-snug"><app-copy [value]="study.done" /></dd>
        </div>
        <div>
          <dt class="text-xs font-bold text-muted-foreground">Resultado</dt>
          <dd class="text-base leading-snug"><app-copy [value]="study.result" /></dd>
        </div>
      </dl>
      <blockquote appTestimonial [quote]="study.quote" [author]="study.author"></blockquote>
      @if (study.url) {
        <a
          appLinkArrow
          icon="external"
          class="mt-auto justify-self-start"
          [href]="study.url"
          target="_blank"
          rel="noopener"
          >Ver el sitio</a
        >
      }
    </div>
  `,
})
export class CaseCard {
  readonly case = input.required<CaseStudy>();
}
