// Genera la imagen para compartir (Open Graph y Twitter): public/og-1200x630.jpg.
//
// Sale de las fuentes del sitio, no de valores a mano: colores, degradado, tipografía, radios y
// sombras de src/styles/tokens.css; el logo de atoms/logo-paths.ts; los textos de
// content/share.ts (og:title y og:description del prototipo), y las capturas reales del hero.
// Composición: azul marino con el logo y los textos en blanco y arena (contraste del manual) y, a
// la derecha, el degradado de marca con las capturas, como en el hero.
//
// Uso: `pnpm share-image` (Node 24 y Google Chrome instalado; otra ruta con CHROME=/ruta/a/chrome).
// TODO(dato): volver a generarla cuando lleguen los archivos de Averta (hoy cae a la fuente del
// sistema, igual que el sitio).
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const out = join(root, 'public/og-1200x630.jpg');
const WIDTH = 1200;
const HEIGHT = 630;

const { ISOTYPE, LOGO_VIEWBOX, WORDMARK } = await import(
  join(root, 'src/app/components/atoms/logo-paths.ts')
);
const { SHARE } = await import(join(root, 'src/app/content/share.ts'));
const tokens = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
const dataUri = (path) =>
  `data:image/jpeg;base64,${readFileSync(join(root, 'public', path)).toString('base64')}`;
const [far, near] = SHARE.captures.map(dataUri);
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
${tokens}
* { box-sizing: border-box; margin: 0; }
html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
body {
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: var(--space-7);
  padding: var(--space-7);
  background: var(--brand-navy);
  color: var(--color-text-inverse);
  font-family: var(--font-text);
  -webkit-font-smoothing: antialiased;
}
.copy { display: flex; flex-direction: column; justify-content: space-between; padding: var(--space-3) 0 var(--space-4); }
.logo { display: block; align-self: flex-start; height: 52px; width: auto; }
h1 {
  font-size: var(--text-h1);
  font-weight: var(--fw-bold);
  line-height: var(--leading-tight);
  text-wrap: balance;
}
p {
  margin-top: var(--space-5);
  color: var(--color-text-inverse-muted);
  font-size: var(--text-h3);
  font-weight: var(--fw-semibold);
  line-height: var(--leading-snug);
  max-width: 30ch;
}
.figure {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--gradient-brand);
}
.phone {
  position: absolute;
  width: 216px;
  border: 6px solid var(--brand-navy);
  border-radius: var(--radius-lg);
  background: var(--brand-navy);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.phone img { display: block; width: 100%; height: auto; border-radius: var(--radius-md); }
.far { left: var(--space-6); bottom: calc(var(--space-8) * -1); }
.near { right: var(--space-6); top: var(--space-7); }
</style>
</head>
<body>
  <div class="copy">
    <svg class="logo" viewBox="${LOGO_VIEWBOX.horizontal}" fill="currentColor" aria-hidden="true">
      ${[...WORDMARK, ...ISOTYPE].map((d) => `<path d="${d}"/>`).join('')}
    </svg>
    <div>
      <h1>${escape(SHARE.title)}.</h1>
      <p>${escape(SHARE.description)}</p>
    </div>
  </div>
  <div class="figure">
    <div class="phone far"><img src="${far}" alt=""></div>
    <div class="phone near"><img src="${near}" alt=""></div>
  </div>
</body>
</html>`;

// Captura con Chrome sin interfaz por el protocolo de DevTools (sin dependencias).
const chromePath =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const work = mkdtempSync(join(tmpdir(), 'share-image-'));
const page = join(work, 'share.html');
writeFileSync(page, html);
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${join(work, 'profile')}`,
  '--hide-scrollbars',
  '--no-first-run',
  'about:blank',
]);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(150);
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
    } catch {
      // Chrome todavía no abre el puerto.
    }
  }
  if (!target) throw new Error(`No se pudo abrir Chrome en ${chromePath}`);

  const ws = new WebSocket(target);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  const events = new Map();
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method && events.has(msg.method)) {
      events.get(msg.method)();
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, (msg) =>
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result),
      );
      ws.send(JSON.stringify({ id: n, method, params }));
    });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const loaded = new Promise((resolve) => events.set('Page.loadEventFired', resolve));
  await send('Page.navigate', { url: `file://${page}` });
  await loaded;
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  const { data } = await send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 88,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
  });
  writeFileSync(out, Buffer.from(data, 'base64'));
  ws.close();
  console.log(`Imagen para compartir: ${out}`);
} finally {
  // Se espera a que Chrome cierre: mientras tanto sigue escribiendo en su perfil.
  if (chrome.exitCode === null) {
    await new Promise((resolve) => {
      chrome.once('exit', resolve);
      chrome.kill();
    });
  }
  rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
