/* Vertex Labs — capa de motion (GSAP + ScrollTrigger + Lenis)
   Lenguaje papel editorial: el movimiento vive en las fotos, los trazos
   y el scroll. Con prefers-reduced-motion la página queda completa y quieta. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";
import { mountCursor } from "./cursor.js";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

/* scroll con inercia; expuesto para que el preloader lo detenga/arranque */
export let lenis = null;

/* ---------- preloader: carga real (fuentes + foto del hero), techo 2.5 s ---------- */
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
  const heroImg = new Image();
  heroImg.src = "/images/hero-negocio-1000.webp";
  const imgReady = heroImg.decode().catch(() => {});
  imgReady.then(() => bump(90));
  Promise.all([document.fonts.ready, imgReady]).then(finish);
  gsap.delayedCall(2.5, finish);
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

  /* ---------- hero: palabras que emergen + la foto se abre ---------- */
  const heroIntro = gsap.timeline({ paused: true });
  heroIntro
    .from(".hw", { yPercent: 118, duration: 0.9, ease: "power3.out", stagger: 0.07 })
    .from(".hero-sub, .hero-actions, .scrollcue", {
      y: 26, autoAlpha: 0, duration: 0.8, ease: "power2.out", stagger: 0.1,
      clearProps: "opacity,visibility,transform",
    }, "-=0.45")
    .fromTo(".hero-photo img", { scale: 1.18 }, {
      scale: 1.04, duration: 1.6, ease: "power2.out",
    }, "-=0.8");
  runPreloader(() => heroIntro.play());

  /* ---------- fotos: parallax interno sutil al hacer scroll ---------- */
  document.querySelectorAll(".photo:not(.shot) img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, {
      yPercent: 5, scale: 1.12, ease: "none",
      scrollTrigger: { trigger: img.closest(".photo"), start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---------- filas editoriales: foto se revela, texto sube ---------- */
  document.querySelectorAll(".row").forEach((row) => {
    const media = row.querySelector(".photo, .portal-ui");
    if (media) {
      gsap.fromTo(media, { clipPath: "inset(10% 10% 10% 10%)", autoAlpha: 0.4 }, {
        clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 1, ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        scrollTrigger: { trigger: row, start: "top 94%", once: true },
      });
    }
    gsap.from(row.querySelector(".row-copy"), {
      y: 36, autoAlpha: 0, duration: 0.9, ease: "power2.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: row, start: "top 94%", once: true },
    });
  });

  /* ---------- voz del narrador: reveal por palabra, scrubbed ---------- */
  document.querySelectorAll(".bridge, .projects-sub").forEach((el) => {
    const split = SplitText.create(el, { type: "words", aria: "none" });
    gsap.fromTo(split.words, { opacity: 0.15 }, {
      opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: el, start: "top 86%", end: "top 45%", scrub: 0.5 },
    });
  });

  /* títulos de sección */
  document.querySelectorAll(".section-title").forEach((el) => {
    gsap.from(el, {
      y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: el, start: "top 94%", once: true },
    });
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
      y: 60, autoAlpha: 0, duration: 0.9, ease: "power2.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: "#radar", start: "top 90%", once: true },
    });
    gsap.from(".radar-caption", {
      y: 30, autoAlpha: 0, duration: 0.8,
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: ".radar-stage", start: "top 92%", once: true },
    });
  }

  /* ---------- método: los trazos se dibujan, los pasos entran en cascada ---------- */
  document.querySelectorAll(".timeline li").forEach((li, i) => {
    gsap.from(li, {
      y: 44, autoAlpha: 0, duration: 0.8, ease: "power2.out", delay: i * 0.1,
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: ".timeline", start: "top 94%", once: true },
    });
    const strokes = li.querySelectorAll("[pathLength]");
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".timeline", start: "top 85%", end: "top 35%", scrub: 0.8 },
    });
    tl.to(strokes, { opacity: 1, duration: 0.4, stagger: 0.1, ease: "power1.in" }, i * 0.12)
      .to(strokes, { drawSVG: "0% 100%", duration: 0.9, stagger: 0.1, ease: "power1.inOut" }, i * 0.12 + 0.05);
  });

  /* ---------- proyectos y cta ---------- */
  gsap.from(".project", {
    y: 44, autoAlpha: 0, duration: 0.8, ease: "power2.out", stagger: 0.12,
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: ".projects-grid", start: "top 94%", once: true },
  });
  gsap.from(".cta-line, .cta-note", {
    y: 30, autoAlpha: 0, duration: 0.8, ease: "power2.out", stagger: 0.12,
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger: ".cta", start: "top 92%", once: true },
  });

  /* ---------- footer: isotipo que se voltea y wordmark que sube ---------- */
  const hourglass = document.querySelector(".hourglass");
  if (hourglass) {
    gsap.from(hourglass, {
      autoAlpha: 0, y: 20, duration: 0.8,
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: ".footer", start: "top 88%", once: true },
    });
    /* el reloj de arena se voltea cada tanto, como quien espera */
    gsap.to(hourglass, {
      rotation: 180, transformOrigin: "50% 50%", duration: 1.1, ease: "power2.inOut",
      repeat: -1, repeatDelay: 4.2,
    });
  }

  gsap.fromTo(".footer-wordmark", { yPercent: 16, autoAlpha: 0.2 }, {
    yPercent: 0, autoAlpha: 1, ease: "none",
    scrollTrigger: { trigger: ".footer-wordmark", start: "top bottom", end: "bottom 96%", scrub: true },
  });

  gsap.fromTo(".footer-ask, .footer-invite .btn, .footer-links",
    { y: 30, autoAlpha: 0 },
    {
      y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1,
      clearProps: "opacity,visibility,transform",
      scrollTrigger: { trigger: ".footer", start: "top 88%", once: true },
    });

  return () => {
    document.removeEventListener("click", onAnchorClick);
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  };
});

/* ---------- desktop con puntero fino: cursor, 3D y magnéticos ---------- */
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

  return () => {
    unmountCursor();
    cleanup3d?.();
    magnets.forEach((fn) => fn());
  };
});

/* reduced-motion: sin preloader */
mm.add("(prefers-reduced-motion: reduce)", () => {
  document.getElementById("preloader")?.remove();
});
