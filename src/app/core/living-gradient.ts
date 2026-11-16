import { compileProgram, tokenColor } from './webgl';

/*
 * Degradado de marca vivo (excepción WebGL aprobada; ver CLAUDE.md, Movimiento). Reproduce las
 * capas de `--gradient-brand` (un lineal de 100° y cuatro manchas radiales) con los colores leídos
 * de los tokens, y mueve las manchas muy despacio. En el cuadro 0 coincide con el degradado CSS,
 * así que el cambio de uno a otro no se nota. Solo dibuja mientras está en pantalla y la pestaña
 * está visible, a 30 cuadros por segundo y a media resolución (es un degradado suave).
 */

const VERTEX = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform vec2 uSize;
uniform float uTime;
uniform vec3 uNavy;
uniform vec3 uPlum;
uniform vec3 uPink;
uniform vec3 uSteel;
uniform vec3 uSand;
out vec4 outColor;

vec2 drift(float speed, float phase) {
  return 0.12 * vec2(sin(uTime * speed + phase) - sin(phase), sin(uTime * speed * 0.8 + phase * 1.7) - sin(phase * 1.7));
}

float blob(vec2 center, vec2 radius, float alpha, float end) {
  float d = length((vUv - center) / radius);
  return alpha * clamp(1.0 - d / end, 0.0, 1.0);
}

void main() {
  // linear-gradient(100deg, navy 0%, plum 45%, pink 72%, sand 100%)
  float a = radians(100.0);
  vec2 dir = vec2(sin(a), -cos(a));
  float len = abs(uSize.x * sin(a)) + abs(uSize.y * cos(a));
  // vUv crece hacia abajo, como el eje y de CSS.
  float t = dot(vUv * uSize - uSize * 0.5, dir) / len + 0.5;
  vec3 color = t < 0.45 ? mix(uNavy, uPlum, t / 0.45)
    : t < 0.72 ? mix(uPlum, uPink, (t - 0.45) / 0.27)
    : mix(uPink, uSand, (t - 0.72) / 0.28);

  float breathe = 1.0 + 0.08 * sin(uTime * 0.38);
  color = mix(color, uPink, blob(vec2(0.70, 0.25) + drift(0.31, 0.0), vec2(0.45, 0.70) * breathe, 1.0, 0.75));
  color = mix(color, uPlum, blob(vec2(0.42, 0.70) + drift(0.24, 1.3), vec2(0.55, 0.80), 1.0, 0.75));
  color = mix(color, uNavy, blob(vec2(0.08, 1.00) + drift(0.20, 2.1), vec2(0.60, 0.90), 1.0, 0.75));
  color = mix(color, uSteel, blob(vec2(0.00, 0.00) + drift(0.27, 3.7), vec2(0.55, 0.75) / breathe, 0.95, 0.70));

  // Un poco de ruido para que el degradado no haga bandas.
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  outColor = vec4(color + noise / 255.0, 1.0);
}`;

const FRAME_MS = 1000 / 30;
const SCALE = 0.5;

export class LivingGradient {
  private readonly uniforms: Record<string, WebGLUniformLocation | null> = {};
  private readonly resizeObserver: ResizeObserver;
  private readonly onVisibility = () => this.sync();
  private wanted = false;
  private running = false;
  private frame = 0;
  private elapsed = 0;
  private last = 0;

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly gl: WebGL2RenderingContext,
    private readonly program: WebGLProgram,
  ) {
    gl.useProgram(program);
    for (const name of ['uSize', 'uTime', 'uNavy', 'uPlum', 'uPink', 'uSteel', 'uSand']) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    const host = canvas.parentElement ?? canvas;
    for (const [uniform, token] of [
      ['uNavy', '--brand-navy'],
      ['uPlum', '--brand-plum'],
      ['uPink', '--brand-pink'],
      ['uSteel', '--brand-steel'],
      ['uSand', '--brand-sand'],
    ] as const) {
      gl.uniform3fv(this.uniforms[uniform], tokenColor(host, token));
    }
    // Un triángulo que cubre todo el lienzo.
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.resize();
  }

  /** `null` sin WebGL 2: queda el degradado CSS. */
  static create(canvas: HTMLCanvasElement, onLost: () => void): LivingGradient | null {
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) return null;
    const program = compileProgram(gl, VERTEX, FRAGMENT);
    if (!program) return null;
    canvas.addEventListener(
      'webglcontextlost',
      (event) => {
        event.preventDefault();
        onLost();
      },
      { once: true },
    );
    return new LivingGradient(canvas, gl, program);
  }

  /** Se anima solo mientras `visible` sea verdadero y la pestaña esté a la vista. */
  setVisible(visible: boolean): void {
    this.wanted = visible;
    this.sync();
  }

  destroy(): void {
    this.wanted = false;
    this.sync();
    this.resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private sync(): void {
    const run = this.wanted && document.visibilityState === 'visible';
    if (run === this.running) return;
    this.running = run;
    if (run) {
      this.last = performance.now();
      this.frame = requestAnimationFrame((now) => this.tick(now));
    } else {
      cancelAnimationFrame(this.frame);
    }
  }

  private tick(now: number): void {
    if (!this.running) return;
    const delta = now - this.last;
    if (delta >= FRAME_MS) {
      this.elapsed += Math.min(delta, 100);
      this.last = now;
      this.draw();
    }
    this.frame = requestAnimationFrame((next) => this.tick(next));
  }

  private resize(): void {
    const width = Math.max(1, Math.round(this.canvas.clientWidth * SCALE));
    const height = Math.max(1, Math.round(this.canvas.clientHeight * SCALE));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.draw();
  }

  private draw(): void {
    const { gl, canvas } = this;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(this.uniforms['uSize'], canvas.width, canvas.height);
    gl.uniform1f(this.uniforms['uTime'], this.elapsed / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
