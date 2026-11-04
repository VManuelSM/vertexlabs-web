/* Vertex Labs — landing */
import "./motion.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- obturador del hero (movimiento firma) ---------- */
window.addEventListener("load", () => {
  document.documentElement.classList.add("shutter-open");
});

/* ---------- video: quieto con reduced-motion o con ahorro de datos ---------- */
if (reduced || navigator.connection?.saveData) {
  document.querySelectorAll("video[autoplay]").forEach((v) => {
    v.removeAttribute("autoplay");
    v.pause();
  });
}

/* ---------- el Radar (lo vivo) ---------- */
const AXES = [
  { key: "propuesta", label: "Propuesta" },
  { key: "cliente", label: "Cliente" },
  { key: "diferenciacion", label: "Diferenciación" },
  { key: "modelo", label: "Modelo" },
  { key: "madurez", label: "Madurez" },
  { key: "finanzas", label: "Finanzas" },
];
const svg = document.getElementById("radarChart");
const form = document.getElementById("radarForm");
const verdictEl = document.getElementById("radarVerdict");

function point(cx, cy, r, factor, i) {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return [cx + Math.cos(a) * r * factor, cy + Math.sin(a) * r * factor];
}

function readValues() {
  return AXES.map((ax) => Number(form.elements[ax.key].value));
}

function drawRadar(animate = true) {
  if (!svg || !form) return;
  const values = readValues();
  const cx = 170, cy = 150, R = 104;
  const ink = "#203441", soft = "rgba(32,52,65,.28)", accent = "#f55786";
  let s = "";
  for (let g = 1; g <= 5; g++) {
    let d = "";
    for (let i = 0; i < 6; i++) {
      const [x, y] = point(cx, cy, R, g / 5, i);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    s += `<path d="${d} Z" fill="none" stroke="${soft}" stroke-width="${g === 5 ? 1.5 : 1}" opacity="${g === 5 ? 1 : 0.55}"/>`;
  }
  let poly = "";
  for (let i = 0; i < 6; i++) {
    const [x, y] = point(cx, cy, R, values[i] / 5, i);
    poly += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
  }
  s += `<path class="radar-poly" d="${poly} Z" fill="${accent}" fill-opacity=".18" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 6; i++) {
    const [x, y] = point(cx, cy, R, values[i] / 5, i);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${accent}"/>`;
  }
  AXES.forEach((ax, i) => {
    const [x, y] = point(cx, cy, R + 24, 1, i);
    const anchor = i === 0 || i === 3 ? "middle" : x < cx ? "end" : "start";
    s += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" font-size="13" font-family="Averta, sans-serif" font-weight="600" fill="${ink}" text-anchor="${anchor}">${ax.label}</text>`;
  });
  svg.innerHTML = s;
}

function verdict() {
  if (!verdictEl) return;
  const values = readValues();
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const low = AXES[values.indexOf(Math.min(...values))].label.toLowerCase();
  let path;
  if (avg < 2.5) {
    path = `Tu siguiente paso es <strong>Vertex</strong>: cimientos digitales, empezando por ${low}.`;
  } else if (avg <= 3.5) {
    path = `Tu siguiente paso es <strong>Vertex con módulos a la medida</strong>: hay base, falta empuje en ${low}.`;
  } else {
    path = `Tu negocio está listo para <strong>Labs</strong>: software a la medida e IA aplicada.`;
  }
  verdictEl.innerHTML = `Promedio ${avg.toFixed(1)} de 5. ${path}`;
}

if (svg && form) {
  drawRadar(false);
  verdict();
  form.addEventListener("input", () => {
    drawRadar();
    verdict();
  });
}

/* ---------- prueba: nombre iluminado que recorre la lista ---------- */
const names = [...document.querySelectorAll(".proof-name")];
if (names.length && !reduced) {
  let lit = 0;
  names[0].classList.add("lit");
  setInterval(() => {
    names[lit].classList.remove("lit");
    lit = (lit + 1) % names.length;
    names[lit].classList.add("lit");
  }, 2000);
} else {
  names.forEach((n) => n.classList.add("lit"));
}

/* ---------- cta: correo con asunto y cuerpo escritos ---------- */
const ctaForm = document.getElementById("ctaForm");
if (ctaForm) {
  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("ctaEmail").value.trim();
    const subject = encodeURIComponent("Quiero empezar con Vertex Labs");
    const body = encodeURIComponent(
      `Hola, soy ${email}.\n\nQuiero contarles de mi negocio y correr mi Radar.\n`
    );
    window.location.href = `mailto:vctr.mnl.s.m@gmail.com?subject=${subject}&body=${body}`;
  });
}
