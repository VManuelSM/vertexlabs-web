# CLAUDE.md — vertexlabs-web

> **Borrador del 2026-10-07, pendiente de aprobación de Víctor.** Una vez aprobado, el agente no
> lo modifica sin su autorización (Marco AIDLC §3.5).

## Contexto del producto

Landing pública de **VertexLabs**: paquetes de páginas web y tiendas en línea para PyME mexicana,
con encuadre _packages-led_. Su objetivo es generar leads calificados por WhatsApp. Es una sola
página estática: no hay backend, cuentas ni base de datos.

La documentación funcional vive en Obsidian
(`~/Bóvedas/Vertex Labs/Definición del negocio/Modelo de Negocio/`):

- `23 - MVP Landing VertexLabs - Arquitectura y Plan de Promocion.md` — arquitectura de
  información, diagnóstico, tono, SEO y pendientes. **Es la especificación vigente.**
- `assets/vertexlabs-mockup-v0.2.html` — mockup navegable del que se portó este proyecto.
- `22 - Benchmarking Competidores Páginas Web PyME.md` — origen de los precios.

Marco de trabajo: `~/Bóvedas/Bóveda Personal/Personal/Marco metodológico AIDLC/Marco-AIDLC-Personal.md`.

Todavía no hay historias de usuario de la landing; las pruebas citan la sección del doc 23 que
verifican. Un cambio de comportamiento nuevo necesita HU o sección del doc 23 aprobada. Si algo es
ambiguo, preguntar; no inventar.

## Stack vigente

| Componente  | Valor                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- |
| Runtime     | Node 24 (`.nvmrc`), pnpm (versión fijada en `packageManager`)                                |
| UI          | Angular 21 LTS: standalone, signals, zoneless, `OnPush`                                      |
| Render      | Prerender estático (`outputMode: "static"`): `dist/vertexlabs-web/browser` son solo archivos |
| Componentes | SpartanUI 1.6 — brain (npm) + helm copiado en `src/app/shared/ui`, estilo `maia`             |
| Estilos     | Tailwind 4 vía PostCSS, alimentado por `tokens.json`                                         |
| Iconos      | `@ng-icons/lucide`                                                                           |
| Tests       | Vitest (`ng test`) y Playwright contra el build estático                                     |
| Hosting     | GitHub Pages vía Actions desde `main`, bajo `/vertexlabs-web/` (`baseHref` de producción)    |

Respecto al marco: sin backend no aplican OpenAPI/orval, TanStack Query, JWT ni MinIO. Si la
landing llega a necesitar servidor (formulario propio, analítica propia), se decide en un ADR.

## Estructura

```
src/app/
  core/           SITE_CONFIG (WhatsApp, correo, modo revisión), ThemeService, layout
                  (barra, pie, fondo aurora, botón flotante)
  features/
    landing/      página y secciones; data/content.ts concentra el copy
    packages/     catálogo (única fuente de precios), categorías y su sección
    diagnostic/   mini-diagnóstico: regla de recomendación (funciones puras) + panel
  shared/
    ui/           helm de SpartanUI (CLI; editable solo con justificación)
    components/   componentes propios reutilizables (isotipo, encabezado de sección)
    lib/          directivas y utilidades (enlace de WhatsApp, revelado al hacer scroll)
    tokens/       tokens.json — fuente única de la identidad visual
src/styles.css    Tailwind + preset de Spartan + tema de Spartan con tokens + material de vidrio
scripts/          tokens.mjs (genera src/styles/tokens.css), social-images.mjs (miniaturas para
                  redes), serve-dist.mjs (build estático bajo la ruta base)
e2e/              Playwright (escritorio y móvil)
```

## Invariantes no negociables

### Contenido y conversión

- Los precios viven solo en `features/packages/data/catalog.ts`. Tarjetas, diagnóstico y mensajes
  de WhatsApp se derivan de ahí; nunca se escribe un precio en una plantilla.
- El copy vive en `features/landing/data/content.ts` (y en catálogo y diagnóstico). Tuteo, claro y
  sin humo (doc 23 §5.1); cada afirmación debe poder respaldarse.
- Todo CTA de contacto usa `appWhatsApp="mensaje"`: el mensaje precargado atribuye el lead. El
  número vive en `SITE_CONFIG`.
- La regla `recommend()` del diagnóstico recomienda el punto de partida correcto, no el paquete más
  caro. Cambiarla es cambiar el negocio: requiere aprobación.

### Render estático

