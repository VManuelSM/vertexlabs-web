import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButton } from '@ui/button';
import { TRUST_SEALS } from '../data/content';
import { HeroParticles } from './hero-particles';
import { BrowserIllustration } from './illustrations/browser-illustration';

@Component({
  selector: 'app-hero-section',
  imports: [BrowserIllustration, HeroParticles, HlmButton],
  template: `
    <section class="relative pt-8.5 pb-11.5 sm:pt-20 sm:pb-19.5" aria-labelledby="hero-title">
      <app-hero-particles />
      <div
        class="hero-grid wrap relative z-1 grid items-center gap-7.5 text-center sm:gap-11 lg:gap-13 lg:text-left"
      >
        <div class="enter">
          <span
            class="glass-pill eyebrow mb-4.5 inline-block px-3.25 py-1.5 text-2xs text-ink-2 shadow-inset sm:mb-6 sm:px-3.75 sm:py-1.75 sm:text-xs"
          >
            Páginas web para negocios · Hecho en México
          </span>
          <h1
            id="hero-title"
            class="mb-4 text-hero-compact tracking-display sm:mx-auto sm:mb-5.5 sm:max-w-title sm:text-hero lg:mx-0"
          >
            Tu negocio en internet, hecho bien y
            <span class="bg-linear-120 from-brand to-aurora-2 bg-clip-text text-transparent"
              >sin sorpresas</span
            >.
          </h1>
          <p class="mx-auto max-w-intro text-lg font-regular text-ink-2 sm:text-intro lg:mx-0">
            Hacemos tu página web o tu tienda en línea con un precio cerrado desde el principio. Te
            decimos la verdad antes de cobrarte, y seguimos contigo después de entregar.
          </p>
          <div
            class="mt-6 flex flex-wrap justify-center gap-2.5 sm:mt-8 sm:gap-3.25 lg:justify-start"
          >
            <a hlmBtn variant="cta" size="cta-lg" class="max-sm:flex-auto" href="#diagnostico"
              >¿Qué necesito? →</a
            >
            <a hlmBtn variant="glass" size="cta-lg" class="max-sm:flex-auto" href="#paquetes"
              >Ver precios</a
            >
          </div>
          <ul
            class="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8.5 sm:gap-2.5 lg:justify-start"
            aria-label="Garantías"
          >
            @for (seal of seals; track seal) {
              <li
                class="glass-pill px-3 py-1.75 font-mono text-2xs tracking-mono text-ink-2 max-xs:px-2.5 max-xs:py-1.5 sm:px-3.5 sm:py-2 sm:text-xs"
              >
                <b class="font-regular text-brand" aria-hidden="true">◆</b> {{ seal }}
              </li>
            }
          </ul>
        </div>

        <div class="enter relative perspective-distant" style="--enter-delay: 120ms">
          <app-browser-illustration />
          <div class="chip chip-1">
            <span class="chip-icon">★</span>
            <div>Producto propio<small>en producción</small></div>
          </div>
          <div class="chip chip-2">
            <span class="chip-icon">⚡</span>
            <div>Entrega ~2 sem<small>precio cerrado</small></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    /* lg = 920 px: texto y maqueta lado a lado, como el mockup (1.02fr / 0.98fr). */
    @media (width >= 57.5rem) {
      .hero-grid {
        grid-template-columns: 1.02fr 0.98fr;
      }
    }

    /* Sellos flotantes sobre la maqueta. Ocultos en móvil. */
    .chip {
      position: absolute;
      z-index: 3;
      display: none;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--glass-border);
      background: var(--glass-strong);
      -webkit-backdrop-filter: blur(var(--blur-button));
      backdrop-filter: blur(var(--blur-button));
      box-shadow:
        var(--glass-shadow),
        inset 0 1px 0 var(--glass-highlight);
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      color: var(--ink);
      text-align: left;
      animation: float 12s ease-in-out infinite;
    }

    .chip-1 {
      top: 14%;
      left: 2%;
      animation-delay: -2s;
    }

    .chip-2 {
      right: 2%;
      bottom: 12%;
      animation-delay: -7s;
    }

    /* sm = 640 px: aparecen los sellos; lg = 920 px: sobresalen de la maqueta. */
    @media (width >= 40rem) {
      .chip {
        display: flex;
      }
    }

    @media (width >= 57.5rem) {
      .chip-1 {
        left: -6%;
      }

      .chip-2 {
        right: -4%;
      }
    }

    .chip small {
      display: block;
      font-family: var(--font-mono);
      font-size: var(--text-2xs);
      font-weight: var(--font-weight-regular);
      letter-spacing: var(--tracking-mono);
      color: var(--ink-3);
    }

    .chip-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: var(--radius-sm);
      background: linear-gradient(140deg, var(--brand), var(--brand-strong));
      color: var(--on-brand);
      font-size: var(--text-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  protected readonly seals = TRUST_SEALS;
}
