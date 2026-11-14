import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

// ---------------------------------------------------------------------------
// Mine mode. Splits the element under it into a grid of CELL-sized blocks
// that break while the mouse is held down on them. Each block is a copy of
// the page clipped to its cell, so the real content cracks, wobbles and falls
// away, leaving a hole that shows the page's raw HTML underneath.
// Unmounting the layer puts everything back.
// ---------------------------------------------------------------------------

const CELL = 64; // block size, px
const HIT_MS = 170; // one swing of the pick
const SWING_DEG = 35;
const GRAVITY = 2200; // px/s², for falling blocks and debris

// Hits needed to break a block, by the hardest thing inside it.
const HITS = { air: 2, text: 4, box: 5, media: 7 };

// Where the pick cursor points: the tip of the left prong in pick-cursor.png.
const HOT_X = 6;
const HOT_Y = 3;

export const pickCursorCss = `
  cursor: url(/pick-cursor.png) ${HOT_X} ${HOT_Y}, crosshair;
  cursor: -webkit-image-set(url(/pick-cursor.png) 1x, url(/pick-cursor@2x.png) 2x) ${HOT_X} ${HOT_Y}, crosshair;
  cursor: image-set(url(/pick-cursor.png) 1x, url(/pick-cursor@2x.png) 2x) ${HOT_X} ${HOT_Y}, crosshair;
`;

type Cell = { col: number; row: number };

type Block = {
  outer: HTMLDivElement; // sits in the grid, shrinks as the block loosens
  inner: HTMLDivElement; // wobbles on each hit
  shade: HTMLDivElement;
  cracks: SVGSVGElement;
};

type Target = Cell & {
  key: string;
  hits: number;
  needed: number;
  colors: string[];
  block?: Block;
};

const keyOf = ({ col, row }: Cell) => `${col},${row}`;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const oneOf = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

interface MineLayerProps {
  // The element being mined. It needs position: relative, the layer covers it.
  rootRef: RefObject<HTMLElement | null>;
}

