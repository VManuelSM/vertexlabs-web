import { type Page, expect, test } from '@playwright/test';

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 640;

test.describe('Landing VertexLabs (doc 23)', () => {
  test('el HTML prerenderizado ya trae el contenido, sin depender de JavaScript (SEO §7)', async ({
    request,
  }) => {
    const html = await (await request.get('./')).text();
    expect(html).toContain('lang="es-MX"');
    expect(html).toContain('Tu negocio en internet, hecho bien y');
    expect(html).toContain('Presencia PyME');
    expect(html).toContain('$5,900');
    expect(html).toContain('Porque no es lo mismo.');
    expect(html).toMatch(/href="https:\/\/wa\.me\/527712291403\?text=Hola/);
    expect(html).toContain('"@type": "ProfessionalService"');
  });

  test('las miniaturas para redes sociales están declaradas y se sirven', async ({ request }) => {
    const html = await (await request.get('./')).text();
    const meta = (key: string) =>
      html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]+)"`))?.[1];

    expect(meta('og:image')).toMatch(/^https:\/\/.+\/og-image\.jpg$/);
    expect(meta('og:image:width')).toBe('1200');
    expect(meta('og:image:height')).toBe('630');
    expect(meta('twitter:card')).toBe('summary_large_image');
    expect(meta('og:url')).toBe(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);

    for (const [file, type] of [
      ['og-image.jpg', 'image/jpeg'],
      ['apple-touch-icon.png', 'image/png'],
    ]) {
      const response = await request.get(`./${file}`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toBe(type);
    }
  });

  test('los casos enlazan a los sitios en producción (§4, Sec 7)', async ({ page }) => {
    await page.goto('./#casos');
    const cases = page.locator('#casos');
    await expect(cases.getByRole('link', { name: 'kindu.vertexlabs.mx' })).toHaveAttribute(
      'href',
      'https://kindu.vertexlabs.mx/login',
    );
    await expect(cases.getByRole('link', { name: 'planificatuvivienda.com' })).toHaveAttribute(
      'href',
      'https://planificatuvivienda.com',
    );
    await expect(page.locator('footer').getByRole('link', { name: /Kindu/ })).toHaveAttribute(
      'href',
      'https://kindu.vertexlabs.mx/login',
    );
  });

  test('carga sin errores de consola ni desborde horizontal', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.mouse.wheel(0, 20_000);
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    expect(errors).toEqual([]);
  });

  test('el diagnóstico recomienda un paquete y prepara el WhatsApp (§3.2)', async ({ page }) => {
    await page.goto('./#diagnostico');
    const panel = page.locator('#diagnostico');

    await panel.getByRole('button', { name: /Vender en línea/ }).click();
    await expect(panel.getByText('Pregunta 2 de 3')).toBeVisible();
    await panel.getByRole('button', { name: /Sí, pero no funciona/ }).click();
    await expect(panel.getByText('Pregunta 3 de 3')).toBeVisible();
    await panel.getByLabel(/Qué vende tu negocio/).fill('ropa deportiva');
    await panel.getByLabel(/Qué vende tu negocio/).press('Enter');

    await expect(panel.getByRole('heading', { name: 'E-commerce con pasarela' })).toBeVisible();
    await expect(panel.getByText('$28,000 – $35,000 MXN')).toBeVisible();
    const href = await panel
      .getByRole('link', { name: /Enviar por WhatsApp/ })
      .getAttribute('href');
    const message = decodeURIComponent(href!.split('?text=')[1]);
    expect(message).toContain('Quiero vender en línea, tengo web pero no funciona.');
    expect(message).toContain('Mi negocio: ropa deportiva.');

    await panel.getByRole('button', { name: 'Empezar de nuevo' }).click();
    await expect(panel.getByText('Pregunta 1 de 3')).toBeVisible();
  });

  test('el tema oscuro se recuerda al recargar', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('./');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: 'Cambiar a tema oscuro' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Cambiar a tema claro' })).toBeVisible();
  });

  test('usa la paleta Grafito, sin selector de paleta', async ({ page }) => {
    await page.goto('./');
    const brand = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand').trim(),
    );
    expect(brand.toUpperCase()).toBe('#5B77B8');
    await expect(page.getByRole('button', { name: /paleta/i })).toHaveCount(0);
  });

  test('el FAQ abre la primera respuesta y despliega las demás', async ({ page }) => {
    await page.goto('./#faq');
    const faq = page.locator('#faq');
    const first = faq.getByRole('button', { name: /Por qué cuestan más/ });
    const second = faq.getByRole('button', { name: /Cuánto cuesta y cuánto tarda/ });

    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(faq.getByText('Cada paquete trae su precio')).toBeVisible();
  });

  test('las anclas del menú llevan a su sección', async ({ page }) => {
    test.skip(isMobile(page), 'En móvil el menú de anclas se oculta, como en el mockup.');
    await page.goto('./');
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Paquetes' })
      .click();
    await expect(page).toHaveURL(/#paquetes$/);
    await expect(page.getByRole('heading', { name: /Elige por dónde empezar/ })).toBeInViewport();
  });

  test('en móvil la barra es compacta y WhatsApp queda a un toque', async ({ page }) => {
    test.skip(!isMobile(page), 'Solo aplica al viewport móvil.');
    await page.goto('./');
    const header = await page.locator('app-site-header').boundingBox();
    expect(header!.height).toBeLessThanOrEqual(59);
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeHidden();

    const fab = page.locator('app-whatsapp-fab a');
    await expect(fab).toBeInViewport();
    await expect(fab).toHaveAttribute('href', /^https:\/\/wa\.me\//);
  });
});
