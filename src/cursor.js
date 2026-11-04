/* Cursor personalizado: anillo + punto. Solo pointer:fine y sin reduced-motion
   (lo decide quien lo monta). El cursor nativo sigue visible por accesibilidad. */

import gsap from "gsap";

export function mountCursor() {
  const ring = document.createElement("div");
  ring.id = "cursor-ring";
  ring.innerHTML = '<span id="cursor-label"></span>';
  const dot = document.createElement("div");
  dot.id = "cursor-dot";
  document.body.append(ring, dot);

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  const onMove = (e) => { mx = e.clientX; my = e.clientY; };
  window.addEventListener("mousemove", onMove, { passive: true });

  const tick = () => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    gsap.set(ring, { x: rx, y: ry });
    gsap.set(dot, { x: mx, y: my });
  };
  gsap.ticker.add(tick);

  const label = ring.querySelector("#cursor-label");
  const setState = (state) => {
    ring.dataset.state = state || "";
    label.textContent = state === "drag" ? "arrastra" : "";
  };
  const onOver = (e) => {
    const t = e.target.closest("[data-cursor], a, button, input[type='range'], input[type='email']");
    if (!t) return setState("");
    setState(t.dataset.cursor || (t.matches("input[type='range']") ? "drag" : "link"));
  };
  const onOut = (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest("[data-cursor], a, button, input")) setState("");
  };
  document.addEventListener("mouseover", onOver, { passive: true });
  document.addEventListener("mouseout", onOut, { passive: true });

  return () => {
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
    gsap.ticker.remove(tick);
    ring.remove();
    dot.remove();
  };
}