- Todo el contenido sale en el HTML prerenderizado (SEO local). Nada que aparezca solo al hidratar.
- APIs del navegador (`window`, `localStorage`, `matchMedia`, `IntersectionObserver`, canvas) solo
  dentro de `afterNextRender` o tras `isPlatformBrowser`.
- Las animaciones de entrada nunca ocultan lo que ya está en pantalla al cargar (LCP) y respetan
  `prefers-reduced-motion`.

### Diseño (Marco §5.4)

- Nada de colores, espaciados, tamaños de fuente o radios arbitrarios: tokens (`bg-glass`,
  `text-ink-2`, `text-section`, `max-w-lead`…) y primitivas SpartanUI.
- Tras editar `tokens.json`, `pnpm tokens`. `src/styles/tokens.css` es generado.
- Un nombre no se repite entre colores, tamaños de texto y sombras: Tailwind los resuelve con el
  mismo prefijo (`text-base` como color _y_ tamaño). `tokens.mjs` lo valida.
- Paleta de marca: **Grafito** (`palette.default`). Las otras tres de `tokens.json` son
  alternativas del mockup sin CSS generado; no se reintroduce un selector de paleta.
- Tema claro/oscuro en `data-theme`, recordado por visitante. La variante `dark:` de Spartan lo sigue.
- CSS de componente: solo CSS plano con `var(--token)`. Nada de `@apply`/`@reference`, que duplican
  el preámbulo de Tailwind en cada componente y rompen el presupuesto de 4 kB. Lo responsivo va como
  utilidades en la plantilla, y una misma propiedad no se fija a la vez en CSS de componente y en
  utilidades (el CSS de componente no tiene capa y siempre gana).
- Excepción: las ilustraciones decorativas (`landing/components/illustrations`) usan geometría
  propia en px; sus colores, radios y materiales siguen saliendo de tokens.
- Extensiones a helm ya hechas y justificadas: variantes `cta`/`glass` y tamaños `cta`/`cta-lg` en
  `hlm-button.ts` (CTAs del material liquid glass); `hlm.ts` extiende tailwind-merge con la escala
  de `tokens.json` para que fusione bien las clases del proyecto.

### Publicación

- La ruta base vive en `angular.json` (`baseHref` de producción); `serve-dist.mjs` y Playwright la
  leen de ahí. Las pruebas navegan con rutas relativas (`./`, `./#faq`).
- Las URL absolutas de `src/index.html` (canonical, Open Graph, Twitter, JSON-LD) apuntan a la
  dirección pública; si cambia la dirección, cambian juntas con `baseHref`.
- `public/og-image.jpg` y `public/apple-touch-icon.png` salen de `pnpm social`; no se editan a mano.

### Accesibilidad

- Un `h1` por página; cada sección con `aria-labelledby` hacia su `h2`.
- Lo decorativo lleva `aria-hidden`; los botones de solo ícono, `aria-label`.
- Al cambiar de paso, el diagnóstico mueve el foco al título nuevo: mantenerlo.

## Convenciones de implementación

- TypeScript estricto. Nombres de código en inglés; textos de UI en español (es-MX).
- Componentes standalone con `OnPush`, `input()`, `signal()`, `computed()` y control flow `@if`/`@for`.
- Antes de implementar UI con Spartan, consultar el MCP `spartan-ui` (`.mcp.json`) en lugar de
  inferir APIs de memoria.
- Tests: `describe('… (doc 23 §x)')`. Cuando existan HUs: `describe('HU-XXX-nn')` e `it('CA-nn: …')`.
- Lo visual se verifica en el build estático con Playwright (`pnpm e2e`), en escritorio y móvil.
- Commits en español, en imperativo.

## Comandos

```bash
pnpm install
pnpm start        # desarrollo en http://localhost:4200
pnpm build        # tokens + build prerenderizado en dist/vertexlabs-web/browser
pnpm preview      # sirve ese build estático en http://localhost:4300/vertexlabs-web/
pnpm social       # regenera og-image.jpg y apple-touch-icon.png desde tokens.json
pnpm test         # unitarias (Vitest)
pnpm e2e          # build + Playwright (escritorio y móvil)
pnpm verify       # tokens, tipos, unitarias y e2e: lo mismo que revisa el CI
```

## Requiere aprobación de Víctor

- Modificar este archivo o `tokens.json`.
- Cambiar precios, paquetes, la regla del diagnóstico o el copy de forma sustantiva.
- Push a `main` (publica en GitHub Pages), encender `reviewMode`, cambiar el número de WhatsApp,
  configurar dominio u hosting.
- Agregar dependencias de runtime, analítica o servicios de terceros.
- Reescribir estilos de helm más allá de las extensiones listadas.
