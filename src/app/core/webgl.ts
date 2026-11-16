/** Utilidades de WebGL 2 compartidas por el radar y el degradado vivo. Solo en el navegador. */

export const compileProgram = (
  gl: WebGL2RenderingContext,
  vertex: string,
  fragment: string,
): WebGLProgram | null => {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
};

/** Color de un token (`--brand-pink`) en 0..1, resuelto por el navegador: nada de colores a mano. */
export const tokenColor = (host: Element, token: string): [number, number, number] => {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  probe.hidden = true;
  host.append(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/[\d.]+/g)
    ?.map(Number) ?? [0, 0, 0];
  probe.remove();
  return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
};

/** Duración de un token de movimiento en ms (0 con movimiento reducido). */
export const tokenMs = (token: string): number => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? (raw.endsWith('ms') ? n : n * 1000) : 0;
};

export const prefersReducedMotion = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;
