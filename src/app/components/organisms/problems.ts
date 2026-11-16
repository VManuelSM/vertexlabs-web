import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROBLEMS } from '@app/content/home';
import { TrackCta } from '@app/core/whatsapp';
import { SectionHead, Wrap } from '../atoms/layout';
import { LinkArrow } from '../atoms/link-arrow';
import { TextImports } from '../atoms/text';
import { ProblemCard } from '../molecules/problem-card';
import { SectionLink } from '@app/core/current-path';
import { Reveal } from '@app/core/motion';

/** Problemas: tres dolores y el cierre "tiene solución". */
@Component({
  selector: 'app-problems',
  imports: [Reveal, SectionLink, LinkArrow, ProblemCard, SectionHead, TextImports, TrackCta, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="problemas" aria-labelledby="problemas-title" class="py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>¿Te suena?</p>
          <h2 appH2 id="problemas-title">Tu negocio funciona. En internet, todavía no se nota.</h2>
        </header>
        <div class="grid gap-6 md:grid-cols-3">
          @for (problem of problems; track problem.title) {
            <article
              appProblemCard
              [appReveal]="$index"
              [icon]="problem.icon"
              [heading]="problem.title"
              [text]="problem.text"
            ></article>
          }
        </div>
        <p appReveal class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span>Tiene solución, y no siempre es la más cara.</span>
          <a appLinkArrow appSection="planes" appTrack="problemas">Ver planes y precios</a>
        </p>
      </div>
    </section>
  `,
})
export class Problems {
  protected readonly problems = PROBLEMS;
}
