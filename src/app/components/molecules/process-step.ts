import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { type Copy } from '@app/content/copy';
import { CopyText } from '../atoms/copy';
import { Heading3 } from '../atoms/text';

/** Paso del proceso: número + título + descripción (ruta "Cómo trabajamos"). */
@Component({
  selector: 'li[appProcessStep]',
  imports: [CopyText, Heading3],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid content-start gap-3' },
  template: `
    <span
      aria-hidden="true"
      class="grid size-10 place-items-center rounded-pill bg-navy font-bold text-white tabular-nums"
      >{{ number() }}</span
    >
    <h3 appH3>{{ heading() }}</h3>
    <p class="text-muted-foreground"><app-copy [value]="text()" /></p>
  `,
})
export class ProcessStep {
  readonly number = input.required<number>();
  readonly heading = input.required<string>();
  readonly text = input.required<Copy>();
}
