import { afterNextRender, DOCUMENT, inject, signal } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { Analytics } from './analytics';
import { type Lead, LeadError, Leads, type Utm } from './leads';

export type LeadState = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Lógica común de los formularios de contacto: valida, lleva el foco al primer campo con error,
 * envía, registra `lead_enviado` y deja el estado listo para la plantilla. Se llama en el
 * constructor de un componente.
 *
 * @param ids id de cada control, en el orden de la pantalla.
 */
export const injectLeadForm = (ids: Readonly<Record<string, string>>) => {
  const leads = inject(Leads);
  const analytics = inject(Analytics);
  const document = inject(DOCUMENT);

  const state = signal<LeadState>('idle');
  const status = signal('');
  const firstName = signal('');
  const utm = signal<Utm>({});

  afterNextRender(() => utm.set(leads.utm()));

  const submit = async (form: FormGroup, build: (utm: Utm) => Lead): Promise<void> => {
    if (state() === 'sending') return;
    form.markAllAsTouched();
    if (form.invalid) {
      status.set('Revisa los campos marcados.');
      const first = Object.keys(ids).find((key) => form.get(key)?.invalid);
      if (first) document.getElementById(ids[first])?.focus();
      return;
    }
    const lead = build(utm());
    state.set('sending');
    status.set('');
    try {
      await leads.send(lead);
      analytics.track('lead_enviado', {
        origen: lead.origen,
        plan: lead.plan ?? null,
        canal: lead.utm.utm_source ?? 'directo',
      });
      firstName.set(lead.nombre.split(/\s+/)[0]);
      state.set('sent');
    } catch (error) {
      if (!(error instanceof LeadError)) console.error(error);
      state.set('error');
    }
  };

  return { state, status, firstName, utm, submit };
};
