import { Directive } from '@angular/core';
import { HlmLabel } from '@ui/label';
import { classes } from '@ui/utils';

@Directive({
  selector: '[hlmFieldLabel],hlm-field-label',
  hostDirectives: [HlmLabel],
  host: { 'data-slot': 'field-label' },
})
export class HlmFieldLabel {
  constructor() {
    classes(() => [
      'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
      'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
    ]);
  }
}
