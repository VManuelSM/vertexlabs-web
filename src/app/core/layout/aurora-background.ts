import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Fondo del material liquid glass: aurora difuminada, orbes de vidrio y viñeta. Decorativo. */
@Component({
  selector: 'app-aurora-background',
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="aurora blur-aurora-compact saturate-125 sm:blur-aurora">
      <b class="blob-1"></b>
      <b class="blob-2"></b>
      <b class="blob-3"></b>
      <b class="blob-4"></b>
    </div>
    <div class="orbs hidden sm:block">
      <i class="orb-1"></i>
      <i class="orb-2"></i>
      <i class="orb-3"></i>
    </div>
    <div class="vignette"></div>
  `,
  styleUrl: './aurora-background.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuroraBackground {}
