import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Isotipo de VertexLabs: un vértice ascendente (doc 23 §5.2). Toma el color de `currentColor`. */
@Component({
  selector: 'app-vertex-mark',
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 26 26" fill="none" class="size-full">
      <path
        d="M3 21 L10 8 L13 13 L16 5 L23 21"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <circle cx="16" cy="5" r="2.2" fill="currentColor" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VertexMark {}
