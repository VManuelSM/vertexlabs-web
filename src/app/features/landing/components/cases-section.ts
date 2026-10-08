import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '@shared/components/section-heading';
import { Reveal } from '@shared/lib/reveal';
import { PhoneIllustration } from './illustrations/phone-illustration';
import { QuoteIllustration } from './illustrations/quote-illustration';

/** Casos = prueba de capacidad (doc 23 §4, Sec 7). Pendiente: testimonio y capturas autorizadas. */
@Component({
  selector: 'app-cases-section',
  imports: [PhoneIllustration, QuoteIllustration, Reveal, SectionHeading],
  template: `
    <section id="casos" class="py-12.5 sm:py-19.5" aria-labelledby="casos-title">
      <div class="wrap">
        <app-section-heading
          titleId="casos-title"
          eyebrow="Lo que hemos hecho"
          title="No lo prometemos: ya lo entregamos."
          lead="Dos ejemplos reales —uno nuestro y uno de un cliente— para que veas de lo que somos capaces."
        />
        <div class="grid gap-4.5 md:grid-cols-2">
          <article class="glass flex flex-col overflow-hidden p-0" appReveal>
            <div class="case-visual">
              <app-phone-illustration />
            </div>
            <div class="flex flex-col gap-3 p-5.5 sm:px-6.5 sm:pt-6 sm:pb-6.5">
              <p class="case-kicker">Producto propio · en producción</p>
              <h3 class="text-4xl tracking-title">Kindu</h3>
              <p class="text-base font-regular text-ink-2">
                Nuestra app para llevar las finanzas personales y de varias cuentas en un solo
                lugar. La diseñamos, la programamos y la mantenemos viva todos los días, con
                usuarios reales.
              </p>
              <p class="case-proof">
                →
                <a
                  class="case-link"
                  href="https://kindu.vertexlabs.mx/login"
                  target="_blank"
                  rel="noopener"
                  >kindu.vertexlabs.mx</a
                >
                · diseño, desarrollo y operación de punta a punta
              </p>
            </div>
          </article>

          <article class="glass flex flex-col overflow-hidden p-0" [appReveal]="1">
            <div class="case-visual">
              <app-quote-illustration />
            </div>
            <div class="flex flex-col gap-3 p-5.5 sm:px-6.5 sm:pt-6 sm:pb-6.5">
              <p class="case-kicker">Cliente real · entregado y en uso</p>
              <h3 class="text-4xl tracking-title">Planifica tu Vivienda</h3>
              <p class="text-base font-regular text-ink-2">
                Una constructora cotizaba a mano, cliente por cliente. Le hicimos un cotizador en
                línea: sus prospectos arman su cotización solos, la descargan en PDF, y el equipo ve
                todo desde un panel con permisos por rol.
              </p>
              <dl class="flex flex-wrap gap-4.5">
                @for (stat of stats; track stat.value) {
                  <div class="flex flex-col-reverse">
                    <dt class="text-xs text-ink-3">{{ stat.label }}</dt>
                    <dd class="font-mono text-3xl font-semibold tracking-body text-ink">
                      {{ stat.value }}
                    </dd>
                  </div>
                }
              </dl>
              <p class="case-proof">
                →
                <a
                  class="case-link"
                  href="https://planificatuvivienda.com"
                  target="_blank"
                  rel="noopener"
                  >planificatuvivienda.com</a
                >
                · proyecto a la medida, entregado y funcionando hoy
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .case-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 210px;
      padding: calc(var(--spacing) * 8) calc(var(--spacing) * 6);
      border-bottom: 1px solid var(--line);
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--aurora-2) 15%, transparent),
        transparent 80%
      );
    }

    .case-kicker {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: var(--font-weight-semibold);
      letter-spacing: var(--tracking-mono-wide);
      text-transform: uppercase;
      color: var(--brand);
    }

    .case-proof {
      margin-top: calc(var(--spacing) * 1.5);
      padding-top: calc(var(--spacing) * 3.5);
      border-top: 1px solid var(--line);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--ink-3);
    }

    .case-link {
      color: var(--brand);
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .case-link:hover {
      color: var(--ink);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesSection {
  protected readonly stats = [
    { value: 'Cotización', label: 'en línea, al instante' },
    { value: 'PDF', label: 'descargable' },
    { value: 'Panel', label: 'por roles' },
  ] as const;
}
