import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, type IconName } from './icon';

/**
 * Enlace con flecha: subrayado rosa y flecha al final ("Ver planes y precios →"). Con
 * `icon="back"` la flecha va al inicio ("← Volver al sitio").
 */
@Component({
  selector: 'a[appLinkArrow], button[appLinkArrow]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'group/link inline-flex min-h-7 cursor-pointer items-center gap-2 border-b-2 border-pink pb-px font-bold text-current transition-colors hover:border-plum',
  },
  template: `
    @if (icon() === 'back') {
      <app-icon
        name="back"
        class="size-5 transition-transform duration-(--motion-base) group-hover/link:-translate-x-1"
      />
    }
    <ng-content />
    @if (icon() !== 'back') {
      <app-icon
        [name]="icon()"
        class="size-5 transition-transform duration-(--motion-base) group-hover/link:translate-x-1"
      />
    }
  `,
})
export class LinkArrow {
  readonly icon = input<IconName>('arrow');
}
