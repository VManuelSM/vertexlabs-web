import { Directive, input } from '@angular/core';
import { classes } from '@ui/utils';
import { type VariantProps, cva } from 'class-variance-authority';

/*
 * Extensión de marca: la insignia del manual ("Recomendado si ya vendes", etiqueta de plan) en
 * arena con texto azul marino, en mayúsculas.
 */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-pill px-3 py-1 text-xs font-bold whitespace-nowrap uppercase',
  {
    variants: {
      variant: {
        default: 'bg-sand text-navy',
        outline: 'border border-input text-muted-foreground',
        dark: 'bg-navy text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  selector: '[hlmBadge],hlm-badge',
  host: {
    'data-slot': 'badge',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmBadge {
  public readonly variant = input<BadgeVariants['variant']>('default');

  constructor() {
    classes(() => badgeVariants({ variant: this.variant() }));
  }
}
