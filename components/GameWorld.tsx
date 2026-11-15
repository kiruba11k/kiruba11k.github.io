"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Crosshair, Gamepad2, Map, Radio, Sparkles, Volume2 } from "lucide-react";

const chapters = [
  { id: "chapter-profile", no: "01", name: "PLAYER PROFILE", sub: "Meet the engineer" },
  { id: "chapter-loadout", no: "02", name: "SKILL LOADOUT", sub: "Tools & abilities" },
  { id: "chapter-career", no: "03", name: "CAREER MISSIONS", sub: "Experience log" },
  { id: "chapter-projects", no: "04", name: "FIELD OPERATIONS", sub: "Featured projects" },
  { id: "chapter-archive", no: "05", name: "THE ARCHIVE", sub: "130 repositories" },
];

function CityArtwork() {
  return <svg className="city-art" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#11172e"/><stop offset=".5" stopColor="#522c68"/><stop offset=".78" stopColor="#e56a70"/><stop offset="1" stopColor="#f6a46c"/></linearGradient>
      <linearGradient id="sunset" x2="0" y2="1"><stop stopColor="#ffd08a"/><stop offset="1" stopColor="#ed6579"/></linearGradient>
      <linearGradient id="water" x2="0" y2="1"><stop stopColor="#37294f"/><stop offset="1" stopColor="#101b35"/></linearGradient>
      <linearGradient id="road" x2="0" y2="1"><stop stopColor="#20243c"/><stop offset="1" stopColor="#090d1c"/></linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect width="1440" height="760" fill="url(#sky)"/>
    <circle cx="1070" cy="280" r="155" fill="#f78b83" opacity=".22" filter="url(#blur)"/>
    <circle cx="1070" cy="280" r="94" fill="url(#sunset)" opacity=".9"/>
    <path d="M0 390 Q260 360 500 400 T980 385 T1440 400 V760 H0Z" fill="url(#water)"/>
    <g opacity=".32" stroke="#f4a0a0" strokeWidth="2"><path d="M900 430h340M940 450h280M1010 470h170M870 495h420M950 520h240"/></g>
    <g fill="#171a31" stroke="#59607d" strokeWidth="2">
      <path d="M0 250h115v210H0zM20 210h76v40H20zM130 300h90v160h-90zM150 255h55v45h-55zM235 220h115v240H235zM260 170h65v50h-65zM360 285h100v175H360zM480 190h105v270H480zM500 145h65v45h-65zM600 260h85v200h-85zM700 210h130v250H700zM725 160h80v50h-80zM850 300h90v160h-90zM1180 260h100v200h-100zM1290 205h150v255h-150zM1320 160h90v45h-90z"/>
    </g>
    <g fill="#f5a0a2" opacity=".55">
      {Array.from({length:9},(_,i)=><rect key={"a"+i} x={18+i*13} y="280" width="4" height="8"/>)} 
      {Array.from({length:8},(_,i)=><rect key={"b"+i} x={250+i*12} y="245" width="5" height="9"/>)} 
      {Array.from({length:9},(_,i)=><rect key={"c"+i} x={495+i*10} y="215" width="5" height="9"/>)} 
      {Array.from({length:10},(_,i)=><rect key={"d"+i} x={720+i*10} y="235" width="5" height="9"/>)} 
      {Array.from({length:10},(_,i)=><rect key={"e"+i} x={1305+i*12} y="230" width="5" height="9"/>)} 
    </g>
    <path d="M0 460H1440V760H0Z" fill="url(#road)"/>
    <path d="M0 545L1440 500" stroke="#e6a1a0" strokeWidth="3" opacity=".55"/>
    <path d="M0 700L1440 625" stroke="#e6a1a0" strokeWidth="2" opacity=".35"/>
    <g fill="#f5b2a4" opacity=".65"><path d="M90 760l210-300h35L180 760zM1190 760l-95-300h26l145 300z"/></g>
    <g stroke="#ffd28d" strokeWidth="3" opacity=".55"><path d="M620 580h85M580 625h115M535 675h160"/></g>
    <g fill="#101527"><path d="M120 465q-35-120-8-210q-2 100 26 210zM100 300q-65-65-78-115q55 42 86 101q-8-78 16-123q7 70-6 135q50-52 97-54q-48 33-104 72z"/><path d="M1370 465q-25-115 0-205q-3 100 20 205zM1360 300q-65-65-78-115q55 42 86 101q-8-78 16-123q7 70-6 135q50-52 97-54q-48 33-104 72z"/></g>
    <g transform="translate(810 565)"><path d="M0 25l25-22h120l35 22 18 35H-10z" fill="#e56f83" stroke="#ffc0a4" strokeWidth="3"/><path d="M42 5h78l24 20H24z" fill="#26314d"/><circle cx="30" cy="60" r="13" fill="#090d19" stroke="#d9a6a3" strokeWidth="4"/><circle cx="155" cy="60" r="13" fill="#090d19" stroke="#d9a6a3" strokeWidth="4"/><path d="M-4 38h15M181 38h10" stroke="#fff1bd" strokeWidth="5"/></g>
    <g transform="translate(1060 630) scale(.65)"><path d="M0 25l25-22h120l35 22 18 35H-10z" fill="#5a9ea0" stroke="#b4d4c8" strokeWidth="3"/><path d="M42 5h78l24 20H24z" fill="#26314d"/><circle cx="30" cy="60" r="13" fill="#090d19" stroke="#b4d4c8" strokeWidth="4"/><circle cx="155" cy="60" r="13" fill="#090d19" stroke="#b4d4c8" strokeWidth="4"/></g>
  </svg>;
}

export default function GameWorld() {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState("chapter-profile");
  const reduceMotion = useReducedMotion();
  const jump = (id: string) => {
    setStarted(true);
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };
  return <>
    <section className="game-intro" id="game-start">
      <CityArtwork />
      <div className="game-scanlines" />
      <div className="game-topbar"><a href="#game-start" className="game-logo"><span>KP</span> OPEN WORLD <i>™</i></a><div className="game-top-status"><span><i /> ONLINE</span><span>COIMBATORE → BENGALURU</span></div><button className="game-sound" aria-label="Sound is off"><Volume2 size={15}/><span>SOUND OFF</span></button></div>
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
      <motion.div className="game-city-label" animate={reduceMotion ? undefined : { y: [0,-7,0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><span>VICE COAST</span><small>THE CITY NEVER STOPS LEARNING</small></motion.div>
      <div className="game-bottom-gradient"/>
      <div className="game-scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></div>
    </section>
    <header className="game-nav">
      <a href="#game-start" className="game-nav-brand">KP<span> / STORY MODE</span></a>
      <nav>{chapters.map(ch => <button key={ch.id} className={active===ch.id?"active":""} onClick={()=>jump(ch.id)}><small>{ch.no}</small>{ch.name}</button>)}</nav>
      <div className="game-nav-right"><span><Radio size={13}/> STORY ONLINE</span><a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12}/></a></div>
    </header>
    <div className="game-chapter-bar"><span><Map size={13}/> CURRENT OBJECTIVE</span><strong>{chapters.find(ch=>ch.id===active)?.name ?? "EXPLORE THE WORLD"}</strong><span className="game-chapter-progress"><i/></span></div>
  </>;
}
