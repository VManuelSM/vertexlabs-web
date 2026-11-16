# CLAUDE.md — vertexlabs-web (Vertex Labs · sitio v1)

> Adaptado el 2026-11-15 del `CLAUDE.md` de la Entrega Victor v1 (escrito para Vite) al stack
> Angular + SpartanUI que se decidió conservar. No se modifica sin autorización de Víctor.

## Contexto

Sitio de una página para **Vertex Labs**, estudio digital en Pachuca que hace sitios web, tiendas en
línea y sistemas para PyMEs de todo México: negocios de 1 a 20 personas que ya venden, pero "en
internet todavía no se nota". Es una sola marca con 3 planes: **Para empezar · Para crecer · A la
medida**. El gancho es un **diagnóstico gratis (Radar)**. El objetivo es generar leads por el
diagnóstico, por WhatsApp y por el formulario.

## Fuentes de verdad

En orden de precedencia:

1. `docs/sitio-v1.md`: la especificación (hoja de hechos, textos finales, tabla de mensajes de
   WhatsApp, criterios de aceptación y etapas). **Todavía no está en el repo**: vive en un documento
   de Claude Docs. Mientras falte, lo que dependa de ella se marca `TODO(dato): …`.
2. `docs/prototipo-v1.html`: referencia visual y de comportamiento, y fuente de verdad del Radar. Se
   porta a componentes; no se copia tal cual. Quedan dos restos de los ejes viejos que **no** se
   portan: el encabezado "P · A · V · M · O · D" de la tabla de pruebas y las opciones de ejemplo de
   la vista de componentes ("Solo mis redes sociales", "Un sitio viejo o que no actualizo").
3. `docs/atomic-design.md`: inventario de átomos, moléculas, organismos y páginas.
4. `src/styles/tokens.css`: tokens del manual. Si el prototipo difiere de tokens.css, gana tokens.css
   (p. ej., el H1 llega a 64 px en el prototipo y a 72 px en tokens; `--color-border-strong` es
   translúcido en el prototipo y azul marino sólido en tokens).
5. `docs/LEEME.md`: contexto de la entrega y pendientes del equipo.

**Superados:** "Landing VertexLabs v2 — Arquitectura Diagnóstico-First" (planes por promedio, ejes
con nombres técnicos, Kindu y el Cotizador como casos) y el doc 23 con su mockup v0.2. Todo texto
con los ejes Presencia / Atención / Ventas / Medición / Operación / Diferencia está superado.

## Contenido

- Los textos se copian tal cual de la especificación o, mientras falte, del prototipo. No reescribas,
  no "mejores" y no agregues texto.
- Nunca afirmes nada que no esté en la hoja de hechos: cifras, clientes, precios, plazos, funciones o
  promesas.
- Si falta un dato, deja `TODO(dato): …` visible en el código y pregunta antes de inventarlo. Lo que
  el prototipo marca con `.tbd` (subrayado con puntos) está por confirmar y se porta como TODO.
- Precios siempre en MXN con "+ IVA" y el total con IVA al lado. Planes y precios viven en un solo
  archivo de datos (`content/`); las tarjetas de planes, el resultado del diagnóstico y los mensajes
  se derivan de ahí. Nunca se escribe un precio en una plantilla.
- Tuteo y cero jerga técnica.

## Stack

| Componente  | Valor                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Runtime     | Node 24 (`.nvmrc`), pnpm (versión fijada en `packageManager`)                              |
| UI          | Angular 21: standalone, signals, zoneless, `OnPush`                                        |
| Render      | Prerender estático (`outputMode: "static"`): `dist/vertexlabs-web/browser` es solo HTML/JS |
| Componentes | SpartanUI 1.6: brain (npm) + helm generado por el CLI en `src/app/shared/ui`, style mira   |
| Estilos     | Tailwind 4 vía PostCSS, con los tokens del manual (`src/styles/tokens.css`)                |
| Tests       | Vitest (`ng test`)                                                                         |
| Hosting     | `TODO(dato)`: dominio y hosting por decidir (etapa 5)                                      |

