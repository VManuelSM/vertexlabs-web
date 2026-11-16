import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';

/** Eventos del sitio, con los datos que envía el prototipo. */
export interface AnalyticsEvents {
  cta_click: { ubicacion: string; texto: string };
  whatsapp_click: { ubicacion: string };
  plan_click: { plan: string };
  diagnostico_inicio: Record<string, never>;
  diagnostico_fin: { plan: string; foco: string };
  lead_enviado: { origen: string; plan: string | null; canal: string };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

interface DataLayerWindow {
  dataLayer?: Record<string, unknown>[];
}

/**
 * Analítica sin proveedor: cada evento se agrega a `window.dataLayer`, que lee cualquier
 * etiquetador (GA4 vía GTM, Plausible, etc.). TODO(dato): proveedor por decidir con Víctor.
 */
@Injectable({ providedIn: 'root' })
export class Analytics {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  track<K extends AnalyticsEventName>(name: K, data: AnalyticsEvents[K]): void {
    if (!this.isBrowser) return;
    const target = window as unknown as DataLayerWindow;
    (target.dataLayer ??= []).push({ event: name, ...data });
    if (isDevMode()) console.info('[evento]', name, data);
  }
}
