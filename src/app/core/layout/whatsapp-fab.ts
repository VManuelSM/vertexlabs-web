import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhatsAppIcon } from '@shared/components/whatsapp-icon';
import { WhatsAppLink } from '@shared/lib/whatsapp';
import { SITE_CONFIG } from '../site.config';

/** Botón flotante de WhatsApp: la conversión principal siempre a un toque (doc 23 §1). */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [WhatsAppIcon, WhatsAppLink],
  template: `
    <a
      class="fab fixed right-4 bottom-4 z-60 flex size-13 items-center justify-center rounded-full bg-whatsapp text-on-whatsapp shadow-fab transition-transform duration-200 hover:scale-108 sm:right-5.5 sm:bottom-5.5 sm:size-14.5"
      title="Escríbenos por WhatsApp"
      aria-label="Escríbenos por WhatsApp"
      [appWhatsApp]="site.whatsappGreeting"
    >
      <app-whatsapp-icon class="size-7 sm:size-7.5" />
    </a>
  `,
  styles: `
    .fab::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      animation: pulse-ring 2.6s ease-out infinite;
    }

    @keyframes pulse-ring {
      from {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--whatsapp) 50%, transparent);
      }
      to {
        box-shadow: 0 0 0 16px transparent;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsAppFab {
  protected readonly site = inject(SITE_CONFIG);
}
