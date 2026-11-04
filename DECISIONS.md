# Decisiones técnicas

- **MCP `imagebank-mcp`: no se registra.** Paquete npm desconocido y sin auditar
  (riesgo de cadena de suministro). Unsplash se consume con `scripts/unsplash.mjs`
  contra la API REST oficial, key en `.env`.
- **Video del hero: manimgx, no banco de imágenes.** La arena del reloj se genera
  con los 3 colores exactos de marca; cero dependencia de licencias de terceros y
  encaja con la narrativa. Foto del Reloj Monumental y su crédito CC BY: retirados
  a petición (2026-11-04).
- **Preloader**: isotipo oficial volteándose + contador 0→100 discreto, ligado a
  `document.fonts.ready` + decode del poster. Sin timers ficticios; techo 2.5 s.
- **Hero: reveal propio en vez de SplitText.** El H1 lleva el slot de video inline
  dentro de la línea; el mecanismo existente (.hero-line con overflow hidden +
  palabras .hw) es equivalente al patrón pedido y no pelea con el elemento inline.
  SplitText sí se usa en puentes y frases del radar (reveal por palabra, scrubbed).
- **GSAP quedó en 3.15.1** (≥3.13: SplitText y DrawSVG incluidos gratis).
- **ffmpeg**: no está en PATH del sistema; se usa el binario del entorno conda
  `audio-video` con ruta absoluta (documentado en CLAUDE.md).
- **gsap.ticker.lagSmoothing(0)** solo si no produce saltos; se valida en la
  prueba manual.
- **Entradas one-shot con `once:true` + el grupo del footer con `fromTo`+`clearProps`.**
  Un `ScrollTrigger.refresh()` tardío (chunk 3D/video) re-aplicaba el estado inicial de
  `gsap.from` ya completados tras saltos instantáneos de scroll; el botón del footer
  quedaba en opacity 0. `clearProps` al completar deja el DOM sin estilos inline.
- **Unsplash 401 (2026-11-04)**: la key en `.env` no autoriza (¿Secret en vez de
  Access Key?). El flujo `scripts/unsplash.mjs` queda listo; ningún asset dependía de él.
