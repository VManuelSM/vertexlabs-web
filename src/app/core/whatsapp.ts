import { computed, Directive, inject, input } from '@angular/core';
import { type PlanId } from '@app/content/plans';
import { Analytics } from './analytics';
import { SITE_CONFIG } from './site-config';
import { Toasts } from './toast';

/** Mensajes prellenados por origen (los `data-wa` del prototipo). */
export const WHATSAPP_MESSAGES = {
  general: 'Hola, vengo del sitio de Vertex Labs y quiero información.',
  team: 'Hola, tengo una pregunta sobre cómo trabajan.',
  diagnostic: (focus: string, plan: string) =>
    `Hola, hice el diagnóstico. Mi prioridad es ${focus} y me salió el plan ${plan}.`,
} as const;

/** `https://wa.me/<número>?text=<mensaje>`, o `null` mientras no haya número. */
export const whatsappUrl = (number: string | null, message: string): string | null =>
  number ? `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}` : null;

/**
 * Enlace de WhatsApp con mensaje prellenado y eventos `whatsapp_click` (y `plan_click` si viene de
 * un plan). Mientras falte el número (TODO(dato)), no abre nada: muestra el mensaje que se enviaría,
 * como el prototipo.
 */
@Directive({
  selector: 'a[appWhatsapp]',
  host: {
    '[attr.href]': 'href() ?? "#contacto"',
    '[attr.target]': 'href() ? "_blank" : null',
    '[attr.rel]': 'href() ? "noopener" : null',
    '(click)': 'onClick($event)',
  },
})
export class WhatsappLink {
  private readonly site = inject(SITE_CONFIG);
  private readonly analytics = inject(Analytics);
  private readonly toasts = inject(Toasts);

  readonly message = input.required<string>({ alias: 'appWhatsapp' });
  /** Dónde está el botón (encabezado, hero, plan-crecer…). */
  readonly location = input.required<string>();
  readonly plan = input<PlanId>();

  protected readonly href = computed(() => whatsappUrl(this.site.whatsappNumber, this.message()));

  protected onClick(event: MouseEvent): void {
    this.analytics.track('whatsapp_click', { ubicacion: this.location() });
    const plan = this.plan();
    if (plan) this.analytics.track('plan_click', { plan });
    if (!this.href()) {
      event.preventDefault();
      this.toasts.show('En el sitio real se abre WhatsApp con este mensaje:', this.message());
    }
  }
}

/** Botón o enlace de llamada a la acción con su evento `cta_click`. */
@Directive({
  selector: '[appTrack]',
  host: { '(click)': 'onClick($event)' },
})
export class TrackCta {
  private readonly analytics = inject(Analytics);
  readonly location = input.required<string>({ alias: 'appTrack' });

  protected onClick(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    this.analytics.track('cta_click', {
      ubicacion: this.location(),
      texto: el?.textContent?.trim() ?? '',
    });
  }
}
