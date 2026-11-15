"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Bot, BrainCircuit, ScanEye, FileText, Code2, ChartNoAxesCombined } from "lucide-react";

const domains = [
  { title: "Agentic AI", note: "Agents · tools · workflows", icon: Bot, angle: -18, y: 23 },
  { title: "RAG Pipelines", note: "Retrieval · embeddings", icon: BrainCircuit, angle: -11, y: 9 },
  { title: "Computer Vision", note: "Detection · segmentation", icon: ScanEye, angle: -4, y: 0 },
  { title: "Document AI", note: "OCR · extraction", icon: FileText, angle: 4, y: 0 },
  { title: "ML Engineering", note: "Training · evaluation", icon: Code2, angle: 11, y: 9 },
  { title: "Model Optimization", note: "Fine-tuning · deployment", icon: ChartNoAxesCombined, angle: 18, y: 23 }
];

export default function HeaderCarousel() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("kp-theme");
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("kp-theme", next);
  }

  return (
    <header className="showcase">
      <motion.div className="theme-switch" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55 }}>
        <span className="theme-caption">APPEARANCE</span>
        <button className={"theme-choice " + (theme === "light" ? "selected" : "")} onClick={toggleTheme} aria-label="Toggle light and dark theme">
          {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <span className="theme-name">{theme === "dark" ? "Dark" : "Light"}</span>
      </motion.div>
      <div className="showcase-label mono">A SMALL TOUR OF WHAT I BUILD <span>✳</span></div>
      <div className="arc-gallery" aria-label="Core engineering domains">
        {domains.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              className="arc-card"
              key={item.title}
              initial={{ opacity: 0, y: 36, rotateY: item.angle * 1.5 }}
              animate={{ opacity: 1, y: item.y, rotateY: item.angle, rotateZ: item.angle * -0.18 }}
              transition={{ delay: 0.08 * index, type: "spring", stiffness: 90, damping: 17 }}
              whileHover={{ y: item.y - 9, scale: 1.035 }}
            >
              <div className="arc-card-top"><span>0{index + 1}</span><Icon size={17} strokeWidth={1.5} /></div>
              <strong>{item.title}</strong>
              <small>{item.note}</small>
            </motion.div>
          );
        })}
      </div>
      <div className="showcase-fade" />
    </header>
  );
}
