/* Vertex Labs — capa de motion (GSAP + ScrollTrigger)
   Todo vive dentro de matchMedia: con prefers-reduced-motion
   la página queda completa y quieta. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";
import { mountCursor } from "./cursor.js";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

/* scroll con inercia; expuesto para que el preloader lo detenga/arranque */
export let lenis = null;

/* Parte un elemento en palabras y caracteres (el texto del DOM sigue íntegro). */
function splitChars(el) {
  if (el.dataset.split) return el.querySelectorAll(".ch");
  const words = el.textContent.trim().split(/\s+/);
  el.dataset.split = "1";
  el.innerHTML = "";
  words.forEach((word, wi) => {
    const w = document.createElement("span");
    w.className = "word";
    for (const ch of word) {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      w.appendChild(s);
    }
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return el.querySelectorAll(".ch");
}

/* ---------- fluido de marca: un solo canvas continuo para todo el método.
   Cada blob tiene un punto de reposo por pantalla (waypoint); el scroll
   interpola entre ellos, así el fluido se reacomoda al subir y al bajar. */
const FLUID_BLOBS = [
  { hex: "#203441", r: 0.62, wp: [[0.18, 0.25], [0.80, 0.30], [0.25, 0.75], [0.70, 0.20]] },
  { hex: "#6e2451", r: 0.56, wp: [[0.75, 0.70], [0.25, 0.60], [0.80, 0.25], [0.30, 0.80]] },
  { hex: "#f55786", r: 0.50, wp: [[0.50, 0.85], [0.65, 0.15], [0.15, 0.30], [0.85, 0.65]] },
  { hex: "#6e2451", r: 0.44, wp: [[0.10, 0.80], [0.90, 0.75], [0.55, 0.10], [0.15, 0.35]] },
  { hex: "#f55786", r: 0.40, wp: [[0.85, 0.15], [0.15, 0.20], [0.60, 0.60], [0.50, 0.90]] },
];

function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const lerp = (a, b, f) => a + (b - a) * f;
const smooth = (f) => f * f * (3 - 2 * f);

function mountMetodoFluid() {
  const stage = document.querySelector(".metodo-stage");
  const section = document.getElementById("metodo");
  if (!stage || !section) return () => {};

  const cv = document.createElement("canvas");
  cv.className = "verb-fluid";
  cv.width = 192;
  cv.height = 108;
  stage.appendChild(cv);
  const ctx = cv.getContext("2d");
  const W = cv.width, H = cv.height;

  const blobs = FLUID_BLOBS.map((b, j) => ({
    rgb: hexRgb(b.hex),
    r: b.r * W,
    wp: b.wp,
    sx: 0.8 + 0.22 * j,
    sy: 0.65 + 0.18 * j,
    ox: j * 2.3,
    oy: j * 4.7,
  }));

  let progress = 0, shown = 0, t = 0, visible = false, raf = 0;
  let mx = -9, my = -9;

  ScrollTrigger.create({
    trigger: section, start: "top bottom", end: "bottom top", scrub: true,
    onUpdate: (self) => { progress = self.progress; },
  });

  /* el blob más cercano al cursor crece un poco */
  const onMouse = (e) => {
    mx = (e.clientX / innerWidth) * W;
    my = (e.clientY / innerHeight) * H;
  };
  const offMouse = () => { mx = -9; my = -9; };
  section.addEventListener("mousemove", onMouse, { passive: true });
  section.addEventListener("mouseleave", offMouse, { passive: true });

  function frame() {
    if (!visible) return;
    t += 0.0045;
    shown += (progress - shown) * 0.08;
    /* posición entre waypoints: 4 pantallas → índice 0..3 */
    const k = Math.min(Math.max(shown * 4.6 - 0.8, 0), 3);
    const i0 = Math.floor(k), i1 = Math.min(i0 + 1, 3), f = smooth(k - i0);

    ctx.fillStyle = "#203441";
    ctx.fillRect(0, 0, W, H);
    for (const b of blobs) {
      const bx = lerp(b.wp[i0][0], b.wp[i1][0], f);
      const by = lerp(b.wp[i0][1], b.wp[i1][1], f);
      const x = (bx + 0.07 * Math.sin(t * b.sx + b.ox)) * W;
      const y = (by + 0.07 * Math.cos(t * b.sy + b.oy)) * H;
      const near = Math.hypot(x - mx, y - my) < b.r * 0.9 ? 1.12 : 1;
      b.boost = (b.boost || 1) + (near - (b.boost || 1)) * 0.06;
      const radius = b.r * b.boost;
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const [r, gg, bb] = b.rgb;
      g.addColorStop(0, `rgba(${r},${gg},${bb},0.9)`);
      g.addColorStop(1, `rgba(${r},${gg},${bb},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
  }, { rootMargin: "60% 0px" });
  io.observe(section);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    section.removeEventListener("mousemove", onMouse);
    section.removeEventListener("mouseleave", offMouse);
    cv.remove();
  };
}

/* ---------- preloader: carga real (fuentes + poster), techo 2.5 s ---------- */
function runPreloader(onDone) {
  const pre = document.getElementById("preloader");
  if (!pre) { onDone(); return; }
  lenis?.stop();
  const count = document.getElementById("preCount");
  const iso = pre.querySelector("img");
  const state = { v: 0 };
  const render = () => { count.textContent = Math.round(state.v); };
  const bump = (to) => gsap.to(state, {
    v: Math.max(to, state.v), duration: 0.5, ease: "power1.out", onUpdate: render,
  });
  const flip = gsap.to(iso, {
    rotation: 180, transformOrigin: "50% 50%", duration: 0.9,
    ease: "power2.inOut", repeat: -1, repeatDelay: 0.5,
  });
  gsap.set(pre, { clipPath: "inset(0 0 0% 0)" });

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    bump(100);
    gsap.to(pre, {
      clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut", delay: 0.4,
      onComplete: () => { flip.kill(); pre.remove(); lenis?.start(); onDone(); },
    });
  };

  document.fonts.ready.then(() => bump(55));
  const poster = new Image();
  poster.src = "/video/arena-poster.jpg";
  const posterReady = poster.decode().catch(() => {});
  posterReady.then(() => bump(90));
  Promise.all([document.fonts.ready, posterReady]).then(finish);
  gsap.delayedCall(2.5, finish);
}

/* ---------- radar vivo de la prueba: una vez dibujado, nunca reinicia ---------- */
function buildProofRadar(svg) {
  const cx = 150, cy = 150, R = 104;
  const pt = (f, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
  };
  let s = "";
  for (let g = 1; g <= 5; g++) {
    let d = "";
    for (let i = 0; i < 6; i++) {
      const [x, y] = pt(g / 5, i);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    s += `<path d="${d} Z" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="${g === 5 ? 1.6 : 1}" opacity="${(0.3 + g * 0.12).toFixed(2)}"/>`;
  }
  s += `<path id="proofPoly" d="" fill="#f55786" fill-opacity=".25" stroke="#f55786" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path id="proofGem" d="M150 141 L158 150 L150 159 L142 150 Z" fill="#ffffff"/>`;
  svg.innerHTML = s;
  return pt;
}

function mountProofRadar() {
  const svg = document.getElementById("proofRadar");
  if (!svg) return;
  const pt = buildProofRadar(svg);
  const poly = svg.querySelector("#proofPoly");
  const gem = svg.querySelector("#proofGem");
  const vals = { a: 4, b: 3, c: 2, d: 3, e: 2, f: 3 };
  const KEYS = ["a", "b", "c", "d", "e", "f"];
  const render = () => {
    let d = "";
    KEYS.forEach((k, i) => {
      const [x, y] = pt(vals[k] / 5, i);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    });
    poly.setAttribute("d", d + " Z");
  };
  render();

  svg.querySelectorAll("path").forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  ScrollTrigger.create({
    trigger: ".proof", start: "top 70%", once: true,
    onEnter: () => {
      svg.querySelectorAll("path").forEach((p, i) => {
        gsap.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: i * 0.07 });
        gsap.to(p, {
          strokeDashoffset: 0, duration: 1.1, delay: i * 0.07, ease: "power2.inOut",
          onComplete: () => { p.style.strokeDasharray = p.style.strokeDashoffset = ""; },
        });
      });
      /* y de ahí en adelante los valores cambian solos, para siempre */
      const shuffle = () => {
        const target = {};
        KEYS.forEach((k) => { target[k] = gsap.utils.random(1.4, 5, 0.1); });
        gsap.to(vals, {
          ...target, duration: 1.9, ease: "sine.inOut", onUpdate: render,
          onComplete: () => gsap.delayedCall(0.7, shuffle),
        });
        gsap.to(gem, {
          rotation: "+=90", transformOrigin: "50% 50%", duration: 1.9, ease: "sine.inOut",
        });
      };
      gsap.delayedCall(1.5, shuffle);
    },
  });
}

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  /* ---------- Lenis: una sola instancia, sincronizada con ScrollTrigger ---------- */
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const onAnchorClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -70 });
  };
  document.addEventListener("click", onAnchorClick);

  /* ---------- hero: aurora viva, palabras que emergen, reloj que respira ---------- */
  document.querySelectorAll(".hero .aurora i").forEach((blob, i) => {
    gsap.to(blob, {
      xPercent: gsap.utils.random(-34, 34),
      yPercent: gsap.utils.random(-26, 26),
      scale: gsap.utils.random(1.1, 1.45),
      duration: gsap.utils.random(6, 10),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: i * 0.8,
    });
  });

  const heroIntro = gsap.timeline({ paused: true });
  heroIntro
    .from(".hw", { yPercent: 118, duration: 0.9, ease: "power3.out", stagger: 0.09 })
    .add(() => document.documentElement.classList.add("shutter-open"), "-=0.55")
    .from(".hero-sub, .hero-actions, .scrollcue", {
      y: 26, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.1,
    }, "-=0.35");
  runPreloader(() => heroIntro.play());

  gsap.to(".hero-sentence", {
    yPercent: -9, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero .aurora", {
    yPercent: 18, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* ---------- caminos: frases por carácter + iconos que aparecen en fade ---------- */
  document.querySelectorAll(".field").forEach((field) => {
    const chars = splitChars(field.querySelector(".field-phrase"));
    gsap.from(chars, {
      yPercent: 115, duration: 0.7, ease: "power3.out", stagger: 0.028,
      scrollTrigger: { trigger: field, start: "top 62%" },
    });
    gsap.from(field.querySelector(".field-copy"), {
      y: 30, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: field, start: "top 62%" },
    });

    const icon = field.querySelector(".draw-icon");
    if (icon) {
      const strokes = icon.querySelectorAll("[pathLength]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: field, start: "top 85%", end: "center 45%", scrub: 0.8 },
      });
      tl.fromTo(strokes, { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.12, ease: "power1.in" }, 0)
        .fromTo(strokes, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1, stagger: 0.12, ease: "power1.inOut" }, 0.08);
      gsap.from(icon, {
        y: 40, ease: "none",
        scrollTrigger: { trigger: field, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  });

  /* ---------- voz del narrador: reveal por palabra, scrubbed, tinta ciruela ---------- */
  document.querySelectorAll(".bridge, .radar-above, .radar-below, .proof-head").forEach((el) => {
    const split = SplitText.create(el, { type: "words", aria: "none" });
    gsap.fromTo(split.words, { opacity: 0.15 }, {
      opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: el, start: "top 86%", end: "top 45%", scrub: 0.5 },
    });
  });

  /* diamante del hexágono de Labs: gira sin prisa */
  gsap.to(".icon-spin", {
    rotation: 360, transformOrigin: "50% 50%", duration: 9, ease: "none", repeat: -1,
  });

  /* ---------- radar: el hexágono se dibuja al llegar ---------- */
  const radarSvg = document.getElementById("radarChart");
  if (radarSvg) {
    ScrollTrigger.create({
      trigger: "#radar", start: "top 60%", once: true,
      onEnter: () => {
        radarSvg.querySelectorAll("path").forEach((p, i) => {
          const len = p.getTotalLength();
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          gsap.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: i * 0.08 });
          gsap.to(p, {
            strokeDashoffset: 0, duration: 1.0, delay: i * 0.08, ease: "power2.inOut",
            onComplete: () => { p.style.strokeDasharray = p.style.strokeDashoffset = ""; },
          });
        });
        gsap.from(radarSvg.querySelectorAll("circle"), {
          scale: 0, transformOrigin: "center", duration: 0.5, stagger: 0.06,
          delay: 0.9, ease: "back.out(2.5)",
        });
      },
    });
    gsap.from(".radar-frame", {
      y: 60, opacity: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: "#radar", start: "top 65%" },
    });
    gsap.from(".radar-caption", {
      y: 30, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: ".radar-stage", start: "top 60%" },
    });
  }

  /* ---------- método: fluido continuo + verbo y texto suben juntos ---------- */
  const cleanupFluid = mountMetodoFluid();
  document.querySelectorAll(".verb-panel").forEach((panel) => {
    gsap.from(panel.querySelector(".verb-stack"), {
      yPercent: 36, scale: 0.96, ease: "power2.out",
      scrollTrigger: { trigger: panel, start: "top 92%", end: "top 38%", scrub: 0.4 },
    });
  });

  /* ---------- prueba y cta ---------- */
  mountProofRadar();
  gsap.from(".proof-sentence, .proof-media", {
    y: 34, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.12,
    scrollTrigger: { trigger: ".proof", start: "top 68%" },
  });
  gsap.from(".cta-line, .cta-note", {
    y: 30, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.12,
    scrollTrigger: { trigger: ".cta", start: "top 72%" },
  });

  /* ---------- footer: aurora, isotipo que se voltea y wordmark que sube ---------- */
  document.querySelectorAll(".aurora-footer i").forEach((blob, i) => {
    gsap.to(blob, {
      xPercent: gsap.utils.random(-18, 18),
      yPercent: gsap.utils.random(-12, 12),
      scale: gsap.utils.random(1.1, 1.35),
      duration: gsap.utils.random(12, 18),
      ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 1.5,
    });
  });

  const hourglass = document.querySelector(".hourglass");
  if (hourglass) {
    gsap.from(hourglass, {
      autoAlpha: 0, y: 20, duration: 0.8,
      scrollTrigger: { trigger: ".footer", start: "top 75%" },
    });
    /* el reloj de arena se voltea cada tanto, como quien espera */
    gsap.to(hourglass, {
      rotation: 180, transformOrigin: "50% 50%", duration: 1.1, ease: "power2.inOut",
      repeat: -1, repeatDelay: 4.2,
    });
  }

  gsap.fromTo(".footer-wordmark", { yPercent: 42 }, {
    yPercent: 0, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  gsap.from(".footer-ask, .footer-invite .btn, .footer-links", {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.1,
    scrollTrigger: { trigger: ".footer", start: "top 70%" },
  });

  return () => {
    cleanupFluid();
    document.removeEventListener("click", onAnchorClick);
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  };
});

/* ---------- desktop con puntero fino: cursor y micro-interacciones ---------- */
mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
  const unmountCursor = mountCursor();

  /* capa 3D del hero, diferida: no toca el bundle inicial */
  let heroProgress = 0;
  let cleanup3d = null;
  ScrollTrigger.create({
    trigger: ".hero", start: "top top", end: "bottom top", scrub: true,
    onUpdate: (self) => { heroProgress = self.progress; },
  });
  if (innerWidth >= 1024) {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
    idle(() => {
      import("./hero3d.js").then((m) => {
        cleanup3d = m.mountHero3D(document.querySelector(".hero"), () => heroProgress);
      });
    });
  }

  /* botones magnéticos */
  const magnets = [];
  document.querySelectorAll(".btn-accent, .nav-cta, .cta-send").forEach((btn) => {
    const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3" });
    const move = (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.45);
    };
    const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    btn.addEventListener("mousemove", move, { passive: true });
    btn.addEventListener("mouseleave", leave, { passive: true });
    magnets.push(() => {
      btn.removeEventListener("mousemove", move);
      btn.removeEventListener("mouseleave", leave);
    });
  });

  /* campos: el icono sigue al mouse y el gradiente se desplaza */
  const fieldFx = [];
  document.querySelectorAll(".field").forEach((field) => {
    const icon = field.querySelector(".field-icon");
    const ix = icon && gsap.quickTo(icon, "x", { duration: 0.5, ease: "power2" });
    const rot = icon && gsap.quickTo(icon, "rotation", { duration: 0.5, ease: "power2" });
    const pos = { x: 30, y: 40 };
    const apply = () => { field.style.backgroundPosition = `${pos.x}% ${pos.y}%`; };
    const move = (e) => {
      const r = field.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      if (icon) { ix(dx * 14); rot(dx * 4); }
      gsap.to(pos, { x: 30 + dx * 26, y: 40 + dy * 16, duration: 0.8, ease: "power2.out", onUpdate: apply, overwrite: true });
    };
    const leave = () => {
      if (icon) { ix(0); rot(0); }
      gsap.to(pos, { x: 30, y: 40, duration: 0.9, ease: "power2.out", onUpdate: apply, overwrite: true });
    };
    field.addEventListener("mousemove", move, { passive: true });
    field.addEventListener("mouseleave", leave, { passive: true });
    fieldFx.push(() => {
      field.removeEventListener("mousemove", move);
      field.removeEventListener("mouseleave", leave);
    });
  });

  return () => {
    unmountCursor();
    cleanup3d?.();
    magnets.forEach((fn) => fn());
    fieldFx.forEach((fn) => fn());
  };
});

/* reduced-motion: el radar de la prueba se muestra dibujado y quieto */
mm.add("(prefers-reduced-motion: reduce)", () => {
  document.getElementById("preloader")?.remove();
  const svg = document.getElementById("proofRadar");
  if (svg && !svg.innerHTML.trim()) {
    const pt = buildProofRadar(svg);
    const poly = svg.querySelector("#proofPoly");
    let d = "";
    [4, 3, 2, 3, 2, 3].forEach((v, i) => {
      const [x, y] = pt(v / 5, i);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    });
    poly.setAttribute("d", d + " Z");
  }
});
