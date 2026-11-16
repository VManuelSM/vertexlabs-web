import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/*
 * Set de íconos del sitio (prototipo, símbolos #i-*): trazo redondeado sobre una rejilla de 24.
 * Círculos y rectángulos del prototipo están convertidos a trazos para guardar solo `d`.
 */
const ICONS = {
  search: ['M4.5 11a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0', 'M20 20l-4.3-4.3'],
  chat: ['M4.5 5.5h15v10.5H10l-4.5 3.5V16h-1z', 'M8.5 9.5h7M8.5 12.5h4.5'],
  grid: [
    'M5.5 4.5h13a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1 -1.5 1.5h-13a1.5 1.5 0 0 1 -1.5 -1.5v-12a1.5 1.5 0 0 1 1.5 -1.5z',
    'M4 9.5h16M4 14.5h16M10 4.5v15',
  ],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  arrow: ['M5 12h14M13 6l6 6-6 6'],
  back: ['M19 12H5M11 6l-6 6 6 6'],
  menu: ['M4 7h16M4 12h16M4 17h16'],
  close: ['M6 6l12 12M18 6L6 18'],
  pin: [
    'M12 21s-6.5-5.6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z',
    'M9.7 9.8a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0 -4.6 0',
  ],
  receipt: ['M6 3.5h12v17l-3-2-3 2-3-2-3 2z', 'M9 8.5h6M9 12.5h6'],
  clock: ['M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0', 'M12 8v4.5l3 2'],
  external: ['M14 4.5h5.5V10M19.5 4.5L11 13', 'M18 14v5.5H4.5V6H10'],
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** Ícono decorativo del set del sitio. Siempre `aria-hidden`: el texto vecino da el significado. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block size-6 shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg
      class="pointer-events-none block size-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = computed(() => ICONS[this.name()]);
}
