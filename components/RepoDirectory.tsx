"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, List, LayoutGrid, Star, GitFork, CalendarDays, ArrowUpRight, RefreshCw, Github, Linkedin, Mail, ChevronDown, Code2, FolderGit2 } from "lucide-react";
import HeaderCarousel from "@/components/HeaderCarousel";
import SidebarFilters from "@/components/SidebarFilters";
import RepoModal from "@/components/RepoModal";
import SurprisePill from "@/components/SurprisePill";
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

  useEffect(() => {
    if (initialRepos.length > 0) return;
    let cancelled = false;
    fetch("/api/repos")
      .then((response) => { if (!response.ok) throw new Error("GitHub is temporarily unavailable"); return response.json(); })
      .then((data: DecoratedRepo[]) => { if (!cancelled) { setRepos(data); setLoadError(false); } })
      .catch(() => { if (!cancelled) setLoadError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [initialRepos.length]);

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
      <HeaderCarousel />
      <div className="directory-layout">
        <SidebarFilters active={activeFilter} counts={counts} onChange={(filter) => { setActiveFilter(filter); setVisibleCount(24); }} />
        <main className="main-column">
          <div className="intro-block">
            <div className="eyebrow mono"><span className="eyebrow-dot" /> INDEPENDENT BUILDER / COIMBATORE, INDIA</div>
            <h1>Hey, I’m <span>Kirubakaran.</span></h1>
            <p>AI/ML Engineer &amp; Full-Stack Builder based in Coimbatore, India — working across agentic AI, LLM systems, computer vision, Python, and Java. <strong>{repos.length || "130+"} public repositories</strong> and counting.</p>
            <div className="intro-links">
              <a className="connect-pill" href="mailto:kiruba11geo@gmail.com"><Mail size={13} /> let’s connect <ArrowUpRight size={12} /></a>
              <a href="https://github.com/kiruba11k" target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
              <a href="https://www.linkedin.com/in/kirubakaranperiyasamy/" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>
            </div>
          </div>

          <section className="focus-slot">
            <div className="focus-label"><span>FOCUS AREAS</span><span className="experience-pill">1.5+ YRS EXP</span></div>
            <a className="focus-row" href="https://github.com/kiruba11k?tab=repositories" target="_blank" rel="noreferrer">
              <div className="focus-symbol"><Code2 size={18} /></div>
              <div className="focus-copy"><strong>AI &amp; Software Engineering</strong><span>Python · Java · LangGraph · PyTorch · FastAPI · Docker</span></div>
              <ArrowUpRight size={16} className="focus-arrow" />
            </a>
          </section>

          <section className="directory-section">
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
            {loadError && <div className="error-panel"><span>Couldn’t reach GitHub just now.</span><button onClick={() => { setLoading(true); setLoadError(false); fetch("/api/repos").then((r) => r.json()).then((data: DecoratedRepo[]) => setRepos(data)).catch(() => setLoadError(true)).finally(() => setLoading(false)); }}><RefreshCw size={13} /> Retry</button></div>}
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
                    animate={{ opacity: 1, y: 0 }}
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
          </section>
          <footer className="main-footer"><span>© {new Date().getFullYear()} KIRUBAKARAN PERIYASAMY</span><span>BUILT AROUND THE WORK, NOT THE HYPE.</span></footer>
        </main>
      </div>
      <SurprisePill disabled={filteredRepos.length === 0} onClick={openSurprise} />
      <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </div>
  );
}
