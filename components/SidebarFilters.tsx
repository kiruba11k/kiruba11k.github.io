"use client";

import { motion } from "framer-motion";
import { Layers3, Star, BrainCircuit, ScanEye, Code2, ChartNoAxesCombined, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SidebarFilter } from "@/lib/types";

const filters: { id: SidebarFilter; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All repositories", icon: Layers3 },
  { id: "featured", label: "Featured", icon: Star },
  { id: "agentic-rag", label: "Agentic & RAG", icon: BrainCircuit },
  { id: "computer-vision", label: "Computer Vision", icon: ScanEye },
  { id: "python-ai", label: "Python & AI", icon: Bot },
  { id: "java-fullstack", label: "Java & Full-stack", icon: Code2 },
  { id: "data-science", label: "Data Science", icon: ChartNoAxesCombined }
];

export default function SidebarFilters({ active, counts, onChange }: {
  active: SidebarFilter;
  counts: Record<SidebarFilter, number>;
  onChange: (filter: SidebarFilter) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading mono">BROWSE BY VIBE</div>
      <nav className="filter-list" aria-label="Repository categories">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const selected = active === filter.id;
          return (
            <button key={filter.id} className={"filter-item " + (selected ? "active" : "")} onClick={() => onChange(filter.id)} aria-pressed={selected}>
              {selected && <motion.span className="active-dot" layoutId="active-filter-dot" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <Icon size={15} strokeWidth={1.7} />
              <span>{filter.label}</span>
              <small className="mono">{counts[filter.id]}</small>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <span className="live-dot" />
        <span>Synced with GitHub</span>
      </div>
    </aside>
  );
}
