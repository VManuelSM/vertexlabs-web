import { booleanAttribute, Directive, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

/*
 * Extensión de marca (CLAUDE.md, "Extensiones de helm"): las variantes y tamaños del style mira se
 * sustituyen por los botones del manual (principal rosa, azul marino, contorno, claro sobre fondo
 * oscuro y texto), y se agrega el estado `loading`. El foco lo pinta el anillo global de styles.css.
 */
export const buttonVariants = cva(
  'group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border-2 border-transparent font-bold leading-snug whitespace-nowrap transition select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 data-loading:pointer-events-none data-loading:text-transparent data-loading:after:absolute data-loading:after:size-5 data-loading:after:animate-spin data-loading:after:rounded-pill data-loading:after:border-2 data-loading:after:border-white data-loading:after:border-r-transparent motion-reduce:after:animate-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-plum',
        dark: 'bg-navy text-white hover:bg-plum',
        outline: 'border-navy bg-transparent text-navy hover:bg-navy hover:text-white',
        light: 'border-white bg-transparent text-white hover:bg-white hover:text-navy',
        text: 'text-navy hover:text-plum',
      },
      size: {
        default: 'min-h-tap px-6 py-2 text-base',
        lg: 'min-h-14 px-6 py-3 text-btn',
        icon: 'size-tap border border-input bg-white text-navy hover:border-navy',
        inline: 'min-h-tap px-1 py-2 text-base',
      },
    },
    compoundVariants: [
      // Blanco sobre rosa solo con 19 px o más en negrita (tabla de contraste del manual).
      { variant: 'primary', size: ['default', 'lg'], class: 'min-h-14 px-6 py-3 text-btn' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
  selector: 'button[hlmBtn], a[hlmBtn]',
  exportAs: 'hlmBtn',
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    'data-slot': 'button',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class HlmButton {
  private readonly _config = injectBrnButtonConfig();

  private readonly _additionalClasses = signal<ClassValue>('');

  public readonly variant = input<ButtonVariants['variant']>(this._config.variant);

  public readonly size = input<ButtonVariants['size']>(this._config.size);

  /** Muestra el indicador de carga y bloquea el botón mientras dura una acción. */
  public readonly loading = input(false, { transform: booleanAttribute });

  constructor() {
    classes(() => [
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this._additionalClasses(),
    ]);
  }

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }
}
