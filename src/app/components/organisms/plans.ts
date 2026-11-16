import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLANS } from '@app/content/plans';
import { TrackCta } from '@app/core/whatsapp';
import { SectionHead, Wrap } from '../atoms/layout';
import { LinkArrow } from '../atoms/link-arrow';
import { TextImports } from '../atoms/text';
import { PlanCard } from '../molecules/plan-card';
import { SectionLink } from '@app/core/current-path';
import { Reveal } from '@app/core/motion';

/** Planes y precios: tres tarjetas y la nota de mantenimiento mensual. */
@Component({
  selector: 'app-plans',
  imports: [Reveal, SectionLink, LinkArrow, PlanCard, SectionHead, TextImports, TrackCta, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="planes" aria-labelledby="planes-title" class="bg-surface py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>Planes y precios</p>
          <h2 appH2 id="planes-title">Precios claros, sin letras chiquitas.</h2>
          <p appLead>Precios en pesos mexicanos, más IVA. Facturamos.</p>
        </header>
        <div class="grid gap-6 md:grid-cols-3">
          @for (plan of plans; track plan.id) {
            <article appPlanCard [plan]="plan" [appReveal]="$index"></article>
          }
        </div>
        <div
          appReveal
          class="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-md border-2 border-dashed border-input px-6 py-6"
        >
          <p class="max-w-copy">
            <b>Después del lanzamiento:</b> mantenimiento, mejoras y soporte mes a mes, para que tu
            sitio siga funcionando. Se cotiza según tu proyecto.
          </p>
          <a appLinkArrow appSection="diagnostico" appTrack="planes-no-se"
            >¿No sabes cuál elegir? Haz el diagnóstico</a
          >
        </div>
      </div>
    </section>
  `,
})
export class Plans {
  protected readonly plans = PLANS;
}