## Estructura

```
docs/                       entrega: prototipo, atomic design y LEEME (no se publica)
src/
  styles/tokens.css         tokens del manual: no se reformatea ni se edita sin aprobación
  styles/no-default-palette.css   desactiva la paleta por defecto de Tailwind
  styles.css                Tailwind + preset de Spartan + tokens + tema de Spartan con la marca
  app/
    core/                   configuración del sitio (WhatsApp, correo, dominio), analítica, enlaces
    content/                datos con copy repetido o derivable: planes y precios, casos, FAQ
    diagnostic/             Radar: ejes, regla recommend() (funciones puras) y sus pruebas
    components/
      atoms/                botón, enlace, texto (etiqueta "__"), ícono, campo, opción, casilla…
      molecules/            campo de formulario, precio, tarjeta de problema, paso, testimonio…
      organisms/            uno por sección: encabezado, hero, confianza, problemas, planes…
    pages/                  inicio, aviso de privacidad, componentes (y diagnóstico, opcional)
    shared/ui/              helm de SpartanUI (CLI)
```

Las carpetas se crean conforme las pide cada etapa.

## Marca (Manual de identidad visual 2026)

- Colores oficiales: azul marino #203441, ciruela #6E2451, rosa #F55786, azul acero #809DAC, arena
  #E0CFBF y blanco.
- Derivados permitidos (documentados en `tokens.css`): `--surface-soft` y `--text-muted`. No agregues
  otros colores.
- Good Timing va siempre en el logo y solo en el título del hero. Todo lo demás en Averta (Regular,
  Semibold, Bold).
- Remate "__" al final de cada etiqueta de sección ("Planes y precios __").
- Degradado de marca solo en: banda de cierre, fondo de capturas de proyectos, imagen para compartir
  y encabezado del portal.
- Logo: no deformar, no alterar composición, tipografía ni color. Respeta la zona de protección de 2X
  y la tabla de usos cromáticos del manual.
- Fuentes: Averta y Good Timing todavía no tienen archivos ni licencia web (`TODO(dato)`). Mientras
  tanto, el sitio cae a la pila de sistema de `tokens.css`. No se cargan fuentes de terceros (Google
  Fonts, por ejemplo) sin aprobación.

## Diseño

- Usa solo tokens. Cero colores, tamaños, sombras o tiempos escritos a mano.
- `styles.css` traduce los tokens a utilidades de Tailwind. Este es el vocabulario:

| Qué                  | Utilidades                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colores del manual   | `navy`, `plum`, `pink`, `steel`, `sand`, `white`, `surface` (= `--surface-soft`): `bg-navy`, `text-plum`…                                                        |
| Semánticos (Spartan) | `background`, `foreground`, `primary` (rosa) + `primary-foreground`, `muted-foreground` (texto secundario), `border`, `input`, `ring`, `destructive` (ciruela)   |
| Texto                | `text-h1`, `text-h2`, `text-h3`, `text-lg`, `text-base`, `text-btn`, `text-sm`, `text-xs`; `leading-tight`/`snug`/`body`; `tracking-eyebrow`; `font-brand`       |
| Espacio              | escala de Tailwind solo en los pasos del manual: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32 (= `space-1`…`space-10`); `py-section`, `px-gutter`, `min-h-tap`, `max-w-site` |
| Forma                | `rounded-sm` (4 px), `rounded-md` (8 px), `rounded-lg` (16 px), `rounded-pill`; `shadow-sm`, `shadow-md`, `shadow-focus`                                         |
| Movimiento           | `transition` (150 ms con la curva del manual), `duration-(--motion-base)`                                                                                        |
| Cortes               | `sm` 560 · `md` 900 · `lg` 1200 (no existen `xl` ni `2xl`)                                                                                                       |
| Medidas de línea     | `max-w-heading` (24ch), `max-w-lead` (58ch), `max-w-copy` (66ch), `max-w-head` (780 px): del prototipo, no del manual                                            |
| Superficie           | `on-dark:` dentro de `data-surface="dark"` (azul marino, ciruela, degradado) y `on-sand:` dentro de `data-surface="sand"`                                        |

