import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButton } from '@ui/button';
import { VertexMark } from '@shared/components/vertex-mark';
import { WhatsAppIcon } from '@shared/components/whatsapp-icon';
import { WhatsAppLink } from '@shared/lib/whatsapp';
import { SITE_CONFIG } from '../site.config';
import { ThemeService } from '../theme/theme.service';

export const NAV_LINKS = [
  { href: '#paquetes', label: 'Paquetes' },
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#proceso', label: 'Cómo trabajamos' },
  { href: '#casos', label: 'Casos' },
  { href: '#faq', label: 'FAQ' },
] as const;

@Component({
  selector: 'app-site-header',
  imports: [HlmButton, NgIcon, VertexMark, WhatsAppIcon, WhatsAppLink],
  providers: [provideIcons({ lucideMoon, lucideSun })],
  host: {
    class:
      'sticky top-0 z-50 block border-b border-line bg-glass backdrop-blur-nav backdrop-saturate-150',
  },
  template: `
    <div class="wrap flex h-14.5 items-center gap-2.25 max-xs:gap-1.75 sm:h-17 sm:gap-6">
      <a
        href="#"
        class="flex items-center gap-1.75 text-lg font-heavy tracking-title sm:gap-2.5 sm:text-3xl"
      >
        <app-vertex-mark class="size-5.5 text-brand sm:size-6.5" />
        VertexLabs
      </a>

      <nav aria-label="Principal" class="ml-auto hidden gap-6 text-md font-book lg:flex">
        @for (link of links; track link.href) {
          <a [href]="link.href" class="text-ink-2 transition-colors hover:text-ink">{{
            link.label
          }}</a>
        }
      </nav>

      <div class="ml-auto flex items-center gap-2.25 max-xs:gap-1.75 sm:gap-6 lg:ml-0">
        <button
          type="button"
          class="control w-9.5 sm:w-10"
          title="Cambiar tema claro/oscuro"
          [attr.aria-label]="themeLabel()"
          (click)="theme.toggleTheme()"
        >
          <ng-icon
            [name]="theme.theme() === 'dark' ? 'lucideSun' : 'lucideMoon'"
            class="text-base"
          />
        </button>
        <a
          hlmBtn
          variant="cta"
          size="cta"
          class="max-sm:size-11 max-sm:p-0"
          aria-label="Escríbenos por WhatsApp"
          [appWhatsApp]="site.whatsappGreeting"
        >
          <app-whatsapp-icon class="size-3.75" />
          <span class="max-sm:hidden">WhatsApp</span>
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly site = inject(SITE_CONFIG);
  protected readonly theme = inject(ThemeService);
  protected readonly links = NAV_LINKS;

  protected readonly themeLabel = computed(() =>
    this.theme.theme() === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro',
  );
}
