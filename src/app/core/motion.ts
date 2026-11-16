import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { prefersReducedMotion } from './webgl';

/** Un solo IntersectionObserver para todas las apariciones. */
let observer: IntersectionObserver | null = null;
const show = (el: Element) => {
  el.setAttribute('data-reveal', 'shown');
  // Al terminar, se quita la marca: el retraso escalonado no debe frenar el hover después.
  const done = (event: Event) => {
    if (event.target !== el) return;
    el.removeAttribute('data-reveal');
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done);
};
const revealObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries, io) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        show(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  ));

/**
 * Aparece (sube y se desvanece hacia adentro) al entrar en pantalla: `<div appReveal>` o, en una
 * lista, `[appReveal]="$index"` para escalonar. Lo que ya se ve al cargar no se oculta nunca, el
 * HTML prerenderizado sale visible y con movimiento reducido no hace nada.
 */
@Directive({
  selector: '[appReveal]',
  host: { '[style.--stagger]': 'stagger()' },
})
export class Reveal {
  /** Posición en una lista, para escalonar la aparición. */
  readonly stagger = input(0, {
    alias: 'appReveal',
    transform: (value: number | string) => Number(value) || 0,
  });

  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    afterNextRender(() => {
      if (prefersReducedMotion() || el.getBoundingClientRect().top < innerHeight) return;
      el.setAttribute('data-reveal', 'hidden');
      revealObserver().observe(el);
    });
    inject(DestroyRef).onDestroy(() => observer?.unobserve(el));
  }
}

/**
 * Profundidad que sigue al cursor: escribe --px y --py (de -1 a 1) en el elemento; sus hijos con
 * `parallax-near` o `parallax-far` se desplazan. Solo con mouse y sin movimiento reducido.
 */
@Directive({ selector: '[appParallax]' })
export class Parallax {
  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
      }
      let frame = 0;
      const move = (event: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--px', (((event.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
          el.style.setProperty('--py', (((event.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
        });
      };
      const leave = () => {
        cancelAnimationFrame(frame);
        el.style.setProperty('--px', '0');
        el.style.setProperty('--py', '0');
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}
