import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../atoms/icon';

/** Elemento de lista: palomita + texto (entregables de un plan, acciones del diagnóstico). */
@Component({
  selector: 'li[appCheckItem]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-start gap-3 text-base leading-snug' },
  template: `
    <app-icon name="check" class="size-5 text-plum on-dark:text-pink" />
    <span class="min-w-0"><ng-content /></span>
  `,
})
export class CheckItem {}
