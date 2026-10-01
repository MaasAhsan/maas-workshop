"use client";
import { useEffect, useRef } from "react";

const RAMP = " .:-=+*#%@";
// Opacity per brightness level (higher = more visible).
const ALPHAS = [0.10, 0.16, 0.23, 0.31];
const COLORS = ALPHAS.map((a) => `rgba(129,140,248,${a})`);
const SKIP = 255;

export function AsciiBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, cell = 18, cols = 0, rows = 0, fps = 24, radius = 8;
    let levels = new Uint8Array(0);
    let chars = new Uint8Array(0);
    // Pointer position in px. Mouse overrides the automatic path once it moves.
    let hasMouse = false;
    let tx = 0, ty = 0; // target
    let px = 0, py = 0; // smoothed
    let raf = 0, last = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const mobile = w < 640;
      cell = mobile ? 24 : 18; // fewer cells on phones
      fps = mobile ? 15 : 24;
      radius = mobile ? 6 : 8;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${cell - 4}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      levels = new Uint8Array(cols * rows);
      chars = new Uint8Array(cols * rows);
    };

    const draw = (now: number) => {
      const s = now / 1000;

      if (!hasMouse || reduced) {
        // Automatic drift (phones, or before the mouse moves).
        tx = w * (0.5 + 0.38 * Math.sin(s * 0.45));
        ty = h * (0.45 + 0.32 * Math.sin(s * 0.33 + 1.2));
      }
      px += (tx - px) * 0.18;
      py += (ty - py) * 0.18;

      const mx = px / cell;
      const my = py / cell;
      const r2 = radius * radius;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let v =
            (Math.sin(x * 0.16 + s * 0.9) +
              Math.sin(y * 0.13 - s * 0.7) +
              Math.sin((x + y) * 0.07 + s * 0.5) +
              3) / 6;
          const dx = x - mx, dy = y - my;
          v += 0.55 * Math.exp(-(dx * dx + dy * dy) / r2);
          if (v > 1) v = 1;
          const i = y * cols + x;
          if (v < 0.4) {
            levels[i] = SKIP;
          } else {
            levels[i] = Math.min(3, Math.floor((v - 0.4) / 0.15));
            chars[i] = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          }
        }
      }

      ctx.clearRect(0, 0, w, h);
      // One fillStyle per level instead of one per character.
      for (let l = 0; l < 4; l++) {
        ctx.fillStyle = COLORS[l];
        for (let i = 0; i < levels.length; i++) {
          if (levels[i] !== l) continue;
          ctx.fillText(RAMP[chars[i]], (i % cols) * cell, Math.floor(i / cols) * cell);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 1000 / fps) return;
      last = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // touch/pen keep the automatic path
      hasMouse = true;
      tx = e.clientX;
      ty = e.clientY;
    };

    resize();
    px = tx = w / 2;
    py = ty = h / 2;
    window.addEventListener("resize", resize);
    if (reduced) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    />
  );
}
