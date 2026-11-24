"use client";

import { useEffect, useRef } from "react";
import { usePrefs } from "@/lib/prefs";

const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];

/** Two-tone ordered dither of a same-origin image; the original fades in on hover. */
export default function DitherImage({ src, alt, size = 220 }: { src: string; alt: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = usePrefs();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      const px = 2, n = Math.floor(size / px);
      canvas.width = n; canvas.height = n;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, n, n);
      const data = ctx.getImageData(0, 0, n, n);
      const [dark, light] = theme === "night" ? [[26, 10, 34], [255, 138, 90]] : [[42, 22, 48], [251, 238, 222]];
      for (let i = 0; i < n * n; i++) {
        const o = i * 4;
        const l = (data.data[o] * .299 + data.data[o + 1] * .587 + data.data[o + 2] * .114) / 255;
        const x = i % n, y = Math.floor(i / n);
        const on = Math.pow(l, .85) * 1.1 > (BAYER[(y % 8) * 8 + (x % 8)] + .5) / 64;
        const c = on ? light : dark;
        data.data[o] = c[0]; data.data[o + 1] = c[1]; data.data[o + 2] = c[2]; data.data[o + 3] = 255;
      }
      ctx.putImageData(data, 0, 0);
    };
    img.src = src;
  }, [src, size, theme]);
  return <span className="dither-image" style={{ width: size, height: size }}>
    <img src={src} alt={alt} width={size} height={size} />
    <canvas ref={ref} aria-hidden="true" />
  </span>;
}
