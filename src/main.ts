import "./style.css";
import { SCHEMES, luminance, type Scheme } from "./schemes";
import { Recolorer, type Mode } from "./engine";
import { makeSample } from "./sample";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const els = {
  status: $<HTMLParagraphElement>("status"),
  open: $<HTMLButtonElement>("open"),
  download: $<HTMLButtonElement>("download"),
  downloadLabel: $<HTMLSpanElement>("download-label"),
  file: $<HTMLInputElement>("file"),
  stage: $<HTMLElement>("stage"),
  print: $<HTMLDivElement>("print"),
  original: $<HTMLImageElement>("original"),
  result: $<HTMLCanvasElement>("result"),
  tagScheme: $<HTMLSpanElement>("tag-scheme"),
  split: $<HTMLDivElement>("split"),
  note: $<HTMLParagraphElement>("stage-note"),
  deck: $<HTMLElement>("deck"),
  blades: $<HTMLDivElement>("blades"),
  rivet: $<HTMLButtonElement>("rivet"),
  fanCue: $<HTMLButtonElement>("fan-cue"),
  fanCueLabel: $<HTMLSpanElement>("fan-cue-label"),
  modeHint: $<HTMLParagraphElement>("mode-hint"),
  strength: $<HTMLInputElement>("strength"),
  strengthOut: $<HTMLOutputElement>("strength-out"),
  dither: $<HTMLButtonElement>("dither"),
  ditherNote: $<HTMLSpanElement>("dither-note"),
};

// ---------- State ----------

interface Settings {
  scheme: string;
  mode: Mode;
  strength: number;
  dither: boolean;
}

const STORE_KEY = "themepaper:settings";

function loadSettings(): Settings {
  const fallback: Settings = { scheme: "gruvbox-dark", mode: "smooth", strength: 100, dither: true };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return fallback;
    const s = { ...fallback, ...JSON.parse(raw) } as Settings;
    if (!SCHEMES.some((x) => x.id === s.scheme)) s.scheme = fallback.scheme;
    if (s.mode !== "smooth" && s.mode !== "strict") s.mode = fallback.mode;
    s.strength = Math.max(0, Math.min(100, Number(s.strength) || 0));
    return s;
  } catch {
    return fallback;
  }
}

function saveSettings() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable: settings just won't persist */
  }
}

const settings = loadSettings();
let previewId: string | null = null;
let imageName = "wallpaper";
let imageSize: { width: number; height: number } | null = null;
let isSample = false;
let split = 50;
let fanOpen = false;
let engine: Recolorer | null = null;

const schemeById = (id: string) => SCHEMES.find((s) => s.id === id)!;
const activeScheme = () => schemeById(previewId ?? settings.scheme);

// ---------- Rendering ----------

function render() {
  const s = activeScheme();
  engine?.render({
    palette: s.chips.map((c) => c.hex),
    mode: settings.mode,
    strength: settings.strength / 100,
    dither: settings.dither,
  });
  els.tagScheme.textContent = `${s.family} ${s.variant}`;
  paintCounter(schemeById(settings.scheme));
}

function paintCounter(s: Scheme) {
  const root = document.documentElement.style;
  root.setProperty("--ground", s.bg);
  root.setProperty("--ink", s.fg);
  root.setProperty("--ink-muted", s.muted);
  root.setProperty("--accent", s.accent);
  root.colorScheme = s.kind;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", s.bg);
  updateStatus();
}

function updateStatus(error?: string) {
  const s = schemeById(settings.scheme);
  const where = imageSize
    ? `${isSample ? "Sample photo (generated)" : escapeHtml(imageName)} · ${imageSize.width}×${imageSize.height}`
    : "No image yet";
  const lead = error
    ? `<span class="err">${escapeHtml(error)}</span>`
    : `<b>${escapeHtml(s.family)} ${escapeHtml(s.variant)}</b> · ${s.chips.length} chips`;
  els.status.innerHTML = `${lead} · ${where}`;
}

