"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Search, List, LayoutGrid, Star, GitFork, CalendarDays, ArrowUpRight, RefreshCw, Github, Linkedin, Mail, ChevronDown, Code2, FolderGit2 } from "lucide-react";
import HeaderCarousel from "@/components/HeaderCarousel";
import SidebarFilters from "@/components/SidebarFilters";
import RepoModal from "@/components/RepoModal";
import SurprisePill from "@/components/SurprisePill";
import ScrollStory from "@/components/ScrollStory";
import { decorateRepositories, fetchAllRepositories } from "@/lib/github";
import type { DecoratedRepo, LanguageFilter, SidebarFilter } from "@/lib/types";

const languageTabs: LanguageFilter[] = ["All", "Python", "Java", "Notebooks", "Web / JS", "Other"];

function displayName(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function shortDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RepoDirectory({ initialRepos }: { initialRepos: DecoratedRepo[] }) {
  const [repos, setRepos] = useState<DecoratedRepo[]>(initialRepos);
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>("all");
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedRepo, setSelectedRepo] = useState<DecoratedRepo | null>(null);
  const [loading, setLoading] = useState(initialRepos.length === 0);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });

  const loadRepositories = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    setErrorMessage("");
    try {
      const data = await fetchAllRepositories();
      setRepos(decorateRepositories(data));
    } catch (error) {
      setLoadError(true);
      setErrorMessage(error instanceof Error ? error.message : "Could not load GitHub repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialRepos.length > 0) return;
    void loadRepositories();
  }, [initialRepos.length, loadRepositories]);

  useEffect(() => {
    function shortcuts(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing && !selectedRepo) {
        event.preventDefault();
        document.getElementById("repo-search")?.focus();
      }
      if (event.key === "Escape") {
        if (document.activeElement?.id === "repo-search") {
          setQuery("");
          (document.activeElement as HTMLElement).blur();
        }
      }
    }
    window.addEventListener("keydown", shortcuts);
    return () => window.removeEventListener("keydown", shortcuts);
  }, [selectedRepo]);

  const counts = useMemo(() => {
    const result: Record<SidebarFilter, number> = { all: repos.length, featured: 0, "agentic-rag": 0, "computer-vision": 0, "python-ai": 0, "java-fullstack": 0, "data-science": 0 };
    repos.forEach((repo) => {
      if (repo.isFeatured) result.featured += 1;
      repo.categories.forEach((category) => { result[category] += 1; });
    });
    return result;
  }, [repos]);

  const filteredRepos = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return repos.filter((repo) => {
      const matchesSidebar = activeFilter === "all" || (activeFilter === "featured" ? repo.isFeatured : repo.categories.includes(activeFilter));
      const matchesLanguage = languageFilter === "All" || repo.languageGroup === languageFilter;
      const haystack = [repo.name, repo.description || "", repo.language || "", ...(repo.topics || [])].join(" ").toLowerCase();
      return matchesSidebar && matchesLanguage && (!normalized || haystack.includes(normalized));
    }).sort((a, b) => {
      if (activeFilter === "all" || activeFilter === "featured") {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      }
      return Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
    });
  }, [repos, activeFilter, languageFilter, query]);

  const openSurprise = useCallback(() => {
    if (!filteredRepos.length) return;
    const current = filteredRepos[Math.floor(Math.random() * filteredRepos.length)];
    setSelectedRepo(current);
  }, [filteredRepos]);

  const shownRepos = filteredRepos.slice(0, visibleCount);

  return (
    <div className="app-shell">
      <motion.div className="scroll-progress" style={{ scaleX: scrollProgress }} />
      <HeaderCarousel />
      <div className="directory-layout">
        <SidebarFilters active={activeFilter} counts={counts} onChange={(filter) => { setActiveFilter(filter); setVisibleCount(24); }} />
        <main className="main-column">
          <motion.div className="intro-block reveal-section" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="eyebrow mono"><span className="eyebrow-dot" /> AI / ML ENGINEER / BENGALURU, INDIA</div>
            <h1>Hey, I’m <span>Kirubakaran.</span></h1>
            <p>AI/ML Engineer with 1.5+ years of experience building machine learning solutions, deep learning applications, Generative AI pipelines and LLM-powered systems. I work across computer vision, NLP, model fine-tuning and production APIs with FastAPI and Django REST Framework. <strong>{repos.length ? repos.length + " public repositories" : "AI systems built for real workflows"}.</strong></p>
            <div className="intro-links">
              <a className="connect-pill" href="mailto:kiruba11geo@gmail.com"><Mail size={13} /> let’s connect <ArrowUpRight size={12} /></a>
              <a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
              <a href="https://www.linkedin.com/in/kirubakaranperiyasamy/" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>
            </div>
          </motion.div>

          <motion.section className="focus-slot reveal-section" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -3 }}>
            <div className="focus-label"><span>CURRENT ROLE</span><span className="experience-pill">1.5+ YEARS EXPERIENCE</span></div>
            <div className="focus-row">
              <div className="focus-symbol"><Code2 size={18} /></div>
              <div className="focus-copy"><strong>AI / ML Engineer · LeadStrategus</strong><span>April 2025 — Present · Bengaluru, India</span></div>
              <a href="https://www.linkedin.com/in/kirubakaranperiyasamy/" target="_blank" rel="noreferrer" aria-label="View LinkedIn profile"><ArrowUpRight size={16} className="focus-arrow" /></a>
            </div>
          </motion.section>

          <motion.section className="profile-section reveal-section" initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="profile-section-head"><span className="section-overline mono">PROFILE / 02</span><h2>Building AI that moves beyond the demo.</h2></div>
            <div className="impact-grid">
              <div className="impact-card"><strong>3</strong><span>Generative AI automation tools shipped</span></div>
              <div className="impact-card"><strong>~40%</strong><span>Less manual processing across workflows</span></div>
              <div className="impact-card"><strong>10+</strong><span>Web sources and APIs integrated</span></div>
              <div className="impact-card"><strong>35%</strong><span>Output-quality improvement after SFT</span></div>
            </div>
            <div className="profile-section-head skills-head"><span className="section-overline mono">TECH STACK / 03</span><h2>Tools I work with</h2></div>
            <div className="skill-groups">
              <div className="skill-group"><strong>ML &amp; Deep Learning</strong><div className="skill-tags"><span>Python</span><span>PyTorch</span><span>TensorFlow</span><span>Keras</span><span>Scikit-learn</span><span>NumPy</span><span>Pandas</span></div></div>
              <div className="skill-group"><strong>Computer Vision &amp; NLP</strong><div className="skill-tags"><span>OpenCV</span><span>YOLO</span><span>CNNs</span><span>Segmentation</span><span>ByteTrack</span><span>Transformers</span><span>BERT</span><span>Hugging Face</span></div></div>
              <div className="skill-group"><strong>GenAI &amp; Engineering</strong><div className="skill-tags"><span>LLMs</span><span>RAG</span><span>LangChain</span><span>LangGraph</span><span>LoRA / QLoRA</span><span>FastAPI</span><span>Django REST</span><span>Docker</span><span>AWS</span><span>Weights &amp; Biases</span></div></div>
            </div>
          </motion.section>

          <motion.section className="experience-section reveal-section" initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="profile-section-head"><span className="section-overline mono">EXPERIENCE / 04</span><h2>Where I’ve contributed</h2></div>
            <div className="experience-list">
              <article className="experience-item"><div className="experience-date mono">APR 2025 — PRESENT</div><div><h3>AI / ML Engineer <span>· LeadStrategus</span></h3><p>Built and deployed GenAI automation tools, data-ingestion pipelines and fine-tuned language models. Developed and evaluated ML/DL models using PyTorch, TensorFlow and scikit-learn.</p></div></article>
              <article className="experience-item"><div className="experience-date mono">AUG 2024 — SEP 2024</div><div><h3>Django Developer Intern <span>· Tecosys</span></h3><p>Contributed to Cerina GPT and designed 8+ Django REST APIs to connect AI inference endpoints with real-time application workflows.</p></div></article>
            </div>
          </motion.section>

          <ScrollStory />

          <motion.section className="work-section reveal-section" initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="profile-section-head"><span className="section-overline mono">SELECTED WORK / 05</span><h2>Projects worth exploring</h2></div>
            <div className="work-grid">
              <motion.article className="work-card" whileHover={{ y: -7, rotateX: 1.5, rotateY: -1.5, scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}><span className="work-index mono">01 / COMPUTER VISION</span><h3>ParcelGuard</h3><p>Visual inspection pipeline combining YOLO detection, Mask R-CNN / U-Net segmentation, ByteTrack and reference-guided anomaly analysis.</p><div className="work-tags">PyTorch · OpenCV · ResNet18 · FastAPI</div></motion.article>
              <article className="work-card"><span className="work-index mono">02 / VIDEO ANALYTICS</span><h3>Smart Traffic Intelligence</h3><p>Vehicle detection and tracking for cars, motorcycles, buses and trucks, with persistent IDs, virtual-line counting and real-time analytics.</p><div className="work-tags">YOLO · OpenCV · ByteTrack</div></article>
              <article className="work-card"><span className="work-index mono">03 / LLM FINE-TUNING</span><h3>Mistral-7B · LoRA / QLoRA</h3><p>Fine-tuned a 7B model on 5K domain pairs with PEFT, tracked experiments in Weights &amp; Biases and published the model to Hugging Face Hub.</p><div className="work-tags">Mistral-7B · PEFT · Hugging Face</div></article>
            </div>
          </motion.section>

          <motion.section className="education-section reveal-section" initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="profile-section-head"><span className="section-overline mono">EDUCATION / 06</span><h2>Foundation</h2></div>
            <div className="education-card"><div><h3>B.E. Computer Science &amp; Engineering</h3><p>Sree Sakthi Engineering College · Coimbatore</p></div><span className="education-date mono">AUG 2020 — MAY 2024</span></div>
            <p className="education-note">Relevant coursework: Machine Learning, Neural Networks, Data Structures &amp; Algorithms, Computer Vision.</p>
          </motion.section>

          <motion.section className="directory-section reveal-section" initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="directory-heading">
              <div><div className="section-overline mono">THE INDEX / 01</div><h2>Repository directory<span className="count-chip mono">{repos.length}</span></h2></div>
              <div className="directory-actions"><span className="sync-status"><i /> LIVE INDEX</span><button className={"view-toggle " + (view === "list" ? "selected" : "")} onClick={() => setView("list")} aria-label="List view"><List size={15} /></button><button className={"view-toggle " + (view === "grid" ? "selected" : "")} onClick={() => setView("grid")} aria-label="Grid view"><LayoutGrid size={15} /></button></div>
            </div>
            <div className="search-wrap">
              <Search size={17} className="search-icon" />
              <input id="repo-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(24); }} placeholder={"Search all " + repos.length + " repositories…"} aria-label="Search repositories" />
              {query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
              <kbd>/</kbd>
            </div>
            <div className="language-tabs" role="tablist" aria-label="Filter by language">
              {languageTabs.map((tab) => (
                <button key={tab} role="tab" aria-selected={languageFilter === tab} className={languageFilter === tab ? "tab active" : "tab"} onClick={() => { setLanguageFilter(tab); setVisibleCount(24); }}>
                  {tab}{languageFilter === tab && <motion.span className="tab-underline" layoutId="language-underline" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                </button>
              ))}
            </div>

            <div className="results-line"><span>{filteredRepos.length} repositories</span><span className="mono">{activeFilter === "all" ? "ALL PROJECTS" : activeFilter.toUpperCase().replace("-", " ")}</span></div>
            {loadError && <div className="error-panel"><span>{errorMessage || "Couldn’t reach GitHub just now."}</span><button onClick={() => void loadRepositories()}><RefreshCw size={13} /> Retry</button></div>}
            {loading && <div className="loading-state"><span className="loading-spinner" /> Fetching repositories from GitHub…</div>}
            {!loading && !loadError && filteredRepos.length === 0 && <div className="empty-state"><FolderGit2 size={25} /><strong>No repositories found</strong><span>Try another keyword or category.</span></div>}
            <div className={view === "list" ? "repo-list" : "repo-grid"}>
              <AnimatePresence mode="popLayout">
                {shownRepos.map((repo, index) => (
                  <motion.button
                    layout
                    key={repo.id}
                    className={view === "list" ? "repo-row" : "repo-card"}
                    onClick={() => setSelectedRepo(repo)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    whileHover={{ y: -3, scale: view === "grid" ? 1.015 : 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, delay: index < 12 ? index * 0.018 : 0 }}
                  >
                    <div className="repo-main">
                      <div className="repo-title-line"><strong>{displayName(repo.name)}</strong>{repo.isFeatured && <span className="featured-badge"><Star size={10} fill="currentColor" /> Featured</span>}<ArrowUpRight size={13} className="repo-open-icon" /></div>
                      <p>{repo.description || repo.featuredNote || repo.fallbackDescription}</p>
                      {view === "grid" && (repo.topics || []).length > 0 && <div className="repo-topics">{(repo.topics || []).slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>}
                    </div>
                    <div className="repo-meta">
                      {repo.language && <span className="language-pill"><i />{repo.language}</span>}
                      {repo.stargazers_count > 0 && <span><Star size={12} />{repo.stargazers_count}</span>}
                      {repo.forks_count > 0 && <span><GitFork size={12} />{repo.forks_count}</span>}
                      <span className="repo-date"><CalendarDays size={12} />{shortDate(repo.updated_at)}</span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            {filteredRepos.length > visibleCount && <button className="load-more" onClick={() => setVisibleCount((count) => count + 24)}>Load more repositories <ChevronDown size={14} /><span className="mono">{Math.min(visibleCount, filteredRepos.length)} / {filteredRepos.length}</span></button>}
            <div className="directory-foot mono"><span>SHOWING {shownRepos.length} OF {filteredRepos.length}</span><span>DATA VIA GITHUB REST API</span></div>
          </motion.section>
          <motion.footer className="main-footer reveal-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}><span>© {new Date().getFullYear()} KIRUBAKARAN PERIYASAMY</span><span>BUILT AROUND THE WORK, NOT THE HYPE.</span></motion.footer>
        </main>
      </div>
      <SurprisePill disabled={filteredRepos.length === 0} onClick={openSurprise} />
      <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </div>
  );
}
