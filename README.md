# VertexLabs — landing

Landing de VertexLabs: paquetes de páginas web y tiendas en línea para PyME mexicana, con
diagnóstico interactivo que recomienda un paquete y deja listo el mensaje de WhatsApp.

Es la versión Angular del mockup `vertexlabs-mockup-v0.2.html` (liquid glass). La especificación
vive en Obsidian: `Vertex Labs/Definición del negocio/Modelo de Negocio/23 - MVP Landing VertexLabs
- Arquitectura y Plan de Promocion.md`. Las convenciones para agentes están en
[`CLAUDE.md`](CLAUDE.md).

## Desarrollo

Requiere Node 24 (`nvm use`) y pnpm (versión fijada en `packageManager`).

```bash
pnpm install
pnpm start        # http://localhost:4200
pnpm build        # sitio prerenderizado en dist/vertexlabs-web/browser
pnpm preview      # sirve ese build en http://localhost:4300
pnpm test         # unitarias
pnpm e2e          # build + Playwright en escritorio y móvil
pnpm verify       # tokens, tipos, unitarias y e2e (lo mismo que el CI)
```

La primera vez que se corran los e2e en una máquina nueva: `pnpm exec playwright install chromium`.

## Cómo está hecho

- **Angular 21 LTS** con componentes standalone, signals y sin Zone.js.
- **Prerender estático**: el build es HTML, CSS y JS planos. Se publica en cualquier hosting de
  archivos (Cloudflare Pages, Vercel, Firebase Hosting…) sin servidor Node.
- **SpartanUI** (estilo `maia`) para botones, badges, input y el acordeón del FAQ.
- **Tokens de diseño** en `src/app/shared/tokens/tokens.json`: tema claro/oscuro y la paleta
  Grafito. `pnpm tokens` genera el CSS para Tailwind 4.
- **Contenido separado de las plantillas**: copy en `features/landing/data/content.ts`; precios en
  `features/packages/data/catalog.ts` (única fuente para tarjetas, diagnóstico y WhatsApp).

## Antes de publicar

Pendientes del doc 23 §9 que el código deja marcados:

- [ ] Número oficial de WhatsApp → `src/app/core/site.config.ts` (hoy es un placeholder).
- [ ] Apagar el modo revisión (`reviewMode: false`): quita la franja "MOCKUP" y la nota del pie.
- [ ] Aviso de privacidad del sitio (LFPDPPP) → enlace del pie de página.
- [ ] IVA incluido o no, y alcance topado de cada paquete → `catalog.ts`.
- [ ] Dominio: `canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt` y la `url` del JSON-LD
      en `src/index.html`.
- [ ] Analítica y conteo de clics a WhatsApp y diagnósticos completados (doc 23 §6.4).
