import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, type IconName } from '../atoms/icon';
import { Heading3 } from '../atoms/text';

/** Tarjeta de problema: ícono + título + descripción. */
@Component({
  selector: 'article[appProblemCard]',
  imports: [Icon, Heading3],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid content-start gap-3 rounded-md border border-border bg-white p-8',
  },
  template: `
    <app-icon [name]="icon()" class="size-10 text-plum" />
    <h3 appH3>{{ heading() }}</h3>
    <p class="text-muted-foreground">{{ text() }}</p>
  `,
})
export class ProblemCard {
  readonly icon = input.required<IconName>();
  readonly heading = input.required<string>();
  readonly text = input.required<string>();
}
