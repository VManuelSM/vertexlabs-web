import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  type ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AXES, type Score } from '@app/diagnostic/axes';
import { RadarRelief } from '@app/diagnostic/radar-gl';
import { RADAR, RADAR_VIEWBOX, radarPoint, toPoints } from '@app/diagnostic/radar-geometry';

let nextId = 0;

const RINGS = Array.from({ length: RADAR.levels }, (_, level) =>
  toPoints(AXES.map((_, i) => radarPoint(i, level + 1))),
);
const SPOKES = AXES.map((_, i) => radarPoint(i, RADAR.levels));
const LABELS = AXES.map((axis, i) => {
  const [x, y] = radarPoint(i, 4.85);
  const anchor = Math.abs(x - RADAR.cx) < 4 ? 'middle' : x > RADAR.cx ? 'start' : 'end';
  return { text: axis.short, x: x.toFixed(1), y: (y + 4).toFixed(1), anchor };
});

/**
 * Radar de seis ejes. El SVG es la versión accesible (título con todos los valores) y dibuja la
 * rejilla y las etiquetas; con WebGL 2, el área se dibuja como relieve debajo de la rejilla. Sin
 * WebGL (o antes de hidratar) el SVG dibuja el área plana del prototipo.
 */
@Component({
  selector: 'app-radar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block' },
  template: `
    <canvas
      #canvas
      aria-hidden="true"
      class="absolute inset-0 size-full"
      [class.invisible]="!relief()"
    ></canvas>
    <svg
      [attr.viewBox]="viewBox"
      role="img"
      [attr.aria-labelledby]="titleId"
      class="relative block h-auto w-full overflow-visible"
    >
      <title [id]="titleId">{{ title() }}</title>
      @for (ring of rings; track $index) {
        <polygon [attr.points]="ring" class="fill-none stroke-steel" stroke-width="1" />
      }
      @for (end of spokes; track $index) {
        <line
          [attr.x1]="center[0]"
          [attr.y1]="center[1]"
          [attr.x2]="end[0].toFixed(1)"
          [attr.y2]="end[1].toFixed(1)"
          class="stroke-steel"
          stroke-width="1"
        />
      }
      @if (!relief()) {
        <g
          class="transition-transform duration-(--motion-base)"
          [style.transform-origin]="origin"
          [style.transform]="grown() ? null : 'scale(0.2)'"
        >
          <polygon
            [attr.points]="area()"
            class="fill-pink/20 stroke-pink"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          @for (dot of dots(); track $index) {
            <circle
              [attr.cx]="dot[0].toFixed(1)"
              [attr.cy]="dot[1].toFixed(1)"
              r="4"
              class="fill-pink"
            />
          }
        </g>
      }
      @for (label of labels; track label.text) {
        <text
          [attr.x]="label.x"
          [attr.y]="label.y"
          [attr.text-anchor]="label.anchor"
          class="fill-navy text-xs font-semibold"
        >
          {{ label.text }}
        </text>
      }
    </svg>
  `,
})
export class RadarChart {
  /** Una respuesta por eje, en el orden de las preguntas; `null` si falta. */
  readonly values = input.required<readonly (Score | null)[]>();
  /** El área nace pequeña y crece al aparecer (resultado). */
  readonly grow = input(false, { transform: booleanAttribute });

  protected readonly viewBox = RADAR_VIEWBOX;
  protected readonly rings = RINGS;
  protected readonly spokes = SPOKES;
  protected readonly labels = LABELS;
  protected readonly center = [RADAR.cx, RADAR.cy] as const;
  protected readonly origin = `${RADAR.cx}px ${RADAR.cy}px`;
  protected readonly titleId = `radar-${nextId++}`;

  protected readonly area = computed(() =>
    toPoints(this.values().map((v, i) => radarPoint(i, v ?? 0))),
  );
  protected readonly dots = computed(() =>
    this.values().flatMap((v, i) => (v ? [radarPoint(i, v)] : [])),
  );
  protected readonly title = computed(
    () =>
      'Radar de tu negocio: ' +
      AXES.map((axis, i) => `${axis.name} ${this.values()[i] ?? 'sin respuesta'}`).join(', '),
  );

  /** El relieve en WebGL, cuando el navegador lo permite. */
  protected readonly relief = signal<RadarRelief | null>(null);
  /** Para la animación del área plana: falso solo en el primer cuadro de un radar con `grow`. */
  protected readonly grown = signal(true);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    afterNextRender(() => {
      if (this.grow()) {
        this.grown.set(false);
        requestAnimationFrame(() => requestAnimationFrame(() => this.grown.set(true)));
      }
      const relief = RadarRelief.create(this.canvas().nativeElement, () => this.relief.set(null));
      if (!relief) return;
      relief.set(this.values(), this.grow());
      this.relief.set(relief);
    });

    effect(() => {
      const values = this.values();
      this.relief()?.set(values);
    });

    inject(DestroyRef).onDestroy(() => this.relief()?.destroy());
  }
}
