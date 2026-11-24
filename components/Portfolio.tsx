"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import DitherCanvas from "@/components/DitherCanvas";
import AsciiScene from "@/components/AsciiScene";
import DitherImage from "@/components/DitherImage";
import Hud from "@/components/Hud";
import Toolbar from "@/components/Toolbar";
import WeaponWheel from "@/components/WeaponWheel";
import Garage from "@/components/Garage";
import RepoDialog from "@/components/RepoDialog";
import NewsTicker from "@/components/NewsTicker";
import HeistBoard from "@/components/HeistBoard";
import RapSheet from "@/components/RapSheet";
import LoadingScreen from "@/components/LoadingScreen";
import { PrefsProvider, usePrefs } from "@/lib/prefs";
import { ACHIEVEMENTS, LINKS, MISSIONS, SECTIONS, STATS, STORY, type SectionId } from "@/lib/content";
import { decorateRepositories, fetchAllRepositories } from "@/lib/github";
import type { DecoratedRepo } from "@/lib/types";

function SectionHead({ no, kicker, title, aside }: { no: string; kicker: string; title: React.ReactNode; aside?: React.ReactNode }) {
  return <header className="sec-head">
    <span className="sec-no">§{no}</span>
    <div className="sec-title">
      <span className="mono-label">{kicker}</span>
      <h2>{title}</h2>
    </div>
    {aside && <div className="sec-aside">{aside}</div>}
  </header>;
}

function Stamp({ top, value, bottom, tilt = 0 }: { top: string; value: string; bottom: string; tilt?: number }) {
  return <div className="stamp" style={{ "--tilt": tilt + "deg" } as React.CSSProperties}>
    <div className="stamp-inner">
      <span className="stamp-top">{top}</span>
      <strong>{value}</strong>
      <span className="stamp-bottom">{bottom}</span>
    </div>
  </div>;
}

function MissionCard({ m }: { m: typeof MISSIONS[number] }) {
  const [state, setState] = useState<"idle" | "running" | "passed">("idle");
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (state !== "running") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setStep(m.objectives.length); setState("passed"); return; }
    if (step >= m.objectives.length) { const t = window.setTimeout(() => setState("passed"), 350); return () => window.clearTimeout(t); }
    const t = window.setTimeout(() => setStep(s => s + 1), 420);
    return () => window.clearTimeout(t);
  }, [state, step, m.objectives.length]);
  const start = () => { if (state === "idle") { setStep(0); setState("running"); } else { setState("idle"); setStep(0); } };
  return <article className={"mission is-" + state}>
    <div className="mission-screen">
      <AsciiScene scene={m.scene} active={state !== "idle"} />
      <span className="mission-no">MISSION {m.no}</span>
      <span className="mission-diff" aria-label={`Difficulty ${m.difficulty} of 5`}>{"★".repeat(m.difficulty)}<i>{"★".repeat(5 - m.difficulty)}</i></span>
      {state === "passed" && <div className="mission-passed" role="status">
        <span className="mp-k">MISSION PASSED</span>
        <dl>{m.results.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </div>}
    </div>
    <div className="mission-body">
      <span className="mono-label">{m.tag}</span>
      <h3>{m.title}</h3>
      <p>{m.desc}</p>
      <ul className="chip-list">{m.stack.map(s => <li key={s}>{s}</li>)}</ul>
      {state !== "idle" && <div className="objectives">
        <span className="mono-label">OBJECTIVES · {Math.min(step, m.objectives.length)} / {m.objectives.length}</span>
        <ol>{m.objectives.map((o, i) => <li key={o} className={i < step ? "is-done" : i === step && state === "running" ? "is-now" : ""}>
          <span className="obj-box" aria-hidden="true">{i < step ? "✓" : ""}</span>{o}
        </li>)}</ol>
      </div>}
      <div className="mission-actions">
        <button className="btn btn-primary" aria-expanded={state !== "idle"} onClick={start}>{state === "idle" ? "Start mission" : state === "running" ? "Abort" : "Replay"}</button>
        <a className="link" href={m.href} target="_blank" rel="noreferrer">Mission file <ArrowUpRight size={13} /></a>
      </div>
    </div>
  </article>;
}

function Checkpoint({ label }: { label: string | null }) {
  if (!label) return null;
  return <div className="checkpoint" role="status" key={label}>
    <span className="checkpoint-k">CHECKPOINT REACHED</span>
    <strong>{label}</strong>
    <span className="checkpoint-r">+ RESPECT</span>
  </div>;
}

