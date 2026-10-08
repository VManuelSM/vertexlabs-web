import { ChangeDetectionStrategy, Component } from '@angular/core';
import { METRICS } from '../data/content';

@Component({
  selector: 'app-metrics-band',
  template: `
    <section class="pt-3.5 pb-2" aria-label="VertexLabs en cifras">
      <div class="wrap">
        <dl class="glass grid grid-cols-2 p-1.5 sm:grid-cols-4">
          @for (metric of metrics; track metric.label) {
            <div class="metric flex flex-col-reverse px-3 py-5 text-center sm:px-4.5 sm:py-6.5">
              <dt class="mt-2.25 text-sm leading-compact text-ink-2">{{ metric.label }}</dt>
              <dd
                class="bg-linear-125 from-brand to-aurora-3 bg-clip-text text-metric leading-none font-bold tracking-heading text-transparent"
              >
                {{ metric.value }}
              </dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .metric + .metric {
      border-left: 1px solid var(--line);
    }

    /* En móvil la banda es de 2 × 2 (sm = 640 px). */
    @media (width < 40rem) {
      .metric:nth-child(odd) {
        border-left: none;
      }

      .metric:nth-child(n + 3) {
        border-top: 1px solid var(--line);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsBand {
  protected readonly metrics = METRICS;
}
