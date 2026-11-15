"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Crosshair, Gamepad2, Map, Radio, Sparkles, Volume2 } from "lucide-react";

const chapters = [
  { id: "chapter-profile", no: "01", name: "PLAYER PROFILE", sub: "Meet the engineer" },
  { id: "chapter-loadout", no: "02", name: "SKILL LOADOUT", sub: "Tools & abilities" },
  { id: "chapter-career", no: "03", name: "CAREER MISSIONS", sub: "Experience log" },
  { id: "chapter-projects", no: "04", name: "FIELD OPERATIONS", sub: "Featured projects" },
  { id: "chapter-education", no: "05", name: "ORIGIN STORY", sub: "Education" },
  { id: "chapter-archive", no: "06", name: "THE GARAGE", sub: "GitHub repository archive" },
];

function CityArtwork() {
  return <div className="city-background" aria-hidden="true">
    <img src="https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2200&q=90" alt="" fetchPriority="high" />
    <div className="city-atmosphere" />
    <div className="city-grain" />
  </div>;
}

export default function GameWorld() {
  const [started, setStarted] = useState(false);
  const [pointer, setPointer] = useState({x:0,y:0});
  const [active, setActive] = useState("chapter-profile");
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-28% 0px -58% 0px", threshold: 0 });
    chapters.forEach(chapter => {
      const node = document.getElementById(chapter.id);
      if (node) observer.observe(node);
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && ["INPUT","TEXTAREA","BUTTON"].includes(event.target.tagName)) return;
      const number = Number(event.key);
      if (number >= 1 && number <= chapters.length) jump(chapters[number-1].id);
      if (event.key.toLowerCase() === "j") jump(chapters[Math.min(activeIndex+1,chapters.length-1)].id);
      if (event.key.toLowerCase() === "k") jump(chapters[Math.max(activeIndex-1,0)].id);
    };
    window.addEventListener("keydown",onKey);
    return () => { observer.disconnect(); window.removeEventListener("keydown",onKey); };
  }, [active]);
  const activeIndex = Math.max(0, chapters.findIndex(chapter => chapter.id === active));
  const jump = (id: string) => {
    setStarted(true);
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };
  return <>
    <section className="game-intro" id="game-start" onPointerMove={event=>{const r=event.currentTarget.getBoundingClientRect();setPointer({x:(event.clientX-r.left)/r.width-.5,y:(event.clientY-r.top)/r.height-.5})}} style={{"--pointer-x":`${pointer.x*18}px`,"--pointer-y":`${pointer.y*12}px`} as React.CSSProperties}>
      <CityArtwork />
      <div className="game-scanlines" />
      <div className="game-topbar"><a href="#game-start" className="game-logo"><span>KP</span> OPEN WORLD <i>™</i></a><div className="game-top-status"><span><i /> ONLINE</span><span>VICE COAST · INDIA SERVER</span></div><button className="game-sound" aria-label="Sound is off"><Volume2 size={15}/><span>SOUND OFF</span></button></div>
      <div className="game-hero-content">
        <motion.div className="game-kicker" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 }}><span /> THE STORY OF AN AI / ML ENGINEER <span className="game-kicker-line"/></motion.div>
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .4 }}>KIRUBAKARAN<br/><em>PERIYASAMY</em></motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}>A builder's journey through machine intelligence, computer vision<br className="desktop-only"/> and systems made for the real world.</motion.p>
        <motion.div className="game-hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <button className="game-start-button" onClick={() => jump("chapter-profile")}><Gamepad2 size={17}/>{started ? "CONTINUE STORY" : "START STORY"}<ArrowUpRight size={15}/></button>
          <button className="game-ghost-button" onClick={() => jump("chapter-projects")}><Crosshair size={15}/> SKIP TO MISSIONS</button>
        </motion.div>
        <div className="game-hero-meta"><span>PLAYER 001 / KIRUBA</span><span>AI ENGINEER · LEVEL 01.5+</span><span>OPEN WORLD EXPERIENCE</span></div>
      </div>
      <motion.div className="game-city-label" animate={reduceMotion ? undefined : { y: [0,-7,0], opacity:[.92,1,.92] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><span>VICE COAST</span><small>THE CITY NEVER STOPS LEARNING</small><b>MISSION PROGRESS <i>{String(activeIndex + 1).padStart(2,"0")} / 06</i></b></motion.div>
      <div className="game-bottom-gradient"/>
      <div className="game-scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></div><div className="game-controls-hint"><span>1—6</span> SELECT CHAPTER <i/> <span>J / K</span> NEXT / PREVIOUS</div>
    </section>
    <header className="game-nav">
      <a href="#game-start" className="game-nav-brand">KP<span> / STORY MODE</span></a>
      <nav>{chapters.map(ch => <button key={ch.id} className={active===ch.id?"active":""} onClick={()=>jump(ch.id)}><small>{ch.no}</small>{ch.name}</button>)}</nav>
      <div className="game-nav-right"><span><Radio size={13}/> STORY ONLINE</span><a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12}/></a></div>
    </header>
    <div className="game-chapter-bar"><span><Map size={13}/> CURRENT OBJECTIVE</span><strong>{chapters.find(ch=>ch.id===active)?.name ?? "EXPLORE THE WORLD"}</strong><span className="game-chapter-progress"><i style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}/></span></div>
  </>;
}