function Page() {
  const { theme, setTheme, render, setRender } = usePrefs();
  const [repos, setRepos] = useState<DecoratedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<DecoratedRepo | null>(null);
  const [active, setActive] = useState<SectionId | null>(null);
  const [visited, setVisited] = useState<Set<SectionId>>(new Set());
  const [checkpoint, setCheckpoint] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const cpTimer = useRef<number>();

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRepos(decorateRepositories(await fetchAllRepositories())); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not reach GitHub."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const jump = useCallback((id: SectionId) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);

  // active chapter + visited set
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id as SectionId;
      setActive(id);
      setVisited(prev => {
        if (prev.has(id)) return prev;
        const next = new Set(prev); next.add(id);
        const s = SECTIONS.find(x => x.id === id);
        if (s && prev.size > 0) {
          setCheckpoint(s.hud);
          window.clearTimeout(cpTimer.current);
          cpTimer.current = window.setTimeout(() => setCheckpoint(null), 2200);
        }
        return next;
      });
    }), { rootMargin: "-40% 0px -55% 0px" });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(null); }, { rootMargin: "-50% 0px -50% 0px" });
    if (hero) heroIo.observe(hero);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? scrollY / max : 0); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); heroIo.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  // reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach(el => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (selected || document.querySelector("[role=menu]")) return;
      const n = Number(e.key);
      if (e.key >= "1" && e.key <= String(SECTIONS.length)) { jump(SECTIONS[n - 1].id); }
      else if (e.key === "0") window.scrollTo({ top: 0, behavior: "smooth" });
      else if (e.key === "/") { e.preventDefault(); jump("garage"); window.setTimeout(() => document.getElementById("repo-search")?.focus({ preventScroll: true }), 450); }
      else if (e.key.toLowerCase() === "t") setTheme(theme === "night" ? "day" : "night");
      else if (e.key.toLowerCase() === "m") setRender(render === "dither" ? "ascii" : "dither");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, selected, theme, render, setTheme, setRender]);

  const wanted = Math.min(5, Math.max(0, visited.size - 1));

  return <div className="site">
    <LoadingScreen />
    <a className="skip" href="#player">Skip to content</a>
    <Hud active={active} visited={wanted} progress={progress} repoCount={repos.length} />
    <Checkpoint label={checkpoint} />

    {/* HERO */}
    <section className="hero" id="top" data-render={render}>
      <DitherCanvas />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-tag">
          <span className="stamp-mini">Player 001</span>
          <span className="mono-label"><MapPin size={11} /> Bengaluru, India · Now playing</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-line">Kirubakaran</span>
          <span className="hero-line hero-line-2">Periyasamy<em>.</em></span>
        </h1>
        <p className="hero-sub">AI / ML engineer building computer-vision, language and GenAI systems that survive <span className="hl">past the demo</span>.</p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => jump("missions")}>Start mission <kbd>3</kbd></button>
          <button className="btn btn-ghost btn-lg" onClick={() => jump("garage")}>Open the garage <kbd>/</kbd></button>
        </div>
      </div>
      <div className="hero-foot">
        <span className="mono-label">◢ RENDER · {render === "ascii" ? "ASCII 9×15" : "BAYER 8×8 · 3PX"}</span>
        <button className="hero-scroll" onClick={() => jump("player")} aria-label="Scroll to player profile"><ArrowDown size={14} /> Scroll to explore</button>
      </div>
    </section>
    <NewsTicker />

    <main className="main">
      {/* 01 PLAYER */}
      <section id="player" className="sec">
        <SectionHead no="01" kicker="Character select" title={<>Meet the <em>player</em>.</>} aside={<span className="mono-label">STATS SYNCED · 2026</span>} />
        <div className="player grid-12" data-reveal>
          <div className="player-card">
            <div className="player-photo stamp-frame">
              <DitherImage src="/kiruba-profile.jpg" alt="Portrait of Kirubakaran Periyasamy" size={200} />
              <span className="stamp-caption">KIRUBA · ₹ 001</span>
            </div>
            <dl className="player-facts">
              <div><dt>Class</dt><dd>AI / ML Engineer</dd></div>
              <div><dt>Experience</dt><dd>1.5+ yrs</dd></div>
              <div><dt>Base</dt><dd>Bengaluru, IN</dd></div>
              <div><dt>Status</dt><dd><span className="dot-live" /> Open to talk</dd></div>
            </dl>
          </div>
          <div className="player-copy">
            <p className="lede">I build intelligent systems that move beyond demos: from <a className="link" href="#missions">computer vision</a> and deep learning to LLM-powered applications and production AI pipelines.</p>
            <div className="stats">
              <span className="mono-label">SKILL STATS</span>
              {STATS.map((s, i) => <div className="stat" key={s.label}>
                <span>{s.label}</span>
                <span className="stat-bar" aria-hidden="true"><i style={{ "--v": s.value / 100, "--d": i * 80 + "ms" } as React.CSSProperties} /></span>
                <b>{s.value}</b>
              </div>)}
            </div>
          </div>
        </div>
        <div className="stamps" data-reveal>
          {ACHIEVEMENTS.map((a, i) => <Stamp key={a.code} top={a.code + " · 0" + (i + 1)} value={a.value} bottom={a.label} tilt={[-3, 2, -1.5, 3][i]} />)}
        </div>
      </section>

      {/* 02 ARSENAL */}
      <section id="arsenal" className="sec">
        <SectionHead no="02" kicker="Weapon wheel" title={<>Choose your <em>loadout</em>.</>} aside={<span className="mono-label">6 SLOTS · 35+ TOOLS</span>} />
        <div data-reveal><WeaponWheel /></div>
      </section>

      {/* 03 MISSIONS */}
      <section id="missions" className="sec">
        <SectionHead no="03" kicker="Selected work" title={<>Pick a <em>mission</em>.</>} aside={<span className="mono-label">3 FEATURED FILES</span>} />
        <div className="missions" data-reveal>{MISSIONS.map(m => <MissionCard key={m.no} m={m} />)}</div>
      </section>

      {/* 04 HEIST */}
      <section id="heist" className="sec">
        <SectionHead no="04" kicker="Heist planning" title={<>How the job <em>gets done</em>.</>} aside={<span className="mono-label">IDEA TO PRODUCTION · 5 SETUPS</span>} />
        <p className="sec-intro" data-reveal>Every model I ship goes through the same five setups. Click a card to tick it off, or run the whole job.</p>
        <div data-reveal><HeistBoard /></div>
      </section>

      {/* 05 STORY */}
      <section id="story" className="sec">
        <SectionHead no="05" kicker="Story mode" title={<>Where I&apos;ve <em>built</em>.</>} aside={<span className="mono-label">PROGRESS 2 / ∞ · RAP SHEET ON FILE</span>} />
        <ol className="story" data-reveal>
          {STORY.map(s => <li key={s.role} className={"story-item" + (s.status === "In progress" ? " is-live" : "")}>
            <div className="story-when"><span>{s.when}</span><span className="story-status">{s.status === "In progress" ? <><span className="dot-live" /> In progress</> : "✓ Complete"}</span></div>
            <div className="story-node" aria-hidden="true" />
            <div className="story-body">
              <span className="mono-label">{s.kind}</span>
              <h3>{s.role} <span className="at">@ {s.org}</span></h3>
              <p>{s.body}</p>
              <ul className="wins">{s.wins.map(w => <li key={w}><span aria-hidden="true">+</span>{w}</li>)}</ul>
              <ul className="chip-list">{s.tags.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
          </li>)}
        </ol>
        <div data-reveal><RapSheet /></div>
      </section>

      {/* 06 GARAGE */}
      <section id="garage" className="sec">
        <SectionHead no="06" kicker="The garage" title={<>Built, tested, <em>parked</em>.</>} aside={<a className="link" href={LINKS.github} target="_blank" rel="noreferrer">github.com/kiruba11k <ArrowUpRight size={12} /></a>} />
        <div data-reveal><Garage repos={repos} loading={loading} error={error} onRetry={() => void load()} onOpen={setSelected} /></div>
      </section>

      {/* 07 CONTACT */}
      <section id="contact" className="sec sec-contact">
        <SectionHead no="07" kicker="Phone · contacts" title={<>More worlds <em>to build</em>.</>} />
        <div className="contact" data-reveal>
          <p className="lede">Hiring for applied ML, computer vision or GenAI work? Give me a call. I pick up.</p>
          <ul className="phone">
            <li><a href={LINKS.email}><span className="phone-ico"><Mail size={16} /></span><span><b>Email</b><small>{LINKS.emailLabel}</small></span><ArrowUpRight size={14} /></a></li>
            <li><a href={LINKS.linkedin} target="_blank" rel="noreferrer"><span className="phone-ico"><Linkedin size={16} /></span><span><b>LinkedIn</b><small>/in/kirubakaranperiyasamy</small></span><ArrowUpRight size={14} /></a></li>
            <li><a href={LINKS.github} target="_blank" rel="noreferrer"><span className="phone-ico"><Github size={16} /></span><span><b>GitHub</b><small>@kiruba11k · {repos.length || "·"} repos</small></span><ArrowUpRight size={14} /></a></li>
          </ul>
        </div>
        <footer className="foot">
          <span className="mono-label">© {new Date().getFullYear()} Kirubakaran Periyasamy</span>
          <span className="mono-label">End of current save · Press 0 to restart</span>
        </footer>
      </section>
    </main>

    <Toolbar active={active} onJump={jump} />
    <RepoDialog repo={selected} onClose={() => setSelected(null)} />
  </div>;
}

export default function Portfolio() {
  return <PrefsProvider><Page /></PrefsProvider>;
}
