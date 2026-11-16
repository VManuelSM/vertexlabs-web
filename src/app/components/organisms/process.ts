import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PORTAL, STEPS } from '@app/content/home';
import { BrandGradient } from '../atoms/brand-gradient';
import { SectionHead, Wrap } from '../atoms/layout';
import { TextImports } from '../atoms/text';
import { ProcessStep } from '../molecules/process-step';
import { Reveal } from '@app/core/motion';

const CHIP = {
  done: 'bg-navy text-white',
  doing: 'bg-sand text-navy',
  todo: 'border border-input text-muted-foreground',
} as const;

/** Cómo trabajamos: los cuatro pasos y el portal de cliente. */
@Component({
  selector: 'app-process',
  imports: [Reveal, BrandGradient, ProcessStep, SectionHead, TextImports, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="proceso" aria-labelledby="proceso-title" class="py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>Cómo trabajamos</p>
          <h2 appH2 id="proceso-title">Siempre sabes en qué va tu proyecto.</h2>
        </header>
        <ol class="grid gap-6 md:grid-cols-4">
          @for (step of steps; track step.title; let i = $index) {
            <li
              appProcessStep
              [appReveal]="i"
              [number]="i + 1"
              [heading]="step.title"
              [text]="step.text"
            ></li>
          }
        </ol>
        <div
          appReveal
          class="mt-12 grid items-center gap-8 rounded-lg border border-border bg-surface p-8 md:grid-cols-2 md:p-12"
        >
          <div class="grid gap-4">
            <p appEyebrow>Tu portal de cliente</p>
            <h3 appH3>
              Tu diagnóstico, tus entregables y el avance de tu proyecto, en un solo lugar.
            </h3>
            <!-- TODO(dato): reemplazar la vista ilustrativa por la captura real del portal. -->
            <p appNote class="mt-3">
              Vista ilustrativa: se reemplaza con la captura real del portal.
            </p>
          </div>
          <div
            class="overflow-hidden rounded-md border border-border bg-white shadow-md"
            aria-hidden="true"
          >
            <div class="relative isolate px-5 py-4 text-white">
              <app-brand-gradient />
              <span
                aria-hidden="true"
                class="absolute inset-0 -z-10 bg-linear-to-r from-navy/80 to-transparent"
              ></span>
              <small class="block text-xs">Portal de cliente</small>
              <b class="text-base">{{ portal.project }}</b>
            </div>
            <div class="grid gap-4 px-5 py-5">
              <div>
                <div class="flex justify-between gap-3 text-sm font-semibold text-muted-foreground">
                  <span>Avance</span><span>{{ portal.progress }}%</span>
                </div>
                <div class="mt-2 h-2 overflow-hidden rounded-pill bg-sand">
                  <span
                    class="block h-full w-3/5 origin-left bg-pink transition-transform delay-(--motion-fast) duration-(--motion-base) revealing:scale-x-0"
                  ></span>
                </div>
              </div>
              @for (row of portal.rows; track row.label) {
                <div
                  class="flex items-center justify-between gap-3 border-b border-border pb-3 text-sm last:border-b-0 last:pb-0"
                >
                  <span>{{ row.label }}</span>
                  <span
                    class="rounded-pill px-3 py-1 text-xs font-bold whitespace-nowrap"
                    [class]="chip[row.tone]"
                    >{{ row.status }}</span
                  >
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Process {
  protected readonly steps = STEPS;
  protected readonly portal = PORTAL;
  protected readonly chip = CHIP;
}
