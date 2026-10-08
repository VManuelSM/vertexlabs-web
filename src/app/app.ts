import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuroraBackground } from './core/layout/aurora-background';
import { ReviewBar } from './core/layout/review-bar';
import { SiteFooter } from './core/layout/site-footer';
import { SiteHeader } from './core/layout/site-header';
import { WhatsAppFab } from './core/layout/whatsapp-fab';
import { SITE_CONFIG } from './core/site.config';

@Component({
  selector: 'app-root',
  imports: [AuroraBackground, ReviewBar, RouterOutlet, SiteFooter, SiteHeader, WhatsAppFab],
  template: `
    <app-aurora-background />
    @if (site.reviewMode) {
      <app-review-bar />
    }
    <app-site-header />
    <main>
      <router-outlet />
    </main>
    <app-site-footer />
    <app-whatsapp-fab />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly site = inject(SITE_CONFIG);
}
