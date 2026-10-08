// Genera las miniaturas que muestran las redes al compartir el enlace, con los colores de
// tokens.json (paleta por defecto, tema claro):
//   public/og-image.jpg          1200 × 630  vista previa de WhatsApp, Facebook, LinkedIn y X
//   public/apple-touch-icon.png   180 × 180  ícono en iMessage, Telegram y al guardar en iOS
// Se versionan en el repo; regenerar con `pnpm social` si cambian la paleta o el titular.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const tokens = JSON.parse(
  fs.readFileSync(path.join(root, 'src/app/shared/tokens/tokens.json'), 'utf8'),
);
const palette = tokens.palette[tokens.palette.default];
const light = tokens.theme.light;
const { sans, mono } = tokens.typography.fontFamily;

const mark = (color) => `
  <svg viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M3 21 L10 8 L13 13 L16 5 L23 21" stroke="${color}" stroke-width="2.4"
      stroke-linejoin="round" stroke-linecap="round" />
    <circle cx="16" cy="5" r="2.2" fill="${color}" />
  </svg>`;

const base = `
  :root {
    --brand: ${palette.brand}; --brand-strong: ${palette['brand-strong']};
    --aurora-1: ${palette['aurora-1']}; --aurora-2: ${palette['aurora-2']}; --aurora-3: ${palette['aurora-3']};
    --canvas: ${light.canvas}; --ink: ${light.ink}; --ink-2: ${light['ink-2']}; --ink-3: ${light['ink-3']};
    --glass: ${light.glass}; --glass-strong: ${light['glass-strong']};
    --glass-border: ${light['glass-border']}; --glass-highlight: ${light['glass-highlight']};
    --on-brand: ${tokens.color['on-brand']};
  }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: ${sans}; color: var(--ink); -webkit-font-smoothing: antialiased; overflow: hidden; }`;

// Titular y sellos del hero (hero-section.ts y content.ts → TRUST_SEALS).
const ogHtml = `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><style>${base}
  body { width: 1200px; height: 630px; position: relative; background: var(--canvas); }
  .aurora { position: absolute; inset: -20% -10%; filter: blur(80px) saturate(125%); opacity: .9; }
  .aurora b { position: absolute; border-radius: 50%; opacity: .6; }
  .b1 { width: 620px; height: 620px; left: -120px; top: -220px; background: var(--aurora-1); }
  .b2 { width: 560px; height: 560px; right: -80px; top: -140px; background: var(--aurora-2); }
  .b3 { width: 600px; height: 600px; left: 380px; bottom: -340px; background: var(--aurora-3); }
  .orb { position: absolute; border-radius: 50%; background: var(--glass); border: 1px solid var(--glass-border);
    backdrop-filter: blur(6px); box-shadow: inset 0 2px 6px var(--glass-highlight); }
  .o1 { width: 150px; height: 150px; left: 18px; top: 360px; }
  .o2 { width: 96px; height: 96px; right: 30px; top: 40px; }
  .panel { position: absolute; inset: 44px; padding: 52px 64px; border-radius: 36px;
    background: var(--glass); border: 1px solid var(--glass-border);
    backdrop-filter: blur(22px) saturate(155%);
    box-shadow: 0 24px 60px -30px rgba(20, 32, 64, .42), inset 0 1px 0 var(--glass-highlight);
    display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 34px; font-weight: 650; letter-spacing: -.02em; }
  .brand svg { width: 44px; height: 44px; }
  .eyebrow { font-size: 15px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-2);
    padding: 10px 20px; border-radius: 999px; background: var(--glass-strong); border: 1px solid var(--glass-border); }
  h1 { margin-top: 44px; font-size: 74px; line-height: 1.04; font-weight: 600; letter-spacing: -.04em; max-width: 960px; }
  h1 span { background: linear-gradient(120deg, var(--brand-strong), var(--brand) 55%, var(--aurora-3));
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  p { margin-top: 22px; font-size: 28px; line-height: 1.4; color: var(--ink-2); letter-spacing: -.01em; }
  .seals { margin-top: auto; display: flex; gap: 14px; }
  .seals span { font-family: ${mono}; font-size: 19px; color: var(--ink-2); padding: 10px 20px; border-radius: 999px;
    background: var(--glass-strong); border: 1px solid var(--glass-border); }
  .seals b { color: var(--brand); font-weight: 400; }
</style></head><body>
  <div class="aurora"><b class="b1"></b><b class="b2"></b><b class="b3"></b></div>
  <i class="orb o1"></i><i class="orb o2"></i>
  <main class="panel">
    <div class="top">
      <div class="brand">${mark(palette.brand)}VertexLabs</div>
      <div class="eyebrow">Páginas web · Hecho en México</div>
    </div>
    <h1>Tu negocio en internet, hecho bien y <span>sin sorpresas</span>.</h1>
    <p>Páginas web y tiendas en línea con precio cerrado desde el principio.</p>
    <div class="seals">
      <span><b>◆</b> Precio cerrado</span>
      <span><b>◆</b> Diagnóstico gratis en 30 s</span>
      <span><b>◆</b> En todo México</span>
    </div>
  </main>
</body></html>`;

const iconHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
  body { width: 180px; height: 180px; display: grid; place-items: center;
    background: linear-gradient(140deg, var(--brand), var(--brand-strong)); }
  svg { width: 112px; height: 112px; margin-top: 6px; }
</style></head><body>${mark(tokens.color['on-brand'])}</body></html>`;

const outputs = [
  { file: 'og-image.jpg', html: ogHtml, width: 1200, height: 630, type: 'jpeg', quality: 90 },
  { file: 'apple-touch-icon.png', html: iconHtml, width: 180, height: 180, type: 'png' },
];

const browser = await chromium.launch();
for (const { file, html, width, height, ...image } of outputs) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  const target = path.join(root, 'public', file);
  await page.screenshot({ path: target, ...image });
  console.log(`${file}: ${width}×${height}, ${Math.round(fs.statSync(target).size / 1024)} kB`);
  await page.close();
}
await browser.close();
