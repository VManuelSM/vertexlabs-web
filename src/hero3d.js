/* Partículas de marca flotando (Three.js, carga diferida).
   Sin corrientes ni columnas: una nube dispersa que cae lentísimo y ondula.
   Solo se importa en desktop con puntero fino y sin reduced-motion. */

import * as THREE from "three";

const PALETTE = [
  [0.961, 0.341, 0.525],   // fresa
  [0.431, 0.141, 0.318],   // ciruela
  [0.125, 0.204, 0.255],   // marino
];

export function mountParticles(host, getProgress, opts = {}) {
  const count = opts.count ?? 1100;
  const opacity = opts.opacity ?? 0.55;

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  cam.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    alpha: true, antialias: false, powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.domElement.className = "fx-particles";
  host.appendChild(renderer.domElement);

  /* nube uniforme a lo ancho: sin zonas densas */
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const fall = new Float32Array(count);
  const baseX = new Float32Array(count);
  const phase = new Float32Array(count);
  const freq = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    baseX[i] = (Math.random() * 2 - 1) * 6.2;
    pos[i * 3] = baseX[i];
    pos[i * 3 + 1] = (Math.random() * 2 - 1) * 4.6;
    pos[i * 3 + 2] = (Math.random() * 2 - 1) * 2.0;
    const pick = Math.random();
    const c = PALETTE[pick < 0.6 ? 0 : pick < 0.85 ? 1 : 2];
    col.set(c, i * 3);
    fall[i] = 0.04 + Math.random() * 0.12;
    phase[i] = Math.random() * Math.PI * 2;
    freq[i] = 0.2 + Math.random() * 0.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true,
    opacity, depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const resize = () => {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / Math.max(r.height, 1);
    cam.updateProjectionMatrix();
  };
  resize();
  addEventListener("resize", resize);

  let running = true, raf = 0, t = 0;
  const clock = new THREE.Clock();

  function loop() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    const p = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] -= fall[i] * dt;
      if (p[i * 3 + 1] < -4.8) p[i * 3 + 1] = 4.8;
      p[i * 3] = baseX[i] + Math.sin(t * freq[i] + phase[i]) * 0.35;
    }
    geo.attributes.position.needsUpdate = true;
    const prog = getProgress ? getProgress() : 0;
    points.rotation.y = Math.sin(t * 0.05) * 0.08;
    points.rotation.x = prog * 0.35;
    points.position.y = prog * 1.2;
    renderer.render(scene, cam);
    raf = requestAnimationFrame(loop);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      running = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (running) { clock.getDelta(); loop(); }
    });
  });
  io.observe(host);
  loop();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener("resize", resize);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
