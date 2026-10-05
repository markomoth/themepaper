// A generated mountain-dusk photo so the tool can be tried without an upload.
// Deterministic: same seed, same picture.

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(width: number, rand: () => number, roughness: number): number[] {
  // Midpoint displacement over a power-of-two span, then sampled per column.
  const n = 1024;
  const pts = new Array(n + 1).fill(0);
  pts[0] = rand();
  pts[n] = rand();
  let step = n;
  let amp = 1;
  while (step > 1) {
    const half = step / 2;
    for (let i = half; i < n; i += step) {
      pts[i] = (pts[i - half] + pts[i + half]) / 2 + (rand() - 0.5) * amp;
    }
    step = half;
    amp *= roughness;
  }
  const out: number[] = [];
  for (let x = 0; x < width; x++) {
    const f = (x / (width - 1)) * n;
    const i = Math.floor(f);
    const t = f - i;
    out.push(pts[i] * (1 - t) + pts[Math.min(n, i + 1)] * t);
  }
  return out;
}

export function makeSample(width = 2560, height = 1440): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext("2d")!;
  const rand = rng(7);

  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.68);
  sky.addColorStop(0, "#0d1b3d");
  sky.addColorStop(0.3, "#34397a");
  sky.addColorStop(0.55, "#c0617a");
  sky.addColorStop(0.78, "#f59a52");
  sky.addColorStop(1, "#ffe0a3");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 420; i++) {
    const y = rand() * height * 0.3;
    ctx.globalAlpha = (1 - y / (height * 0.3)) * (0.3 + rand() * 0.7);
    ctx.fillStyle = "#fff8e8";
    const r = rand() < 0.95 ? 1.2 : 2.4;
    ctx.beginPath();
    ctx.arc(rand() * width, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const sunX = width * 0.66;
  const sunY = height * 0.5;
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, height * 0.55);
  glow.addColorStop(0, "rgba(255,236,190,0.95)");
  glow.addColorStop(0.08, "rgba(255,200,130,0.6)");
  glow.addColorStop(1, "rgba(255,150,100,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#fff3d6";
  ctx.beginPath();
  ctx.arc(sunX, sunY, height * 0.055, 0, Math.PI * 2);
  ctx.fill();

  const layers = [
    { base: 0.66, amp: 0.2, rough: 0.56, top: "#b07a8e", bottom: "#d08a7e" },
    { base: 0.72, amp: 0.17, rough: 0.54, top: "#7d5a7d", bottom: "#a0647a" },
    { base: 0.79, amp: 0.14, rough: 0.52, top: "#4f3e66", bottom: "#5e4268" },
    { base: 0.86, amp: 0.12, rough: 0.5, top: "#2d2a4c", bottom: "#33294a" },
    { base: 0.94, amp: 0.1, rough: 0.6, top: "#151628", bottom: "#0f0f1c" },
  ];
  for (const l of layers) {
    const r = ridge(width, rand, l.rough);
    const g = ctx.createLinearGradient(0, height * (l.base - l.amp), 0, height);
    g.addColorStop(0, l.top);
    g.addColorStop(1, l.bottom);
    const path = new Path2D();
    path.moveTo(0, height);
    for (let x = 0; x < width; x++) path.lineTo(x, height * (l.base - r[x] * l.amp));
    path.lineTo(width, height);
    path.closePath();
    ctx.fillStyle = g;
    ctx.fill(path);

    // Haze that sits in each valley, kept inside its own ridge.
    const top = height * (l.base - l.amp * 0.6);
    const haze = ctx.createLinearGradient(0, top, 0, top + height * 0.14);
    haze.addColorStop(0, "rgba(255,190,160,0)");
    haze.addColorStop(1, "rgba(255,190,160,0.16)");
    ctx.save();
    ctx.clip(path);
    ctx.fillStyle = haze;
    ctx.fillRect(0, top, width, height * 0.14);
    ctx.restore();
  }

  // Film grain keeps the gradients from banding once remapped.
  const img = ctx.getImageData(0, 0, width, height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * 10;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}
