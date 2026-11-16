import { ViewportScroller } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './components/organisms/site-footer';
import { SiteHeader } from './components/organisms/site-header';
import { Toast } from './components/organisms/toast';
import { WhatsappFloat } from './components/organisms/whatsapp-float';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteFooter, SiteHeader, Toast, WhatsappFloat],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-header />
    <main id="principal" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>
    <app-site-footer />
    <app-whatsapp-float />
    <app-toast />
  `,
})
export class App {
  constructor() {
    const scroller = inject(ViewportScroller);
    // Las anclas del router (p. ej., "Volver al formulario") no respetan `scroll-margin-top`: se les
    // da el mismo margen de styles.css, para que el encabezado fijo no tape el inicio de la sección.
    afterNextRender(() => {
      const main = document.getElementById('principal');
      scroller.setOffset(() => [
        0,
        main ? parseFloat(getComputedStyle(main).scrollMarginTop) || 0 : 0,
      ]);
    });
  }
}
