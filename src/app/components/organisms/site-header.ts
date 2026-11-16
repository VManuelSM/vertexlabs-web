import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { HlmButton } from '@ui/button';
import { SectionLink } from '@app/core/current-path';
import { TrackCta, WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { Icon } from '../atoms/icon';
import { Wrap } from '../atoms/layout';
import { Logo } from '../atoms/logo';

const NAV = [
  { id: 'planes', label: 'Planes', mobile: 'Planes' },
  { id: 'diagnostico', label: 'Diagnóstico', mobile: 'Diagnóstico gratis' },
  { id: 'casos', label: 'Casos', mobile: 'Casos' },
  { id: 'preguntas', label: 'Preguntas', mobile: 'Preguntas' },
] as const;

/** Encabezado fijo: logo, navegación, WhatsApp, diagnóstico y menú desplegable en celular. */
@Component({
  selector: 'app-site-header',
  imports: [SectionLink, HlmButton, Icon, Logo, TrackCta, WhatsappLink, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'header-shadow sticky top-0 z-(--z-header) block border-b border-border bg-white',
    '[attr.data-scrolled]': 'scrolled() ? "" : null',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
  template: `
    <a
      class="absolute start-4 -top-16 z-(--z-float) rounded-sm bg-navy px-4 py-2 font-bold text-white focus:top-3"
      appSection="principal"
      page=""
      >Saltar al contenido</a
    >
    <div appWrap class="flex min-h-17 items-center justify-between gap-4">
      <a
        appSection="inicio"
        class="inline-flex py-2 text-navy"
        aria-label="Vertex Labs, ir al inicio"
      >
        <app-logo class="h-9" />
      </a>
      <nav class="hidden gap-8 md:flex" aria-label="Principal">
        @for (item of nav; track item.id) {
          <a
            [appSection]="item.id"
            class="border-b-2 border-transparent py-2 text-base font-semibold transition-colors hover:border-pink"
            >{{ item.label }}</a
          >
        }
      </nav>
      <div class="flex items-center gap-2">
        <a
          hlmBtn
          variant="text"
          size="icon"
          [appWhatsapp]="messages.general"
          location="encabezado"
          aria-label="Escríbenos por WhatsApp"
          ><app-icon name="chat"
        /></a>
        <a
          hlmBtn
          variant="dark"
          class="hidden sm:inline-flex"
          appSection="diagnostico"
          appTrack="encabezado"
          >Diagnóstico gratis</a
        >
        <button
          hlmBtn
          variant="text"
          size="icon"
          type="button"
          class="md:hidden"
          aria-controls="menu-movil"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="menuOpen() ? 'Cerrar menú' : 'Abrir menú'"
          (click)="menuOpen.set(!menuOpen())"
        >
          <app-icon [name]="menuOpen() ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
    <div id="menu-movil" class="border-t border-border bg-white md:hidden" [hidden]="!menuOpen()">
      <ul appWrap class="grid pt-2 pb-4">
        @for (item of nav; track item.id) {
          <li class="animate-enter" [style.--stagger]="$index">
            <a
              [appSection]="item.id"
              class="block py-3 text-base font-bold"
              (click)="menuOpen.set(false)"
              >{{ item.mobile }}</a
            >
          </li>
        }
      </ul>
    </div>
  `,
})
export class SiteHeader {
  protected readonly nav = NAV;
  protected readonly messages = WHATSAPP_MESSAGES;
  protected readonly menuOpen = signal(false);
  /** La sombra del encabezado aparece en cuanto la página se mueve. */
  protected readonly scrolled = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const update = () => this.scrolled.set(scrollY > 0);
      update();
      addEventListener('scroll', update, { passive: true });
      destroyRef.onDestroy(() => removeEventListener('scroll', update));
    });
  }
}
