import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButton } from '@ui/button';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { WhatsAppLink } from '@shared/lib/whatsapp';
import { PROCESS_STEPS } from '../data/content';

@Component({
  selector: 'app-process-section',
  imports: [DecimalPipe, HlmButton, Reveal, SectionHeading, WhatsAppLink],
  template: `
    <section id="proceso" class="py-12.5 sm:py-19.5" aria-labelledby="proceso-title">
      <div class="wrap">
        <app-section-heading
          titleId="proceso-title"
          eyebrow="Cómo trabajamos"
          title="Así es de principio a fin. Sin misterio."
          lead="Cinco pasos claros. En cada uno sabes qué está pasando y qué recibes."
        />
        <ol class="flex flex-col gap-3">
          @for (step of steps; track step.title; let i = $index) {
            <li
              class="glass flex flex-col gap-1.5 p-5.5 sm:flex-row sm:gap-5.5 sm:px-7 sm:py-6"
              [appReveal]="i"
            >
              <span
                class="font-mono text-4xl leading-none font-semibold tracking-title text-brand opacity-90"
              >
                {{ i + 1 | number: '2.0' }}
              </span>
              <div class="flex-1">
                <div class="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                  <h3 class="text-3xl">{{ step.title }}</h3>
                  <span class="step-duration sm:ml-auto">{{ step.duration }}</span>
                </div>
                <p class="text-base font-regular text-ink-2">{{ step.body }}</p>
                <p class="mt-2.5 flex items-baseline gap-2 text-sm text-ink-2">
                  <b
                    class="font-mono text-2xs font-semibold tracking-mono-wide whitespace-nowrap text-brand uppercase"
                  >
                    Recibes
                  </b>
                  {{ step.outcome }}
                </p>
              </div>
            </li>
          }
        </ol>
        <div class="mt-6.5 text-center">
          <a hlmBtn variant="cta" size="cta-lg" [appWhatsApp]="startMessage"
            >Empezar con el paso 1 →</a
          >
        </div>
      </div>
    </section>
  `,
  styles: `
    .step-duration {
      padding: calc(var(--spacing) * 0.75) calc(var(--spacing) * 2.25);
      border-radius: var(--radius-full);
      background: color-mix(in srgb, var(--ink-3) 10%, transparent);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: nowrap;
      color: var(--ink-3);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessSection {
  protected readonly steps = PROCESS_STEPS;
  protected readonly startMessage = 'Hola, quiero empezar. ¿Me cuentan cómo funciona?';
}
