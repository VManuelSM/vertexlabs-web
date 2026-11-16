import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { LivingGradient } from '@app/core/living-gradient';
import { prefersReducedMotion } from '@app/core/webgl';

/**
 * Degradado de marca (`--gradient-brand`), solo donde el manual lo permite: banda de cierre, fondo
 * de capturas de proyectos, imagen para compartir y encabezado del portal. Ocupa el contenedor
 * posicionado más cercano y queda detrás del contenido.
 *
 * Con `live`, encima del degradado CSS (que sale en el HTML prerenderizado) se dibuja su versión
 * viva en WebGL, que aparece con un fundido. Con movimiento reducido o sin WebGL queda el CSS.
 */
@Component({
  selector: 'app-brand-gradient',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none absolute inset-0 -z-10 block bg-(image:--gradient-brand)',
    'aria-hidden': 'true',
  },
  template: `
    @if (live()) {
      <canvas
        #canvas
        class="block size-full transition-opacity duration-(--motion-base)"
        [class.opacity-0]="!ready()"
      ></canvas>
    }
  `,
})
export class BrandGradient {
  readonly live = input(false, { transform: booleanAttribute });
  protected readonly ready = signal(false);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const canvas = this.canvas()?.nativeElement;
      if (!canvas || prefersReducedMotion()) return;
      const gradient = LivingGradient.create(canvas, () => this.ready.set(false));
      if (!gradient) return;
      const observer = new IntersectionObserver(([entry]) =>
        gradient.setVisible(entry.isIntersecting),
      );
      observer.observe(host);
      this.ready.set(true);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        gradient.destroy();
      });
    });
  }
}
