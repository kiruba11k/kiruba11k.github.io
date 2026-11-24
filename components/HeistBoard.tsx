"use client";

import { useState } from "react";
import { HEIST } from "@/lib/content";

/** Corkboard planning screen: pin cards joined by red string; click to mark a setup done. */
export default function HeistBoard() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setDone(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const complete = done.size === HEIST.length;
  return <div className="heist">
    <div className="heist-top">
      <span className="mono-label">SETUPS COMPLETE · {done.size} / {HEIST.length}</span>
      <div className="heist-progress" aria-hidden="true">{HEIST.map(h => <i key={h.id} className={done.has(h.id) ? "on" : ""} />)}</div>
      <button className="btn btn-ghost" onClick={() => setDone(complete ? new Set() : new Set(HEIST.map(h => h.id)))}>{complete ? "Reset board" : "Run the whole job"}</button>
    </div>
    <div className="board">
      <svg className="board-string" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 12 Q20 30 30 20 T50 14 T70 24 T90 12" />
      </svg>
      <ol className="board-cards">
        {HEIST.map((h, i) => {
          const isDone = done.has(h.id);
          return <li key={h.id} className={"pin-card" + (isDone ? " is-done" : "")} style={{ "--r": [-2.5, 1.8, -1, 2.4, -1.6][i] + "deg" } as React.CSSProperties}>
            <span className="pin" aria-hidden="true" />
            <button className="pin-body" aria-pressed={isDone} onClick={() => toggle(h.id)}>
              <span className="pin-step">{h.step}</span>
              <strong>{h.title}</strong>
              <span className="pin-role">{h.role}</span>
              <ul>{h.lines.map(l => <li key={l}>{l}</li>)}</ul>
              <span className="pin-proof"><b>PROOF</b>{h.proof}</span>
              <span className="pin-stamp" aria-hidden="true">DONE</span>
            </button>
          </li>;
        })}
      </ol>
      {complete && <div className="heist-passed" role="status"><span>HEIST COMPLETE</span><small>Idea → data → model → eval → production</small></div>}
    </div>
  </div>;
}
