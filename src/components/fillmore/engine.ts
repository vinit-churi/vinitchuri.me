/**
 * Canvas drawing for the Fillmore page: the cloud fly-through behind the hero and the
 * ink-splash short film that plays over the page. Plain 2D canvas, no dependencies.
 * Everything here runs in the browser only; callers start it from an effect and keep
 * the returned cleanup.
 */

type Ctx = CanvasRenderingContext2D;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const eo = (p: number) => 1 - Math.pow(1 - p, 3);
const eio = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const back = (p: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
};
function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INK = "#1a1a18";
const PAPER = "#f3eee3";
const RED = "#d42a24";
const BLUE = "#3b2fd9";
const GREEN = "#2f6e55";
const AMBER = "#c98a00";
const SANS = "Hanken Grotesk, system-ui, sans-serif";
const SERIF = "Instrument Serif, Georgia, serif";
const MONO = "JetBrains Mono, ui-monospace, monospace";

/** The page loads fonts through next/font, which renames the family; read the real names once. */
function fontFamilies() {
  const css = getComputedStyle(document.documentElement);
  const pick = (v: string, fallback: string) => {
    const name = css.getPropertyValue(v).trim();
    return name ? `${name}, ${fallback}` : fallback;
  };
  return {
    sans: pick("--font-hanken", SANS),
    serif: pick("--font-instrument", SERIF),
    mono: pick("--font-jetbrains", MONO),
  };
}

/* ---------- Fillmore, his poses and his paper plane ---------- */

/**
 * One drawing of Fillmore. `cx` is where his body's centre sits across the artwork and `foot`
 * how far down his feet are, both as fractions; `k` scales poses whose artwork carries extra
 * props (flying papers, "!" marks) so his body stays the same size from pose to pose.
 */
export type Art = { img: HTMLImageElement; cx: number; foot: number; k: number };

export const POSES = {
  hero: { src: "/agents/fillmore.png", cx: 0.57, foot: 0.97, k: 1 },
  checklist: { src: "/agents/fillmore/poses/checklist.webp", cx: 0.46, foot: 1, k: 1 },
  sweat: { src: "/agents/fillmore/poses/sweat.webp", cx: 0.53, foot: 1, k: 1.08 },
  panic: { src: "/agents/fillmore/poses/panic.webp", cx: 0.51, foot: 1, k: 1.2 },
  inspect: { src: "/agents/fillmore/poses/inspect.webp", cx: 0.42, foot: 1, k: 1 },
  stack: { src: "/agents/fillmore/poses/stack.webp", cx: 0.49, foot: 1, k: 1 },
  laptop: { src: "/agents/fillmore/poses/laptop.webp", cx: 0.48, foot: 1, k: 1 },
  worried: { src: "/agents/fillmore/poses/worried.webp", cx: 0.53, foot: 1, k: 1.08 },
  tablet: { src: "/agents/fillmore/poses/tablet.webp", cx: 0.49, foot: 1, k: 1 },
} as const;
export type Pose = keyof typeof POSES;
export type Cast = Record<Pose, Art>;

function drawPenguin(
  ctx: Ctx,
  art: Art,
  x: number,
  y: number,
  h: number,
  o: { flip?: boolean; rot?: number; sq?: number; alpha?: number } = {},
) {
  const { img } = art;
  if (!img.complete || !img.naturalWidth || o.alpha === 0) return;
  h *= art.k;
  const w = (h * img.naturalWidth) / img.naturalHeight;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  ctx.translate(x, y);
  if (o.rot) ctx.rotate(o.rot);
  ctx.scale(o.flip ? -1 : 1, 1);
  if (o.sq) ctx.scale(1 + o.sq, 1 - o.sq);
  ctx.drawImage(img, -w * art.cx, -h * art.foot, w, h);
  ctx.restore();
}

function drawPlane(ctx: Ctx, s: number) {
  ctx.save();
  ctx.scale(s, s);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 3.2;
  ctx.strokeStyle = "#141414";
  const poly = (pts: number[][], fill: string) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  poly([[-150, -12], [180, 6], [-168, -2]], "#cfd6e4"); // far wing
  poly([[-122, 22], [180, 6], [-98, 52]], "#b9c2d4"); // keel
  poly([[-170, -4], [180, 6], [-122, 22]], "#f6f2e8"); // near wing, a folded form
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(20,20,20,0.35)";
  for (let i = 0; i < 4; i++) {
    const x0 = -128 + i * 52;
    ctx.beginPath();
    ctx.moveTo(x0, 4 + i * 0.6);
    ctx.lineTo(x0 + 34, 5.6 + i * 0.6);
    ctx.stroke();
  }
  ctx.strokeStyle = RED;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(-150, 6);
  ctx.lineTo(-145, 11);
  ctx.lineTo(-136, 1);
  ctx.stroke();
  ctx.restore();
}

/* ---------- Hero sky: flying through clouds ---------- */