export default function MineLayer({ rootRef }: MineLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const pickRef = useRef<HTMLImageElement>(null);

  const [mined, setMined] = useState<ReadonlySet<string>>(() => new Set());
  const [active, setActive] = useState<string | null>(null); // block being hit
  const [hover, setHover] = useState<Cell | null>(null);
  const [source, setSource] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    const fx = fxRef.current;
    const pick = pickRef.current;
    if (!root || !layer || !fx || !pick) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSource(pageCopy(root, layer, true).outerHTML);

    const broken = new Set<string>();
    let pointer: { x: number; y: number } | null = null;
    let hoverKey = "";
    let holding = false;
    let swingStart = 0;
    let swings = 0;
    let frame = 0;
    let target: Target | null = null;

    const cellAt = ({ x, y }: { x: number; y: number }): Cell | null => {
      const box = layer.getBoundingClientRect();
      const lx = x - box.left;
      const ly = y - box.top;
      if (lx < 0 || ly < 0 || lx >= box.width || ly >= box.height) return null;
      return { col: Math.floor(lx / CELL), row: Math.floor(ly / CELL) };
    };

    const updateHover = () => {
      const cell = pointer && cellAt(pointer);
      const key = cell ? keyOf(cell) : "";
      if (key === hoverKey) return;
      hoverKey = key;
      setHover(cell);
    };

    // Stop hitting the current block. An unbroken block snaps back into place.
    const release = () => {
      if (target?.block) {
        target.block.outer.remove();
        setActive(null);
      }
      target = null;
    };

    // Point the pick at whatever block is under the pointer.
    const aim = () => {
      const cell = pointer && cellAt(pointer);
      const key = cell && keyOf(cell);
      if (target && target.key === key) return;
      release();
      if (!cell || !key || broken.has(key)) return;
      target = { ...cell, key, hits: 0, ...probe(cell, root, layer) };
    };

    const hit = () => {
      aim();
      if (!target || !pointer) return;
      const t = target;
      if (!t.block) {
        t.block = buildBlock(t, root, layer);
        fx.append(t.block.outer);
        setActive(t.key);
      }
      t.hits++;

      const progress = t.hits / t.needed;
      const { outer, inner, shade, cracks } = t.block;
      cracks.style.setProperty("--crack", String(1 - progress));
      shade.style.opacity = String(progress * 0.18);
      outer.style.transform = `scale(${1 - progress * 0.06})`;

      if (!still) {
        inner.animate(
          [
            { transform: "none" },
            { transform: `translate(${rand(-2, 2)}px, ${rand(-2, 2)}px) rotate(${rand(-2, 2)}deg)` },
            { transform: "none" },
          ],
          { duration: 110, easing: "ease-out" },
        );
        const box = layer.getBoundingClientRect();
        spray(fx, pointer.x - box.left, pointer.y - box.top, t.colors, 3, 1);
      }
      if (t.hits < t.needed) return;

      // Broken: the hole stays and the block drops out of it.
      target = null;
      broken.add(t.key);
      setMined(new Set(broken));
      setActive(null);
      if (still) {
        outer.remove();
        return;
      }
      const dir = Math.random() < 0.5 ? -1 : 1;
      fling(outer, {
        vx: dir * rand(30, 110),
        vy: rand(-260, -160),
        spin: dir * rand(90, 260),
        ms: 900,
        scale: [0.94, 0.55],
      });
      spray(fx, t.col * CELL + CELL / 2, t.row * CELL + CELL / 2, t.colors, 14, 1.6);
    };

    const swing = (now: number) => {
      if (!pointer) return;
      const angle = still ? 0 : swingAngle(((now - swingStart) % HIT_MS) / HIT_MS);
      pick.style.transform = `translate(${pointer.x - HOT_X}px, ${pointer.y - HOT_Y}px) rotate(${angle}deg)`;
    };

    const tick = (now: number) => {
      frame = 0;
      if (!holding) return;
      swing(now);
      // One hit per finished swing, and never more than one per frame.
      const due = Math.floor((now - swingStart) / HIT_MS);
      if (due > swings) {
        swings = due;
        hit();
      }
      frame = requestAnimationFrame(tick);
    };

    const track = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      updateHover();
      if (holding) aim();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || holding) return;
      e.preventDefault();
      layer.setPointerCapture(e.pointerId);
      holding = true;
      // Start most of the way through a wind-up so the first hit lands fast.
      swingStart = performance.now() - HIT_MS * 0.7;
      swings = 0;
      track(e);
      swing(performance.now());
      layer.classList.add("mine-swinging");
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onUp = () => {
      if (!holding) return;
      holding = false;
      layer.classList.remove("mine-swinging");
      release();
    };

    const onLeave = () => {
      if (holding) return;
      pointer = null;
      updateHover();
    };

    // Scrolling moves the page under a still pointer.
    const onScroll = () => {
      updateHover();
      if (holding) aim();
    };

    const onContextMenu = (e: MouseEvent) => {
      if (holding) e.preventDefault();
    };

    layer.addEventListener("pointerdown", onDown);
    layer.addEventListener("pointermove", track);
    layer.addEventListener("pointerup", onUp);
    layer.addEventListener("pointercancel", onUp);
    layer.addEventListener("lostpointercapture", onUp);
    layer.addEventListener("pointerleave", onLeave);
    layer.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      layer.removeEventListener("pointerdown", onDown);
      layer.removeEventListener("pointermove", track);
      layer.removeEventListener("pointerup", onUp);
      layer.removeEventListener("pointercancel", onUp);
      layer.removeEventListener("lostpointercapture", onUp);
      layer.removeEventListener("pointerleave", onLeave);
      layer.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("scroll", onScroll);
    };
  }, [rootRef]);

  // Open cells (broken ones plus the block being hit) with inner shadows on
  // the sides that touch unbroken page, so neighbouring holes read as one pit.
  const holes = useMemo(() => {
    const open = new Set(mined);
    if (active) open.add(active);
    const shut = (col: number, row: number) => !open.has(`${col},${row}`);
    return [...open].map((key) => {
      const [col, row] = key.split(",").map(Number);
      const shadow = holeShadow(
        shut(col, row - 1),
        shut(col - 1, row),
        shut(col + 1, row),
        shut(col, row + 1),
      );
      return { key, col, row, shadow };
    });
  }, [mined, active]);

  const clip = holes.length
    ? `path("${holes.map((h) => `M${h.col * CELL} ${h.row * CELL}h${CELL}v${CELL}h${-CELL}z`).join("")}")`
    : "inset(50%)";

  return (
    <div ref={layerRef} className="mine-layer" aria-hidden="true">
      <style>{mineCss}</style>
      <div className="mine-grid" />

      <div className="mine-core" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <pre>{source.repeat(3)}</pre>
        {holes.map((h) => (
          <div
            key={h.key}
            className="mine-hole"
            style={{ left: h.col * CELL, top: h.row * CELL, boxShadow: h.shadow }}
          />
        ))}
      </div>

      <div ref={fxRef} className="mine-fx" />

      {hover && !mined.has(keyOf(hover)) && (
        <div className="mine-hover" style={{ left: hover.col * CELL, top: hover.row * CELL }} />
      )}

      <img ref={pickRef} className="mine-pick" src="/pick-cursor@2x.png" alt="" draggable={false} />
    </div>
  );
}

