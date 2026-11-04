# vertexlabs-landing

Sitio público real de Vertex Labs (Pachuca). Vite + HTML/CSS/JS vanilla + GSAP + Lenis
(+ Three.js diferido en el hero). Sin frameworks. Narrativa del TIEMPO en una sola página.

## Reglas duras
- Paleta estricta: fresa `#F55786`, marino `#203441`, ciruela `#6E2451` + blanco y
  tintes derivados. Sin bandas de color sólido grandes: gradientes de esos 3.
- Solo logos oficiales del paquete de marca (`public/assets/brand/`). Nunca redibujar
  ni deformar el logo. Tipos: Good Timing (display) y Averta (texto), self-hosted.
- Sin nombres de personas en la página. Nada que parezca mockup o demo.
- Animación: GSAP + ScrollTrigger en `src/motion.js`; solo `transform`/`opacity`;
  todo con fallback `prefers-reduced-motion` (sin Lenis, sin scrub, sin cursor,
  sin 3D, sin video). `pointer: coarse` no carga `cursor.js` ni `hero3d.js`.
- Gate: el build de producción pasa el inspector del taste-skill con 0 FAIL
  (`node ~/.claude/skills/taste-skill/scripts/inspect.mjs <url> --allow gradient`),
  titulares ≤2 líneas en 1440/768/390, contraste WCAG (texto sobre fresa siempre
  grande y bold, ≥3:1).

## Assets
Nunca hotlinkear. Fotos solo vía `scripts/unsplash.mjs` (API oficial, key en `.env`
como `UNSPLASH_ACCESS_KEY`; buscar en inglés). Guardar en `public/images/*.webp`
(sharp, q80, máx 2000px + versión 1000px). Video de marca: generado con manimgx
(escenas en el scratchpad de la sesión) → WebM VP9 + poster JPG en `public/video/`.
Registrar todo asset externo en `public/ASSETS.md` con fuente, autor y licencia.
Iconos: SVG inline de geometría de marca. Nunca yt-dlp/gallery-dl para publicables.

## Correr
`nvm use 24` → `npm run dev` (5173) / `npm run build` / `npm run preview` (4173).
ffmpeg vive en `/opt/homebrew/Caskroom/miniconda/base/envs/audio-video/bin/ffmpeg`
(fuera del PATH).
