#!/usr/bin/env node
/* Busca y descarga fotos de Pixabay por la API oficial, convierte a WebP
   (2000px + 1000px) con sharp y registra el crédito en public/ASSETS.md.

   Uso:  node scripts/pixabay.mjs "<query en inglés>" [--pick N] [--out nombre]
   Requiere PIXABAY_API_KEY en .env o en el entorno. */

import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const KEY = process.env.PIXABAY_API_KEY;
if (!KEY) {
  console.error("Falta PIXABAY_API_KEY (ponla en .env). Nada descargado.");
  process.exit(1);
}

const args = process.argv.slice(2);
const query = args.find((a) => !a.startsWith("--"));
const pick = Number(args[args.indexOf("--pick") + 1]) || 0;
const outName = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
if (!query) {
  console.error('Uso: node scripts/pixabay.mjs "<query en inglés>" [--pick N] [--out nombre]');
  process.exit(1);
}

const url = `https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=10&safesearch=true&min_width=1600`;
const res = await fetch(url).then((r) => {
  if (!r.ok) throw new Error(`Pixabay ${r.status}: ${r.statusText}`);
  return r.json();
});
if (!res.hits?.length) {
  console.error("Sin resultados.");
  process.exit(1);
}

if (!args.includes("--pick")) {
  res.hits.forEach((p, i) =>
    console.log(`${i}. ${p.id} — ${p.tags} — ${p.imageWidth}x${p.imageHeight} — por ${p.user}`)
  );
  console.log(`\nElige con: node scripts/pixabay.mjs "${query}" --pick <índice> [--out nombre]`);
  process.exit(0);
}

const photo = res.hits[pick];
const buf = Buffer.from(await (await fetch(photo.largeImageURL)).arrayBuffer());

const name = outName || `${query.replace(/\s+/g, "-")}-${photo.id}`.toLowerCase();
const dir = path.join(root, "public/images");
mkdirSync(dir, { recursive: true });
await sharp(buf).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
await sharp(buf).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(dir, `${name}-1000.webp`));

const credit = `- \`images/${name}.webp\` — "${photo.tags}" por ${photo.user}, Pixabay Content License, ${photo.pageURL}\n`;
const assetsMd = path.join(root, "public/ASSETS.md");
if (!existsSync(assetsMd)) writeFileSync(assetsMd, "# Assets externos\n\n");
appendFileSync(assetsMd, credit);
console.log(`Guardado: public/images/${name}.webp (+ -1000) y crédito en public/ASSETS.md`);
