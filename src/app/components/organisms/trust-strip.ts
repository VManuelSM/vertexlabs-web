import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TRUST } from '@app/content/home';
import { CopyText } from '../atoms/copy';
import { Icon } from '../atoms/icon';
import { Wrap } from '../atoms/layout';
import { Reveal } from '@app/core/motion';

/** Franja de confianza: clientes reales y datos de la empresa. */
@Component({
  selector: 'app-trust-strip',
  imports: [Reveal, CopyText, Icon, Wrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-label="Clientes y datos de la empresa" class="border-y border-border bg-surface">
      <div appWrap class="grid gap-x-10 gap-y-3 py-6 md:grid-cols-2 md:items-center">
        <div appReveal>
          <p class="mb-2 text-xs font-bold tracking-eyebrow text-muted-foreground uppercase">
            Negocios que ya trabajan con nosotros
          </p>
          <ul class="flex flex-wrap gap-x-6 gap-y-2 text-base font-bold">
            @for (client of trust.clients; track $index) {
              <li><app-copy [value]="client" /></li>
            }
          </ul>
        </div>
        <ul
          appReveal="1"
          class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground md:justify-end"
        >
          @for (fact of trust.facts; track fact.icon) {
            <li class="inline-flex items-center gap-2">
              <app-icon [name]="fact.icon" class="size-5 text-plum" /><app-copy
                [value]="fact.text"
              />
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class TrustStrip {
  protected readonly trust = TRUST;
}
