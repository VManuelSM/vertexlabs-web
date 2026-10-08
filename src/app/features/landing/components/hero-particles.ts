import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { ThemeService } from '../../../core/theme/theme.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MAX_PARTICLES = 46;
const LINK_DISTANCE = 118;

/**
 * Campo de partículas del hero (inspirado en Neracode, desaturado). Solo en navegador: se pausa
 * cuando el hero sale de pantalla y no corre con prefers-reduced-motion.
 */
@Component({
  selector: 'app-hero-particles',
  host: {
    class: 'pointer-events-none absolute inset-0 opacity-55 motion-reduce:hidden',
    'aria-hidden': 'true',
  },
  template: `<canvas #canvas class="block size-full"></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroParticles {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly theme = inject(ThemeService);
  private color = '';

  constructor() {
    const destroyRef = inject(DestroyRef);

    // El acento se relee solo al cambiar de tema, no en cada cuadro.
    effect(() => {
      this.theme.theme();
      this.color = '';
    });

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const view = canvas.ownerDocument.defaultView;
      const ctx = canvas.getContext('2d');
      if (!view || !ctx || view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const dpr = Math.min(view.devicePixelRatio || 1, 2);
      let width = 0;
      let height = 0;
      let particles: Particle[] = [];
      let frame = 0;
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(MAX_PARTICLES, Math.round(width / 28));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
        }));
      };

      const draw = () => {
        if (!this.color) {
          this.color = view.getComputedStyle(canvas).getPropertyValue('--brand').trim();
        }
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = ctx.fillStyle = this.color;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const distance = Math.hypot(p.x - q.x, p.y - q.y);
            if (distance < LINK_DISTANCE) {
              ctx.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.3;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
        frame = view.requestAnimationFrame(draw);
      };

      const start = () => {
        if (!frame) frame = view.requestAnimationFrame(draw);
      };
      const stop = () => {
        view.cancelAnimationFrame(frame);
        frame = 0;
      };

      const visibility = new IntersectionObserver(([entry]) =>
        entry?.isIntersecting ? start() : stop(),
      );
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 180);
      };

      resize();
      visibility.observe(canvas);
      view.addEventListener('resize', onResize);

      destroyRef.onDestroy(() => {
        stop();
        clearTimeout(resizeTimer);
        visibility.disconnect();
        view.removeEventListener('resize', onResize);
      });
    });
  }
}
