"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Copy, Check, Star, GitFork, CalendarDays, Code2, Terminal } from "lucide-react";
import type { DecoratedRepo } from "@/lib/types";

export default function RepoModal({ repo, onClose }: { repo: DecoratedRepo | null; onClose: () => void }) {
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!repo) return;
    let cancelled = false;
    setLanguages({});
    setLoadingLanguages(true);
    fetch("/api/repos/" + encodeURIComponent(repo.name) + "/languages")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load languages");
        return response.json();
      })
      .then((data: Record<string, number>) => { if (!cancelled) setLanguages(data); })
      .catch(() => { if (!cancelled) setLanguages({}); })
      .finally(() => { if (!cancelled) setLoadingLanguages(false); });
    return () => { cancelled = true; };
  }, [repo]);

  useEffect(() => {
    if (!repo) return;
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [repo, onClose]);

  async function copyClone() {
    if (!repo) return;
    try {
      await navigator.clipboard.writeText("git clone " + repo.clone_url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const languageEntries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const totalBytes = languageEntries.reduce((sum, entry) => sum + entry[1], 0);

  return (
    <AnimatePresence>
      {repo && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
          <motion.section className="repo-modal" role="dialog" aria-modal="true" aria-labelledby="repo-modal-title" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
            <div className="modal-topline"><span className="mono">REPOSITORY / DETAILS</span><button className="icon-button" onClick={onClose} aria-label="Close details"><X size={17} /></button></div>
            <div className="modal-title-row">
              <div><div className="repo-owner mono">KIRUBA11K / PUBLIC</div><h2 id="repo-modal-title">{repo.name}</h2></div>
              {repo.isFeatured && <span className="featured-badge"><Star size={11} fill="currentColor" /> Featured</span>}
            </div>
            <p className="modal-description">{repo.description || repo.featuredNote || repo.fallbackDescription}</p>
            <div className="modal-stats">
              <span><Code2 size={14} /> {repo.language || "Not specified"}</span>
              <span><Star size={14} /> {repo.stargazers_count} stars</span>
              <span><GitFork size={14} /> {repo.forks_count} forks</span>
              <span><CalendarDays size={14} /> Updated {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="modal-section">
              <div className="modal-section-head"><span>LANGUAGE BREAKDOWN</span><span className="mono">{loadingLanguages ? "LOADING…" : languageEntries.length ? languageEntries.length + " LANGUAGES" : "—"}</span></div>
              {languageEntries.length > 0 ? (
                <>
                  <div className="language-bar">{languageEntries.map(([language, bytes]) => <span key={language} title={language} style={{ width: (bytes / totalBytes * 100) + "%" }} />)}</div>
                  <div className="language-legend">{languageEntries.map(([language, bytes]) => <span key={language}><i />{language}<b className="mono">{Math.round(bytes / totalBytes * 100)}%</b></span>)}</div>
                </>
              ) : <p className="modal-muted">{loadingLanguages ? "Fetching language statistics from GitHub…" : "Language statistics are not available for this repository."}</p>}
            </div>
            <div className="modal-section">
              <div className="modal-section-head"><span>TOPICS</span><span className="mono">{(repo.topics || []).length} TAGS</span></div>
              <div className="topic-list">{(repo.topics || []).length ? repo.topics?.map((topic) => <span key={topic}>{topic}</span>) : <span className="modal-muted">No topics added on GitHub yet.</span>}</div>
            </div>
            <div className="clone-box"><div><Terminal size={14} /><code>git clone {repo.clone_url}</code></div><button onClick={copyClone} aria-label="Copy clone command">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}</button></div>
            <div className="modal-actions"><a className="modal-primary" href={repo.html_url} target="_blank" rel="noreferrer">Open on GitHub <ExternalLink size={14} /></a><button className="modal-secondary" onClick={onClose}>Close</button></div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