function cloudSprite(seed: number) {
  const r = rng(seed);
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 380;
  const g = c.getContext("2d")!;
  const puffs: [number, number, number][] = [];
  const n = 70 + Math.floor(r() * 30);
  for (let i = 0; i < n; i++) {
    const u = (r() + r() + r()) / 3 - 0.5;
    const x = 320 + u * 470;
    const dome = Math.cos(u * Math.PI) * 120;
    const y = 300 - dome * (0.45 + r() * 0.6) + (r() - 0.5) * 30;
    const rad = 22 + r() * 52 * (0.5 + Math.cos(u * Math.PI) * 0.7);
    puffs.push([x, y, rad]);
  }
  puffs.sort((a, b) => a[1] - b[1]);
  for (const [x, y, rad] of puffs) {
    const gr = g.createRadialGradient(x, y + rad * 0.3, 0, x, y + rad * 0.3, rad * 1.15);
    gr.addColorStop(0, "rgba(22,38,72,0.95)");
    gr.addColorStop(0.7, "rgba(22,38,72,0.7)");
    gr.addColorStop(1, "rgba(22,38,72,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y + rad * 0.3, rad * 1.15, 0, 7);
    g.fill();
  }
  // Moonlight from the upper right.
  for (const [x, y, rad] of puffs) {
    const gr = g.createRadialGradient(x + rad * 0.35, y - rad * 0.45, rad * 0.05, x, y, rad);
    gr.addColorStop(0, "rgba(186,206,236,0.55)");
    gr.addColorStop(0.4, "rgba(118,148,192,0.45)");
    gr.addColorStop(0.8, "rgba(52,80,128,0.25)");
    gr.addColorStop(1, "rgba(40,64,110,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, rad, 0, 7);
    g.fill();
  }
  g.globalCompositeOperation = "source-atop";
  const shade = g.createLinearGradient(0, 120, 0, 380);
  shade.addColorStop(0, "rgba(10,20,44,0)");
  shade.addColorStop(1, "rgba(10,20,44,0.75)");
  g.fillStyle = shade;
  g.fillRect(0, 0, 640, 380);
  const out = document.createElement("canvas");
  out.width = 640;
  out.height = 380;
  const o = out.getContext("2d")!;
  o.filter = "blur(7px)";
  o.drawImage(c, 0, 0);
  return out;
}

type Cloud = { x: number; y: number; z: number; s: number; k: number; flip: boolean };

/** Starts the sky behind `hero`. Fillmore's plane is centred on `art`. Returns a cleanup. */
export function startSky(canvas: HTMLCanvasElement, hero: HTMLElement, art: HTMLElement, fillmore: Art) {
  const img = fillmore.img;
  const ctx = canvas.getContext("2d")!;
  const reduce = prefersReducedMotion();
  const sprites = Array.from({ length: 8 }, (_, i) => cloudSprite(11 + i * 97));
  const R = rng(7);
  const ZMAX = 7;
  const spawn = (z: number): Cloud => {
    let x: number, y: number;
    do {
      x = (R() - 0.5) * 5.2;
      y = 0.15 + R() * 1.1;
    } while (Math.abs(x) < 0.55 && y < 0.55 && R() < 0.85); // keep the middle mostly clear
    return { x, y, z, s: 0.9 + R() * 1.1, k: Math.floor(R() * 8), flip: R() < 0.5 };
  };
  const clouds = Array.from({ length: 64 }, () => spawn(R() * ZMAX + 0.3));
  const stars = Array.from({ length: 240 }, () => ({ x: R(), y: R() * 0.75, r: R() * 1.3 + 0.2, p: R() * 6.28, a: 0.35 + R() * 0.6 }));

  let W = 0, H = 0, DPR = 1;
  let camX = 0, camY = 0, tgtX = 0, tgtY = 0;
  let t = 0, last = performance.now(), raf = 0, visible = true;

  const size = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    if (reduce) render(0);
  };
  const onMove = (e: PointerEvent) => {
    const b = hero.getBoundingClientRect();
    tgtX = ((e.clientX - b.left) / b.width - 0.5) * 0.35;
    tgtY = ((e.clientY - b.top) / b.height - 0.5) * 0.12;
  };
  const onLeave = () => {
    tgtX = 0;
    tgtY = 0;
  };

  function render(dt: number) {
    if (!W) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    camX += (tgtX - camX) * 0.04;
    camY += (tgtY - camY) * 0.04;
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#050914");
    bg.addColorStop(0.45, "#0b1736");
    bg.addColorStop(1, "#1d3762");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const moon = ctx.createRadialGradient(W * 0.8, H * 0.12, 0, W * 0.8, H * 0.12, W * 0.45);
    moon.addColorStop(0, "rgba(160,190,240,0.22)");
    moon.addColorStop(1, "rgba(160,190,240,0)");
    ctx.fillStyle = moon;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#dfe8ff";
    for (const s of stars) {
      ctx.globalAlpha = s.a * (0.6 + 0.4 * Math.sin(t * 1.6 + s.p));
      ctx.fillRect((s.x * W - camX * 30 + W) % W, s.y * H - camY * 20, s.r, s.r);
    }
    ctx.globalAlpha = 1;

    const speed = reduce ? 0 : 0.42;
    for (const c of clouds) {
      c.z -= speed * dt;
      if (c.z < 0.22) Object.assign(c, spawn(ZMAX));
    }
    clouds.sort((a, b) => b.z - a.z);
    const f = Math.max(W, H * 1.4) * 0.42;
    const hz = H * 0.42;
    const a = art.getBoundingClientRect();
    const h = hero.getBoundingClientRect();
    const P = { x: a.left - h.left + a.width * 0.5, y: a.top - h.top + a.height * 0.55, s: clamp(a.width / 560, 0.55, 1.05) };
    const ZP = 1.25;
    let planeDrawn = false;
    const plane = () => {
      const bob = Math.sin(t * 1.3) * 8;
      const roll = Math.sin(t * 0.9) * 0.035;
      ctx.save();
      ctx.translate(P.x - camX * 120, P.y + bob - camY * 60);
      ctx.rotate(roll - 0.04);
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 3; i++) {
        const g = ctx.createLinearGradient(-170 * P.s, 0, -520 * P.s, 0);
        g.addColorStop(0, "rgba(230,238,255,0.55)");
        g.addColorStop(1, "rgba(230,238,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-160 * P.s, (8 + i * 14) * P.s);
        ctx.lineTo(-520 * P.s, (8 + i * 14 + Math.sin(t * 3 + i) * 6) * P.s);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      drawPlane(ctx, P.s);
      drawPenguin(ctx, fillmore, -22 * P.s, 4 * P.s, 240 * P.s, { rot: Math.sin(t * 1.1) * 0.03 });
      ctx.restore();
      planeDrawn = true;
    };
    for (const c of clouds) {
      if (!planeDrawn && c.z < ZP) plane();
      const sc = f / c.z;
      const x = W / 2 + (c.x - camX) * sc;
      const y = hz + (c.y - camY) * sc;
      const w = 1.25 * c.s * sc;
      const ch = (w * 380) / 640;
      if (x + w / 2 < 0 || x - w / 2 > W || y - ch > H + 40) continue;
      ctx.globalAlpha = seg(ZMAX - c.z, 0, 2.2) * seg(c.z, 0.22, 0.9) * 0.95;
      ctx.save();
      ctx.translate(x, y);
      if (c.flip) ctx.scale(-1, 1);
      ctx.drawImage(sprites[c.k], -w / 2, -ch * 0.75, w, ch);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (!planeDrawn) plane();
  }

  const loop = (now: number) => {
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now;
    if (visible && !document.body.dataset.film) {
      t += dt;
      render(dt);
    }
    raf = requestAnimationFrame(loop);
  };

  const ro = new ResizeObserver(size);
  ro.observe(hero);
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(hero);
  hero.addEventListener("pointermove", onMove);
  hero.addEventListener("pointerleave", onLeave);
  const onLoad = () => render(0);
  img.addEventListener("load", onLoad);
  size();
  if (!reduce) raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    hero.removeEventListener("pointermove", onMove);
    hero.removeEventListener("pointerleave", onLeave);
    img.removeEventListener("load", onLoad);
  };
}

/* ---------- Ink splash ---------- */

type Blob = { x: number; y: number; delay: number; size: number; p1: number; p2: number; p3: number; spikes: { a: number; k: number; w: number }[] };
type Splash = { blobs: Blob[]; drops: { a: number; d: number; rad: number; len: number }[]; diag: number; ox: number; oy: number };

function blobPath(ctx: Ctx, b: Blob, R: number) {
  ctx.beginPath();
  const steps = 360;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    let r =
      1 +
      0.09 * Math.sin(4 * a + b.p1) +
      0.05 * Math.sin(7 * a + b.p2) +
      0.025 * Math.sin(13 * a + b.p3) +
      0.008 * Math.sin(37 * a + b.p1);
    for (const sp of b.spikes) {
      const d = Math.atan2(Math.sin(a - sp.a), Math.cos(a - sp.a));
      r += sp.k * Math.exp(-(d * d) / sp.w);
    }
    const rr = Math.max(0, R * r);
    const x = b.x + Math.cos(a) * rr;
    const y = b.y + Math.sin(a) * rr;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.closePath();
}

function makeSplash(ox: number, oy: number, W: number, H: number, seed: number): Splash {
  const r = rng(seed);
  const mk = (x: number, y: number, delay: number, size: number): Blob => ({
    x, y, delay, size,
    p1: r() * 6.28, p2: r() * 6.28, p3: r() * 6.28,
    spikes: Array.from({ length: 6 }, () => ({ a: r() * 6.28, k: 0.08 + r() * 0.22, w: 0.006 + r() * 0.03 })),
  });
  const blobs = [mk(ox, oy, 0, 1)];
  for (let i = 0; i < 4; i++) blobs.push(mk(W * (0.15 + r() * 0.7), H * (0.15 + r() * 0.7), 0.12 + i * 0.08, 0.75 + r() * 0.3));
  const drops = Array.from({ length: 34 }, () => ({ a: r() * 6.28, d: 0.12 + r() * 0.5, rad: 2 + r() * 11, len: 1 + r() * 3 }));
  return { blobs, drops, diag: Math.hypot(W, H), ox, oy };
}

function fillSplash(ctx: Ctx, S: Splash, p: number, grow = 1) {
  for (const b of S.blobs) {
    const q = clamp((p - b.delay) / (1 - b.delay * 0.6));
    if (q <= 0) continue;
    blobPath(ctx, b, S.diag * 0.62 * b.size * eio(q) * grow + 18 * grow);
    ctx.fill();
  }
  const dp = seg(p, 0, 0.55);
  if (dp > 0 && dp < 1) {
    for (const d of S.drops) {
      const dist = S.diag * d.d * eo(dp);
      ctx.save();
      ctx.translate(S.ox + Math.cos(d.a) * dist, S.oy + Math.sin(d.a) * dist);
      ctx.rotate(d.a);
      ctx.beginPath();
      ctx.ellipse(0, 0, d.rad * d.len * (1 - dp * 0.5) * grow, d.rad * grow, 0, 0, 7);
      ctx.fill();
      ctx.restore();
    }
  }
}

/* ---------- The short film, drawn on a 1600×900 stage ---------- */

export const FILM_LENGTH = 45;

export const FILM_SUBTITLES: [number, number, string][] = [
  [0.4, 6, "This is Fillmore. Fillmore is a very careful penguin."],
  [6.2, 13, "Then the forms arrive. Forty-seven fields you have typed before."],
  [13.2, 21, "So you give Fillmore your documents once. It reads them and remembers what matters."],
  [21.2, 27, "Open any form. Fillmore fills what it knows and shows where each answer came from."],
  [27, 32, "When it isn’t sure, it asks you. It never guesses."],
  [32.2, 38, "And Fillmore never presses Submit. You check it, and you send it."],
  [38.5, 44.5, "Fillmore. A form-filling agent by Vinit Churi, in the lab."],
];

/** A pose that starts at a scene-local time. */
type Beat = [number, Pose];
const HOP = 0.5;

function makeStage(cast: Cast) {
  const F = fontFamilies();
  const still = prefersReducedMotion();
  const rr = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };
  const inkBox = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string, lw = 3.5) => {
    rr(ctx, x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (lw) {
      ctx.lineWidth = lw;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  };
  const text = (ctx: Ctx, s: string, x: number, y: number, size: number, o: { w?: number; f?: string; c?: string; a?: CanvasTextAlign } = {}) => {
    ctx.font = `${o.w ?? 600} ${size}px ${o.f ?? F.sans}`;
    ctx.fillStyle = o.c ?? INK;
    ctx.textAlign = o.a ?? "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(s, x, y);
  };
  const shadow = (ctx: Ctx, x: number, y: number, w: number) => {
    ctx.fillStyle = "rgba(26,26,24,0.12)";
    ctx.beginPath();
    ctx.ellipse(x, y, w, w * 0.14, 0, 0, 7);
    ctx.fill();
  };
  const penguin = (ctx: Ctx, x: number, y: number, h: number, o?: { flip?: boolean; rot?: number; sq?: number }) => drawPenguin(ctx, cast.hero, x, y, h, o);

  /**
   * Fillmore acting through a scene: he breathes while he holds a pose, and changes pose with a
   * little hop (crouch, jump, land) while the old drawing dissolves into the new one mid-air.
   */
  function act(ctx: Ctx, beats: Beat[], lt: number, x: number, y: number, h: number, o: { flip?: boolean; rot?: number; sq?: number } = {}) {
    let i = 0;
    while (i + 1 < beats.length && lt >= beats[i + 1][0]) i++;
    const since = lt - beats[i][0];
    // With reduced motion he stands still and the poses simply dissolve into each other.
    const breathe = still ? 0 : Math.sin(lt * 2.4);
    let sq = (o.sq ?? 0) + breathe * 0.012;
    let lift = breathe * h * 0.004;
    let mix = 1;
    if (i > 0 && since < HOP) {
      const p = since / HOP;
      if (!still) {
        sq += Math.sin(p * Math.PI * 3) * 0.08 * (1 - p * 0.5);
        lift += p > 0.25 && p < 0.75 ? Math.sin(((p - 0.25) / 0.5) * Math.PI) * h * 0.07 : 0;
      }
      mix = eio(seg(p, 0.2, 0.6));
    }
    const pose = { flip: o.flip, rot: (o.rot ?? 0) + (still ? 0 : Math.sin(lt * 1.3) * 0.012), sq };
    if (mix < 1) drawPenguin(ctx, cast[beats[i - 1][1]], x, y - lift, h, { ...pose, alpha: 1 - mix });
    drawPenguin(ctx, cast[beats[i][1]], x, y - lift, h, { ...pose, alpha: mix });
  }

  function doc(ctx: Ctx, kind: string, x: number, y: number, rot: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    if (kind === "passport") {
      inkBox(ctx, -70, -95, 140, 190, 14, "#7a1f2b");
      ctx.strokeStyle = "#e9c46a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -10, 28, 0, 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -10, 14, 0, 7);
      ctx.stroke();
      text(ctx, "PASSPORT", 0, 58, 17, { c: "#e9c46a", a: "center", w: 700, f: F.mono });
    } else if (kind === "id") {
      inkBox(ctx, -110, -70, 220, 140, 16, "#e6efe9");
      inkBox(ctx, -92, -46, 64, 80, 8, "#c8d6cc", 2.5);
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-60, -16, 14, 0, 7);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-60, 26, 22, 14, 0, Math.PI, 0);
      ctx.fill();
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i ? "rgba(26,26,24,0.3)" : INK;
        ctx.fillRect(-10, -40 + i * 22, i ? 90 : 70, 8);
      }
      text(ctx, "ID CARD", 92, 56, 13, { a: "right", w: 500, f: F.mono });
    } else {
      inkBox(ctx, -85, -110, 170, 220, 10, "#fffdf8");
      text(ctx, kind === "payslip" ? "PAYSLIP" : "ELECTRICITY BILL", -66, -78, 12.5, { w: 700, f: F.mono });
      ctx.fillStyle = "rgba(26,26,24,0.25)";
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(-66, -56 + i * 22, 70 + ((i * 37) % 50), 7);
        ctx.fillRect(34, -56 + i * 22, 32, 7);
      }
      ctx.fillStyle = kind === "payslip" ? GREEN : AMBER;
      ctx.fillRect(-66, 82, 132, 10);
    }
    ctx.restore();
  }

  function field(ctx: Ctx, x: number, y: number, w: number, label: string, value: string, typed: number, state: string, src: string) {
    text(ctx, label, x, y - 12, 15, { c: "#5b5953", w: 500, f: F.mono });
    const col = state === "ok" ? GREEN : state === "ask" ? AMBER : state === "on" ? BLUE : "#cfc9bb";
    rr(ctx, x, y, w, 56, 12);
    ctx.fillStyle = state === "ask" ? "#fff6dc" : "#fff";
    ctx.fill();
    ctx.lineWidth = state ? 3 : 2;
    ctx.strokeStyle = col;
    ctx.stroke();
    if (value) {
      const n = Math.floor(value.length * clamp(typed));
      text(ctx, value.slice(0, n), x + 18, y + 37, 22, { w: 500 });
      if (typed < 1 && Math.floor(performance.now() / 300) % 2) {
        const mw = ctx.measureText(value.slice(0, n)).width;
        ctx.fillStyle = BLUE;
        ctx.fillRect(x + 20 + mw, y + 14, 2.5, 28);
      }
    }
    if (src && typed >= 1) {
      ctx.font = `500 13px ${F.mono}`;
      const tw = ctx.measureText(src).width + 22;
      rr(ctx, x + w - tw - 12, y + 15, tw, 26, 13);
      ctx.fillStyle = state === "ask" ? "#f7e2a8" : "#e3efe8";
      ctx.fill();
      text(ctx, src, x + w - tw / 2 - 12, y + 33, 13, { a: "center", c: state === "ask" ? "#7a5600" : GREEN, w: 500, f: F.mono });
    }
  }

  function bubble(ctx: Ctx, x: number, y: number, w: number, lines: string[], p: number) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    const s = back(clamp(p));
    ctx.scale(s, s);
    const h = 24 + lines.length * 32;
    rr(ctx, -w / 2, -h, w, h, 18);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-14, -2);
    ctx.lineTo(10, 26);
    ctx.lineTo(16, -2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(10, 26);
    ctx.lineTo(16, 0);
    ctx.stroke();
    lines.forEach((l, i) => text(ctx, l, 0, -h + 42 + i * 32, 24, { a: "center", w: 600 }));
    ctx.restore();
  }

  function cursor(ctx: Ctx, x: number, y: number, down: boolean) {
    ctx.save();
    ctx.translate(x, y);
    if (down) ctx.scale(0.88, 0.88);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 34);
    ctx.lineTo(9, 26);
    ctx.lineTo(16, 40);
    ctx.lineTo(22, 37);
    ctx.lineTo(15, 23);
    ctx.lineTo(27, 23);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.restore();
  }

  return function drawStage(ctx: Ctx, t: number) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(-2000, -2000, 5600, 4900);
    ctx.fillStyle = "rgba(26,26,24,0.04)";
    for (let i = 0; i < 9; i++) ctx.fillRect(-400, 90 + i * 100, 2400, 1);
    const fade = (a: number, b: number, f = 0.4) => clamp(Math.min((t - a) / f, (b - t) / f));

    // 1. Meet Fillmore
    let a = fade(0, 6.4);
    if (a > 0) {
      ctx.save();
      ctx.globalAlpha = a;
      const pop = back(seg(t, 0.3, 1.2));
      const zoom = 1 + seg(t, 0, 6.4) * 0.06;
      ctx.translate(800, 470);
      ctx.scale(zoom, zoom);
      ctx.translate(-800, -470);
      shadow(ctx, 800, 720, 170 * pop);
      penguin(ctx, 800, 722 + Math.sin(t * 2.4) * 3, 470 * pop, { sq: Math.sin(t * 2.4) * 0.012 });
      const ta = seg(t, 1.2, 2.0);
      ctx.globalAlpha = a * ta;
      text(ctx, "This is Fillmore.", 800, 175 - (1 - eo(ta)) * 20, 92, { a: "center", f: F.serif, w: 400 });
      const l1 = seg(t, 3, 3.6);
      const l2 = seg(t, 3.7, 4.3);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = INK;
      if (l1) {
        ctx.globalAlpha = a * l1;
        ctx.beginPath();
        ctx.moveTo(560, 430);
        ctx.lineTo(470, 380);
        ctx.stroke();
        text(ctx, "red scarf: non-negotiable", 460, 370, 20, { a: "right", w: 500, f: F.mono });
      }
      if (l2) {
        ctx.globalAlpha = a * l2;
        ctx.beginPath();
        ctx.moveTo(1010, 520);
        ctx.lineTo(1100, 470);
        ctx.stroke();
        text(ctx, "clipboard: always", 1110, 465, 20, { w: 500, f: F.mono });
      }
      ctx.restore();
    }

    // 2. The forms arrive
    a = fade(6, 13.4);
    if (a > 0) {
      const lt = t - 6;
      ctx.save();
      ctx.globalAlpha = a;
      const r = rng(5);
      for (let i = 0; i < 16; i++) {
        const p = clamp((lt - (0.6 + i * 0.32)) / 0.9);
        const x = 170 + r() * 560;
        const y1 = 745 - Math.floor(i / 3) * 12;
        const rot = (r() - 0.5) * 0.5 * (1 - p) + (r() - 0.5) * 0.12;
        if (p <= 0) continue;
        ctx.save();
        ctx.translate(x, -200 + (y1 + 200) * eo(p));
        ctx.rotate(rot);
        inkBox(ctx, -130, -26, 260, 52, 6, "#fffdf8", 3);
        ctx.fillStyle = "rgba(26,26,24,0.25)";
        ctx.fillRect(-110, -8, 120, 6);
        ctx.fillRect(-110, 6, 80, 6);
        ctx.restore();
      }
      const fy = 900 - eo(seg(lt, 0, 1.0)) * 790;
      inkBox(ctx, 870, fy, 560, 900, 18, "#fffdf8");
      rr(ctx, 872, fy + 2, 556, 74, 16);
      ctx.fillStyle = "#ece6d8";
      ctx.fill();
      text(ctx, "Application form · page 1 of 6", 900, fy + 48, 22, { w: 700 });
      ctx.save();
      rr(ctx, 872, fy + 78, 556, 820, 0);
      ctx.clip();
      const scroll = Math.max(0, lt - 1.2) * 140;
      const labels = ["Full name", "Date of birth", "Passport number", "Place of issue", "Address line 1", "Address line 2", "Employer", "Date joined", "Father’s name", "Annual income", "Purpose of visit", "Previous visits"];
      for (let i = 0; i < 30; i++) {
        const y = fy + 120 + i * 92 - scroll;
        if (y < fy - 100 || y > 1000) continue;
        field(ctx, 905, y + 26, 490, labels[i % labels.length], "", 0, "", "");
      }
      ctx.restore();
      const cnt = Math.min(47, 1 + Math.floor(Math.max(0, lt - 1.2) * 7));
      inkBox(ctx, 1240, fy - 34, 210, 52, 26, INK, 0);
      text(ctx, `Field ${cnt} of 47`, 1345, fy - 1, 21, { a: "center", c: PAPER, w: 500, f: F.mono });
      const shake = lt > 3 ? Math.sin(lt * 38) * 3 * seg(lt, 3, 4) : 0;
      shadow(ctx, 430, 735, 140);
      act(ctx, [[0, "checklist"], [2.9, "sweat"], [5.1, "panic"]], lt, 430 + shake, 736, 360, { sq: lt > 3 ? 0.03 * seg(lt, 3, 3.6) : 0 });
      if (lt > 3.4) {
        for (let i = 0; i < 3; i++) {
          const p = ((lt - 3.4) * 0.9 + i * 0.33) % 1;
          ctx.globalAlpha = a * (1 - p);
          ctx.fillStyle = "#8fc0e8";
          ctx.strokeStyle = INK;
          ctx.lineWidth = 2;
          const x = 560 + i * 26;
          const y = 360 + p * 70;
          ctx.beginPath();
          ctx.moveTo(x, y - 14);
          ctx.quadraticCurveTo(x + 9, y, x, y + 6);
          ctx.quadraticCurveTo(x - 9, y, x, y - 14);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 3. Documents in, read, remembered
    a = fade(13, 21.4);
    if (a > 0) {
      const lt = t - 13;
      ctx.save();
      ctx.globalAlpha = a;
      const docs: [string, number, number, string, string][] = [
        ["passport", 230, 0.4, "Name · Asha Rao", "Passport · Z4821937"],
        ["id", 470, 1.0, "Date of birth · 12 Apr 1994", ""],
        ["payslip", 700, 1.6, "Employer · Kestrel Labs", "Joined · Jun 2021"],
        ["bill", 920, 2.2, "Address · 14 Lake Rd, Pune", ""],
      ];
      const chips: [string, number, number, number][] = [];
      docs.forEach(([k, x, st, c1, c2], i) => {
        const p = eo(seg(lt, st, st + 0.7));
        if (p <= 0) return;
        const dx = -300 + (x + 300) * p;
        const dy = 380 - Math.sin(p * Math.PI) * 120;
        doc(ctx, k, dx, dy, (1 - p) * -0.6 + (i % 2 ? 0.05 : -0.05));
        const sp = seg(lt, st + 2.4, st + 3.2);
        if (sp > 0 && sp < 1) {
          const by = dy - 115 + sp * 230;
          const g = ctx.createLinearGradient(0, by - 24, 0, by + 4);
          g.addColorStop(0, "rgba(59,47,217,0)");
          g.addColorStop(1, "rgba(59,47,217,0.35)");
          ctx.fillStyle = g;
          ctx.fillRect(dx - 125, by - 24, 250, 28);
          ctx.fillStyle = BLUE;
          ctx.fillRect(dx - 125, by, 250, 3);
        }
        [c1, c2].forEach((c, j) => {
          if (c) chips.push([c, dx, dy, st + 3.0 + j * 0.25]);
        });
      });
      const px = 1150 + (1 - eo(seg(lt, 2.4, 3.2))) * 500;
      inkBox(ctx, px, 140, 400, 470, 22, "#fff");
      text(ctx, "Your profile", px + 28, 192, 28, { w: 800 });
      text(ctx, "kept on your device", px + 28, 222, 15, { c: "#5b5953", w: 500, f: F.mono });
      chips.forEach(([c, dx, dy, st], i) => {
        const q = eio(seg(lt, st, st + 0.8));
        if (q <= 0) return;
        const tx = px + 28;
        const ty = 252 + i * 54;
        const x = dx - 100 + (tx - dx + 100) * q;
        const y = dy - 40 + (ty - dy + 40) * q - Math.sin(q * Math.PI) * 60;
        ctx.font = `500 17px ${F.mono}`;
        const w = Math.min(344, ctx.measureText(c).width + 28);
        rr(ctx, x, y, w, 40, 20);
        ctx.fillStyle = q >= 1 ? "#e3efe8" : "#e8e5fb";
        ctx.fill();
        text(ctx, c, x + 14, y + 26, 17, { w: 500, f: F.mono, c: q >= 1 ? GREEN : BLUE });
      });
      shadow(ctx, 1350, 845, 90);
      act(ctx, [[0, "stack"], [2.6, "inspect"], [5.6, "checklist"]], lt, 1350, 846, 230, { flip: true });
      ctx.restore();
    }

    // 4–5. The browser form: fill, ask, hand over Submit
    a = fade(21, 38.4);
    if (a > 0) {
      const lt = t - 21;
      ctx.save();
      ctx.globalAlpha = a;
      const bx = 110;
      const by = 70 + (1 - eo(seg(lt, 0, 0.8))) * 80;
      inkBox(ctx, bx, by, 1060, 780, 22, "#fff");
      rr(ctx, bx + 2, by + 2, 1056, 60, 20);
      ctx.fillStyle = "#ece6d8";
      ctx.fill();
      ["#e8573a", "#f2c230", "#2f6e55"].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(bx + 32 + i * 26, by + 32, 8, 0, 7);
        ctx.fill();
      });
      rr(ctx, bx + 130, by + 14, 600, 36, 18);
      ctx.fillStyle = "#fff";
      ctx.fill();
      text(ctx, "apply.visa-portal.example / step-2", bx + 152, by + 39, 16, { c: "#5b5953", w: 500, f: F.mono });
      inkBox(ctx, bx + 980, by + 12, 60, 38, 12, lt > 1 ? RED : "#fff", 2.5);
      text(ctx, "F", bx + 1010, by + 39, 22, { a: "center", w: 800, c: lt > 1 ? "#fff" : INK });
      text(ctx, "Visa application", bx + 50, by + 130, 38, { w: 800 });
      text(ctx, "Step 2 of 6 · Personal details", bx + 50, by + 164, 17, { c: "#5b5953", w: 500, f: F.mono });
      const fields: [string, string, string][] = [
        ["Full name", "Asha Rao", "passport"],
        ["Date of birth", "12 / 04 / 1994", "ID card"],
        ["Passport number", "Z4821937", "passport"],
        ["Employer", "Kestrel Labs", "payslip"],
        ["Home address", "14 Lake Rd, Pune 411001", "you chose"],
        ["Purpose of visit", "Conference", "profile"],
      ];
      const askT = 6.2;
      const answerT = 9.6;
      const stateOf = (typed: number) => (typed > 0 && typed < 1 ? "on" : typed >= 1 ? "ok" : "");
      fields.forEach(([lab, val, src], i) => {
        const x = bx + 50 + (i % 2) * 490;
        const y = by + 240 + Math.floor(i / 2) * 130;
        const st = 1.3 + i * 0.75;
        let typed = seg(lt, st, st + 0.6);
        let state = stateOf(typed);
        if (i === 4) {
          if (lt < askT) {
            typed = 0;
            state = "";
          } else if (lt < answerT) {
            typed = 0;
            state = "ask";
          } else {
            typed = seg(lt, answerT, answerT + 0.6);
            state = typed < 1 ? "on" : "ok";
          }
        }
        if (i === 5) {
          typed = seg(lt, answerT + 0.9, answerT + 1.4);
          state = stateOf(typed);
        }
        field(ctx, x, y, 450, lab, val, typed, state, state === "ask" ? "2 found" : src);
        if (state === "ask") text(ctx, "?  Waiting for you", x + 18, y + 37, 20, { c: AMBER, w: 700 });
      });
      const allDone = lt > answerT + 1.6;
      const clicked = lt > 15.2;
      const sbx = bx + 50;
      const sby = by + 650;
      if (allDone) {
        ctx.save();
        ctx.shadowColor = "rgba(59,47,217,0.6)";
        ctx.shadowBlur = 24 * (0.5 + 0.5 * Math.sin(lt * 4));
        rr(ctx, sbx, sby, 240, 64, 16);
        ctx.fillStyle = clicked ? GREEN : BLUE;
        ctx.fill();
        ctx.restore();
      } else {
        rr(ctx, sbx, sby, 240, 64, 16);
        ctx.fillStyle = "#d9d4c8";
        ctx.fill();
      }
      text(ctx, clicked ? "Submitted ✓" : "Submit", sbx + 120, sby + 41, 24, { a: "center", c: "#fff", w: 700 });
      if (allDone && !clicked) text(ctx, "Fillmore never clicks this.", sbx + 268, sby + 40, 19, { c: "#5b5953", w: 500, f: F.mono });
      const px = 1370 + (1 - eo(seg(lt, 0.5, 1.3))) * 300;
      shadow(ctx, px, 800, 110);
      const beats: Beat[] = [[0, "laptop"], [askT, "worried"], [answerT, "laptop"], [answerT + 1.6, "checklist"], [15.3, "tablet"]];
      act(ctx, beats, lt, px, 802, 330, { flip: true, rot: lt > askT && lt < answerT ? Math.sin(lt * 3) * 0.04 : 0 });
      bubble(ctx, px - 30, 400, 330, ["Two addresses found.", "Which one is home?"], lt > askT + 0.2 && lt < answerT ? seg(lt, askT + 0.2, askT + 0.6) : 0);
      if (lt > askT + 1.4 && lt < answerT + 0.5) {
        const oy = by + 240 + 2 * 130 + 70;
        ctx.save();
        ctx.globalAlpha = a * seg(lt, askT + 1.4, askT + 1.8);
        inkBox(ctx, bx + 50, oy, 450, 120, 14, "#fff", 2.5);
        rr(ctx, bx + 58, oy + 8, 434, 50, 10);
        ctx.fillStyle = lt > answerT - 0.7 ? "#e3efe8" : "#f7f4ec";
        ctx.fill();
        text(ctx, "14 Lake Rd, Pune · from bill", bx + 74, oy + 41, 19, { w: 500 });
        text(ctx, "Old: 3 MG Road, Bengaluru · ID card", bx + 74, oy + 99, 19, { w: 500, c: "#8d8a82" });
        ctx.restore();
        const cp = eio(seg(lt, askT + 1.9, answerT - 0.8));
        cursor(ctx, 700 + (bx + 300 - 700) * cp, 860 + (oy + 36 - 860) * cp, lt > answerT - 0.7 && lt < answerT - 0.4);
      }
      if (allDone) {
        const cp = eio(seg(lt, 13, 15));
        const cx = 700 + (sbx + 150 - 700) * cp;
        const cy = 900 + (sby + 34 - 900) * cp;
        cursor(ctx, cx, cy, lt > 15 && lt < 15.35);
        if (lt > 13) text(ctx, "you", cx + 30, cy + 58, 16, { w: 700, f: F.mono, c: BLUE });
      }
      ctx.restore();
    }

    // 6. Title card
    a = fade(38, 46);
    if (a > 0) {
      const lt = t - 38;
      ctx.save();
      ctx.globalAlpha = a;
      const pop = back(seg(lt, 0.2, 1));
      shadow(ctx, 1080, 760, 150 * pop);
      penguin(ctx, 1080, 762 + Math.sin(lt * 2) * 4, 520 * pop, { rot: Math.sin(lt * 1.6) * 0.025 });
      const ta = eo(seg(lt, 0.6, 1.4));
      ctx.globalAlpha = a * ta;
      text(ctx, "Fillmore", 160, 430 + (1 - ta) * 30, 180, { f: F.serif, w: 400 });
      text(ctx, "The form-filling agent", 168, 500, 34, { w: 700 });
      text(ctx, "by Vinit Churi · join the waitlist", 168, 548, 22, { w: 500, c: "#5b5953", f: F.mono });
      ctx.restore();
    }
  };
}

