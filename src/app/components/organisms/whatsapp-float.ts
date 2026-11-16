import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { Icon } from '../atoms/icon';

/** Botón flotante de WhatsApp, presente en todas las pantallas. Usa la marca, no el verde. */
@Component({
  selector: 'app-whatsapp-float',
  imports: [Icon, WhatsappLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="fixed end-4 bottom-4 z-(--z-float) inline-flex min-h-13 items-center gap-2 rounded-pill border-2 border-white bg-navy ps-4 pe-5 font-bold text-white shadow-md transition-colors hover:bg-plum"
      [appWhatsapp]="message"
      location="flotante"
      aria-label="Escríbenos por WhatsApp"
    >
      <app-icon name="chat" /><span aria-hidden="true">WhatsApp</span>
    </a>
  `,
})
export class WhatsappFloat {
  protected readonly message = WHATSAPP_MESSAGES.general;
}
