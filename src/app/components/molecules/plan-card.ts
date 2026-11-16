import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBadge } from '@ui/badge';
import { HlmButton, type ButtonVariants } from '@ui/button';
import { type Plan } from '@app/content/plans';
import { WhatsappLink } from '@app/core/whatsapp';
import { CopyText } from '../atoms/copy';
import { Heading3 } from '../atoms/text';
import { CheckItem } from './check-item';
import { Price } from './price';

const TONES = {
  light: { card: 'border-border bg-white', button: 'outline' },
  dark: { card: 'border-navy bg-navy text-white', button: 'primary' },
  sand: { card: 'border-sand bg-sand', button: 'dark' },
} as const satisfies Record<Plan['tone'], { card: string; button: ButtonVariants['variant'] }>;

/** Tarjeta de plan: nombre, para quién es, precio, entregables, plazos y su botón de WhatsApp. */
@Component({
  selector: 'article[appPlanCard]',
  imports: [CheckItem, CopyText, Heading3, HlmBadge, HlmButton, Price, WhatsappLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-6 rounded-md border p-8',
    '[class]': 'tone().card',
    '[attr.data-surface]': 'plan().tone === "light" ? null : plan().tone',
  },
  template: `
    @let p = plan();
    <div class="grid gap-2">
      @if (p.badge) {
        <span hlmBadge>{{ p.badge }}</span>
      }
      <h3 appH3>{{ p.name }}</h3>
      <p class="text-base text-muted-foreground on-dark:text-sand on-sand:text-navy">
        {{ p.audience }}
      </p>
    </div>
    <app-price [plan]="p" />
    <ul class="grid gap-3">
      @for (item of p.includes; track $index) {
        <li appCheckItem><app-copy [value]="item" /></li>
      }
    </ul>
    <div
      class="grid gap-1 border-t border-border pt-4 text-sm on-dark:border-sand/30 on-dark:text-sand on-sand:border-navy/20"
    >
      <span><b>Entrega: </b><app-copy [value]="p.delivery" /></span>
      <span><b>Pago: </b><app-copy [value]="p.payment" /></span>
    </div>
    <a
      hlmBtn
      class="mt-auto w-full"
      [variant]="tone().button"
      [appWhatsapp]="p.whatsapp"
      [location]="'plan-' + p.id"
      [plan]="p.id"
      >{{ p.cta }}</a
    >
  `,
})
export class PlanCard {
  readonly plan = input.required<Plan>();
  protected readonly tone = computed(() => TONES[this.plan().tone]);
}
