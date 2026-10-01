"use client";
import { useEffect, useRef } from "react";

const RAMP = " .:-=+*#%@";
const FPS = 20;

export function AsciiBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cell = 18;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      cell = w < 640 ? 22 : 18;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${cell - 4}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = t / 1000;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v =
            (Math.sin(x * 0.16 + s * 0.9) +
              Math.sin(y * 0.13 - s * 0.7) +
              Math.sin((x + y) * 0.07 + s * 0.5) +
              3) /
            6;
          if (v < 0.5) continue;
          const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          ctx.fillStyle = `rgba(99,102,241,${(0.05 + (v - 0.5) * 0.3).toFixed(3)})`;
          ctx.fillText(RAMP[idx], x * cell, y * cell);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
    />
  );
}
