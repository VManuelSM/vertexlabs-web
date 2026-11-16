# LÉEME — Vertex Labs · Sitio v1 (entrega para Victor)

> 2 minutos de lectura antes de abrir lo demás. Fecha: 11-nov-2026.

## De dónde venimos

El sitio anterior (`vmanuelsm.github.io/vertexlabs-web`) estaba **bien construido pero no vendía**: mensaje abstracto, jerga propia, el formulario no enviaba nada (usaba `mailto:`), el Radar era un callejón sin salida y su lógica solo sacaba el promedio. Se hizo una auditoría estricta (6 áreas, 18 hallazgos) y se decidió **no lanzarlo así**.

## Qué decidimos

- **Una sola marca, Vertex Labs, con 3 planes** (se eliminan los "caminos" Vertex/Labs).
- **Cliente objetivo:** PyME/micronegocio mexicano (1–20 personas) que ya vende y opera, pero "en internet todavía no se nota". Desde Pachuca, para todo México.
- **Posicionamiento:** hacemos sitios, tiendas en línea y sistemas, y **empezamos por un diagnóstico gratis** que dice qué necesitas y qué no.
- **Narrativa de 10 secciones** (Hero → Confianza → Problemas → Planes → Diagnóstico → Casos → Cómo trabajamos → Equipo → FAQ → Cierre).
- **Diagnóstico (Radar) rediseñado:** 6 preguntas concretas, recomienda **por el punto más débil, nunca por promedio**.

### ⚠️ Decisión reciente sobre el Radar (esto manda sobre el audit)

El audit original medía 6 ejes solo de "lo que vendemos como web". **Se corrigió:** el Radar ahora cubre el negocio completo porque **también acompañamos al cliente** (consultoría), pero con **nombres en lenguaje de cliente**. Los 6 ejes canónicos son:

1. **Por qué te compran** (propuesta de valor)
2. **Tu cliente ideal** (conocimiento del cliente)
3. **Lo que te hace diferente** (diferenciación)
4. **De dónde entra el dinero** (modelo de negocio)
5. **Qué tan digital eres** (madurez digital)
6. **Precios y control** (finanzas y precios)

Cada eje bajo propone **acompañamiento + lo digital** (no solo la web). **La fuente de verdad del Radar es `prototipo-v1.html`** (ya pasa los 7 casos de prueba). Si algún texto viejo del documento de especificación dice otros ejes (Presencia/Atención/Ventas/Medición/Operación/Diferencia), **ignóralo**: quedó superado.

## Qué hay en esta carpeta

| Archivo | Para qué |
|---|---|
| `prototipo-v1.html` | Referencia visual y de comportamiento. Se porta a componentes; no se copia tal cual. Incluye la vista `#componentes`. |
| `CLAUDE.md` | Reglas que Fable lee en cada sesión. Va en la raíz del repo. |
| `tokens.css` | Tokens del manual de identidad. Va en `src/styles/tokens.css`. |
| `atomic-design.md` | Inventario de UI (átomos/moléculas/organismos). |
| `LEEME.md` | Este archivo. |

> La especificación larga (hoja de hechos, todos los textos finales, plan de medición) vive en el **documento de Claude Docs** y en la **auditoría completa** (`2026-11-11 Vertex Labs - Auditoría y sitio v1.md`). Esta carpeta es el arranque mínimo para construir.

## Qué hace Victor (con Fable)

1. Subir `CLAUDE.md`, `tokens.css`, `prototipo-v1.html` (y `sitio-v1.md`) al repo.
2. Trabajar en **6 etapas**, una rama y una revisión por etapa: (1) base/limpieza · (2) átomos+moléculas+`/componentes` · (3) organismos · (4) diagnóstico (primero la lógica con los 7 casos, luego la interfaz) · (5) integraciones (formulario real, analítica, WhatsApp, Open Graph, aviso de privacidad) · (6) revisión contra criterios + Lighthouse.
3. **Fable NO inventa contenido:** solo afirma lo que está en la hoja de hechos; si falta un dato deja `TODO(dato): …` y pregunta.

## Lo que el equipo debe cerrar antes de lanzar (no lo hace Fable)

Testimonios reales de los 3 clientes con permiso · qué incluye cada plan (plazo y pago) · nº de mensualidades del plan A la medida · número de WhatsApp Business + correo del dominio · captura del portal · aviso de privacidad validado · imagen para compartir 1200×630 · licencia web de Averta.
