import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Maqueta de sitio en un marco de navegador de vidrio (hero). Decorativa. */
@Component({
  selector: 'app-browser-illustration',
  host: { 'aria-hidden': 'true', class: 'block' },
  template: `
    <div
      class="device glass overflow-hidden rounded-lg p-0 max-lg:mx-auto max-lg:max-w-115 sm:rounded-xl"
    >
      <div class="bar">
        <i></i><i></i><i></i>
        <span class="url">tunegocio.mx</span>
      </div>
      <div class="screen p-3.25 sm:p-4">
        <div class="nav">
          <span class="logo"></span>
          <span class="line" style="width: 34px"></span>
          <span class="line" style="width: 26px"></span>
          <span class="line" style="width: 30px"></span>
          <span class="pill"></span>
        </div>
        <div class="hero">
          <div class="copy">
            <span class="heading"></span>
            <span class="heading short"></span>
            <span class="text"></span>
            <span class="text short"></span>
            <span class="cta"></span>
          </div>
          <div class="art h-20 sm:h-24"></div>
        </div>
        <div class="cards">
          <span class="card"></span>
          <span class="card"></span>
          <span class="card"></span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './browser-illustration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserIllustration {}
