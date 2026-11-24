"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ExternalLink, Copy, Check, Star, GitFork, CalendarDays, Code2 } from "lucide-react";
import { fetchRepositoryLanguages } from "@/lib/github";
import type { DecoratedRepo } from "@/lib/types";

export default function RepoDialog({ repo, onClose }: { repo: DecoratedRepo | null; onClose: () => void }) {
  const [languages, setLanguages] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!repo) return;
    let cancelled = false;
    setLanguages([]); setLoading(true);
    fetchRepositoryLanguages(repo.name)
      .then(d => { if (!cancelled) setLanguages(Object.entries(d).sort((a, b) => b[1] - a[1])); })
      .catch(() => { if (!cancelled) setLanguages([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [repo]);

  const total = languages.reduce((s, [, b]) => s + b, 0);
  async function copy() {
    if (!repo) return;
    try { await navigator.clipboard.writeText("git clone " + repo.clone_url); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  }

  return <Dialog.Root open={!!repo} onOpenChange={o => { if (!o) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="dlg-overlay" />
      <Dialog.Content className="dlg">
        {repo && <>
          <div className="dlg-top">
            <span className="mono-label">VEHICLE FILE · KIRUBA11K / {repo.name.toUpperCase()}</span>
            <Dialog.Close className="icon-btn" aria-label="Close"><X size={16} /></Dialog.Close>
          </div>
          <Dialog.Title className="dlg-title">{repo.name.replace(/[-_]+/g, " ")}</Dialog.Title>
          <Dialog.Description className="dlg-desc">{repo.description || repo.featuredNote || repo.fallbackDescription}</Dialog.Description>
          <dl className="dlg-stats">
            <div><dt><Code2 size={13} /> Language</dt><dd>{repo.language || "—"}</dd></div>
            <div><dt><Star size={13} /> Stars</dt><dd>{repo.stargazers_count}</dd></div>
            <div><dt><GitFork size={13} /> Forks</dt><dd>{repo.forks_count}</dd></div>
            <div><dt><CalendarDays size={13} /> Updated</dt><dd>{new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</dd></div>
          </dl>
          <div className="dlg-section">
            <span className="mono-label">PERFORMANCE · LANGUAGES</span>
            {languages.length > 0 ? <>
              <div className="lang-bar">{languages.map(([l, b], i) => <span key={l} title={l} style={{ width: (b / total * 100) + "%", opacity: 1 - i * .15 }} />)}</div>
              <ul className="lang-legend">{languages.slice(0, 6).map(([l, b]) => <li key={l}>{l}<b>{Math.round(b / total * 100)}%</b></li>)}</ul>
            </> : <p className="muted">{loading ? "Reading the spec sheet…" : "No language data on GitHub."}</p>}
          </div>
          {(repo.topics || []).length > 0 && <ul className="chip-list">{repo.topics!.map(t => <li key={t}>{t}</li>)}</ul>}
          <div className="clone">
            <code>git clone {repo.clone_url}</code>
            <button onClick={copy} aria-label="Copy clone command">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
          </div>
          <div className="dlg-actions">
            <a className="btn btn-primary" href={repo.html_url} target="_blank" rel="noreferrer">Open on GitHub <ExternalLink size={14} /></a>
            <Dialog.Close className="btn btn-ghost">Back to garage</Dialog.Close>
          </div>
        </>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
