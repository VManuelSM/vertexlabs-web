import { Directive, computed, inject, input } from '@angular/core';
import { SITE_CONFIG } from '../../core/site.config';

/** Enlace wa.me con el mensaje precargado (doc 23 §7): así sabemos que el lead viene del sitio. */
export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * `<a appWhatsApp="Hola, …">` abre WhatsApp con ese mensaje. El href se resuelve al prerenderizar,
 * así que funciona aunque JavaScript no haya cargado.
 */
@Directive({
  selector: 'a[appWhatsApp]',
  host: {
    '[href]': 'href()',
    target: '_blank',
    rel: 'noopener',
  },
})
export class WhatsAppLink {
  private readonly site = inject(SITE_CONFIG);

  readonly message = input.required<string>({ alias: 'appWhatsApp' });

  protected readonly href = computed(() => whatsappLink(this.site.whatsappNumber, this.message()));
}
