# Vertex Labs · Sitio v1 — Atomic Design

> Inventario de UI para construir con Fable. **Regla de oro:** ningún componente usa valores escritos a mano; todo sale de `tokens.css`. Estados completos por componente (hover, foco, presionado, deshabilitado, error, cargando, éxito, según aplique). Primero celular (390 px), luego escritorio (1440 px).

---

## 0. Tokens (fuente: `tokens.css`)

- **Color:** `brand-navy` #203441 · `brand-plum` #6E2451 · `brand-pink` #F55786 · `brand-steel` #809DAC · `brand-sand` #E0CFBF · `brand-white` #FFFFFF · derivados `surface-soft` #F6F1EC y `text-muted` #586770 · `gradient-brand` (degradado del manual).
- **Tipografía:** `font-brand` (Good Timing) solo en logo y título del hero · `font-text` (Averta) todo lo demás. Escala H1 40→72 · H2 32→44 · H3 22→26 · texto 18 · botón 19 · nota 15.
- **Espacio:** escala de 4 (`space-1`…`space-10`, 4→128 px). Entre secciones 64 px (celular) / 96 px (escritorio). Contenedor 1200 px.
- **Forma:** radios 4 / 8 / 16 px · sombras `shadow-sm`/`shadow-md` · `focus-ring`.
- **Movimiento:** 150–250 ms, solo `transform` y `opacity`. Nada con `prefers-reduced-motion`.
- **Cortes:** 560 · 900 · 1200 px.

**Contraste permitido** (ver tabla en `tokens.css`): texto normal solo ≥ 4.5:1. Blanco sobre rosa (3.2:1) solo ≥ 19 px en negrita (botón principal). Rosa sobre navy (4.05:1) solo texto grande. Azul acero nunca para texto.

---

## 1. Átomos

| Átomo | Variantes | Estados |
|---|---|---|
| **Botón** | principal (rosa), secundario (contorno), WhatsApp (navy), texto/enlace-flecha | reposo, hover, foco, presionado, deshabilitado, cargando |
| **Enlace** | en texto, con flecha | reposo, hover, foco, visitado |
| **Texto** | etiqueta (con remate "__"), H1, H2, H3, párrafo, nota | — |
| **Ícono** | set del sitio (`#i-*`: search, chat, grid, check, arrow, back, menu, close, pin, receipt, clock, external) | decorativo (aria-hidden) |
| **Campo** | texto, email, tel | reposo, foco, error, deshabilitado |
| **Selector / opción** | botón de respuesta del diagnóstico | reposo, hover, foco, seleccionado |
| **Casilla** | checkbox (aviso de privacidad) | marcado, sin marcar, error, foco |
| **Insignia** | "Recomendado", etiqueta de plan | — |
| **Imagen** | captura de proyecto, foto de equipo | con texto alternativo descriptivo |
| **Logo** | vertical, horizontal, solo isotipo | respeta zona de protección 2X; no deformar |

## 2. Moléculas

| Molécula | Compone |
|---|---|
| **Campo de formulario** | label + campo + mensaje de error (`aria-live`) |
| **Precio** | monto "+ IVA" + total con IVA |
| **Elemento de lista** | ícono check + texto (entregables de un plan) |
| **Tarjeta de problema** | ícono + título + descripción |
| **Paso del proceso** | número + título + descripción (ruta "cómo trabajamos") |
| **Testimonio** | cita + nombre + cargo + foto/logo |
| **Ficha de caso** | marco de navegador + captura real + resultado + enlace al sitio |
| **Opción de respuesta** | botón del diagnóstico (texto + punto) |
| **Pregunta frecuente** | pregunta + respuesta (acordeón) |
| **Canal de contacto** | ícono + etiqueta + acción (diagnóstico / WhatsApp / formulario) |

## 3. Organismos (uno por sección)

| # | Organismo | Qué contiene |
|---|---|---|
| 1 | **Encabezado** | logo + navegación + menú hamburguesa (celular) |
| 2 | **Hero** | etiqueta, H1, subtítulo, 2 botones, línea de confianza bajo botones |
| 3 | **Franja de confianza** | clientes reales + datos (Pachuca·todo México · facturamos · respuesta <1 día) |
| 4 | **Problemas** | 3 tarjetas de dolor + cierre "tiene solución" |
| 5 | **Planes** | 3 tarjetas (Para empezar / Para crecer / A la medida) + nota de mantenimiento |
| 6 | **Diagnóstico (Radar)** | 6 preguntas, 1 por pantalla, hexágono en vivo, pantalla de resultado |
| 7 | **Casos** | fichas de Planifica Tu Vivienda · Toastmasters Pachuca · despacho contable |
| 8 | **Cómo trabajamos + portal** | ruta de pasos + captura del portal de cliente |
| 9 | **Equipo** | fotos reales, nombres y roles (Alex · Victor) |
| 10 | **Preguntas frecuentes** | acordeón |
| 11 | **Cierre** | formulario de contacto + CTAs (sobre degradado de marca) |
| 12 | **Pie de página** | contacto, redes, aviso de privacidad |
| 13 | **WhatsApp flotante** | botón presente en todas las pantallas |

## 4. Plantillas y páginas

- **Plantillas:** página de inicio · página legal.
- **Páginas:** Inicio · Aviso de privacidad · `/diagnostico` (opcional, para compartir en redes) · `/componentes` (sin indexar, muestra todos los estados y corre las 7 pruebas del diagnóstico).

---

## 5. Reglas de sección (no negociables)

- Patrón de sección: **etiqueta con "__"**, título y subtítulo, **alineados a la izquierda**. Centrado solo en el cierre.
- Degradado de marca **solo** en: banda de cierre, fondo de capturas, imagen para compartir y encabezado del portal.
- **Prohibido:** cursor personalizado, partículas, scroll suavizado (Lenis), fotos de banco de imágenes, espacios que dependan de `vh`.
- **Accesibilidad:** `lang="es"`, un solo H1, foco visible, todo con teclado, campos con `<label>`, errores con `aria-live`, toques ≥ 44×44 px.

> El `prototipo-v1.html` ya implementa todo esto como referencia de comportamiento (incluida la vista `#componentes`). Se porta a componentes; no se copia tal cual.
