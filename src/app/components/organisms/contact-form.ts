import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { HlmNativeSelect } from '@ui/native-select';
import { tbd } from '@app/content/copy';
import { NEEDS } from '@app/content/home';
import { injectLeadForm } from '@app/core/lead-form';
import { isEmail, isWhatsapp, UTM_KEYS } from '@app/core/leads';
import { WHATSAPP_MESSAGES } from '@app/core/whatsapp';
import { CopyText } from '../atoms/copy';
import { TextImports } from '../atoms/text';
import { CheckField, FormField } from '../molecules/form-field';
import { LeadFailure, LeadSuccess } from '../molecules/lead-feedback';

const contactValidator = (control: AbstractControl<string>): ValidationErrors | null => {
  const value = control.value?.trim() ?? '';
  return !value || isEmail(value) || isWhatsapp(value) ? null : { contacto: true };
};

/** Orden de los campos: al enviar con errores, el foco va al primero inválido. */
const FIELD_IDS = {
  nombre: 'cf-nombre',
  negocio: 'cf-negocio',
  contacto: 'cf-contacto',
  necesidad: 'cf-necesidad',
  privacidad: 'cf-privacidad',
} as const;

/** "¿Prefieres que te contactemos?": formulario del cierre. */
@Component({
  selector: 'app-contact-form',
  imports: [
    CheckField,
    CopyText,
    FormField,
    HlmButton,
    HlmCheckbox,
    HlmInput,
    HlmNativeSelect,
    LeadFailure,
    LeadSuccess,
    ReactiveFormsModule,
    RouterLink,
    TextImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid min-w-0 gap-4 rounded-lg bg-white p-6 text-navy shadow-md sm:p-8',
    'data-surface': 'light',
  },
  template: `
    @if (lead.state() === 'sent') {
      <app-lead-success [name]="lead.firstName()" autofocus />
    } @else {
      <form class="grid gap-4" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <h3 appH3>¿Prefieres que te contactemos?</h3>
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
        <app-form-field
          label="WhatsApp o correo"
          [for]="ids.contacto"
          error="Déjanos un WhatsApp de 10 dígitos o un correo válido."
        >
          <input hlmInput [id]="ids.contacto" formControlName="contacto" />
        </app-form-field>
        <app-form-field label="¿Qué necesitas?" [for]="ids.necesidad" error="Elige una opción.">
          <hlm-native-select [selectId]="ids.necesidad" formControlName="necesidad">
            <option value="">Elige una opción</option>
            @for (need of needs; track need) {
              <option [value]="need">{{ need }}</option>
            }
          </hlm-native-select>
        </app-form-field>
        <app-check-field [for]="ids.privacidad" error="Necesitamos tu aceptación para contactarte.">
          <hlm-checkbox [inputId]="ids.privacidad" formControlName="privacidad" />
          Acepto el
          <a class="font-semibold underline" routerLink="/aviso-de-privacidad"
            >aviso de privacidad</a
          >.
        </app-check-field>
        @for (key of utmKeys; track key) {
          <input type="hidden" [name]="key" [value]="lead.utm()[key] ?? ''" />
        }
        <button
          hlmBtn
          variant="dark"
          class="w-full"
          type="submit"
          [loading]="lead.state() === 'sending'"
        >
          Enviar
        </button>
        <p appNote><app-copy [value]="responseNote" /></p>
        <p class="font-semibold" role="status" aria-live="polite">{{ lead.status() }}</p>
        @if (lead.state() === 'error') {
          <app-lead-failure [message]="messages.general" location="cierre-error" />
        }
      </form>
    }
  `,
})
export class ContactForm {
  protected readonly ids = FIELD_IDS;
  protected readonly needs = NEEDS;
  protected readonly utmKeys = UTM_KEYS;
  protected readonly messages = WHATSAPP_MESSAGES;
  protected readonly responseNote = tbd('Te respondemos en menos de 1 día hábil.');

  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    negocio: ['', [Validators.required, Validators.maxLength(160)]],
    contacto: ['', [Validators.required, contactValidator]],
    necesidad: ['', Validators.required],
    privacidad: [false, Validators.requiredTrue],
  });

  protected readonly lead = injectLeadForm(FIELD_IDS);

  protected submit(): Promise<void> {
    return this.lead.submit(this.form, (utm) => {
      const value = this.form.getRawValue();
      return {
        origen: 'cierre',
        nombre: value.nombre.trim(),
        negocio: value.negocio.trim(),
        contacto: value.contacto.trim(),
        necesidad: value.necesidad,
        plan: null,
        utm,
      };
    });
  }
}
