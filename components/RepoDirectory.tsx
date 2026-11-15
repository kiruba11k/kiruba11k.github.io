"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Search, List, LayoutGrid, Star, GitFork, CalendarDays, ArrowUpRight, RefreshCw, Github, Linkedin, Mail, ChevronDown, Code2, FolderGit2, Crosshair, MapPin, Trophy, BriefcaseBusiness, GraduationCap, Terminal, ShieldCheck, Cpu, Database, Eye, Rocket, X, Gamepad2 } from "lucide-react";
import GameWorld from "@/components/GameWorld";
import RepoModal from "@/components/RepoModal";
import { decorateRepositories, fetchAllRepositories } from "@/lib/github";
import type { DecoratedRepo, LanguageFilter } from "@/lib/types";

const languageTabs: LanguageFilter[] = ["All", "Python", "Java", "Notebooks", "Web / JS", "Other"];
const chapters = [
  {id:"chapter-profile",no:"01",name:"PLAYER",sub:"Identity"},
  {id:"chapter-loadout",no:"02",name:"ARSENAL",sub:"Skills"},
  {id:"chapter-projects",no:"03",name:"MISSIONS",sub:"Projects"},
  {id:"chapter-career",no:"04",name:"CAREER",sub:"Experience"},
  {id:"chapter-archive",no:"05",name:"GARAGE",sub:"GitHub"},
];
function displayName(name:string){return name.replace(/[-_]+/g," ").replace(/\\b\\w/g,l=>l.toUpperCase())}
function shortDate(date:string){return new Date(date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}

function SceneArt({type}:{type:"parcel"|"traffic"|"llm"|"career"|"education"}) {
 const scenes = {
  career: { image:"https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=2000&q=90", label:"VICE COAST · CAREER DISTRICT", position:"center 48%" },
  education: { image:"https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=90", label:"ORIGIN POINT · COIMBATORE", position:"center 52%" },
  parcel: { image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=90", label:"INDUSTRIAL DISTRICT", position:"center 52%" },
  traffic: { image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=90", label:"NEON HIGHWAY", position:"center 55%" },
  llm: { image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90", label:"DIGITAL SKYLINE", position:"center 50%" }
 } as const;
 const scene=scenes[type];
 return <div className={`scene-art scene-art-${type}`} aria-hidden="true">
  <img className="scene-photo" src={scene.image} alt="" loading="lazy" style={{objectPosition:scene.position}}/>
  <div className="scene-photo-grade"/>
  <div className="scene-art-caption">{scene.label}</div>
 </div>;
}
function MissionCard({number,tag,title,desc,tech,type,href,image,alt}:{number:string;tag:string;title:string;desc:string;tech:string;type:"parcel"|"traffic"|"llm";href:string;image:string;alt:string}) {
 const [briefOpen,setBriefOpen]=useState(false);
 const [accepted,setAccepted]=useState(false);
 const brief=type==="parcel"?"INSPECTION ROUTE  /  DETECT → SEGMENT → COMPARE → CLASSIFY":type==="traffic"?"TRAFFIC ROUTE  /  DETECT → TRACK → COUNT → ANALYSE":"MODEL ROUTE  /  PREPARE → LoRA → EVALUATE → PUBLISH";
 return <motion.article className={"mission-card mission-"+type} initial={{opacity:0,y:38,rotateX:5}} whileInView={{opacity:1,y:0,rotateX:0}} viewport={{once:false,amount:.22}} whileHover={{y:-8,rotateX:1.2,scale:1.012}} transition={{type:"spring",stiffness:175,damping:20}}>
  <div className="mission-visual"><img className="mission-photo" src={image} alt={alt} loading="lazy"/><div className="mission-photo-shade"/><span className="mission-number">MISSION {number}</span><span className="mission-difficulty">● ● ● <i>FIELD VISUAL</i></span><div className="mission-scan"/><div className="mission-corner-mark">KP / OPS</div></div>
  <div className="mission-copy"><div className="mission-type">{tag}</div><h3>{title}</h3><p>{desc}</p><div className="mission-tech">{tech}</div>
   <button type="button" className="mission-brief-toggle" aria-expanded={briefOpen} onClick={()=>{setAccepted(true);setBriefOpen(v=>!v)}}>{accepted?"MISSION ACCEPTED · VIEW BRIEF":briefOpen?"CLOSE MISSION BRIEF":"ACCEPT MISSION"} <ChevronDown size={13}/></button>
   <AnimatePresence initial={false}>{briefOpen&&<motion.div className="mission-brief" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.28}}><span>{accepted?"MISSION ACTIVE · OPERATION FLOW":"OPERATION FLOW"}</span><p>{brief}</p><small>FIELD NOTES · PROJECT OVERVIEW</small></motion.div>}</AnimatePresence>
   <a href={href} target="_blank" rel="noreferrer">VIEW MISSION FILE <ArrowUpRight size={14}/></a>
  </div>
 </motion.article>
}

export default function RepoDirectory({initialRepos}:{initialRepos:DecoratedRepo[]}) {
 const [repos,setRepos]=useState<DecoratedRepo[]>(initialRepos);
 const [languageFilter,setLanguageFilter]=useState<LanguageFilter>("All");
 const [query,setQuery]=useState("");
 const [view,setView]=useState<"list"|"grid">("list");
 const [visibleCount,setVisibleCount]=useState(8);
 const [selectedRepo,setSelectedRepo]=useState<DecoratedRepo|null>(null);
 const [loading,setLoading]=useState(initialRepos.length===0);
 const [booting,setBooting]=useState(true);
 const [loadError,setLoadError]=useState(false);
 const [errorMessage,setErrorMessage]=useState("");
 const [activeChapter,setActiveChapter]=useState("chapter-profile");
 const {scrollYProgress}=useScroll();
 const scrollProgress=useSpring(scrollYProgress,{stiffness:110,damping:28,restDelta:.001});
 const loadRepositories=useCallback(async()=>{
  setLoading(true);setLoadError(false);setErrorMessage("");
  try{const data=await fetchAllRepositories();setRepos(decorateRepositories(data))}
  catch(error){setLoadError(true);setErrorMessage(error instanceof Error?error.message:"Could not load GitHub repositories.")}
  finally{setLoading(false)}
 },[]);
 useEffect(()=>{if(initialRepos.length>0)return;void loadRepositories()},[initialRepos.length,loadRepositories]);
 useEffect(()=>{const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;const timer=window.setTimeout(()=>setBooting(false),reduced?120:1150);return()=>window.clearTimeout(timer)},[]);
 useEffect(()=>{
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActiveChapter(e.target.id)}),{rootMargin:"-25% 0px -60% 0px"});
  chapters.forEach(c=>{const el=document.getElementById(c.id);if(el)obs.observe(el)});
  return()=>obs.disconnect();
 },[]);
 useEffect(()=>{
  const targets=document.querySelectorAll<HTMLElement>(".chapter-block,.career-entry,.achievement-row>div,.loadout-card,.education-mission,.world-footer");
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced){targets.forEach(el=>el.classList.add("scene-visible"));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   entry.target.classList.toggle("scene-visible",entry.isIntersecting);
  }),{threshold:0,rootMargin:"-12% 0px -18% 0px"});
  targets.forEach(el=>{el.classList.add("scene-reveal");observer.observe(el)});
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  function keys(e:KeyboardEvent){const t=e.target as HTMLElement|null;const typing=t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable);if(e.key==="/"&&!typing&&!selectedRepo){e.preventDefault();document.getElementById("repo-search")?.focus()}if(e.key==="Escape"&&document.activeElement?.id==="repo-search"){setQuery("");(document.activeElement as HTMLElement).blur()}}
  window.addEventListener("keydown",keys);return()=>window.removeEventListener("keydown",keys)
 },[selectedRepo]);
 const filteredRepos=useMemo(()=>{const q=query.trim().toLowerCase();return repos.filter(r=>(languageFilter==="All"||r.languageGroup===languageFilter)&&(!q||[r.name,r.description||"",r.language||"",...(r.topics||[])].join(" ").toLowerCase().includes(q))).sort((a,b)=>{if(a.isFeatured!==b.isFeatured)return a.isFeatured?-1:1;return Date.parse(b.pushed_at)-Date.parse(a.pushed_at)})},[repos,languageFilter,query]);
 const shownRepos=filteredRepos.slice(0,visibleCount);
 const jump=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
 return <div className="app-shell vice-shell">
  <AnimatePresence>
   {booting&&<motion.div className="boot-loader" role="status" aria-label="Loading portfolio" initial={{opacity:1}} exit={{opacity:0,filter:"blur(8px)"}} transition={{duration:.42,ease:"easeOut"}}>
    <motion.div className="boot-loader-inner" initial={{y:14,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.55,ease:[.2,.7,.2,1]}}>
     <motion.div className="boot-loader-mark" animate={{y:[0,-5,0],rotate:[-3,3,-3]}} transition={{duration:1.5,repeat:Infinity,ease:"easeInOut"}}>KP</motion.div>
     <div className="boot-loader-title">Entering Vice Coast</div>
     <div className="boot-loader-sub">INITIALIZING PORTFOLIO · AI / ML ENGINEER</div>
     <div className="boot-loader-track"><i/></div>
    </motion.div>
   </motion.div>}
  </AnimatePresence>
  <motion.div className="scroll-progress" style={{scaleX:scrollProgress}}/>
  <GameWorld/>
  <div className="world-nav">
   <div className="world-nav-inner"><span className="world-location"><MapPin size={13}/> VICE COAST · SAN ANDREAS</span><nav>{chapters.map(c=><button key={c.id} className={activeChapter===c.id?"active":""} onClick={()=>jump(c.id)}><small>{c.no}</small>{c.name}</button>)}</nav><a href="mailto:kiruba11geo@gmail.com">CONTACT <ArrowUpRight size={13}/></a></div>
  </div>
  <main className="story-main">
   <section id="chapter-profile" className="chapter-block player-chapter">
    <div className="chapter-title-row"><div><span className="chapter-kicker">01 / CHARACTER SELECT</span><h2>Meet the <em>player.</em></h2></div><span className="chapter-side-note">PLAYER PROFILE <b>001</b></span></div>
    <div className="player-card">
     <div className="player-art"><div className="player-sun"/><div className="player-palm palm-a"/><div className="player-palm palm-b"/><div className="player-cityline"><i/><i/><i/><i/><i/><i/></div><div className="player-portrait-frame"><img className="player-portrait" src="/kiruba-profile.jpg" alt="Portrait of Kirubakaran Periyasamy" loading="eager"/><span>PLAYER 001 · KIRUBA</span></div><span className="player-art-caption">THE BUILDER · EST. 2024</span></div>
     <div className="player-details"><div className="player-label"><span>PLAYER NAME</span><b>ACTIVE</b></div><h3>KIRUBAKARAN<br/><em>PERIYASAMY</em></h3><p className="player-role">AI / ML ENGINEER <span>·</span> BENGALURU, INDIA</p><p className="player-bio">I build intelligent systems that move beyond demos — from computer vision and deep learning to LLM-powered applications and production AI pipelines.</p><div className="player-stats"><div><small>EXPERIENCE</small><strong>1.5+ <i>YRS</i></strong></div><div><small>PRIMARY CLASS</small><strong>AI <i>ENGINEER</i></strong></div><div><small>BASE</small><strong>IND <i>/ IN</i></strong></div></div><div className="player-links"><a href="https://www.linkedin.com/in/kirubakaranperiyasamy/" target="_blank" rel="noreferrer"><Linkedin size={14}/> LINKEDIN</a><a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer"><Github size={14}/> GITHUB</a><a href="mailto:kiruba11geo@gmail.com"><Mail size={14}/> EMAIL</a></div></div>
    </div>
    <div className="achievement-row"><div><Trophy/><span><b>3</b> GENAI TOOLS SHIPPED</span></div><div><ShieldCheck/><span><b>~40%</b> LESS MANUAL WORK</span></div><div><Database/><span><b>10+</b> SOURCES & APIS</span></div><div><Cpu/><span><b>35%</b> SFT QUALITY LIFT</span></div></div>
   </section>
   <section id="chapter-loadout" className="chapter-block loadout-chapter">
    <div className="chapter-title-row"><div><span className="chapter-kicker">02 / WEAPON WHEEL</span><h2>Choose your <em>loadout.</em></h2></div><span className="chapter-side-note">SKILL INVENTORY <b>10+</b></span></div>
    <div className="loadout-grid">
     <article className="loadout-card loadout-ai"><div className="loadout-icon"><Cpu/></div><span className="loadout-level">LVL 08 · CORE CLASS</span><h3>Machine learning</h3><p>Training, evaluation and deep neural networks.</p><div className="loadout-skills">{["Python","PyTorch","TensorFlow","Keras","Scikit-learn","NumPy","Pandas"].map(x=><span key={x}>{x}</span>)}</div><div className="loadout-meter"><i style={{width:"92%"}}/></div></article>
     <article className="loadout-card loadout-vision"><div className="loadout-icon"><Eye/></div><span className="loadout-level">LVL 07 · SPECIALIST</span><h3>Vision & language</h3><p>Perception systems, detection, tracking and NLP.</p><div className="loadout-skills">{["OpenCV","YOLO","CNNs","Segmentation","ByteTrack","Transformers","BERT","Hugging Face"].map(x=><span key={x}>{x}</span>)}</div><div className="loadout-meter"><i style={{width:"86%"}}/></div></article>
     <article className="loadout-card loadout-genai"><div className="loadout-icon"><Terminal/></div><span className="loadout-level">LVL 09 · ADVANCED</span><h3>GenAI engineering</h3><p>LLM orchestration, retrieval, fine-tuning and APIs.</p><div className="loadout-skills">{["LLMs","RAG","LangChain","LangGraph","LoRA / QLoRA","FastAPI","Django REST","Docker","AWS","W&B"].map(x=><span key={x}>{x}</span>)}</div><div className="loadout-meter"><i style={{width:"89%"}}/></div></article>
    </div>
   </section>
   <section id="chapter-projects" className="chapter-block missions-chapter">
    <div className="chapter-title-row"><div><span className="chapter-kicker">03 / SELECTED PROJECTS</span><h2>Choose a <em>mission.</em></h2></div><span className="chapter-side-note">3 FEATURED FILES <b>● ● ●</b></span></div>
    <div className="missions-grid">
     <MissionCard number="01" tag="COMPUTER VISION / INSPECTION" title="ParcelGuard" desc="A visual inspection system combining object detection, segmentation, tracking and reference-guided anomaly analysis to identify parcel damage." tech="YOLO · MASK R-CNN / U-NET · BYTETRACK · PYTORCH" type="parcel" href="https://github.com/kiruba11k" image="https://blog.fontpackaging.com/hubfs/magnific_a-battered-corrugated-car_2960550790.png" alt="Damaged corrugated parcel on an industrial conveyor belt"/>
     <MissionCard number="02" tag="REAL-TIME VIDEO ANALYTICS" title="Smart Traffic Intelligence" desc="Detect and track cars, motorcycles, buses and trucks with persistent identities, virtual-line counting and live traffic analytics." tech="YOLO · OPENCV · BYTETRACK" type="traffic" href="https://github.com/kiruba11k" image="https://images.unsplash.com/photo-1714238080829-986d493e0e55?auto=format&fit=crop&w=1400&q=85" alt="Nighttime multi-lane urban highway with cars and trucks"/>
     <MissionCard number="03" tag="LLM FINE-TUNING / NLP" title="Mistral-7B · LoRA / QLoRA" desc="Fine-tuned a 7B language model on 5K domain pairs using PEFT, tracked experiments and published the model to Hugging Face Hub." tech="MISTRAL-7B · PEFT · W&B · HUGGING FACE" type="llm" href="https://github.com/kiruba11k" image="https://cdn.gccgamers.com/media/posts/ai-pc-featured.webp" alt="High-performance AI workstation with GPU hardware and training monitor"/>
    </div>
   </section>
   <section id="chapter-career" className="chapter-block career-chapter">
    <div className="chapter-title-row"><div><span className="chapter-kicker">04 / EXPERIENCE</span><h2>Where I have <em>built.</em></h2></div><span className="chapter-side-note">CAREER LOG <b>02</b></span></div>
    <div className="career-timeline">
     <article className="career-entry"><div className="career-date">APR 2025 — PRESENT <i>MISSION ACTIVE</i></div><div className="career-marker"><BriefcaseBusiness/></div><div className="career-copy"><span>MAIN STORY · BENGALURU</span><h3>AI / ML Engineer <em>@ LeadStrategus</em></h3><p>Built and deployed GenAI automation tools, data-ingestion pipelines and fine-tuned language models. Developed and evaluated ML/DL models using PyTorch, TensorFlow and scikit-learn.</p><div className="career-tags">GENAI · ML/DL · DATA PIPELINES · LLMs</div></div></article>
     <article className="career-entry"><div className="career-date">AUG 2024 — SEP 2024 <i>COMPLETED</i></div><div className="career-marker"><Code2/></div><div className="career-copy"><span>EARLY ACCESS · INTERNSHIP</span><h3>Django Developer Intern <em>@ Tecosys</em></h3><p>Contributed to Cerina GPT and designed 8+ Django REST APIs to connect AI inference endpoints with real-time application workflows.</p><div className="career-tags">PYTHON · DJANGO REST · API ENGINEERING</div></div></article>
    </div>
    <div className="education-inline"><div className="education-inline-icon"><GraduationCap/></div><div><span>EDUCATION · 2020—2024</span><h3>B.E. Computer Science & Engineering</h3><p>Sree Sakthi Engineering College · Coimbatore</p></div><b>COMPLETED</b></div>
   </section>
   <section id="chapter-archive" className="chapter-block archive-chapter">
    <div className="chapter-title-row"><div><span className="chapter-kicker">06 / THE GARAGE</span><h2>Built, tested, <em>stored.</em></h2></div><span className="chapter-side-note">LIVE GITHUB FEED <b>{repos.length}</b></span></div>
    <div className="archive-topline"><p>Explore the code, experiments and side quests behind the missions.</p><a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer">OPEN GITHUB PROFILE <ArrowUpRight size={14}/></a></div>
    <div className="archive-tools"><div className="search-wrap"><Search size={17}/><input id="repo-search" type="search" value={query} onChange={e=>{setQuery(e.target.value);setVisibleCount(8)}} placeholder={"Search "+repos.length+" repositories..."}/>{query&&<button onClick={()=>setQuery("")}>×</button>}<kbd>/</kbd></div><div className="directory-actions"><button className={view==="list"?"selected":""} onClick={()=>setView("list")} aria-label="List view"><List size={15}/></button><button className={view==="grid"?"selected":""} onClick={()=>setView("grid")} aria-label="Grid view"><LayoutGrid size={15}/></button></div></div>
    <div className="language-tabs">{languageTabs.map(tab=><button key={tab} className={languageFilter===tab?"tab active":"tab"} onClick={()=>{setLanguageFilter(tab);setVisibleCount(8)}}>{tab}</button>)}</div>
    <div className="results-line"><span>{filteredRepos.length} repositories</span><span className="mono">PUBLIC REPOSITORY INDEX</span></div>
    {loadError&&<div className="error-panel"><span>{errorMessage||"Could not reach GitHub."}</span><button onClick={()=>void loadRepositories()}><RefreshCw size={13}/> Retry</button></div>}
    {loading&&<div className="loading-state"><span className="loading-spinner"/> Fetching live repository data...</div>}
    {!loading&&!loadError&&filteredRepos.length===0&&<div className="empty-state"><FolderGit2 size={25}/><strong>No repositories found</strong><span>Try another keyword or language.</span></div>}
    <div className={view==="list"?"repo-list":"repo-grid"}><AnimatePresence mode="popLayout">{shownRepos.map((repo,index)=><motion.button layout key={repo.id} className={view==="list"?"repo-row":"repo-card"} onClick={()=>setSelectedRepo(repo)} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:false,amount:.12}} whileHover={{y:-3,scale:view==="grid"?1.015:1.005}} whileTap={{scale:.995}} exit={{opacity:0,y:-8}} transition={{duration:.22,delay:index<12?index*.018:0}}><div className="repo-main"><div className="repo-title-line"><strong>{displayName(repo.name)}</strong>{repo.isFeatured&&<span className="featured-badge"><Star size={10} fill="currentColor"/> Featured</span>}<ArrowUpRight size={13}/></div><p>{repo.description||repo.featuredNote||repo.fallbackDescription}</p>{view==="grid"&&(repo.topics||[]).length>0&&<div className="repo-topics">{(repo.topics||[]).slice(0,3).map(topic=><span key={topic}>{topic}</span>)}</div>}</div><div className="repo-meta">{repo.language&&<span className="language-pill"><i/>{repo.language}</span>}{repo.stargazers_count>0&&<span><Star size={12}/>{repo.stargazers_count}</span>}{repo.forks_count>0&&<span><GitFork size={12}/>{repo.forks_count}</span>}<span className="repo-date"><CalendarDays size={12}/>{shortDate(repo.updated_at)}</span></div></motion.button>)}</AnimatePresence></div>
    {filteredRepos.length>visibleCount&&<button className="load-more" onClick={()=>setVisibleCount(n=>n+8)}>LOAD MORE FILES <ChevronDown size={14}/><span>{Math.min(visibleCount,filteredRepos.length)} / {filteredRepos.length}</span></button>}
    <div className="directory-foot mono"><span>SHOWING {shownRepos.length} OF {filteredRepos.length}</span><span>DATA VIA GITHUB REST API</span></div>
   </section>
   <footer className="world-footer"><div><span>END OF CURRENT SAVE</span><h2>More worlds<br/><em>to build.</em></h2></div><div className="world-footer-actions"><a href="mailto:kiruba11geo@gmail.com"><Mail size={15}/> START A CONVERSATION</a><a href="https://www.linkedin.com/in/kirubakaranperiyasamy/" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={13}/></a><a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={13}/></a></div><small>© {new Date().getFullYear()} KIRUBAKARAN PERIYASAMY · BUILT TO EXPLORE</small></footer>
  </main>
  <div className="floating-chapter"><span>NOW PLAYING</span><b>{chapters.find(c=>c.id===activeChapter)?.name||"OPEN WORLD"}</b><i/></div>
  <RepoModal repo={selectedRepo} onClose={()=>setSelectedRepo(null)}/>
 </div>;
}
