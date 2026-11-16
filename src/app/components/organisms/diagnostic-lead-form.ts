import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  type AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@ui/button';
import { HlmCheckbox } from '@ui/checkbox';
import { HlmInput } from '@ui/input';
import { tbd } from '@app/content/copy';
import { injectLeadForm } from '@app/core/lead-form';
import { isEmail, isWhatsapp, UTM_KEYS } from '@app/core/leads';
import { CopyText } from '../atoms/copy';
import { CheckField, FormField } from '../molecules/form-field';
import { LeadFailure, LeadSuccess } from '../molecules/lead-feedback';
import type { Recommendation } from '@app/diagnostic/recommend';

const whatsappValidator = (control: AbstractControl<string>): ValidationErrors | null =>
  !control.value || isWhatsapp(control.value) ? null : { whatsapp: true };
const emailValidator = (control: AbstractControl<string>): ValidationErrors | null =>
  !control.value?.trim() || isEmail(control.value) ? null : { correo: true };

const FIELD_IDS = {
  nombre: 'lf-nombre',
  negocio: 'lf-negocio',
  whatsapp: 'lf-wa',
  correo: 'lf-correo',
  privacidad: 'lf-privacidad',
} as const;

/** "Recibe tu diagnóstico completo": datos de contacto con el resultado en campos ocultos. */
@Component({
  selector: 'app-diagnostic-lead-form',
  imports: [
    CheckField,
    CopyText,
    FormField,
    HlmButton,
    HlmCheckbox,
    HlmInput,
    LeadFailure,
    LeadSuccess,
    ReactiveFormsModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (lead.state() === 'sent') {
      <app-lead-success [name]="lead.firstName()" autofocus />
    } @else {
      <form
        class="grid gap-4 rounded-md border border-border bg-surface p-6"
        [formGroup]="form"
        (ngSubmit)="submit()"
        novalidate
      >
        <p>
          Te lo mandamos por WhatsApp y, si quieres, lo revisamos juntos en una llamada de
          <app-copy [value]="callLength" />, sin costo.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
          <app-form-field label="Nombre" [for]="ids.nombre" error="Escribe tu nombre.">
            <input hlmInput [id]="ids.nombre" formControlName="nombre" autocomplete="name" />
          </app-form-field>
          <app-form-field
            label="Tu negocio"
            [for]="ids.negocio"
            error="Escribe el nombre o giro de tu negocio."
          >
            <input
              hlmInput
              [id]="ids.negocio"
              formControlName="negocio"
              autocomplete="organization"
            />
          </app-form-field>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <app-form-field
            label="WhatsApp"
            [for]="ids.whatsapp"
            error="Escribe un WhatsApp de 10 dígitos."
          >
            <input
              hlmInput
              [id]="ids.whatsapp"
              formControlName="whatsapp"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
            />
          </app-form-field>
          <app-form-field label="Correo" optional [for]="ids.correo" error="Revisa el correo.">
            <input
              hlmInput
              [id]="ids.correo"
              formControlName="correo"
              type="email"
              autocomplete="email"
            />
          </app-form-field>
        </div>
        <app-check-field
          [for]="ids.privacidad"
          error="Necesitamos tu aceptación para enviarte el diagnóstico."
        >
          <hlm-checkbox [inputId]="ids.privacidad" formControlName="privacidad" />
          Acepto el
          <a class="font-semibold underline" routerLink="/aviso-de-privacidad"
            >aviso de privacidad</a
          >.
        </app-check-field>
        @for (key of utmKeys; track key) {
          <input type="hidden" [name]="key" [value]="lead.utm()[key] ?? ''" />
        }
        <input type="hidden" name="diagnostico" [value]="diagnostic()" />
        <input type="hidden" name="plan" [value]="result().plan" />
        <input type="hidden" name="foco" [value]="result().focus" />
        <button
          hlmBtn
          variant="dark"
          class="justify-self-start"
          type="submit"
          [loading]="lead.state() === 'sending'"
        >
          Enviarme mi diagnóstico
        </button>
        <p class="font-semibold" role="status" aria-live="polite">{{ lead.status() }}</p>
        @if (lead.state() === 'error') {
          <app-lead-failure [message]="whatsappMessage()" location="diagnostico-error" />
        }
      </form>
    }
  `,
})
export class DiagnosticLeadForm {
  readonly result = input.required<Recommendation>();
  /** Respuestas en texto: "V4 C3 F2 N4 D3 P4". */
  readonly summary = input.required<string>();
  readonly whatsappMessage = input.required<string>();

  protected readonly ids = FIELD_IDS;
  protected readonly utmKeys = UTM_KEYS;
  protected readonly callLength = tbd('20 minutos');

  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    negocio: ['', [Validators.required, Validators.maxLength(160)]],
    whatsapp: ['', [Validators.required, whatsappValidator]],
    correo: ['', emailValidator],
    privacidad: [false, Validators.requiredTrue],
  });

  protected readonly lead = injectLeadForm(FIELD_IDS);
  protected readonly diagnostic = computed(
    () => `${this.summary()} · plan ${this.result().plan} · foco ${this.result().focus}`,
  );

  protected submit(): Promise<void> {
    return this.lead.submit(this.form, (utm) => {
      const value = this.form.getRawValue();
      return {
        origen: 'diagnostico',
        nombre: value.nombre.trim(),
        negocio: value.negocio.trim(),
        contacto: value.whatsapp.trim(),
        correo: value.correo.trim() || undefined,
        plan: this.result().plan,
        diagnostico: this.diagnostic(),
        utm,
      };
    });
  }
}
