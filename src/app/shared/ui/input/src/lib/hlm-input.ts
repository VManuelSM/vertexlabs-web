import { Directive } from '@angular/core';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnInput } from '@spartan-ng/brain/input';
import { classes } from '@ui/utils';

/* Extensión de marca: campo del manual (48 px de alto, borde azul marino, error en ciruela). */
@Directive({
  selector: '[hlmInput]',
  hostDirectives: [
    { directive: BrnInput, inputs: ['id', 'forceInvalid'] },
    BrnFieldControlDescribedBy,
  ],
  host: { 'data-slot': 'input' },
})
export class HlmInput {
  constructor() {
    classes(
      () =>
        'h-12 w-full min-w-0 rounded-sm border border-input bg-white px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-navy focus-visible:border-navy disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 data-[matches-spartan-invalid=true]:border-2 data-[matches-spartan-invalid=true]:border-destructive',
    );
  }
}
