import { RADAR, radarPoint } from './radar-geometry';

/*
 * Relieve del radar en WebGL 2. Dibuja el área como una pirámide de seis caras vista desde arriba,
 * en las mismas coordenadas que el SVG (que sigue encima con la rejilla, los ejes, las etiquetas y
 * el título accesible). Solo usa el rosa de la marca: la luz cambia la opacidad de cada cara, no el
 * color. Cambia de forma con la duración de `--motion-base` (0 ms con movimiento reducido) y solo
 * dibuja cuando algo cambia.
 */

const VERTEX = `#version 300 es
in vec2 aPos;
in vec3 aNormal;
in float aCenter;
uniform vec4 uView;
out vec3 vNormal;
out float vCenter;
void main() {
  vec2 p = (aPos - uView.xy) / uView.zw;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
  vNormal = aNormal;
  vCenter = aCenter;
}`;

const FRAGMENT = `#version 300 es
precision mediump float;
in vec3 vNormal;
in float vCenter;
uniform vec3 uColor;
uniform float uLine;
out vec4 outColor;
void main() {
  vec3 light = normalize(vec3(-0.45, 0.55, 0.7));
  float lambert = max(dot(normalize(vNormal), light), 0.0);
  float alpha = 0.12 + 0.34 * lambert;
  float d = vCenter / max(fwidth(vCenter), 1e-4);
  float edge = 1.0 - smoothstep(uLine - 1.0, uLine, d);
  alpha = mix(alpha, 1.0, edge);
  outColor = vec4(uColor * alpha, alpha);
}`;

const DOT_VERTEX = `#version 300 es
in vec2 aPos;
uniform vec4 uView;
uniform float uSize;
void main() {
  vec2 p = (aPos - uView.xy) / uView.zw;
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
  gl_PointSize = uSize;
}`;

const DOT_FRAGMENT = `#version 300 es
precision mediump float;
uniform vec3 uColor;
out vec4 outColor;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  float a = 1.0 - smoothstep(0.75, 1.0, d);
  outColor = vec4(uColor * a, a);
}`;

/** Altura del vértice central, en unidades del SVG: da la inclinación de las caras. */
const PEAK = 55;
/** Grosor del borde (2.5 en el SVG del prototipo) y diámetro de los puntos (radio 4). */
const STROKE = 2.5;
const DOT = 8;

