import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Copy, copyParts, isTbd } from '@app/content/copy';

/** Dato por confirmar: subrayado con puntos en ciruela (arena sobre fondo oscuro). */
@Component({
  selector: 'app-tbd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'cursor-help underline decoration-plum decoration-dotted decoration-2 underline-offset-4 on-dark:decoration-sand',
    '[attr.title]': 'note()',
  },
  template: '<ng-content />',
})
export class TbdMark {
  readonly note = input('Por confirmar');
}

/** Pinta un texto de contenido, marcando sus datos por confirmar. */
@Component({
  selector: 'app-copy',
  imports: [TbdMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (part of parts(); track $index) {
      @if (isTbd(part)) {
        <app-tbd [note]="part.note ?? 'Por confirmar'">{{ part.tbd }}</app-tbd>
      } @else {
        {{ part }}
      }
    }
  `,
})
export class CopyText {
  readonly value = input.required<Copy>();
  protected readonly parts = computed(() => copyParts(this.value()));
  protected readonly isTbd = isTbd;
}