type FilmCallbacks = {
  onStart: () => void;
  /** Fires when the ink has fully cleared; `finished` is true when the film ran to the end. */
  onEnd: (finished: boolean) => void;
  onUi: (visible: boolean) => void;
  onTime: (t: number) => void;
};

/** Sets up the ink film on a full-screen canvas. Call `play` from a click; `close` to skip. */
export function createFilm(canvas: HTMLCanvasElement, cast: Cast, cb: FilmCallbacks) {
  const fctx = canvas.getContext("2d")!;
  const scene = document.createElement("canvas");
  const sctx = scene.getContext("2d")!;
  const ink = document.createElement("canvas");
  const ictx = ink.getContext("2d")!;
  const drawStage = makeStage(cast);
  const INTRO = 1.25;
  const OUTRO = 1.3;
  let W = 0, H = 0, DPR = 1;
  let state: "idle" | "in" | "play" | "out" = "idle";
  let tState = 0, tFilm = 0, finished = false;
  let splashIn: Splash | null = null;
  let splashOut: Splash | null = null;
  let raf = 0, last = 0;

  const size = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    for (const c of [canvas, scene, ink]) {
      c.width = Math.round(W * DPR);
      c.height = Math.round(H * DPR);
    }
  };

  function renderScene(t: number) {
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, scene.width, scene.height);
    const s = Math.min(W / 1600, H / 900) * DPR * 0.98;
    sctx.setTransform(s, 0, 0, s, (scene.width - 1600 * s) / 2, (scene.height - 900 * s) / 2 - (H < 700 ? 0 : 20 * DPR));
    drawStage(sctx, t);
  }

  function frame(now: number) {
    // rAF timestamps can trail performance.now(), so never let a step go negative.
    const dt = last ? clamp((now - last) / 1000, 0, 0.05) : 0;
    last = now;
    tState += dt;
    if (state === "in" && tState >= INTRO) {
      state = "play";
      tState = 0;
      cb.onUi(true);
    } else if (state === "play") {
      tFilm += dt;
      if (tFilm >= FILM_LENGTH) {
        finished = true;
        close();
      }
    }
    renderScene(Math.min(tFilm, FILM_LENGTH));
    cb.onTime(tFilm);

    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.clearRect(0, 0, canvas.width, canvas.height);
    ictx.setTransform(1, 0, 0, 1, 0, 0);
    ictx.clearRect(0, 0, ink.width, ink.height);
    ictx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const composite = () => {
      ictx.globalCompositeOperation = "source-in";
      ictx.setTransform(1, 0, 0, 1, 0, 0);
      ictx.drawImage(scene, 0, 0);
      ictx.globalCompositeOperation = "source-over";
      fctx.setTransform(1, 0, 0, 1, 0, 0);
      fctx.drawImage(ink, 0, 0);
    };

    if (state === "in" || state === "play") {
      const p = state === "in" ? clamp(tState / INTRO) : 1;
      // The ink leads; the picture bleeds in just behind it.
      fctx.fillStyle = INK;
      if (p < 1 && splashIn) fillSplash(fctx, splashIn, p * 1.08 + 0.02, 1);
      else fctx.fillRect(0, 0, W, H);
      ictx.fillStyle = "#000";
      const q = clamp((p - 0.18) / 0.82);
      if (q >= 1) ictx.fillRect(0, 0, W, H);
      else if (q > 0 && splashIn) fillSplash(ictx, splashIn, q, 0.97);
      composite();
    } else if (state === "out" && splashOut) {
      const p = clamp(tState / OUTRO);
      fctx.fillStyle = INK;
      fctx.fillRect(0, 0, W, H);
      fctx.globalCompositeOperation = "destination-out";
      fillSplash(fctx, splashOut, clamp(p * 1.15 - 0.12), 1);
      fctx.globalCompositeOperation = "source-over";
      ictx.fillStyle = "#000";
      ictx.fillRect(0, 0, W, H);
      ictx.globalCompositeOperation = "destination-out";
      fillSplash(ictx, splashOut, clamp(p * 1.15 + 0.02), 1.06);
      composite();
      if (p >= 1) {
        state = "idle";
        fctx.setTransform(1, 0, 0, 1, 0, 0);
        fctx.clearRect(0, 0, canvas.width, canvas.height);
        cb.onEnd(finished);
        return;
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function play(x: number, y: number) {
    if (state !== "idle") return;
    size();
    splashIn = makeSplash(x, y, W, H, 3 + Math.floor(Math.random() * 999));
    state = "in";
    tState = 0;
    tFilm = 0;
    finished = false;
    cb.onStart();
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function close() {
    if (state === "idle" || state === "out") return;
    splashOut = makeSplash(W / 2, H / 2, W, H, 4242);
    state = "out";
    tState = 0;
    cb.onUi(false);
  }

  const onResize = () => {
    if (state !== "idle") size();
  };
  window.addEventListener("resize", onResize);

  return {
    play,
    close,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    },
  };
}
