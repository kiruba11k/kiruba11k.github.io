"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "night" | "day";
export type FontChoice = "allo" | "sans" | "serif" | "mono" | "pixel";
export type RenderMode = "dither" | "ascii";

export const FONT_OPTIONS: { id: FontChoice; label: string; sample: string }[] = [
  { id: "allo", label: "Allo", sample: "Bricolage" },
  { id: "sans", label: "Sans", sample: "Inter" },
  { id: "serif", label: "Serif", sample: "Instrument" },
  { id: "mono", label: "Mono", sample: "JetBrains" },
  { id: "pixel", label: "Pixel", sample: "Silkscreen" }
];

type Prefs = {
  theme: Theme; font: FontChoice; render: RenderMode;
  setTheme: (t: Theme) => void; setFont: (f: FontChoice) => void; setRender: (r: RenderMode) => void;
};

const PrefsContext = createContext<Prefs | null>(null);

function read(key: string) { try { return window.localStorage.getItem(key); } catch { return null; } }
function write(key: string, value: string) { try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ } }

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("night");
  const [font, setFontState] = useState<FontChoice>("allo");
  const [render, setRenderState] = useState<RenderMode>("dither");

  useEffect(() => {
    const t = read("kp-theme"); const f = read("kp-font"); const r = read("kp-render");
    if (t === "night" || t === "day") setThemeState(t);
    if (FONT_OPTIONS.some(o => o.id === f)) setFontState(f as FontChoice);
    if (r === "dither" || r === "ascii") setRenderState(r);
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = theme === "day" ? "light" : "dark"; }, [theme]);
  useEffect(() => { document.documentElement.dataset.font = font; }, [font]);

  const setTheme = useCallback((t: Theme) => { setThemeState(t); write("kp-theme", t); }, []);
  const setFont = useCallback((f: FontChoice) => { setFontState(f); write("kp-font", f); }, []);
  const setRender = useCallback((r: RenderMode) => { setRenderState(r); write("kp-render", r); }, []);

  return <PrefsContext.Provider value={{ theme, font, render, setTheme, setFont, setRender }}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