function escapeHtml(t: string) {
  return t.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

// ---------- Fan deck ----------

const blades: HTMLButtonElement[] = [];

function buildDeck() {
  const pad = (n: number) => String(n).padStart(2, "0");
  for (const [index, s] of SCHEMES.entries()) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "blade";
    b.setAttribute("role", "radio");
    b.dataset.id = s.id;
    b.setAttribute("aria-label", `${s.family} ${s.variant}, ${s.kind}, ${s.chips.length} colours`);

    const head = document.createElement("span");
    head.className = "blade-head";

    const chips = document.createElement("span");
    chips.className = "chips";
    for (const c of s.chips) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.style.background = c.hex;
      chip.style.color = luminance(c.hex) > 0.32 ? "rgb(20 20 20 / 0.82)" : "rgb(255 255 255 / 0.86)";
      chip.title = `${c.name} ${c.hex}`;
      const label = document.createElement("span");
      label.textContent = c.hex.slice(1);
      chip.append(label);
      chips.append(chip);
    }

    const tip = document.createElement("span");
    tip.className = "blade-tip";
    tip.innerHTML = `<span class="blade-name">${escapeHtml(s.family)}</span><span class="blade-variant">${escapeHtml(s.variant)}</span><span class="blade-meta">${pad(index + 1)}/${SCHEMES.length} · ${s.chips.length} chips · ${s.kind}</span>`;

    b.append(head, chips, tip);
    b.addEventListener("click", () => {
      if (!fanOpen) return setFan(true);
      commit(s.id);
    });
    b.addEventListener("pointerenter", (e) => {
      if (fanOpen && e.pointerType === "mouse") preview(s.id);
    });
    b.addEventListener("focus", () => {
      if (fanOpen) preview(s.id);
    });
    b.addEventListener("keydown", onBladeKey);
    blades.push(b);
    els.blades.append(b);
  }
  els.deck.addEventListener("pointerleave", () => {
    if (fanOpen && previewId) preview(null);
  });
}

function layoutDeck() {
  const narrow = window.matchMedia("(max-width: 860px)").matches;
  const deckW = els.deck.clientWidth;
  const len = Math.max(300, Math.min(820, narrow ? deckW : deckW - 150));
  document.documentElement.style.setProperty("--blade-len", `${len}px`);
  for (const b of blades) {
    const chips = b.querySelector<HTMLElement>(".chips")!;
    chips.classList.toggle("tight", chips.clientWidth / chips.childElementCount < 15);
  }

  const current = SCHEMES.findIndex((s) => s.id === settings.scheme);
  const n = SCHEMES.length;

  // Fan as wide as the space above the pivot allows, up to a quarter turn.
  const pivot = els.blades.getBoundingClientRect();
  const room = pivot.top + pivot.height / 2 - 12;
  const maxAngle = Math.min(84, (Math.asin(Math.min(1, room / len)) * 180) / Math.PI);
  const step = maxAngle / (n - 1);

  blades.forEach((b, i) => {
    let angle: number;
    let z: number;
    let delay: number;
    if (fanOpen) {
      angle = -i * step;
      z = n - i;
      delay = i * 12;
    } else if (i === current) {
      angle = 0;
      z = n + 1;
      delay = 0;
    } else {
      // Closed: the rest of the deck peeks above the pulled blade as slivers.
      const rank = (i - current + n) % n;
      angle = -rank * 0.2;
      z = n - rank;
      delay = (n - rank) * 6;
    }
    b.style.setProperty("--angle", `${angle}deg`);
    b.style.setProperty("--z", String(z));
    b.style.setProperty("--delay", `${delay}ms`);
    const checked = SCHEMES[i].id === settings.scheme;
    b.setAttribute("aria-checked", String(checked));
    b.tabIndex = checked ? 0 : -1;
  });
}

function setFan(open: boolean) {
  fanOpen = open;
  els.deck.classList.toggle("open", open);
  els.rivet.setAttribute("aria-expanded", String(open));
  els.fanCue.setAttribute("aria-expanded", String(open));
  els.rivet.setAttribute("aria-label", open ? "Close the deck" : "Fan out all schemes");
  els.fanCueLabel.textContent = open ? "Hover to preview, click to pick" : `Fan out ${SCHEMES.length} schemes`;
  if (!open && previewId) preview(null);
  layoutDeck();
  if (open) blades.find((b) => b.dataset.id === settings.scheme)?.focus({ preventScroll: true });
}

function preview(id: string | null) {
  if (previewId === id) return;
  previewId = id === settings.scheme ? null : id;
  render();
}

let pullTimer = 0;

function commit(id: string) {
  const blade = blades.find((b) => b.dataset.id === id);
  settings.scheme = id;
  previewId = null;
  saveSettings();
  render();
  clearTimeout(pullTimer);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  blade?.classList.add("pulling");
  pullTimer = window.setTimeout(
    () => {
      blade?.classList.remove("pulling");
      setFan(false);
      blade?.focus({ preventScroll: true });
    },
    reduced ? 0 : 170,
  );
}

function step(delta: number) {
  const i = SCHEMES.findIndex((s) => s.id === settings.scheme);
  const next = SCHEMES[(i + delta + SCHEMES.length) % SCHEMES.length];
  settings.scheme = next.id;
  previewId = null;
  saveSettings();
  render();
  layoutDeck();
}

