import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButton } from '@ui/button';
import { TrackCta, WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { BrandGradient } from '../atoms/brand-gradient';
import { Icon } from '../atoms/icon';
import { Wrap } from '../atoms/layout';
import { TextImports } from '../atoms/text';
import { ContactForm } from './contact-form';
import { SectionLink } from '@app/core/current-path';
import { Reveal } from '@app/core/motion';

/**
 * Cierre sobre el degradado de marca. El texto va sobre una capa azul marino para quedar siempre
 * en la zona oscura del degradado (regla del manual: texto blanco solo sobre azul marino o ciruela).
 */
@Component({
  selector: 'app-closing',
  imports: [
    Reveal,
    SectionLink,
    BrandGradient,
    ContactForm,
    HlmButton,
    Icon,
    TextImports,
    TrackCta,
    WhatsappLink,
    Wrap,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      class="relative isolate overflow-hidden text-white"
      data-surface="dark"
    >
      <app-brand-gradient live />
      <span
        aria-hidden="true"
        class="absolute inset-0 -z-10 bg-linear-to-b from-navy/95 via-navy/90 to-plum/70 md:bg-linear-to-r md:from-navy/95 md:via-navy/85 md:to-transparent"
      ></span>
      <div appWrap class="grid items-center gap-12 py-24 md:grid-cols-2 md:gap-16">
        <div appReveal>
          <p appEyebrow class="mb-4">Empecemos</p>
          <h2 appH2 id="contacto-title">Empieza por saber dónde estás.</h2>
          <p appLead class="mt-4">
            El diagnóstico es gratis y toma 3 minutos. Si prefieres hablar directo, escríbenos.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a hlmBtn appSection="diagnostico" appTrack="cierre">Haz tu diagnóstico gratis</a>
            <a hlmBtn variant="light" [appWhatsapp]="messages.general" location="cierre">
              <app-icon name="chat" />Escríbenos por WhatsApp
            </a>
          </div>
          <p class="mt-12 font-bold text-sand">Medimos tu negocio. Construimos el resto.</p>
        </div>
        <!--
          El formulario sale completo en el HTML prerenderizado; su código (Angular Forms) se carga
          al acercarse a la vista. En navegación interna se dibuja en cuanto el navegador está libre.
        -->
        <div appReveal="1" class="min-w-0">
          @defer (on idle; hydrate on viewport) {
            <app-contact-form />
          } @placeholder {
            <div aria-hidden="true" class="min-h-140 rounded-lg bg-white shadow-md"></div>
          }
        </div>
      </div>
    </section>
  `,
})
export class Closing {
  protected readonly messages = WHATSAPP_MESSAGES;
}
