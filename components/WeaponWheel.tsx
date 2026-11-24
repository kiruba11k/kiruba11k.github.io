"use client";

import { useState } from "react";
import { ARSENAL } from "@/lib/content";

const N = ARSENAL.length;

export default function WeaponWheel() {
  const [sel, setSel] = useState(2);
  const item = ARSENAL[sel];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setSel(s => (s + 1) % N); focusSlot((sel + 1) % N); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setSel(s => (s + N - 1) % N); focusSlot((sel + N - 1) % N); }
  };
  const focusSlot = (i: number) => document.getElementById("wheel-slot-" + i)?.focus();
  return <div className="arsenal">
    <div className="wheel" style={{ "--sel": sel, "--n": N } as React.CSSProperties} onKeyDown={onKey}>
      <div className="wheel-ring" aria-hidden="true" />
      <div className="wheel-sweep" aria-hidden="true" />
      <div role="radiogroup" aria-label="Skill categories">
        {ARSENAL.map((a, i) => {
          const angle = (i / N) * 360 - 90;
          return <button key={a.id} id={"wheel-slot-" + i} role="radio" aria-checked={i === sel} tabIndex={i === sel ? 0 : -1}
            className={"wheel-slot" + (i === sel ? " is-sel" : "")}
            style={{ "--a": angle + "deg" } as React.CSSProperties}
            onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)}>
            <span className="wheel-glyph">{a.glyph}</span>
            <span className="wheel-name">{a.slot}</span>
          </button>;
        })}
      </div>
      <div className="wheel-core" aria-live="polite">
        <span className="wheel-core-k">LVL {String(item.level).padStart(2, "0")}</span>
        <strong>{item.name}</strong>
        <span className="wheel-ammo">{item.ammo}</span>
      </div>
    </div>
    <div className="arsenal-detail">
      <div className="arsenal-head">
        <span className="mono-label">SLOT {String(sel + 1).padStart(2, "0")} · {item.slot.toUpperCase()}</span>
        <h3>{item.name}</h3>
        <p>{item.note}</p>
      </div>
      <div className="level-bar" aria-label={"Level " + item.level + " of 10"}>
        {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < item.level ? "on" : ""} />)}
      </div>
      <ul className="chip-list">{item.skills.map(s => <li key={s}>{s}</li>)}</ul>
      <p className="arsenal-hint mono-label">Hover the wheel · or use ← → keys</p>
    </div>
  </div>;
}