- La paleta por defecto de Tailwind está desactivada: `bg-red-500`, `text-black`… no generan CSS.
- Nada de valores arbitrarios (`[…]`). Para un token sin utilidad propia se usa la sintaxis de
  variable: `z-(--z-header)`, `duration-(--motion-base)`.
- Ojo con los nombres: `bg-accent` es el fondo de hover de Spartan (arena suave), no el ciruela que
  `tokens.css` llama `--color-accent`. Para el ciruela, `text-plum`.
- En código propio no se usa `rounded-xl` a `rounded-4xl`: siguen la fórmula de Spartan, no el manual.
- CSS de componente: solo CSS plano con `var(--token)`. Nada de `@apply` ni `@reference`, que
  duplican el preámbulo de Tailwind en cada componente y rompen el presupuesto de 4 kB. Lo responsivo
  va como utilidades en la plantilla, y una misma propiedad no se fija a la vez en CSS de componente
  y en utilidades.
- Atomic design: un organismo por sección. Cada componente con todos sus estados: hover, foco,
  presionado, deshabilitado, error, cargando y éxito, según aplique.
- Primero celular (390 px), luego escritorio (1440 px).
- Patrón de sección: etiqueta con "__", título y subtítulo, alineados a la izquierda. Centrado solo en
  el cierre.
- Prohibido: cursor personalizado, partículas decorativas, librerías de scroll suavizado (Lenis),
  fotos de banco de imágenes y espacios que dependan de la altura de pantalla (`vh`).
- `pnpm check:design` revisa el código propio: sin valores arbitrarios, colores a mano, `vh` ni la
  paleta por defecto.
- En `/componentes`, `data-demo="hover"`, `"focus"` o `"active"` fuerza ese estado para mostrarlo
  sin interacción (`styles.css` amplía esas variantes; en el sitio se comportan igual que siempre).

## SpartanUI

- Antes de implementar UI con Spartan, consulta el MCP `spartan-ui` (`.mcp.json`) en lugar de inferir
  APIs de memoria.
- Usa brain/helm cuando exista la primitiva accesible (acordeón de preguntas, casilla, campo,
  etiqueta…). Los átomos propios envuelven o extienden helm; no se duplica lo que Spartan ya resuelve.
- Helm se genera con el CLI en `src/app/shared/ui` y toma la marca de las variables del tema en
  `styles.css`. Extender helm (variantes nuevas) requiere justificación y se anota en la lista de
  abajo.
- Style **mira** (compacto: botones de 28 px y texto de 12 px). Al generar un componente se ajustan
  tamaños, radios y colores a la marca. El CLI puede volver a agregar `@ng-icons/*` al generar: no se
  conserva (el sitio usa su propio set de íconos y SVG en línea).
- El acordeón de preguntas usa el brain (`@spartan-ng/brain/accordion`) sin helm: el helm anima la
  altura y el manual solo permite `transform` y `opacity`.
- Extensiones de helm hechas (etapa 2):
  - `button`: variantes del manual `primary` (rosa, 56 px, texto de 19 px por contraste), `dark`,
    `outline`, `light` (sobre fondo oscuro) y `text`; tamaños `default` (44 px), `lg`, `icon` e
    `inline`; estado `loading` (indicador y `aria-busy`).
  - `badge`: arena con texto azul marino, en mayúsculas; variantes `outline` y `dark`.
  - `input`, `native-select`: campo del manual (48 px, borde azul marino, error en ciruela con borde de
    2 px). `native-select` y `checkbox` dibujan su flecha y su palomita en SVG en línea.
  - `checkbox`: 24 px, azul marino al marcar y borde ciruela cuando su campo es inválido. `label`: Semibold de 15 px.
  - `field`: el error lleva el ícono "!" del prototipo y no tiñe la etiqueta.
  - `utils/hlm.ts`: tailwind-merge conoce el vocabulario de `styles.css` (sin esto, `text-btn` borraba
    el color de texto del botón principal).

