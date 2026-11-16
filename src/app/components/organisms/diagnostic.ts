import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead, Wrap } from '../atoms/layout';
import { TextImports } from '../atoms/text';
import { DiagnosticPanel } from './diagnostic-panel';

/** Diagnóstico gratis (Radar). */
@Component({
  selector: 'app-diagnostic',
  imports: [DiagnosticPanel, SectionHead, TextImports, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="diagnostico" aria-labelledby="diagnostico-title" class="py-section">
      <div appWrap>
        <header appSectionHead>
          <p appEyebrow>Diagnóstico gratis</p>
          <h2 appH2 id="diagnostico-title">¿Por dónde empieza tu negocio?</h2>
          <p appLead>
            Responde 6 preguntas en 3 minutos. Te decimos qué plan te conviene y qué puede esperar.
          </p>
        </header>
        <!--
          La primera pregunta sale en el HTML prerenderizado; el código del Radar (y su WebGL) se
          carga al acercarse a la vista. En navegación interna se dibuja en cuanto el navegador está
          libre.
        -->
        @defer (on idle; hydrate on viewport) {
          <app-diagnostic-panel />
        } @placeholder {
          <div
            aria-hidden="true"
            class="min-h-140 rounded-lg border border-border bg-white shadow-md"
          ></div>
        }
      </div>
    </section>
  `,
})
export class Diagnostic {}
