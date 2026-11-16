import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CASES } from '@app/content/cases';
import { SectionHead, Wrap } from '../atoms/layout';
import { TextImports } from '../atoms/text';
import { CaseCard } from '../molecules/case-card';
import { Reveal } from '@app/core/motion';

/** Casos: fichas de proyectos reales y la nota de Kindu. */
@Component({
  selector: 'app-cases',
  imports: [Reveal, CaseCard, SectionHead, TextImports, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="casos" aria-labelledby="casos-title" class="bg-surface py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>Casos</p>
          <h2 appH2 id="casos-title">Negocios que ya trabajan con nosotros.</h2>
          <p appLead>Tres giros distintos, tres puntos de partida.</p>
        </header>
        <div class="grid gap-6 md:grid-cols-3">
          @for (study of cases; track study.id) {
            <article appCaseCard [case]="study" [appReveal]="$index"></article>
          }
        </div>
        <p appReveal class="mt-8 max-w-copy text-muted-foreground">
          Además, creamos y operamos Kindu, nuestra propia app de finanzas personales. Lo que
          aprendemos ahí lo aplicamos en tu proyecto.
        </p>
      </div>
    </section>
  `,
})
export class Cases {
  protected readonly cases = CASES;
}
