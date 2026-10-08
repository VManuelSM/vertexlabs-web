import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

/** Escalonado del mockup: 70 ms entre hermanos, en ciclos de 6. */
const STAGGER_MS = 70;
const STAGGER_CYCLE = 6;

/**
 * Revela el elemento al entrar en pantalla (mejora progresiva). Lo que ya está visible al
 * hidratar no se toca: el HTML prerenderizado nunca parpadea ni retrasa el LCP.
 *
 * `<div appReveal>` o, dentro de un @for, `<div [appReveal]="$index">` para escalonar.
 */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  readonly index = input(0, {
    alias: 'appReveal',
    transform: (value: unknown) => numberAttribute(value, 0),
  });

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const view = host.ownerDocument.defaultView;
      if (!view || !('IntersectionObserver' in view)) return;
      if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (host.getBoundingClientRect().top < view.innerHeight) return;

      host.style.setProperty('--reveal-delay', `${(this.index() % STAGGER_CYCLE) * STAGGER_MS}ms`);
      host.classList.add('reveal-pending');

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          host.classList.replace('reveal-pending', 'reveal-in');
          observer.disconnect();
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
