import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrnField } from '@spartan-ng/brain/field';
import { HlmFieldImports } from '@ui/field';
import { HlmLabel } from '@ui/label';

/**
 * Campo de formulario: etiqueta + control (proyectado) + mensaje de error. Se apoya en el campo de
 * Spartan: el error aparece cuando el control es inválido y ya se tocó (o se intentó enviar), se
 * enlaza con `aria-describedby` y se anuncia (role="alert").
 *
 * ```html
 * <app-form-field label="Nombre" for="cf-nombre" error="Escribe tu nombre.">
 *   <input hlmInput id="cf-nombre" formControlName="nombre" />
 * </app-form-field>
 * ```
 */
@Component({
  selector: 'app-form-field',
  imports: [HlmFieldImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnField, inputs: ['forceInvalid'] }],
  host: { class: 'group/field flex w-full flex-col gap-2', 'data-slot': 'field' },
  template: `
    <label hlmFieldLabel [for]="for()">
      {{ label() }}
      @if (optional()) {
        <span class="font-normal text-muted-foreground">(opcional)</span>
      }
    </label>
    <ng-content />
    @if (error()) {
      <hlm-field-error [forceShow]="showError()">{{ error() }}</hlm-field-error>
    }
  `,
})
export class FormField {
  readonly label = input.required<string>();
  /** `id` del control que nombra la etiqueta. */
  readonly for = input.required<string>();
  readonly error = input('');
  readonly optional = input(false, { transform: booleanAttribute });
  /** Muestra el error sin esperar a la validación (vista de componentes). */
  readonly showError = input(false, { transform: booleanAttribute });
}

/**
 * Casilla con su etiqueta y su error (aviso de privacidad). La etiqueta se proyecta y puede llevar
 * un enlace.
 *
 * ```html
 * <app-check-field for="cf-privacidad" error="Necesitamos tu aceptación para contactarte.">
 *   <hlm-checkbox inputId="cf-privacidad" formControlName="privacidad" />
 *   Acepto el <a href="/aviso-de-privacidad">aviso de privacidad</a>.
 * </app-check-field>
 * ```
 */
@Component({
  selector: 'app-check-field',
  imports: [HlmFieldImports, HlmLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnField, inputs: ['forceInvalid'] }],
  host: { class: 'group/field flex w-full flex-col gap-2', 'data-slot': 'field' },
  template: `
    <div class="flex items-start gap-3">
      <ng-content select="hlm-checkbox" />
      <label hlmLabel [for]="for()" class="block pt-px text-sm leading-snug font-normal">
        <ng-content />
      </label>
    </div>
    @if (error()) {
      <hlm-field-error [forceShow]="showError()">{{ error() }}</hlm-field-error>
    }
  `,
})
export class CheckField {
  readonly for = input.required<string>();
  readonly error = input('');
  readonly showError = input(false, { transform: booleanAttribute });
}