function onBladeKey(e: KeyboardEvent) {
  const i = blades.indexOf(e.currentTarget as HTMLButtonElement);
  const move = (d: number) => {
    e.preventDefault();
    if (!fanOpen) return step(d);
    const next = blades[(i + d + blades.length) % blades.length];
    next.tabIndex = 0;
    blades[i].tabIndex = -1;
    next.focus({ preventScroll: true });
  };
  if (e.key === "ArrowUp" || e.key === "ArrowRight") move(1);
  else if (e.key === "ArrowDown" || e.key === "ArrowLeft") move(-1);
  else if (e.key === "Escape" && fanOpen) {
    e.preventDefault();
    setFan(false);
    blades.find((b) => b.dataset.id === settings.scheme)?.focus({ preventScroll: true });
  }
}

// ---------- Image loading ----------

function fitPrint() {
  if (!imageSize) return;
  const cs = getComputedStyle(els.stage);
  const w = els.stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const narrow = window.matchMedia("(max-width: 860px)").matches;
  const h = narrow
    ? window.innerHeight * 0.62
    : els.stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const ar = imageSize.width / imageSize.height;
  let pw = w;
  let ph = w / ar;
  if (ph > h) {
    ph = h;
    pw = h * ar;
  }
  els.print.style.width = `${Math.floor(pw)}px`;
  els.print.style.height = `${Math.floor(ph)}px`;
}

async function showImage(source: ImageBitmap | HTMLCanvasElement, url: string, name: string, sample: boolean) {
  if (!engine) return;
  const prev = els.original.src;
  els.original.src = url;
  if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
  imageSize = engine.setImage(source);
  if ("close" in source) source.close();
  imageName = name;
  isSample = sample;
  els.print.hidden = false;
  els.note.hidden = true;
  els.download.disabled = false;
  fitPrint();
  render();
}

async function loadFile(file: File) {
  if (!file.type.startsWith("image/")) {
    updateStatus(`${file.name} is not an image. Try a PNG, JPG or WebP.`);
    return;
  }
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const name = file.name.replace(/\.[^.]+$/, "") || "wallpaper";
    await showImage(bmp, URL.createObjectURL(file), name, false);
    if (engine && Math.max(bmp.width, bmp.height) > engine.maxSize) {
      updateStatus(`Scaled down to fit this GPU's ${engine.maxSize}px limit.`);
    }
  } catch {
    updateStatus(`Couldn't read ${file.name}. The file may be damaged or in an unsupported format.`);
  }
}

async function loadSample() {
  els.note.hidden = false;
  els.note.textContent = "Developing the sample photo…";
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r)));
  const canvas = makeSample();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  const url = blob ? URL.createObjectURL(blob) : canvas.toDataURL();
  await showImage(canvas, url, "sample", true);
}

// ---------- Split compare ----------

function setSplit(v: number) {
  split = Math.max(0, Math.min(100, v));
  els.print.style.setProperty("--split", `${split}%`);
  els.split.setAttribute("aria-valuenow", String(Math.round(split)));
  els.split.setAttribute("aria-valuetext", `${Math.round(100 - split)}% recoloured`);
  els.print.dataset.split = split <= 0 ? "0" : split >= 100 ? "100" : "mid";
}

function bindSplit() {
  let dragging = false;
  const fromEvent = (e: PointerEvent) => {
    const r = els.print.getBoundingClientRect();
    setSplit(((e.clientX - r.left) / r.width) * 100);
  };
  els.print.addEventListener("pointerdown", (e) => {
    dragging = true;
    els.print.setPointerCapture(e.pointerId);
    fromEvent(e);
  });
  els.print.addEventListener("pointermove", (e) => dragging && fromEvent(e));
  els.print.addEventListener("pointerup", () => (dragging = false));
  els.print.addEventListener("pointercancel", () => (dragging = false));
  els.split.addEventListener("keydown", (e) => {
    const big = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setSplit(split - big);
    else if (e.key === "ArrowRight") setSplit(split + big);
    else if (e.key === "Home") setSplit(0);
    else if (e.key === "End") setSplit(100);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });
}

// ---------- Settings card ----------

const MODE_HINT: Record<Mode, string> = {
  smooth: "Blends chips, keeps photo detail.",
  strict: "Every pixel becomes an exact chip.",
};

