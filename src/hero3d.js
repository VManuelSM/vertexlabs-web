/* Capa 3D del hero: arena de marca cayendo (Three.js, carga diferida).
   Solo se importa en desktop con puntero fino y sin reduced-motion. */

import * as THREE from "three";

export function mountHero3D(host, getProgress) {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  cam.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    alpha: true, antialias: false, powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.domElement.className = "hero3d";
  host.appendChild(renderer.domElement);

  /* columna central de arena cayendo + halo de granos lentos */
  const N = 1400;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const speed = new Float32Array(N);
  const PALETTE = [
    [0.961, 0.341, 0.525],   // fresa
    [0.431, 0.141, 0.318],   // ciruela
    [0.125, 0.204, 0.255],   // marino
  ];
  for (let i = 0; i < N; i++) {
    const stream = Math.random() < 0.55;
    const r = stream ? Math.random() * 0.35 : 1.2 + Math.random() * 3.6;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = (Math.random() * 2 - 1) * 4.4;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.6;
    const pick = Math.random();
    const c = PALETTE[pick < 0.6 ? 0 : pick < 0.85 ? 1 : 2];
    col.set(c, i * 3);
    speed[i] = stream ? 0.8 + Math.random() * 1.6 : 0.05 + Math.random() * 0.15;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true,
    opacity: 0.6, depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  points.position.x = 1.6;   /* carga visual a la derecha, bajo el slot de la frase */
  scene.add(points);

  const resize = () => {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / r.height;
    cam.updateProjectionMatrix();
  };
  resize();
  addEventListener("resize", resize);

  let running = true, raf = 0;
  const clock = new THREE.Clock();

  function loop() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const p = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      p[i * 3 + 1] -= speed[i] * dt;
      if (p[i * 3 + 1] < -4.6) p[i * 3 + 1] = 4.6;
    }
    geo.attributes.position.needsUpdate = true;
    const prog = getProgress();
    points.rotation.y += dt * 0.12;
    points.rotation.x = prog * 0.5;
    points.position.y = prog * 1.8;
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