// The root's content without the mine layer, optionally without <style>s.
function pageCopy(root: HTMLElement, layer: HTMLElement, withStyles: boolean) {
  const copy = root.cloneNode(false) as HTMLElement;
  for (const child of root.children) {
    if (child === layer || (!withStyles && child.tagName === "STYLE")) continue;
    copy.append(child.cloneNode(true));
  }
  return copy;
}

const SVG_NS = "http://www.w3.org/2000/svg";

function buildBlock(cell: Cell, root: HTMLElement, layer: HTMLElement): Block {
  const outer = document.createElement("div");
  outer.className = "mine-block";
  outer.style.left = `${cell.col * CELL}px`;
  outer.style.top = `${cell.row * CELL}px`;

  const inner = document.createElement("div");
  inner.className = "mine-block-inner";

  // A full copy of the page, offset so its slice lines up exactly with the
  // real content underneath.
  const ghost = pageCopy(root, layer, false);
  ghost.removeAttribute("id");
  ghost.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  ghost.querySelectorAll("img").forEach((img) => {
    img.decoding = "sync";
  });
  ghost.setAttribute("inert", "");
  const { width, height } = root.getBoundingClientRect();
  Object.assign(ghost.style, {
    position: "absolute",
    left: `${-cell.col * CELL}px`,
    top: `${-cell.row * CELL}px`,
    width: `${width}px`,
    height: `${height}px`,
    minHeight: "0",
    margin: "0",
  });

  const shade = document.createElement("div");
  shade.className = "mine-block-shade";

  const cracks = document.createElementNS(SVG_NS, "svg");
  cracks.setAttribute("class", "mine-cracks");
  cracks.setAttribute("viewBox", `0 0 ${CELL} ${CELL}`);
  for (const d of crackPaths()) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("pathLength", "1");
    cracks.append(path);
  }

  inner.append(ghost, shade, cracks);
  outer.append(inner);
  return { outer, inner, shade, cracks };
}

