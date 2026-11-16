import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { type Copy } from '@app/content/copy';
import { CopyText } from '../atoms/copy';

/**
 * Testimonio: cita + nombre y cargo. Solo con citas reales y con permiso por escrito; mientras no
 * existan, el contenido llega marcado como dato por confirmar.
 */
@Component({
  selector: 'blockquote[appTestimonial]',
  imports: [CopyText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-s-4 border-pink ps-4 text-base' },
  template: `
    <p><app-copy [value]="quote()" /></p>
    <footer class="mt-2 text-sm text-muted-foreground"><app-copy [value]="author()" /></footer>
  `,
})
export class Testimonial {
  readonly quote = input.required<Copy>();
  readonly author = input.required<Copy>();
}
