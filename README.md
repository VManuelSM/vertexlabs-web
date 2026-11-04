# Vertex Labs — Landing

Landing oficial de Vertex Labs, construida desde cero con la identidad del
paquete de cliente (CHOPCHOP) sobre los mockups v2 de Alex.

## Correr

```bash
nvm use 24        # o cualquier Node ≥ 20.19
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # producción en dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

## Qué hay

- **Stack**: Vite + HTML/CSS/JS vanilla, sin frameworks. Una página (`index.html`),
  lista para crecer a multipágina (vertex, labs, portal, login) agregando entradas
  en `vite.config` más adelante.
- **Dirección de arte**: `sentence-as-layout` (taste-skill, seed 469580659). La frase
  del hero «Es el momento ▭ de tu negocio.» lleva dentro la foto del Reloj Monumental
  de Pachuca: ciudad + tiempo + el reloj de arena del logo.
- **Lo vivo**: el Radar (`#radar`): seis sliders redibujan el hexágono y recomiendan
  camino con los umbrales del Esquema B (2.5 / 3.5) — **por validar con Alex**.
- **Marca**: paleta y tipografías del manual (Good Timing display, Averta texto,
  en `public/fonts/` como woff2). Logos en `public/assets/brand/`. Los fondos de los
  verbos son los Efectos 1–4 del paquete, rasterizados.

## Pendientes antes de lanzar

- [ ] Formulario de contacto: hoy abre `mailto:` al correo de Víctor. Cablear
      backend o cambiar el destinatario oficial.
- [ ] Validar umbrales y textos del veredicto del Radar.
- [ ] Dominio y hosting (`dist/` es estático: Netlify, Vercel, Pages, lo que sea).
- [ ] Crédito obligatorio ya en el footer: foto del Reloj Monumental,
      Vojeda05, CC BY 4.0, Wikimedia Commons (ver `assets/credits.json`).