// Jagged cracks radiating from a point near the middle of the block, some with
// a side branch. pathLength=1 lets a single dash offset grow them all.
function crackPaths() {
  const cx = rand(0.35, 0.65) * CELL;
  const cy = rand(0.35, 0.65) * CELL;
  const count = 5 + Math.floor(Math.random() * 3);
  const step = CELL / 8;
  const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const paths: string[] = [];

  for (let i = 0; i < count; i++) {
    const heading = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
    let x = cx;
    let y = cy;
    let d = `M${pt(x, y)}`;
    let branch = "";
    for (let s = 0; s < 4; s++) {
      const a = heading + rand(-0.6, 0.6);
      const len = step * rand(0.7, 1.3);
      x += Math.cos(a) * len;
      y += Math.sin(a) * len;
      d += `L${pt(x, y)}`;
      if (s === 1 && Math.random() < 0.5) {
        const b = heading + (Math.random() < 0.5 ? -1 : 1) * rand(0.6, 1);
        branch = `M${pt(x, y)}l${pt(Math.cos(b) * step, Math.sin(b) * step)}`;
      }
    }
    paths.push(d + branch);
  }
  return paths;
}

const PROBE_POINTS = [
  [0.5, 0.5],
  [0.2, 0.2],
  [0.8, 0.2],
  [0.2, 0.8],
  [0.8, 0.8],
];

// Looks at a few points under a block to see what it's made of. That decides
// how many hits it takes and what colour its debris is.
function probe(cell: Cell, root: HTMLElement, layer: HTMLElement) {
  const box = layer.getBoundingClientRect();
  const left = box.left + cell.col * CELL;
  const top = box.top + cell.row * CELL;
  const seen = new Set<Element>();
  const colors = new Set([getComputedStyle(root).backgroundColor]);
  let needed = HITS.air;

  for (const [fx, fy] of PROBE_POINTS) {
    const el = document
      .elementsFromPoint(left + fx * CELL, top + fy * CELL)
      .find((n) => !layer.contains(n));
    if (!el || el === root || !root.contains(el) || seen.has(el)) continue;
    seen.add(el);

    if (el instanceof HTMLImageElement) {
      needed = Math.max(needed, HITS.media);
      imageColors(el, left, top).forEach((c) => colors.add(c));
      continue;
    }
    if (el.closest("video, canvas, iframe, svg")) {
      needed = Math.max(needed, HITS.media);
      colors.add("#72777d");
      continue;
    }

    const style = getComputedStyle(el);
    if (!/^rgba\(.*,\s*0\)$/.test(style.backgroundColor)) {
      needed = Math.max(needed, HITS.box);
      colors.add(style.backgroundColor);
    }
    const hasText = [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
    );
    if (hasText) {
      needed = Math.max(needed, HITS.text);
      colors.add(style.color);
    }
  }
  return { needed, colors: [...colors] };
}

// A few colours from the part of an image inside a block, for its debris.
function imageColors(img: HTMLImageElement, left: number, top: number) {
  try {
    const r = img.getBoundingClientRect();
    const kx = img.naturalWidth / r.width;
    const ky = img.naturalHeight / r.height;
    const x0 = Math.max(left, r.left);
    const y0 = Math.max(top, r.top);
    const x1 = Math.min(left + CELL, r.right);
    const y1 = Math.min(top + CELL, r.bottom);

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 3;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, (x0 - r.left) * kx, (y0 - r.top) * ky, (x1 - x0) * kx, (y1 - y0) * ky, 0, 0, 3, 3);
    const data = ctx.getImageData(0, 0, 3, 3).data;
    const out: string[] = [];
    for (let i = 0; i < data.length; i += 4) out.push(`rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`);
    return out;
  } catch {
    return ["#72777d", "#a2a9b1"];
  }
}

// Throws an element along a ballistic arc with spin, fades it out near the
// end, then removes it.
function fling(
  el: HTMLElement,
  o: { vx: number; vy: number; spin: number; ms: number; scale?: [number, number] },
) {
  const [s0, s1] = o.scale ?? [1, 1];
  const frames: Keyframe[] = [];
  for (let i = 0; i <= 12; i++) {
    const p = i / 12;
    const t = (p * o.ms) / 1000;
    const x = o.vx * t;
    const y = o.vy * t + 0.5 * GRAVITY * t * t;
    frames.push({
      transform: `translate(${x}px, ${y}px) rotate(${o.spin * t}deg) scale(${s0 + (s1 - s0) * p})`,
      opacity: p < 0.6 ? 1 : (1 - p) / 0.4,
    });
  }
  el.animate(frames, { duration: o.ms, fill: "forwards" }).onfinish = () => el.remove();
}

