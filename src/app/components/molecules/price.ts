import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Plan, priceView } from '@app/content/plans';

/**
 * Precio: monto "+ IVA" y el total con IVA al lado. Sale siempre de `content/plans.ts`.
 * En la tarjeta destacada (fondo azul marino) el monto va en rosa: texto grande, 4.05:1.
 */
@Component({
  selector: 'app-price',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid gap-1' },
  template: `
    <span class="text-sm font-semibold">{{ view().label }}</span>
    <span
      class="leading-tight font-bold tabular-nums"
      [class]="view().tax ? 'text-h2 on-dark:text-pink' : 'text-h3'"
    >
      {{ view().amount }}
      @if (view().tax) {
        <small class="ms-1 text-base font-bold on-dark:text-white">{{ view().tax }}</small>
      }
    </span>
    <span class="text-sm text-muted-foreground on-dark:text-sand on-sand:text-navy">{{
      view().total
    }}</span>
  `,
})
export class Price {
  readonly plan = input.required<Plan>();
  protected readonly view = computed(() => priceView(this.plan()));
}
