import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { DIFFERENTIATORS, type NumberedItem } from '../data/content';

interface Differentiator extends NumberedItem {
  /** Cuerpo partido alrededor de la palabra resaltada: [antes, resaltado, después]. */
  readonly parts: readonly [string, string, string] | null;
}

const withParts = (item: NumberedItem): Differentiator => {
  const at = item.emphasis ? item.body.indexOf(item.emphasis) : -1;
  if (!item.emphasis || at < 0) return { ...item, parts: null };
  const end = at + item.emphasis.length;
  return { ...item, parts: [item.body.slice(0, at), item.emphasis, item.body.slice(end)] };
};

@Component({
  selector: 'app-why-us-section',
  imports: [DecimalPipe, Reveal, SectionHeading],
  template: `
    <section id="porque" class="py-12.5 sm:py-19.5" aria-labelledby="porque-title">
      <div class="wrap">
        <app-section-heading
          titleId="porque-title"
          eyebrow="Por qué nosotros"
          title="Sí, hay quien cobra menos. Esto es lo que te llevas de más."
          lead="Hay muchas páginas baratas que después nadie mantiene. Nosotros te damos algo que sí funciona y no te deja solo."
        />
        <ol class="grid gap-4 md:grid-cols-2">
          @for (item of items; track item.title; let i = $index) {
            <li class="glass flex gap-4 p-5.5" [appReveal]="i">
              <span class="flex-none pt-0.75 font-mono text-xs font-semibold text-brand">{{
                i + 1 | number: '2.0'
              }}</span>
              <div>
                <h3 class="mb-1.75 text-2xl">{{ item.title }}</h3>
                <p class="text-md font-regular text-ink-2">
                  @if (item.parts; as parts) {
                    {{ parts[0] }}<em class="text-brand not-italic">{{ parts[1] }}</em
                    >{{ parts[2] }}
                  } @else {
                    {{ item.body }}
                  }
                </p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUsSection {
  protected readonly items = DIFFERENTIATORS.map(withParts);
}
