"use client";

import { useEffect, useState } from "react";

const TIPS = [
  "Press 1 – 6 to fast travel between chapters.",
  "Press / anywhere to search the garage of repositories.",
  "Switch the hero between dither and ASCII rendering with M.",
  "Every chapter you visit raises your wanted level."
];

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [tip, setTip] = useState(TIPS[0]);
  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    let seen = false;
    try { seen = window.sessionStorage.getItem("kp-loaded") === "1"; window.sessionStorage.setItem("kp-loaded", "1"); } catch { /* ignore */ }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) { setShow(false); return; }
    const a = window.setTimeout(() => setLeaving(true), 1700);
    const b = window.setTimeout(() => setShow(false), 2150);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, []);
  if (!show) return null;
  return <div className={"loader" + (leaving ? " is-leaving" : "")} role="status" aria-label="Loading portfolio" onClick={() => setLeaving(true)} onTransitionEnd={() => leaving && setShow(false)}>
    <div className="loader-panels" aria-hidden="true"><i /><i /><i /></div>
    <div className="loader-mark"><span>KP</span><small>Vice Coast Edition</small></div>
    <div className="loader-foot">
      <p><b>TIP</b> {tip}</p>
      <div className="loader-spin"><span className="loader-ring" />LOADING</div>
    </div>
  </div>;
}
