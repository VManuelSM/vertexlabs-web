import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { TEAM } from '../data/content';

@Component({
  selector: 'app-team-section',
  imports: [Reveal, SectionHeading],
  template: `
    <section id="nosotros" class="py-12.5 sm:py-19.5" aria-labelledby="nosotros-title">
      <div class="wrap">
        <app-section-heading
          titleId="nosotros-title"
          eyebrow="Quiénes somos"
          title="Dos personas. Dos oficios que se equilibran."
        />
        <ul class="grid gap-4.5 md:grid-cols-2">
          @for (member of team; track member.name; let i = $index) {
            <li class="glass flex items-start gap-3.5 p-5.5 sm:gap-4.5 sm:p-6" [appReveal]="i">
              <span
                class="flex size-12 flex-none items-center justify-center rounded-md bg-linear-140 from-brand to-brand-strong text-3xl font-heavy text-on-brand shadow-inset sm:size-14 sm:rounded-lg sm:text-4xl"
                aria-hidden="true"
              >
                {{ member.initial }}
              </span>
              <div>
                <h3 class="text-3xl">{{ member.name }}</h3>
                <p class="mt-0.75 mb-2.25 font-mono text-xs tracking-mono text-ink-3">
                  {{ member.role }}
                </p>
                <p class="text-md font-regular text-ink-2">{{ member.bio }}</p>
              </div>
            </li>
          }
        </ul>
        <p
          class="mx-auto mt-7 max-w-quote text-center text-quote font-medium tracking-title text-balance"
          appReveal
        >
          Uno diseña la solución correcta; el otro garantiza que se pueda construir.
          <em class="text-brand not-italic">Esa tensión es tu seguro de calidad.</em>
        </p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSection {
  protected readonly team = TEAM;
}
