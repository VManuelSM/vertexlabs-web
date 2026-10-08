import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VertexMark } from '@shared/components/vertex-mark';
import { SITE_CONFIG } from '../site.config';

const FOOTER_LINKS = [
  { href: '#paquetes', label: 'Paquetes' },
  { href: '#proceso', label: 'Cómo trabajamos' },
  { href: '#casos', label: 'Casos' },
  { href: '#faq', label: 'FAQ' },
  // Pendiente doc 23 §9 #10: aviso de privacidad del sitio (LFPDPPP).
  { href: '#', label: 'Aviso de Privacidad' },
  { href: 'https://kindu.vertexlabs.mx/login', label: 'Kindu ↗' },
] as const;

@Component({
  selector: 'app-site-footer',
  imports: [VertexMark],
  host: { class: 'mt-5 block border-t border-line pt-11 pb-10 text-md text-ink-3' },
  template: `
    <footer class="wrap">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <p class="flex items-center gap-2.5 text-xl font-heavy tracking-title text-ink">
          <app-vertex-mark class="size-5.5 text-brand" />
          VertexLabs
        </p>
        <nav aria-label="Pie de página" class="flex flex-wrap gap-5.5">
          @for (link of links; track link.label) {
            <a [href]="link.href" class="text-ink-2 transition-colors hover:text-ink">{{
              link.label
            }}</a>
          }
        </nav>
      </div>
      <p class="mt-5.5 font-mono text-xs">
        Desarrollo de páginas web y tiendas en línea en Pachuca, Hidalgo · Servicio en todo México ·
        © VertexLabs
        {{ year }}
      </p>
      @if (site.reviewMode) {
        <p class="mt-3 font-mono text-2xs opacity-85">
          // mockup navegable v0.2 (liquid glass) — propuesta interna. Textos, precios y marca
          sujetos a validación. Los botones de WhatsApp abren un mensaje precargado de demostración
          (número placeholder).
        </p>
      }
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly site = inject(SITE_CONFIG);
  protected readonly links = FOOTER_LINKS;
  protected readonly year = new Date().getFullYear();
}
