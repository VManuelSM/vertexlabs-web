// Ruta base del sitio publicado (p. ej. "/vertexlabs-web/" en GitHub Pages). Su única fuente es
// angular.json → build.configurations.production.baseHref; aquí la leen serve-dist y Playwright.
import fs from 'node:fs';
import path from 'node:path';

const angular = JSON.parse(
  fs.readFileSync(path.resolve(import.meta.dirname, '../angular.json'), 'utf8'),
);

export const baseHref =
  angular.projects['vertexlabs-web'].architect.build.configurations.production.baseHref ?? '/';
