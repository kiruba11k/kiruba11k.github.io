"use client";

import { useMemo, useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ArrowUpRight, RefreshCw, Search, Star } from "lucide-react";
import type { DecoratedRepo, LanguageFilter } from "@/lib/types";

const TABS: LanguageFilter[] = ["All", "Python", "Notebooks", "Java", "Web / JS", "Other"];
const GLYPH: Record<Exclude<LanguageFilter, "All">, string> = { Python: "py>", Notebooks: "[≡]", Java: "{j}", "Web / JS": "</>", Other: "·:·" };

function pretty(name: string) { return name.replace(/[-_]+/g, " "); }
function ago(date: string) {
  const days = Math.floor((Date.now() - Date.parse(date)) / 864e5);
  if (days < 1) return "today";
  if (days < 30) return days + "d";
  if (days < 365) return Math.floor(days / 30) + "mo";
  return Math.floor(days / 365) + "y";
}

export default function Garage({ repos, loading, error, onRetry, onOpen }: {
  repos: DecoratedRepo[]; loading: boolean; error: string; onRetry: () => void; onOpen: (r: DecoratedRepo) => void;
}) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<LanguageFilter>("All");
  const [count, setCount] = useState(10);
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: repos.length };
    repos.forEach(r => { c[r.languageGroup] = (c[r.languageGroup] || 0) + 1; });
    return c;
  }, [repos]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos.filter(r => (lang === "All" || r.languageGroup === lang) && (!q || [r.name, r.description || "", r.language || "", ...(r.topics || [])].join(" ").toLowerCase().includes(q)));
  }, [repos, lang, query]);
  const shown = filtered.slice(0, count);

  return <div className="garage">
    <div className="garage-tools">
      <label className="search">
        <Search size={15} strokeWidth={1.75} />
        <span className="sr-only">Search repositories</span>
        <input id="repo-search" type="search" value={query} placeholder={`Search ${repos.length || ""} vehicles…`} onChange={e => { setQuery(e.target.value); setCount(10); }}
          onKeyDown={e => { if (e.key === "Escape") { setQuery(""); e.currentTarget.blur(); } }} />
        <kbd>/</kbd>
      </label>
      <ToggleGroup.Root type="single" value={lang} onValueChange={v => { if (v) { setLang(v as LanguageFilter); setCount(10); } }} className="filter-seg" aria-label="Filter by language">
        {TABS.map(t => <ToggleGroup.Item key={t} value={t} className="filter-item">{t}<small>{counts[t] || 0}</small></ToggleGroup.Item>)}
      </ToggleGroup.Root>
    </div>

    {error && <div className="notice"><span>{error}</span><button className="btn btn-ghost" onClick={onRetry}><RefreshCw size={13} /> Retry</button></div>}
    {loading && <div className="notice"><span className="spinner" /> Pulling vehicles from GitHub…</div>}
    {!loading && !error && filtered.length === 0 && <div className="notice">Nothing parked here. Try another keyword.</div>}

    <ol className="garage-list">
      {shown.map((r, i) => <li key={r.id}>
        <button className="garage-row" onClick={() => onOpen(r)}>
          <span className="g-idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="g-glyph" aria-hidden="true">{GLYPH[r.languageGroup]}</span>
          <span className="g-main">
            <span className="g-name">{pretty(r.name)}{r.isFeatured && <span className="stamp-mini">Featured</span>}</span>
            <span className="g-desc">{r.description || r.featuredNote || r.fallbackDescription}</span>
          </span>
          <span className="g-meta">
            <span>{r.language || "·"}</span>
            {r.stargazers_count > 0 && <span><Star size={11} /> {r.stargazers_count}</span>}
            <span>{ago(r.pushed_at)}</span>
          </span>
          <ArrowUpRight className="g-arrow" size={15} />
        </button>
      </li>)}
    </ol>
    <div className="garage-foot">
      <span className="mono-label">SHOWING {shown.length} / {filtered.length} · LIVE VIA GITHUB API</span>
      {filtered.length > count && <button className="btn btn-ghost" onClick={() => setCount(c => c + 10)}>Load 10 more</button>}
    </div>
  </div>;
}
