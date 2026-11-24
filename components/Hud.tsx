"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { SECTIONS, SECTION_TOTAL, type SectionId } from "@/lib/content";

function useClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
    fmt();
    const id = window.setInterval(fmt, 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/** Radar-style minimap: one blip per chapter, the player arrow tracks scroll. */
function Radar({ active, progress }: { active: SectionId | null; progress: number }) {
  const idx = SECTIONS.findIndex(s => s.id === active);
  return <div className="radar" aria-hidden="true">
    <svg viewBox="0 0 100 100">
      <defs>
        <clipPath id="radar-clip"><circle cx="50" cy="50" r="46" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="47" className="radar-bg" />
      <g clipPath="url(#radar-clip)" style={{ transform: `rotate(${-progress * 300}deg)`, transformOrigin: "50px 50px" }} className="radar-world">
        <path d="M-10 62 L40 60 L58 74 L110 70" className="radar-road" />
        <path d="M30 -10 L36 40 L28 110" className="radar-road" />
        <path d="M60 -10 Q70 40 92 110" className="radar-road thin" />
        <rect x="8" y="12" width="18" height="14" className="radar-block" />
        <rect x="62" y="20" width="22" height="12" className="radar-block" />
        <rect x="44" y="78" width="16" height="16" className="radar-block" />
        <path d="M-10 92 Q40 82 110 96 L110 110 L-10 110Z" className="radar-water" />
        {SECTIONS.map((s, i) => {
          const a = (i / SECTIONS.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(a) * 30, y = 50 + Math.sin(a) * 30;
          return <g key={s.id} className={"radar-blip" + (i === idx ? " is-active" : "") + (i < idx ? " is-done" : "")}>
            <circle cx={x} cy={y} r="4.2" />
            <text x={x} y={y + 2.2}>{i + 1}</text>
          </g>;
        })}
      </g>
      <circle cx="50" cy="50" r="47" className="radar-ring" />
      <path d="M50 42 L56 56 L50 52 L44 56Z" className="radar-player" />
      <text x="50" y="11" className="radar-n">N</text>
    </svg>
  </div>;
}

export default function Hud({ active, visited, progress, repoCount }: { active: SectionId | null; visited: number; progress: number; repoCount: number }) {
  const time = useClock();
  const section = SECTIONS.find(s => s.id === active);
  return <>
    <div className="hud hud-left">
      <Radar active={active} progress={progress} />
      <div className="hud-zone">
        <span className="hud-zone-k">ZONE</span>
        <b>{section ? section.hud : "VICE COAST"}</b>
        <span className="hud-zone-sub">{section ? section.no + " / " + SECTION_TOTAL : "BENGALURU · IN"}</span>
      </div>
    </div>
    <div className="hud hud-right" aria-label="Status">
      <div className="hud-clock" title="Local time in Bengaluru">{time}<small>IST</small></div>
      <div className="hud-cash" title="Public repositories on GitHub"><span>$</span>{String(repoCount).padStart(6, "0")}</div>
      <div className="hud-wanted" aria-label={visited + " of 5 wanted stars"} title="Explore chapters to raise your wanted level">
        {[0, 1, 2, 3, 4].map(i => <Star key={i} size={15} strokeWidth={2} className={i < visited ? "on" : ""} fill={i < visited ? "currentColor" : "none"} />)}
      </div>
    </div>
  </>;
}