## Contraste

- Texto normal solo en combinaciones de 4.5:1 o más: azul marino sobre blanco o arena, blanco sobre
  azul marino o ciruela, ciruela sobre blanco.
- Blanco sobre rosa (3.2:1) solo en texto de 19 px o más en negrita: el botón principal.
- Rosa sobre azul marino (4.05:1) solo en texto grande.
- Azul acero nunca para texto.

## Movimiento

- Solo `transform` y `opacity`, de 150 a 250 ms.
- Con `prefers-reduced-motion: reduce`, nada se anima (los tokens de duración bajan a 0 ms).
- Nunca alteres el scroll del navegador (nada de `scroll-behavior: smooth`).

## Accesibilidad (mínimos)

- Foco visible en todo lo interactivo (`--focus-ring`); todo se usa con teclado.
- Cada campo con `<label>`; los errores se anuncian con `aria-live`.
- Botones y opciones de al menos 44 × 44 px (`min-h-tap`).
- `lang="es"`, un solo H1 por página y jerarquía de títulos sin saltos. Cada sección con
  `aria-labelledby` hacia su título.
- Imágenes con texto alternativo que describa lo que muestran; lo decorativo lleva `aria-hidden`, y
  los botones de solo ícono, `aria-label`.
- En el diagnóstico, al cambiar de pregunta el foco va al título nuevo, y al terminar va al título
  del resultado.

## Render estático

- Todo el contenido sale en el HTML prerenderizado. Nada aparece solo al hidratar.
- Las APIs del navegador (`window`, `localStorage`, `matchMedia`, `IntersectionObserver`) solo se
  usan dentro de `afterNextRender` o tras `isPlatformBrowser`.
- Las animaciones de entrada nunca ocultan lo que ya está en pantalla al cargar.

## Diagnóstico (Radar)

**Los 6 ejes son estos y solo estos.** Cada respuesta vale de 1 a 4 (cuatro opciones por pregunta;
los textos de las opciones están en el prototipo).

| Clave | Eje                      | Pregunta                                                   |
| ----- | ------------------------ | ---------------------------------------------------------- |
| V     | Por qué te compran       | ¿Sabes explicar en una frase por qué te compran a ti?      |
| C     | Tu cliente ideal         | ¿Qué tan bien conoces a tu cliente ideal?                  |
| F     | Lo que te hace diferente | ¿Tus clientes ven claro por qué elegirte a ti y no a otro? |
| N     | De dónde entra el dinero | ¿De cuántas formas le entra dinero a tu negocio?           |
| D     | Qué tan digital eres     | ¿Qué tan presente y digital es tu operación hoy?           |
| P     | Precios y control        | ¿Qué tan claro tienes tus precios y el control del dinero? |

Recomienda **por el punto más débil, nunca por promedio**:

1. `D ≤ 2` → **Para empezar**, foco D.
2. Si no, alguno de V, C, F `≤ 2` → **Para crecer**, foco en el más bajo de ellos.
3. Si no, alguno de N, P `≤ 2` → **A la medida**, foco en el más bajo de ellos.
4. Si no (todo ≥ 3) → **A la medida**, foco "Automatizar y escalar".

- Los empates se rompen con la prioridad D, V, C, F, N, P.
- "Después" es el siguiente eje `≤ 2` sin contar el foco; "Lo que ya tienes bien" es el eje más alto,
  si es ≥ 3.
- Cada eje, cuando sale bajo, propone **acompañamiento + lo digital** (no solo la web). Los textos de
  foco están en el prototipo. No los cambies.

