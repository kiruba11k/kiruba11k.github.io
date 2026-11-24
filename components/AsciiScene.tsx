"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/prefs";
import type { MissionScene } from "@/lib/content";

const RAMP = " .:-=+*#%@";

/** Brightness field per mission, in cell space (x: 0..1, y: 0..1 from top). */
const FIELDS: Record<MissionScene, (x: number, y: number, t: number, a: number) => number> = {
  // conveyor belt carrying parcels; a scan beam sweeps across
  parcel: (x, y, t, a) => {
    let v = 0;
    if (y > .72 && y < .78) v = .5 + .3 * Math.sin((x * 40 - t * 4));
    const bx = ((x + t * .08) % .34) / .34;
    if (y > .38 && y < .72 && bx > .15 && bx < .75) {
      v = .55;
      if (Math.abs(y - .38) < .03 || Math.abs(bx - .15) < .02 || Math.abs(bx - .75) < .02) v = .85;
      const dent = Math.hypot((bx - .6) * 1.8, y - .5);
      if (Math.floor((x + t * .08) / .34) % 3 === 1 && dent < .08) v = .98;
    }
    const scan = ((t * .25) % 1.2) - .1;
    if (Math.abs(x - scan) < .012) v = Math.max(v, .9);
    if (y < .12) v = Math.max(v, .12 * Math.abs(Math.sin(x * a * 3)));
    return v;
  },
  // perspective highway with moving vehicles and a virtual counting line
  traffic: (x, y, t) => {
    const hz = .2;
    if (y < hz) return Math.abs(y - hz + .03) < .02 ? .25 + .2 * Math.sin(x * 50) : (Math.sin(x * 90 + y * 30) > .96 ? .3 : 0);
    const d = (y - hz) / (1 - hz);
    const hw = .04 + d * .52;
    const dx = x - .5;
    if (Math.abs(dx) > hw) return Math.abs(Math.abs(dx) - hw) < .012 ? .35 : 0;
    let v = .1;
    const lanePos = dx / hw * 3;
    if (Math.abs(lanePos - Math.round(lanePos)) < .05 * (1 + d) && Math.round(lanePos) !== 0 && Math.abs(Math.round(lanePos)) < 3 && Math.sin(d * 28 - t * 7) > 0) v = .45;
    if (Math.abs(y - .7) < .02) v = .72;
    for (let i = 0; i < 6; i++) {
      const lane = -2.5 + i;
      const z = (t * (.12 + (i % 3) * .04) + i * .29) % 1;
      const cy = hz + z * z * (1 - hz);
      const cd = (cy - hz) / (1 - hz);
      const cx = .5 + (lane / 3) * (.04 + cd * .52);
      const w = .012 + cd * .07, h = .02 + cd * .09;
      if (Math.abs(x - cx) < w && Math.abs(y - cy) < h) {
        v = Math.abs(y - cy) > h * .55 ? 1 : .62;
        if (Math.abs(cy - .7) < .04) v = 1;
      }
    }
    return v;
  },
  // pulsing neural network / attention matrix
  llm: (x, y, t) => {
    const layers = 5;
    const lx = x * (layers - 1);
    const li = Math.round(lx);
    let v = .04;
    const nodes = [4, 6, 7, 6, 3][li];
    for (let n = 0; n < nodes; n++) {
      const ny = (n + 1) / (nodes + 1);
      const d = Math.hypot((lx - li) * .25, y - ny);
      if (d < .035) v = .6 + .4 * Math.sin(t * 3 + n + li * 2);
    }
    const seg = Math.floor(lx);
    if (seg < layers - 1) {
      const f = lx - seg;
      const a = [4, 6, 7, 6, 3][seg], b = [4, 6, 7, 6, 3][seg + 1];
      for (let i = 0; i < a; i += 1) for (let j = 0; j < b; j += 2) {
        const y0 = (i + 1) / (a + 1), y1 = (j + 1) / (b + 1);
        const yy = y0 + (y1 - y0) * f;
        if (Math.abs(y - yy) < .012) {
          const pulse = (t * .6 + i * .13 + j * .07) % 1;
          v = Math.max(v, Math.abs(f - pulse) < .08 ? .95 : .22);
        }
      }
    }
    return v;
  }
};

export default function AsciiScene({ scene, active }: { scene: MissionScene; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, visible = false, last = 0;
    const cw = 8, ch = 13;
    const field = FIELDS[scene];
    const draw = (now: number) => {
      raf = 0;
      if (now - last > 60) {
        last = now;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        const styles = getComputedStyle(canvas);
        const ink = styles.getPropertyValue("--ascii-ink").trim() || "#ff3d7f";
        const hot = styles.getPropertyValue("--ascii-hot").trim() || "#ffe2a1";
        ctx.font = `500 ${ch - 2}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.textBaseline = "top";
        const cols = Math.ceil(w / cw), rows = Math.ceil(h / ch);
        const t = reduced ? 3 : now / 1000 * (active ? 1.8 : 1);
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const v = field(c / cols, r / rows, t, cols);
          if (v < .05) continue;
          ctx.fillStyle = v > .8 ? hot : ink;
          ctx.globalAlpha = .35 + v * .65;
          ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))], c * cw, r * ch);
        }
        ctx.globalAlpha = 1;
      }
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [scene, active, reduced]);
  return <canvas ref={ref} className="ascii-scene" aria-hidden="true" />;
}
