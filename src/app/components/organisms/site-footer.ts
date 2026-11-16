import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type Copy, tbd } from '@app/content/copy';
import { SITE_CONFIG } from '@app/core/site-config';
import { CopyText } from '../atoms/copy';
import { Wrap } from '../atoms/layout';
import { Logo } from '../atoms/logo';
import { SectionLink } from '@app/core/current-path';

/** Pie de página: contacto, mapa del sitio y datos legales. */
@Component({
  selector: 'app-site-footer',
  imports: [SectionLink, CopyText, Logo, RouterLink, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-navy text-sand', 'data-surface': 'dark' },
  template: `
    <footer appWrap class="grid gap-8 pt-16 pb-24">
      <div class="grid gap-8 md:grid-cols-3 md:gap-12">
        <div class="grid content-start gap-4">
          <a
            appSection="inicio"
            class="inline-flex text-white"
            aria-label="Vertex Labs, ir al inicio"
          >
            <app-logo class="h-10" />
          </a>
          <p>Medimos tu negocio. Construimos el resto.</p>
        </div>
        <div>
          <h2 class="mb-3 text-xs font-bold tracking-eyebrow text-white uppercase">Contacto</h2>
          <ul class="grid gap-2">
            <li>WhatsApp: <app-copy [value]="whatsapp()" /></li>
            <li>
              Correo:
              @if (site.email; as email) {
                <a class="text-white hover:underline" [href]="'mailto:' + email">{{ email }}</a>
              } @else {
                <app-copy [value]="pendingEmail" />
              }
            </li>
            <li>Pachuca, Hidalgo · Trabajamos con todo México</li>
            <li>Redes: <app-copy [value]="socials" /></li>
          </ul>
        </div>
        <div>
          <h2 class="mb-3 text-xs font-bold tracking-eyebrow text-white uppercase">Sitio</h2>
          <ul class="grid gap-2">
            <li><a class="text-white hover:underline" appSection="planes">Planes</a></li>
            <li><a class="text-white hover:underline" appSection="diagnostico">Diagnóstico</a></li>
            <li><a class="text-white hover:underline" appSection="casos">Casos</a></li>
            <li><a class="text-white hover:underline" appSection="preguntas">Preguntas</a></li>
            <li>
              <a class="text-white hover:underline" routerLink="/aviso-de-privacidad"
                >Aviso de privacidad</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-sand/25 pt-6 text-sm"
      >
        <span>© 2026 Vertex Labs · <app-copy [value]="legalName()" /> · Facturamos</span>
        <a class="text-white hover:underline" routerLink="/componentes">Componentes del sitio</a>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly site = inject(SITE_CONFIG);

  protected readonly whatsapp = computed<Copy>(() => {
    const n = this.site.whatsappNumber;
    return n ? `+${n}` : tbd('[número]', 'Pendiente');
  });
  protected readonly pendingEmail = tbd('hola@[dominio]', 'Pendiente');
  protected readonly legalName = computed<Copy>(
    () => this.site.legalName ?? tbd('[razón social]', 'Pendiente'),
  );
  /** TODO(dato): redes sociales oficiales. */
  protected readonly socials = tbd('[cuáles]', 'Pendiente');
}
