import type { BooleanInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { classes, hlm } from '@ui/utils';
import type { ClassValue } from 'clsx';

export const HLM_NATIVE_SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmNativeSelect),
  multi: true,
};

@Component({
  selector: 'hlm-native-select',
  providers: [HLM_NATIVE_SELECT_VALUE_ACCESSOR, provideBrnLabelable(HlmNativeSelect)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnFieldControl],
  host: {
    'data-slot': 'native-select-wrapper',
    '[attr.data-size]': 'size()',
  },
  template: `
    <select
      data-slot="native-select"
      [id]="selectId()"
      [class]="_computedSelectClass()"
      [attr.data-size]="size()"
      [attr.aria-invalid]="_ariaInvalid() ? 'true' : null"
      [attr.data-invalid]="_ariaInvalid() ? 'true' : null"
      [attr.data-dirty]="_dirty?.() ? 'true' : null"
      [attr.data-touched]="_touched?.() ? 'true' : null"
      [attr.data-matches-spartan-invalid]="_spartanInvalid() ? 'true' : null"
      [value]="value()"
      [disabled]="_disabled()"
      (change)="_valueChanged($event)"
      (blur)="_blur()"
    >
      <ng-content />
    </select>

    <!-- Extensión de marca: flecha en SVG en línea, sin @ng-icons. -->
    <svg
      [class]="_computedSelectIconClass()"
      aria-hidden="true"
      data-slot="native-select-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  `,
})
export class HlmNativeSelect implements ControlValueAccessor {
  private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

  private static _id = 0;

  public readonly selectId = input<string>(`hlm-native-select-${HlmNativeSelect._id++}`);

  public readonly selectClass = input<ClassValue>('');

  protected readonly _computedSelectClass = computed(() =>
    hlm(
      'h-12 w-full min-w-0 cursor-pointer appearance-none rounded-sm border border-input bg-white ps-4 pe-12 text-base text-foreground transition-colors select-none hover:border-navy focus-visible:border-navy disabled:pointer-events-none disabled:cursor-not-allowed data-[matches-spartan-invalid=true]:border-2 data-[matches-spartan-invalid=true]:border-destructive',
      this.selectClass(),
    ),
  );

  public readonly selectIconClass = input<ClassValue>('');

  protected readonly _computedSelectIconClass = computed(() =>
    hlm(
      'pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-navy select-none',
      this.selectIconClass(),
    ),
  );

  public readonly size = input<'sm' | 'default'>('default');

  public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  protected readonly _disabled = linkedSignal(this.disabled);

  /** Whether to force the input into an invalid state. */
  public readonly forceInvalid = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** Manual override for aria-invalid. When not set, auto-detects from the parent autocomplete error state. */
  public readonly ariaInvalidInput = input<boolean | undefined, BooleanInput>(undefined, {
    transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
    alias: 'aria-invalid',
  });

  protected readonly _ariaInvalid = computed(() => this.ariaInvalidInput() ?? this._invalid?.());

  public readonly valueInput = input<string | undefined | null>('', { alias: 'value' });
  public readonly value = linkedSignal(this.valueInput);

  public readonly valueChange = output<string | undefined | null>();

  protected _onChange?: ChangeFn<string | undefined | null>;
  protected _onTouched?: TouchFn;

  public readonly labelableId = this.selectId;

  protected readonly _invalid = this._fieldControl?.invalid;
  protected readonly _touched = this._fieldControl?.touched;
  protected readonly _dirty = this._fieldControl?.dirty;
  protected readonly _spartanInvalid = computed(
    () => this.forceInvalid() || this._fieldControl?.spartanInvalid(),
  );

  constructor() {
    classes(() => 'group/native-select relative block w-full has-[select:disabled]:opacity-50');
  }

  protected _valueChanged(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value.set(value);
    this.valueChange.emit(value);
    this._onChange?.(value);
    this._onTouched?.();
  }

  protected _blur(): void {
    this._onTouched?.();
  }

  /** CONTROL VALUE ACCESSOR */
  public writeValue(value: string | undefined | null): void {
    this.value.set(value);
  }

  public registerOnChange(fn: ChangeFn<string | undefined | null>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
