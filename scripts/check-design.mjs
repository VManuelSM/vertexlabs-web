#!/usr/bin/env node
/*
 * Reglas del manual sobre el código propio (src/app menos el helm generado en shared/ui):
 * sin valores arbitrarios de Tailwind, sin colores escritos a mano, sin `vh` y sin la paleta por
 * defecto. Uso: pnpm check:design
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(process.cwd(), 'src/app');
const SKIP = join(ROOT, 'shared/ui');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (path === SKIP) return [];
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(ts|html|css)$/.test(name) && !name.endsWith('.spec.ts') ? [path] : [];
  });

const RULES = [
  {
    name: 'valor arbitrario de Tailwind (`[…]`)',
    test: (line) => /(?:^|[\s'"`])[\w:/.-]*(?:-\[|\[&|:\[)[^\]]*\]/.test(line),
  },
  {
    name: 'color escrito a mano',
    test: (line) => /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(line) && !/value: '#/.test(line),
  },
  { name: 'altura de pantalla (vh)', test: (line) => /\b\d*[dsl]?vh\b|h-screen/.test(line) },
  {
    name: 'paleta por defecto de Tailwind',
    test: (line) =>
      /\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|decoration)-(?:black|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/.test(
        line,
      ),
  },
];

const problems = walk(ROOT).flatMap((path) =>
  readFileSync(path, 'utf8')
    .split('\n')
    .flatMap((line, i) =>
      RULES.filter((rule) => rule.test(line)).map(
        (rule) => `${relative(process.cwd(), path)}:${i + 1}  ${rule.name}\n    ${line.trim()}`,
      ),
    ),
);

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problema(s) contra las reglas del manual.`);
  process.exit(1);
}
console.log('Reglas del manual: sin problemas.');
