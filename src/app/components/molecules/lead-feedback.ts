import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { tbd } from '@app/content/copy';
import { WhatsappLink } from '@app/core/whatsapp';
import { CopyText } from '../atoms/copy';
import { LinkArrow } from '../atoms/link-arrow';

/** Éxito de un formulario de contacto: "Listo, {nombre}." y cuándo le escribimos. */
@Component({
  selector: 'app-lead-success',
  imports: [CopyText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid animate-enter gap-2 rounded-md border border-border bg-surface p-6' },
  template: `
    <b #title tabindex="-1" class="text-lg outline-none">Listo, {{ name() }}.</b>
    <span><app-copy [value]="note" /></span>
  `,
})
export class LeadSuccess {
  readonly name = input.required<string>();
  /** Lleva el foco al mensaje al aparecer (tras enviar). */
  readonly autofocus = input(false, { transform: booleanAttribute });
  protected readonly note = tbd('Te escribimos en menos de 1 día hábil.');
  private readonly title = viewChild.required<ElementRef<HTMLElement>>('title');

  constructor() {
    afterNextRender(() => {
      if (this.autofocus()) this.title().nativeElement.focus();
    });
  }
}

/**
 * Error de envío, con WhatsApp como salida para no perder el contacto.
 * TODO(dato): el texto del error no está en el prototipo.
 */
@Component({
  selector: 'app-lead-failure',
  imports: [CopyText, LinkArrow, WhatsappLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid animate-enter gap-3 rounded-md border-2 border-destructive bg-white p-4',
    role: 'alert',
  },
  template: `
    <p class="flex items-center gap-2 font-semibold text-destructive">
      <span
        aria-hidden="true"
        class="inline-grid size-5 shrink-0 place-items-center rounded-pill bg-destructive text-xs font-bold text-white"
        >!</span
      >
      <app-copy [value]="text" />
    </p>
    <a appLinkArrow class="justify-self-start" [appWhatsapp]="message()" [location]="location()"
      >Escríbenos por WhatsApp</a
    >
  `,
})
export class LeadFailure {
  readonly message = input.required<string>();
  readonly location = input.required<string>();
  protected readonly text = tbd('[Mensaje si no se pudo enviar]', 'Pendiente');
}
