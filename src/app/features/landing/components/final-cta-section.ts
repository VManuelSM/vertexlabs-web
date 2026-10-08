import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButton } from '@ui/button';
import { Reveal } from '@shared/lib/reveal';
import { WhatsAppLink } from '@shared/lib/whatsapp';
import { SITE_CONFIG } from '../../../core/site.config';

@Component({
  selector: 'app-final-cta-section',
  imports: [HlmButton, Reveal, WhatsAppLink],
  template: `
    <section id="final" class="py-12.5 sm:py-19.5" aria-labelledby="final-title">
      <div class="wrap">
        <div
          class="glass relative isolate overflow-hidden px-5.5 py-10 text-center sm:px-7.5 md:py-14 lg:py-18"
          appReveal
        >
          <div class="final-glow absolute inset-0 -z-10" aria-hidden="true"></div>
          <h2 id="final-title" class="mx-auto mb-4 max-w-closing text-closing">
            Cuéntanos qué necesitas. Sin compromiso.
          </h2>
          <p class="mx-auto mb-7.5 max-w-copy text-lg font-regular text-ink-2 sm:text-2xl">
            La primera plática es gratis. Salgas o no con nosotros, te vas con las ideas más claras.
          </p>
          <div class="flex flex-wrap justify-center gap-2.5 sm:gap-3.25">
            <a hlmBtn variant="cta" size="cta-lg" class="max-sm:flex-auto" [appWhatsApp]="message">
              Hablemos por WhatsApp →
            </a>
            <a
              hlmBtn
              variant="glass"
              size="cta-lg"
              class="max-sm:flex-auto"
              [href]="'mailto:' + site.email"
            >
              Escríbenos por correo
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .final-glow {
      background: radial-gradient(
        90% 120% at 50% 0%,
        color-mix(in srgb, var(--brand) 20%, transparent),
        transparent 60%
      );
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCtaSection {
  protected readonly site = inject(SITE_CONFIG);
  protected readonly message =
    'Hola, vengo del sitio de VertexLabs. Mi negocio es ___ y necesito ___.';
}
