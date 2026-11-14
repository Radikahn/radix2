import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./PenguinHideout.css";

// ---------------------------------------------------------------------------
// A penguin that lives in a hole under a lid (the bar showing `name`).
// Hovering the lid lifts it and the penguin peeks out; clicking lets it out
// to follow the cursor around the page; clicking again sends it back home.
// The penguin itself is portalled to <body> and positioned in page
// coordinates, so it scrolls with the page and isn't part of the content.
//
// Art: /penguin.png is the still (hiding, peeking, standing, mid-jump) and
// /penguin-walk.png the animated walk. Both are transparent cut-outs of
// /penguin.gif, whose frames have a solid white background.
// ---------------------------------------------------------------------------

const W = 52; // penguin size, px (the images are 2x this)
const H = 56;
const FOLLOW_GAP = 60; // how close it comes to the cursor, px
const WALK = 240; // px/s
const HURRY = 620; // speed when it has fallen far behind, px/s

type Mode = "home" | "leaving" | "following" | "returning" | "entering";

type Jump = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  start: number;
  ms: number;
  arc: number; // how high it hops above the straight line, px
  fall: boolean; // accelerate downwards (dropping into the hole)
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

export default function PenguinHideout({ name }: { name: string }) {
  const holeRef = useRef<HTMLDivElement>(null);
  const penguinRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ toggle: (x: number, y: number) => void; hover: (on: boolean) => void } | null>(
    null,
  );
  const [mode, setMode] = useState<Mode>("home");
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const hole = holeRef.current;
    const el = penguinRef.current;
    if (!hole || !el) return;

    let mode: Mode = "home";
    let hovering = false;
    let x = 0; // top-left of the penguin, page px
    let y = 0;
    let speed = 0;
    let hurrying = false;
    let walking = false;
    let cursor = { x: 0, y: 0 }; // client px
    let jump: Jump | null = null;
    let frame = 0;
    let last = 0;

    const holeBox = () => {
      const r = hole.getBoundingClientRect();
      return { left: r.left + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width };
    };
    const homeX = (h: ReturnType<typeof holeBox>) => h.left + h.width * 0.74 - W / 2;

    // clipBottom hides everything below the hole's bottom edge so the penguin
    // never shows over the photo while it's (partly) inside the hole.
    const place = (clipBottom: number | null) => {
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.clipPath = clipBottom === null ? "none" : `inset(0 0 ${Math.max(0, clipBottom)}px 0)`;
    };

    const setWalking = (on: boolean) => {
      if (on === walking) return;
      walking = on;
      el.classList.toggle("is-walking", on);
    };

    const enter = (m: Mode) => {
      mode = m;
      setMode(m);
      el.classList.toggle("is-home", m === "home");
      el.classList.toggle("is-out", m !== "home");
      el.classList.toggle("is-airborne", m === "leaving" || m === "entering");
    };

    // At home the penguin waits below the hole (fully clipped). Peeking raises
    // it until its head and eyes show in the hole under the lifted lid.
    // .is-home animates between the two with a springy transition.
    const settleHome = (peek: boolean) => {
      const h = holeBox();
      x = homeX(h);
      y = peek ? h.top + 4 : h.bottom;
      place(y + H - h.bottom);
    };

    const leave = () => {
      // Start from wherever the peek animation had got to.
      const r = el.getBoundingClientRect();
      x = r.left + scrollX;
      y = r.top + scrollY;
      enter("leaving");
      const h = holeBox();
      const maxX = document.documentElement.clientWidth - W - 4;
      jump = {
        fromX: x,
        fromY: y,
        toX: Math.min(maxX, Math.max(4, h.left - 34 - W / 2)),
        toY: h.bottom + 30 - H / 2,
        start: performance.now(),
        ms: 560,
        arc: 46,
        fall: false,
      };
    };

    const goIn = () => {
      const h = holeBox();
      setWalking(false);
      speed = 0;
      enter("entering");
      jump = {
        fromX: x,
        fromY: y,
        toX: homeX(h),
        toY: h.bottom,
        start: performance.now(),
        ms: 520,
        arc: 20,
        fall: true,
      };
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const h = holeBox();

      if (jump) {
        const t = Math.min(1, (now - jump.start) / jump.ms);
        const ty = jump.fall ? t * t : t;
        x = jump.fromX + (jump.toX - jump.fromX) * easeInOut(t);
        y = jump.fromY + (jump.toY - jump.fromY) * ty - jump.arc * 4 * t * (1 - t);
        const inHole = mode === "entering" || t < 0.4;
        place(inHole ? y + H - h.bottom : null);
        if (t >= 1) {
          jump = null;
          if (mode === "leaving") {
            enter("following");
          } else {
            enter("home");
            settleHome(false);
            if (hovering) requestAnimationFrame(() => settleHome(true)); // peek back out
          }
        }
      } else if (mode === "following" || mode === "returning") {
        const returning = mode === "returning";
        // Following aims at the cursor; going home aims at the top of the lid.
        const tx = returning ? homeX(h) + W / 2 : cursor.x + scrollX;
        const ty = returning ? h.top - H / 2 : cursor.y + scrollY;
        const dx = tx - (x + W / 2);
        const dy = ty - (y + H / 2);
        const dist = Math.hypot(dx, dy);
        const gap = returning ? 0 : FOLLOW_GAP;
        hurrying = dist > 320 || (hurrying && dist > 140);
        const want = dist > gap + 2 ? (hurrying ? HURRY : WALK) : 0;

        speed += (want - speed) * Math.min(1, dt * 8);
        const step = Math.min(speed * dt, Math.max(0, dist - gap));
        if (dist > 0.01) {
          x += (dx / dist) * step;
          y += (dy / dist) * step;
        }
        const doc = document.documentElement;
        x = Math.min(doc.clientWidth - W, Math.max(0, x));
        y = Math.min(doc.scrollHeight - H, Math.max(0, y));
        setWalking(speed >= 25);
        place(null);
        if (returning && dist < 3) goIn();
      }

      if (mode !== "home") frame = requestAnimationFrame(tick);
      else last = 0;
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    api.current = {
      hover(on) {
        hovering = on;
        setHovering(on);
        if (mode === "home") settleHome(on);
      },
      toggle(cx, cy) {
        cursor = { x: cx, y: cy };
        if (mode === "home") leave();
        else if (mode === "following") enter("returning");
        else if (mode === "returning") enter("following");
        kick();
      },
    };

    const onPointer = (e: PointerEvent) => {
      cursor = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });

    // Park it in the hole without animating there.
    el.classList.remove("is-home");
    settleHome(false);
    void el.offsetWidth;
    el.classList.add("is-home");
    el.style.visibility = "visible";

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      api.current = null;
    };
  }, []);

  const out = mode !== "home";
  const lid = mode === "leaving" || mode === "entering" ? "open" : hovering ? "peek" : "closed";

  // Hover and clicks are taken on the hole, which stays put, rather than the
  // lid: a lifted lid moves out from under a still cursor and would flicker.
  return (
    <div
      ref={holeRef}
      className="penguin-hole"
      onPointerEnter={() => api.current?.hover(true)}
      onPointerLeave={() => api.current?.hover(false)}
      onClick={(e) => api.current?.toggle(e.clientX, e.clientY)}
    >
      <div className="penguin-hit" />
      <div
        className="penguin-lid"
        data-lid={lid}
        role="button"
        tabIndex={0}
        aria-pressed={out}
        aria-label={out ? `${name}: call the penguin back` : `${name}: let the penguin out`}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          api.current?.toggle(r.left + r.width / 2, r.top + r.height / 2);
        }}
      >
        <div className="penguin-lid-face">{name}</div>
      </div>

      {createPortal(
        <div ref={penguinRef} className="penguin is-home" aria-hidden="true">
          <div className="penguin-pose">
            <img className="penguin-still" src="/penguin.png" alt="" draggable={false} />
            <img className="penguin-walk" src="/penguin-walk.png" alt="" draggable={false} />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
