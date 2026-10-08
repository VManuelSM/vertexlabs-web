import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { PROBLEMS } from '../data/content';

@Component({
  selector: 'app-problem-section',
  imports: [DecimalPipe, Reveal, SectionHeading],
  template: `
    <section id="problema" class="py-12.5 sm:py-19.5" aria-labelledby="problema-title">
      <div class="wrap">
        <app-section-heading
          titleId="problema-title"
          eyebrow="Te suena familiar"
          title="Si algo de esto te pasa, estás en el lugar correcto."
        />
        <ol class="grid gap-4.5 md:grid-cols-3">
          @for (problem of problems; track problem.title; let i = $index) {
            <li class="glass p-5.5 sm:p-6.5" [appReveal]="i">
              <p class="mb-3.5 font-mono text-xs tracking-mono text-brand">
                {{ i + 1 | number: '2.0' }}
              </p>
              <h3 class="mb-2.5 text-3xl">{{ problem.title }}</h3>
              <p class="text-base font-regular text-ink-2">{{ problem.body }}</p>
            </li>
          }
        </ol>
        <p class="mt-6.5 text-center text-base text-ink-2" appReveal>
          Por eso empezamos escuchándote, no vendiéndote.
        </p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemSection {
  protected readonly problems = PROBLEMS;
}
