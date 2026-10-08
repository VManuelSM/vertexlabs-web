import { defineConfig, devices } from '@playwright/test';
import angular from './angular.json';

const PORT = 4300;
/** Ruta base de GitHub Pages; misma fuente que usa scripts/serve-dist.mjs. */
const baseHref =
  angular.projects['vertexlabs-web'].architect.build.configurations.production.baseHref;

/**
 * E2E contra el build estático prerenderizado y bajo la misma ruta base que GitHub Pages, no
 * contra ng serve. `pnpm e2e` compila primero. Las pruebas navegan con rutas relativas ('./').
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}${baseHref}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'escritorio',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: `http://localhost:${PORT}${baseHref}`,
    reuseExistingServer: !process.env['CI'],
  },
});