function syncControls() {
  document.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((b) => {
    const on = b.dataset.mode === settings.mode;
    b.setAttribute("aria-checked", String(on));
    b.tabIndex = on ? 0 : -1;
  });
  els.modeHint.textContent = MODE_HINT[settings.mode];
  els.strength.value = String(settings.strength);
  els.strength.style.setProperty("--fill", `${settings.strength}%`);
  els.strengthOut.textContent = `${settings.strength}%`;
  els.dither.setAttribute("aria-checked", String(settings.dither));
  els.dither.disabled = settings.mode !== "strict";
  els.ditherNote.textContent = settings.mode === "strict" ? "Ordered 8×8" : "Strict only";
}

function bindControls() {
  const modeButtons = document.querySelectorAll<HTMLButtonElement>("[data-mode]");
  modeButtons.forEach((b) => {
    b.addEventListener("click", () => {
      settings.mode = b.dataset.mode as Mode;
      saveSettings();
      syncControls();
      render();
    });
    b.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      settings.mode = settings.mode === "smooth" ? "strict" : "smooth";
      saveSettings();
      syncControls();
      render();
      document.querySelector<HTMLButtonElement>(`[data-mode="${settings.mode}"]`)?.focus();
    });
  });
  els.strength.addEventListener("input", () => {
    settings.strength = Number(els.strength.value);
    syncControls();
    render();
  });
  els.strength.addEventListener("change", saveSettings);
  els.strength.addEventListener("keydown", (e) => e.stopPropagation());
  els.dither.addEventListener("click", () => {
    settings.dither = !settings.dither;
    saveSettings();
    syncControls();
    render();
  });
}

// ---------- Export ----------

async function download() {
  if (!engine || !imageSize) return;
  const s = schemeById(settings.scheme);
  previewId = null;
  render();
  els.download.disabled = true;
  els.downloadLabel.textContent = "Encoding…";
  try {
    const blob = await engine.toBlob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${imageName}-${s.id}-${settings.mode}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  } catch {
    updateStatus("Couldn't encode the PNG. The image may be too large for this browser.");
  } finally {
    els.download.disabled = false;
    els.downloadLabel.innerHTML = 'Download<span class="long">&nbsp;PNG</span>';
  }
}

// ---------- Global wiring ----------

function bindGlobal() {
  els.open.addEventListener("click", () => els.file.click());
  els.file.addEventListener("change", () => {
    const f = els.file.files?.[0];
    if (f) loadFile(f);
    els.file.value = "";
  });
  els.download.addEventListener("click", download);
  els.rivet.addEventListener("click", () => setFan(!fanOpen));
  els.fanCue.addEventListener("click", () => setFan(!fanOpen));

  document.addEventListener("pointerdown", (e) => {
    if (fanOpen && !els.deck.contains(e.target as Node)) setFan(false);
  });

  let dragDepth = 0;
  window.addEventListener("dragenter", (e) => {
    if (!e.dataTransfer?.types.includes("Files")) return;
    dragDepth++;
    document.body.classList.add("dragging");
  });
  window.addEventListener("dragleave", () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) document.body.classList.remove("dragging");
  });
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDepth = 0;
    document.body.classList.remove("dragging");
    const f = e.dataTransfer?.files[0];
    if (f) loadFile(f);
  });
  window.addEventListener("paste", (e) => {
    const f = [...(e.clipboardData?.files ?? [])].find((x) => x.type.startsWith("image/"));
    if (f) loadFile(f);
  });

  window.addEventListener("keydown", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, [role=slider]")) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      download();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      setFan(!fanOpen);
    } else if (e.key === "o" || e.key === "O") {
      els.file.click();
    } else if (e.key === "Escape" && fanOpen) {
      setFan(false);
    } else if (!fanOpen && !t.closest(".blade, [role=radio], [role=switch]")) {
      if (e.key === "ArrowRight" || e.key === "]") step(1);
      else if (e.key === "ArrowLeft" || e.key === "[") step(-1);
    }
  });

  let raf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      fitPrint();
      layoutDeck();
    });
  });
}

// ---------- Boot ----------

function boot() {
  buildDeck();
  syncControls();
  bindControls();
  bindSplit();
  bindGlobal();
  setSplit(split);
  try {
    engine = new Recolorer(els.result);
  } catch {
    els.note.hidden = false;
    els.note.textContent =
      "themepaper needs WebGL2 to recolour images, and this browser has it turned off. Try a current Firefox, Chrome or Safari.";
    els.open.disabled = true;
  }
  paintCounter(activeScheme());
  layoutDeck();
  els.fanCueLabel.textContent = `Fan out ${SCHEMES.length} schemes`;
  if (engine) loadSample();
}

boot();
