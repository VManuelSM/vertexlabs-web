#!/usr/bin/env node
/* Busca y descarga fotos de Unsplash por la API oficial, convierte a WebP
   (2000px + 1000px) con sharp y registra el crédito en public/ASSETS.md.

   Uso:  node scripts/unsplash.mjs "sand dunes abstract" [--pick N] [--out nombre]
   Requiere UNSPLASH_ACCESS_KEY en .env o en el entorno. */

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

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error("Falta UNSPLASH_ACCESS_KEY (ponla en .env). Nada descargado.");
  process.exit(1);
}

const args = process.argv.slice(2);
const query = args.find((a) => !a.startsWith("--"));
const pick = Number(args[args.indexOf("--pick") + 1]) || 0;
const outName = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
if (!query) {
  console.error('Uso: node scripts/unsplash.mjs "<query en inglés>" [--pick N] [--out nombre]');
  process.exit(1);
}

const api = (p) =>
  fetch(`https://api.unsplash.com${p}`, {
    headers: { Authorization: `Client-ID ${KEY}`, "Accept-Version": "v1" },
  }).then((r) => {
    if (!r.ok) throw new Error(`Unsplash ${r.status}: ${r.statusText}`);
    return r.json();
  });

const res = await api(`/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`);
if (!res.results.length) {
  console.error("Sin resultados.");
  process.exit(1);
}

if (!args.includes("--pick")) {
  res.results.forEach((p, i) =>
    console.log(`${i}. ${p.id} — ${p.description || p.alt_description || "(sin descripción)"} — ${p.width}x${p.height} — por ${p.user.name}`)
  );
  console.log(`\nElige con: node scripts/unsplash.mjs "${query}" --pick <índice> [--out nombre]`);
  process.exit(0);
}

const photo = res.results[pick];
/* Guideline de Unsplash: avisar la descarga */
await api(`/photos/${photo.id}/download`.replace("https://api.unsplash.com", "")).catch(() => {});
const buf = Buffer.from(await (await fetch(`${photo.urls.raw}&w=2400&q=85&fm=jpg`)).arrayBuffer());

const name = outName || `${query.replace(/\s+/g, "-")}-${photo.id}`.toLowerCase();
const dir = path.join(root, "public/images");
mkdirSync(dir, { recursive: true });
await sharp(buf).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
await sharp(buf).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(dir, `${name}-1000.webp`));

const credit = `- \`images/${name}.webp\` — "${photo.description || photo.alt_description || query}" por ${photo.user.name} (@${photo.user.username}), Unsplash License, ${photo.links.html}\n`;
const assetsMd = path.join(root, "public/ASSETS.md");
if (!existsSync(assetsMd)) writeFileSync(assetsMd, "# Assets externos\n\n");
appendFileSync(assetsMd, credit);
console.log(`Guardado: public/images/${name}.webp (+ -1000) y crédito en public/ASSETS.md`);
