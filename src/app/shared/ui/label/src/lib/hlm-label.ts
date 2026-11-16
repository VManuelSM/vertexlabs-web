import { Directive } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';
import { classes } from '@ui/utils';

/* Extensión de marca: etiqueta de campo en Averta Semibold de 15 px. */
@Directive({
  selector: '[hlmLabel]',
  hostDirectives: [{ directive: BrnLabel, inputs: ['id', 'for'] }],
  host: { 'data-slot': 'label' },
})
export class HlmLabel {
  constructor() {
    classes(
      () =>
        'flex items-center gap-2 text-sm leading-snug font-semibold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    );
  }
}
