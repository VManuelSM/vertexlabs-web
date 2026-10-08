import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;

/**
 * E2E contra el build estático prerenderizado (lo mismo que se publicaría), no contra ng serve.
 * `pnpm e2e` compila primero.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    port: PORT,
    reuseExistingServer: !process.env['CI'],
  },
});
