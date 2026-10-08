// Genera src/styles/tokens.css desde tokens.json, la única fuente de verdad de la
// identidad visual (Marco AIDLC §5). Dos salidas:
//   1. Variables de runtime: la paleta de palette.default y el tema (data-theme / prefers-color-scheme).
//   2. Bloques @theme de Tailwind 4 que convierten esos tokens en utilidades (bg-glass, text-ink-2…).
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'src/app/shared/tokens/tokens.json');
const target = path.join(root, 'src/styles/tokens.css');
const tokens = JSON.parse(fs.readFileSync(source, 'utf8'));

const rem = (px) => `${px / 16}rem`;
const entries = (group) => Object.entries(group).filter(([key]) => !key.startsWith('__'));
const declarations = (pairs, indent = '  ') =>
  pairs.map(([k, v]) => `${indent}--${k}: ${v};`).join('\n');

const { default: defaultPalette, ...palettes } = tokens.palette;
if (!palettes[defaultPalette]) throw new Error(`palette.default "${defaultPalette}" no existe`);
const paletteVars = entries(palettes[defaultPalette]).filter(([k]) => k !== 'label');

const { light, dark } = tokens.theme;
const lightKeys = Object.keys(light).join();
if (lightKeys !== Object.keys(dark).join())
  throw new Error('theme.light y theme.dark deben declarar las mismas claves');

// Tailwind 4 deriva toda la escala de espaciado de una unidad base.
const base = tokens.spacing['1'];
const linear = entries(tokens.spacing).every(([k, v]) => v === Number(k) * base);
if (!linear) throw new Error('tokens.spacing debe ser múltiplo lineal de spacing.1');

const runtime = `:root {
  color-scheme: light;
${declarations(paletteVars)}
${declarations(entries(light))}
${declarations(entries(tokens.color))}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
${declarations(entries(dark), '    ')}
  }
}

:root[data-theme='dark'] {
  color-scheme: dark;
${declarations(entries(dark))}
}`;

const colorNames = [
  ...paletteVars.map(([k]) => k),
  ...entries(light)
    .filter(([k]) => !k.endsWith('-shadow') && !k.endsWith('-opacity'))
    .map(([k]) => k),
  ...entries(tokens.color).map(([k]) => k),
];

// Tailwind resuelve `text-x` y `shadow-x` contra varios espacios de nombres: un mismo nombre en
// dos de ellos produce utilidades ambiguas (p. ej. `text-base` como color y como tamaño).
const clash = (names, others, label) => {
  const repeated = names.filter((name) => others.includes(name));
  if (repeated.length) throw new Error(`${label}: ${repeated.join(', ')}`);
};
const typeKeys = [
  ...Object.keys(tokens.typography.fontSize),
  ...Object.keys(tokens.typography.fluidSize),
];
clash(colorNames, typeKeys, 'Colores que chocan con tamaños de texto (text-*)');
clash(colorNames, Object.keys(tokens.shadow), 'Colores que chocan con sombras (shadow-*)');

const themeInline = [
  ...colorNames.map((name) => [`color-${name}`, `var(--${name})`]),
  ...entries(tokens.shadow).map(([k, v]) => [`shadow-${k}`, v]),
];

const { fontFamily, fontSize, fluidSize, fontWeight, lineHeight, letterSpacing } =
  tokens.typography;
const theme = [
  ['font-sans', fontFamily.sans],
  ['font-mono', fontFamily.mono],
  // Se descarta la escala tipográfica de Tailwind: solo existen los tamaños del proyecto.
  ['text-*', 'initial'],
  ...entries(fontSize).map(([k, v]) => [`text-${k}`, rem(v)]),
  ...entries(fluidSize).map(([k, v]) => [`text-${k}`, v]),
  ...entries(fontWeight).map(([k, v]) => [`font-weight-${k}`, v]),
  ...entries(lineHeight).map(([k, v]) => [`leading-${k}`, v]),
  ...entries(letterSpacing).map(([k, v]) => [`tracking-${k}`, v]),
  ['spacing', rem(base)],
  ...entries(tokens.borderRadius).map(([k, v]) => [
    `radius-${k}`,
    k === 'full' ? 'calc(infinity * 1px)' : rem(v),
  ]),
  ...entries(tokens.blur).map(([k, v]) => [`blur-${k}`, `${v}px`]),
  // Breakpoints del diseño (mobile-first): sustituyen a los de Tailwind.
  ['breakpoint-*', 'initial'],
  ...entries(tokens.breakpoint).map(([k, v]) => [`breakpoint-${k}`, rem(v)]),
  ['container-site', rem(tokens.layout.maxWidth)],
  // Anchos de lectura en ch (max-w-lead, max-w-reason…).
  ...entries(tokens.measure).map(([k, v]) => [`container-${k}`, v]),
];

const css = `/* Generado por scripts/tokens.mjs desde tokens.json — no editar a mano. */

${runtime}

@theme inline {
${declarations(themeInline)}
}

@theme {
${declarations(theme)}
}
`;

if (process.argv.includes('--check')) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== css) {
    console.error('tokens.css no está sincronizado con tokens.json; ejecuta `pnpm tokens`.');
    process.exit(1);
  }
} else {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, css);
  console.log(
    `tokens.css generado (paleta ${defaultPalette}, ${themeInline.length + theme.length} variables de tema)`,
  );
}