Los 7 casos (V · C · F · N · D · P → plan / foco):

| Respuestas  | Plan         | Foco                     |
| ----------- | ------------ | ------------------------ |
| 4·4·4·4·1·4 | Para empezar | Qué tan digital eres     |
| 1·4·4·4·4·4 | Para crecer  | Por qué te compran       |
| 4·1·4·4·4·4 | Para crecer  | Tu cliente ideal         |
| 4·4·1·4·4·4 | Para crecer  | Lo que te hace diferente |
| 4·4·4·1·4·4 | A la medida  | De dónde entra el dinero |
| 4·4·4·4·4·1 | A la medida  | Precios y control        |
| 4·4·4·4·4·4 | A la medida  | Automatizar y escalar    |

- Escribe `recommend()` como función pura con estas pruebas (Vitest) antes de hacer la interfaz. Las
  pruebas deben pasar siempre; la página `/componentes` también las corre.
- Cambiar los ejes, la regla o los textos de foco es cambiar el negocio: requiere aprobación.

## Integraciones (etapa 5)

- Formulario: servicio real (nada de `mailto:`), con estados de éxito y error y la casilla del aviso
  de privacidad. Es un servicio de terceros: se elige con Víctor.
- Guarda los parámetros UTM y el resultado del diagnóstico en campos ocultos del formulario.
- WhatsApp: enlaces `https://wa.me/<número>?text=` con el mensaje prellenado de cada origen (tabla en
  `docs/sitio-v1.md`; mientras falte, los `data-wa` del prototipo). El número vive en la
  configuración del sitio: `TODO(dato)`.
- Eventos de analítica: `cta_click`, `whatsapp_click`, `plan_click`, `diagnostico_inicio`,
  `diagnostico_fin` y `lead_enviado`, con los datos que envía el prototipo. Proveedor por decidir.
- `<head>`: título, descripción, URL canónica, Open Graph, Twitter y JSON-LD `LocalBusiness`.

## Páginas

Inicio · Aviso de privacidad · `/componentes` (sin indexar: muestra todos los estados y corre las 7
pruebas del diagnóstico) · `/diagnostico` (opcional, para compartir en redes).

## Forma de trabajo

- 6 etapas, cada una en su rama (`etapa-N-nombre`) y con su revisión: (1) base y limpieza ·
  (2) átomos + moléculas + `/componentes` · (3) organismos · (4) diagnóstico (primero la lógica con
  los 7 casos, luego la interfaz) · (5) integraciones (formulario real, analítica, WhatsApp, Open
  Graph, aviso de privacidad) · (6) revisión contra criterios + Lighthouse.
- Al cerrar cada etapa: toma capturas en 390 y 1440 px, revisa los criterios de aceptación que
  aplican y reporta cuáles pasan, cuáles no y por qué.
- Ante una duda de contenido o de marca, pregunta antes de decidir.

## Convenciones de implementación

- TypeScript estricto. Nombres de código en inglés; textos de UI en español.
- Componentes standalone con `OnPush`, `input()`, `signal()`, `computed()` y control flow
  `@if`/`@for`.
- Commits en español, en imperativo.

## Comandos

```bash
pnpm install
pnpm start        # desarrollo en http://localhost:4200
pnpm build        # build prerenderizado en dist/vertexlabs-web/browser
pnpm test         # unitarias (Vitest)
pnpm typecheck    # tipos de app y pruebas
pnpm format       # prettier sobre src (respeta .prettierignore)
pnpm check:design # reglas del manual sobre el código propio
```

## Requiere aprobación de Víctor

- Modificar este archivo o `src/styles/tokens.css`.
- Cambiar precios, planes, la regla del diagnóstico o el copy.
- Push a `main`, publicar, configurar dominio u hosting.
- Agregar dependencias de runtime, analítica, fuentes o servicios de terceros.
- Reescribir estilos de helm más allá de las extensiones listadas.
