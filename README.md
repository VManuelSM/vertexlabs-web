# VertexLabs — landing

Landing de VertexLabs: paquetes de páginas web y tiendas en línea para PyME mexicana, con
diagnóstico interactivo que recomienda un paquete y deja listo el mensaje de WhatsApp.

**Publicada en https://vmanuelsm.github.io/vertexlabs-web/**

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
pnpm preview      # sirve ese build en http://localhost:4300/vertexlabs-web/
pnpm social       # regenera las miniaturas para redes (public/og-image.jpg, apple-touch-icon.png)
pnpm test         # unitarias
pnpm e2e          # build + Playwright en escritorio y móvil
pnpm verify       # tokens, tipos, unitarias y e2e (lo mismo que el CI)
```

La primera vez que se corran los e2e en una máquina nueva: `pnpm exec playwright install chromium`.

## Cómo está hecho

- **Angular 21 LTS** con componentes standalone, signals y sin Zone.js.
- **Prerender estático**: el build es HTML, CSS y JS planos, sin servidor Node.
- **SpartanUI** (estilo `maia`) para botones, badges, input y el acordeón del FAQ.
- **Tokens de diseño** en `src/app/shared/tokens/tokens.json`: tema claro/oscuro y la paleta
  Grafito. `pnpm tokens` genera el CSS para Tailwind 4.
- **Contenido separado de las plantillas**: copy en `features/landing/data/content.ts`; precios en
  `features/packages/data/catalog.ts` (única fuente para tarjetas, diagnóstico y WhatsApp).

## Despliegue

Cada push a `main` corre el CI (`.github/workflows/ci.yml`): tokens, tipos, unitarias, build y e2e.
Si todo pasa, publica `dist/vertexlabs-web/browser` en GitHub Pages. Otras ramas solo se verifican.

Pages sirve el sitio bajo `/vertexlabs-web/`, así que el build de producción usa ese `baseHref`
(`angular.json`); `pnpm start` sigue en `/`.

### Miniaturas para redes

Al compartir el enlace, WhatsApp, Facebook, LinkedIn y X muestran `public/og-image.jpg`
(1200 × 630); iMessage y Telegram usan además `public/apple-touch-icon.png`. Las genera
`pnpm social` con la paleta de `tokens.json` y el titular del hero: regenerarlas si cambian.
WhatsApp guarda en caché la vista previa de cada URL; un cambio de imagen puede tardar en verse.

### Mudarse a vertexlabs.mx

1. `angular.json` → `baseHref: "/"`.
2. `src/index.html` → las URL absolutas (`canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD).
3. GitHub → Settings → Pages → Custom domain, y los registros DNS que indica GitHub.

## Pendientes

Del doc 23 §9:

- [ ] Aviso de privacidad del sitio (LFPDPPP) → enlace del pie de página.
- [ ] IVA incluido o no, y alcance topado de cada paquete → `catalog.ts`.
- [ ] Dominio propio (ver arriba), y entonces `sitemap.xml` y `robots.txt` en la raíz del dominio.
- [ ] Analítica y conteo de clics a WhatsApp y diagnósticos completados (doc 23 §6.4).
