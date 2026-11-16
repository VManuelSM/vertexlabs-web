import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
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
import { Analytics } from '@app/core/analytics';
import { isEmail, isWhatsapp, LeadError, Leads, UTM_KEYS, type Utm } from '@app/core/leads';
import { WHATSAPP_MESSAGES, WhatsappLink } from '@app/core/whatsapp';
import { CopyText } from '../atoms/copy';
import { LinkArrow } from '../atoms/link-arrow';
import { TextImports } from '../atoms/text';
import { CheckField, FormField } from '../molecules/form-field';

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
    LinkArrow,
    ReactiveFormsModule,
    RouterLink,
    TextImports,
    WhatsappLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid min-w-0 gap-4 rounded-lg bg-white p-6 text-navy shadow-md sm:p-8',
    'data-surface': 'light',
  },
  template: `
    @if (state() === 'sent') {
      <div class="grid gap-2 rounded-md border border-border bg-surface p-6">
        <b #success tabindex="-1" class="text-lg">Listo, {{ firstName() }}.</b>
        <span><app-copy [value]="successNote" /></span>
      </div>
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
          <input type="hidden" [name]="key" [value]="utm()[key] ?? ''" />
        }
        <button
          hlmBtn
          variant="dark"
          class="w-full"
          type="submit"
          [loading]="state() === 'sending'"
        >
          Enviar
        </button>
        <p appNote><app-copy [value]="responseNote" /></p>
        <p class="font-semibold" role="status" aria-live="polite">{{ status() }}</p>
        @if (state() === 'error') {
          <!-- TODO(dato): texto cuando falla el envío (no está en el prototipo). -->
          <div class="grid gap-3 rounded-md border-2 border-destructive p-4" role="alert">
            <p class="flex items-center gap-2 font-semibold text-destructive">
              <span
                aria-hidden="true"
                class="inline-grid size-5 shrink-0 place-items-center rounded-pill bg-destructive text-xs font-bold text-white"
                >!</span
              >
              <app-copy [value]="errorNote" />
            </p>
            <a
              appLinkArrow
              class="justify-self-start"
              [appWhatsapp]="messages.general"
              location="cierre-error"
              >Escríbenos por WhatsApp</a
            >
          </div>
        }
      </form>
    }
  `,
})
export class ContactForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly leads = inject(Leads);
  private readonly analytics = inject(Analytics);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly successEl = viewChild<ElementRef<HTMLElement>>('success');

  protected readonly ids = FIELD_IDS;
  protected readonly needs = NEEDS;
  protected readonly utmKeys = UTM_KEYS;
  protected readonly messages = WHATSAPP_MESSAGES;
  protected readonly responseNote = tbd('Te respondemos en menos de 1 día hábil.');
  protected readonly successNote = tbd('Te escribimos en menos de 1 día hábil.');
  protected readonly errorNote = tbd('[Mensaje si no se pudo enviar]', 'Pendiente');

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    negocio: ['', [Validators.required, Validators.maxLength(160)]],
    contacto: ['', [Validators.required, contactValidator]],
    necesidad: ['', Validators.required],
    privacidad: [false, Validators.requiredTrue],
  });

  protected readonly state = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  protected readonly status = signal('');
  protected readonly firstName = signal('');
  protected readonly utm = signal<Utm>({});

  constructor() {
    afterNextRender(() => this.utm.set(this.leads.utm()));
  }

  protected async submit(): Promise<void> {
    if (this.state() === 'sending') return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.status.set('Revisa los campos marcados.');
      const first = (Object.keys(FIELD_IDS) as (keyof typeof FIELD_IDS)[]).find(
        (key) => this.form.controls[key].invalid,
      );
      if (first) this.document.getElementById(FIELD_IDS[first])?.focus();
      return;
    }

    const value = this.form.getRawValue();
    this.state.set('sending');
    this.status.set('');
    try {
      await this.leads.send({
        origen: 'cierre',
        nombre: value.nombre.trim(),
        negocio: value.negocio.trim(),
        contacto: value.contacto.trim(),
        necesidad: value.necesidad,
        plan: null,
        utm: this.utm(),
      });
      this.analytics.track('lead_enviado', {
        origen: 'cierre',
        plan: null,
        canal: this.utm().utm_source ?? 'directo',
      });
      this.firstName.set(value.nombre.trim().split(/\s+/)[0]);
      this.state.set('sent');
      afterNextRender(() => this.successEl()?.nativeElement.focus(), { injector: this.injector });
    } catch (error) {
      if (!(error instanceof LeadError)) console.error(error);
      this.state.set('error');
    }
  }
}
