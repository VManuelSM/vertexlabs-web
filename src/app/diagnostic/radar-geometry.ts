/** Geometría del radar del prototipo: hexágono con centro (160, 150) y radio 100 en un lienzo 380 × 300. */
export const RADAR = {
  cx: 160,
  cy: 150,
  r: 100,
  /** `viewBox` del SVG: x, y, ancho, alto. */
  view: [-30, 0, 380, 300] as const,
  levels: 4,
} as const;

export const RADAR_VIEWBOX = RADAR.view.join(' ');

/** Punto del eje `i` (0 = arriba, en sentido horario) para un valor de 0 a 4. */
export const radarPoint = (i: number, value: number): readonly [number, number] => {
  const angle = ((-90 + i * 60) * Math.PI) / 180;
  const d = (RADAR.r * value) / RADAR.levels;
  return [RADAR.cx + Math.cos(angle) * d, RADAR.cy + Math.sin(angle) * d];
};

export const toPoints = (points: readonly (readonly [number, number])[]): string =>
  points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