function spray(fx: HTMLElement, x: number, y: number, colors: string[], count: number, power: number) {
  for (let i = 0; i < count; i++) {
    const size = Math.round(rand(2, 3 + power * 3));
    const bit = document.createElement("div");
    bit.className = "mine-bit";
    Object.assign(bit.style, {
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      background: oneOf(colors),
    });
    fx.append(bit);
    fling(bit, {
      vx: rand(-140, 140) * power,
      vy: -rand(100, 260) * power,
      spin: rand(-540, 540),
      ms: rand(450, 800),
    });
  }
}

// Slow wind-up for most of the swing, then a fast strike that lands at 0°.
function swingAngle(phase: number) {
  if (phase < 0.7) {
    const t = phase / 0.7;
    return -SWING_DEG * (1 - (1 - t) * (1 - t));
  }
  const t = (phase - 0.7) / 0.3;
  return -SWING_DEG * (1 - t * t);
}

function holeShadow(top: boolean, left: boolean, right: boolean, bottom: boolean) {
  const sides = [
    top && "inset 0 12px 10px -8px rgba(0, 0, 0, 0.9)",
    left && "inset 12px 0 10px -8px rgba(0, 0, 0, 0.7)",
    right && "inset -8px 0 8px -6px rgba(0, 0, 0, 0.45)",
    bottom && "inset 0 -1px 0 rgba(255, 255, 255, 0.08)",
  ].filter(Boolean);
  return sides.length ? sides.join(", ") : undefined;
}

const mineCss = `
.mine-layer {
  position: absolute; inset: 0; z-index: 2; overflow: hidden;
  user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
  touch-action: pan-y pinch-zoom;
  ${pickCursorCss}
}
.mine-layer.mine-swinging { cursor: none; }

.mine-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 0;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.18) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 1px, transparent 1px);
  background-size: ${CELL}px ${CELL}px;
  animation: mine-grid 1.4s ease-out;
}
@keyframes mine-grid { 15% { opacity: 1; } }

.mine-core { position: absolute; inset: 0; overflow: hidden; pointer-events: none; background: #141518; }
.mine-core pre {
  margin: 0; padding: 6px 8px; white-space: pre-wrap; word-break: break-all;
  font: 10px/14px 'JetBrains Mono', monospace; color: #3a3e47;
}
.mine-hole { position: absolute; width: ${CELL}px; height: ${CELL}px; }

.mine-fx { position: absolute; inset: 0; pointer-events: none; }
.mine-block { position: absolute; width: ${CELL}px; height: ${CELL}px; transition: transform 90ms ease-out; }
.mine-block-inner { position: absolute; inset: 0; overflow: hidden; }
.mine-block-shade { position: absolute; inset: 0; background: #000; opacity: 0; transition: opacity 90ms; }
.mine-cracks { position: absolute; inset: 0; width: 100%; height: 100%; }
.mine-cracks path {
  fill: none; stroke: rgba(0, 0, 0, 0.75); stroke-width: 1.5; stroke-linejoin: bevel;
  stroke-dasharray: 1; stroke-dashoffset: var(--crack, 1);
  transition: stroke-dashoffset 90ms ease-out;
}
.mine-bit { position: absolute; pointer-events: none; }

.mine-hover {
  position: absolute; width: ${CELL}px; height: ${CELL}px; pointer-events: none;
  box-shadow: inset 0 0 0 2px #000, inset 0 0 0 3px rgba(255, 255, 255, 0.7);
}

.mine-pick {
  position: fixed; left: 0; top: 0; width: 26px; height: 26px; display: none;
  transform-origin: 0 100%; image-rendering: pixelated; pointer-events: none;
}
.mine-swinging .mine-pick { display: block; }
`;
