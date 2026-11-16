import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButton } from '@ui/button';
import { startingPrice } from '@app/content/plans';
import { Parallax } from '@app/core/motion';
import { TrackCta, WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { BrandGradient } from '../atoms/brand-gradient';
import { Icon } from '../atoms/icon';
import { Wrap } from '../atoms/layout';
import { PhoneFrame } from '../atoms/phone-frame';
import { TextImports } from '../atoms/text';
import { SectionLink } from '@app/core/current-path';

/** Hero: etiqueta, H1 en Good Timing, subtítulo, dos acciones y dos capturas reales. */
@Component({
  selector: 'app-hero',
  imports: [
    Parallax,
    SectionLink,
    BrandGradient,
    HlmButton,
    Icon,
    PhoneFrame,
    TextImports,
    TrackCta,
    WhatsappLink,
    Wrap,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="inicio" aria-labelledby="hero-title" class="pt-12 pb-16 md:pt-16 md:pb-24">
      <div appWrap class="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p appEyebrow class="mb-4">Estudio digital en Pachuca · Trabajamos con todo México</p>
          <h1 appH1 id="hero-title">Tu negocio, listo para vender en internet.</h1>
          <p appLead class="mt-4">
            Hacemos tu sitio web, tu tienda en línea o el sistema que te falta. Empieza con un
            diagnóstico gratis de 3 minutos y te decimos qué necesitas (y qué no).
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a hlmBtn appSection="diagnostico" appTrack="hero">Haz tu diagnóstico gratis</a>
            <a hlmBtn variant="outline" [appWhatsapp]="messages.general" location="hero">
              <app-icon name="chat" />Escríbenos por WhatsApp
            </a>
          </div>
          <p appNote class="mt-4">Sin costo ni compromiso · Facturamos · {{ startingPrice }}</p>
        </div>
        <figure
          appParallax
          class="relative isolate m-0 aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-140"
        >
          <app-brand-gradient live />
          <app-phone-frame
            class="parallax-far absolute start-1/12 -bottom-1/12 w-11/25"
            src="/images/planifica-tu-vivienda.jpg"
            alt="Sitio de Planifica Tu Vivienda en un celular, con el título «Construye tu casa paso a paso y sin complicaciones»."
            priority
          />
          <app-phone-frame
            class="parallax-near absolute end-1/12 top-1/12 w-11/25"
            src="/images/toastmasters-pachuca.jpg"
            alt="Sitio de Toastmasters Pachuca en un celular, con el título «Voces con poder»."
            priority
          />
          <figcaption
            class="absolute end-4 bottom-4 max-w-2/5 rounded-sm bg-white px-3 py-2 text-xs leading-snug font-semibold text-navy shadow-md"
          >
            Proyectos reales: Planifica Tu Vivienda y Toastmasters Pachuca
          </figcaption>
        </figure>
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly messages = WHATSAPP_MESSAGES;
  protected readonly startingPrice = startingPrice();
}