const compile = (gl: WebGL2RenderingContext, vertex: string, fragment: string) => {
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

/** Color de un token (`--brand-pink`) en 0..1, resuelto por el navegador. */
const tokenColor = (host: HTMLElement, token: string): [number, number, number] => {
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

const tokenMs = (token: string): number => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? (raw.endsWith('ms') ? n : n * 1000) : 0;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export class RadarRelief {
  private readonly faces: WebGLBuffer;
  private readonly dots: WebGLBuffer;
  private readonly faceVao: WebGLVertexArrayObject;
  private readonly dotVao: WebGLVertexArrayObject;
  private readonly color: [number, number, number];
  private readonly resizeObserver: ResizeObserver;
  private current = [0, 0, 0, 0, 0, 0];
  private target = [0, 0, 0, 0, 0, 0];
  private answered = [false, false, false, false, false, false];
  private from = this.current;
  private start = 0;
  private frame = 0;

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly gl: WebGL2RenderingContext,
    private readonly faceProgram: WebGLProgram,
    private readonly dotProgram: WebGLProgram,
  ) {
    this.faces = gl.createBuffer();
    this.dots = gl.createBuffer();
    const stride = 6 * 4;
    this.faceVao = gl.createVertexArray();
    gl.bindVertexArray(this.faceVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.faces);
    this.attribute(faceProgram, 'aPos', 2, stride, 0);
    this.attribute(faceProgram, 'aNormal', 3, stride, 2 * 4);
    this.attribute(faceProgram, 'aCenter', 1, stride, 5 * 4);
    this.dotVao = gl.createVertexArray();
    gl.bindVertexArray(this.dotVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dots);
    this.attribute(dotProgram, 'aPos', 2, 0, 0);
    gl.bindVertexArray(null);
    this.color = tokenColor(canvas.parentElement ?? canvas, '--brand-pink');
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  /** `null` si el navegador no tiene WebGL 2: el SVG dibuja el área por su cuenta. */
  static create(canvas: HTMLCanvasElement, onLost: () => void): RadarRelief | null {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) return null;
    const faces = compile(gl, VERTEX, FRAGMENT);
    const dots = compile(gl, DOT_VERTEX, DOT_FRAGMENT);
    if (!faces || !dots) return null;
    canvas.addEventListener(
      'webglcontextlost',
      (event) => {
        event.preventDefault();
        onLost();
      },
      { once: true },
    );
    return new RadarRelief(canvas, gl, faces, dots);
  }

  /**
   * Nuevos valores (0 = sin respuesta). Con `grow`, el área nace al 20 % de su tamaño y crece,
   * como la animación de resultado del prototipo.
   */
  set(values: readonly (number | null)[], grow = false): void {
    this.answered = values.map((v) => v !== null && v > 0);
    this.target = values.map((v) => v ?? 0);
    this.from = grow ? this.target.map((v) => v * 0.2) : [...this.current];
    this.start = performance.now();
    if (tokenMs('--motion-base') === 0) {
      this.current = [...this.target];
      this.draw();
      return;
    }
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame((now) => this.tick(now));
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private tick(now: number): void {
    const duration = tokenMs('--motion-base');
    const t = duration ? Math.min(1, (now - this.start) / duration) : 1;
    const k = easeOut(t);
    this.current = this.target.map((v, i) => this.from[i] + (v - this.from[i]) * k);
    this.draw();
    if (t < 1) this.frame = requestAnimationFrame((next) => this.tick(next));
  }

  private resize(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(this.canvas.clientWidth * ratio);
    const height = Math.round(this.canvas.clientHeight * ratio);
    if (!width || !height) return;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.draw();
  }

  private draw(): void {
    const { gl, canvas } = this;
    const [viewX, viewY, viewW, viewH] = RADAR.view;
    const unit = canvas.width / viewW;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Seis caras: centro elevado y dos vértices del contorno, con su normal (y hacia arriba).
    const data: number[] = [];
    const outer = this.current.map((v, i) => radarPoint(i, v));
    for (let i = 0; i < 6; i++) {
      const a = outer[i];
      const b = outer[(i + 1) % 6];
      const c = [RADAR.cx, -RADAR.cy, PEAK];
      const u = [a[0] - c[0], -a[1] - c[1], -PEAK];
      const w = [b[0] - c[0], -b[1] - c[1], -PEAK];
      let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      n = n.map((x) => x / len);
      if (n[2] < 0) n = n.map((x) => -x);
      data.push(RADAR.cx, RADAR.cy, ...n, 1, a[0], a[1], ...n, 0, b[0], b[1], ...n, 0);
    }
    gl.useProgram(this.faceProgram);
    gl.bindVertexArray(this.faceVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.faces);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
    gl.uniform4f(gl.getUniformLocation(this.faceProgram, 'uView'), viewX, viewY, viewW, viewH);
    gl.uniform3fv(gl.getUniformLocation(this.faceProgram, 'uColor'), this.color);
    gl.uniform1f(gl.getUniformLocation(this.faceProgram, 'uLine'), STROKE * unit);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    // Puntos solo en los ejes ya respondidos.
    const points = outer.filter((_, i) => this.answered[i]).flat();
    if (points.length) {
      gl.useProgram(this.dotProgram);
      gl.bindVertexArray(this.dotVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.dots);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.DYNAMIC_DRAW);
      gl.uniform4f(gl.getUniformLocation(this.dotProgram, 'uView'), viewX, viewY, viewW, viewH);
      gl.uniform3fv(gl.getUniformLocation(this.dotProgram, 'uColor'), this.color);
      gl.uniform1f(gl.getUniformLocation(this.dotProgram, 'uSize'), DOT * unit);
      gl.drawArrays(gl.POINTS, 0, points.length / 2);
    }
    gl.bindVertexArray(null);
  }

  private attribute(
    program: WebGLProgram,
    name: string,
    size: number,
    stride: number,
    offset: number,
  ) {
    const location = this.gl.getAttribLocation(program, name);
    if (location < 0) return;
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, stride, offset);
  }
}
