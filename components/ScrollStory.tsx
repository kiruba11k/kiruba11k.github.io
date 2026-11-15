"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Database, BrainCircuit, FlaskConical, Rocket, ArrowUpRight } from "lucide-react";

const stages = [
  { number: "01", title: "Ingest", subtitle: "Data foundations", detail: "Images, documents and signals enter a clean, structured pipeline.", icon: Database, output: "Structured inputs", visual: "data" },
  { number: "02", title: "Understand", subtitle: "Model intelligence", detail: "Vision, language and retrieval models turn raw data into context.", icon: BrainCircuit, output: "Useful predictions", visual: "network" },
  { number: "03", title: "Evaluate", subtitle: "Quality loop", detail: "Metrics and failure analysis guide each iteration toward reliability.", icon: FlaskConical, output: "Measured quality", visual: "evaluate" },
  { number: "04", title: "Deploy", subtitle: "Production systems", detail: "Validated capabilities become APIs and products people can use.", icon: Rocket, output: "Working software", visual: "deploy" },
];

function StageCard({ stage, index, progress, reduceMotion }: { stage: typeof stages[number]; index: number; progress: MotionValue<number>; reduceMotion: boolean }) {
  const start = index * 0.25;
  const active = useTransform(progress, [Math.max(0, start - 0.12), Math.min(1, start + 0.08), Math.min(1, start + 0.23)], [0.48, 1, 1]);
  const lift = useTransform(progress, [Math.max(0, start - 0.12), Math.min(1, start + 0.08)], [12, 0]);
  const Icon = stage.icon;
  return (
    <motion.article className={`pipeline-card pipeline-card-${stage.visual}`} style={reduceMotion ? undefined : { opacity: active, y: lift }}>
      <div className="pipeline-card-meta"><span className="mono">{stage.number} / 04</span><span className="pipeline-card-status"><i /> STAGE</span></div>
      <div className={`pipeline-art pipeline-art-${stage.visual}`} aria-hidden="true">
        {stage.visual === "data" && <div className="data-stack"><span /><span /><span /><span /><span /><span /><span /></div>}
        {stage.visual === "network" && <div className="network-graphic"><i /><i /><i /><i /><i /><i /><i /><i /><i /><b /><b /><b /><b /></div>}
        {stage.visual === "evaluate" && <div className="gauge-graphic"><i /><b /><span>98.4</span><small>QUALITY SCORE</small></div>}
        {stage.visual === "deploy" && <div className="terminal-graphic"><span> &gt; deploy --prod</span><i /><i /><i /></div>}
        <div className="pipeline-art-icon"><Icon size={18} strokeWidth={1.6} /></div>
      </div>
      <div className="pipeline-card-copy">
        <span className="pipeline-card-subtitle">{stage.subtitle}</span>
        <h3>{stage.title}</h3>
        <p>{stage.detail}</p>
      </div>
      <div className="pipeline-card-output"><span className="pipeline-output-dot" />{stage.output}<ArrowUpRight size={13} /></div>
    </motion.article>
  );
}

export default function ScrollStory() {
  const target = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 75, damping: 22, mass: 0.35 });
  const lineWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const glowX = useTransform(progress, [0, 1], ["4%", "96%"]);

  return (
    <section ref={target} id="build-process" className="scroll-story pipeline-story">
      <div className="story-sticky pipeline-sticky">
        <div className="pipeline-backdrop-grid" />
        <motion.div className="pipeline-ambient" style={reduceMotion ? undefined : { left: glowX }} />
        <div className="pipeline-heading">
          <div>
            <div className="section-overline mono"><span className="pipeline-heading-mark" /> THE ENGINEERING LOOP / 04 STAGES</div>
            <h2>Ideas become<br /><span>intelligent systems.</span></h2>
          </div>
          <p>Not just models. A complete path from messy inputs to dependable software in production.</p>
        </div>
        <div className="pipeline-rail-labels mono"><span>01 — INPUT</span><span>02 — INTELLIGENCE</span><span>03 — VALIDATION</span><span>04 — DELIVERY</span></div>
        <div className="pipeline-rail"><div className="pipeline-rail-base" /><motion.div className="pipeline-rail-progress" style={{ width: reduceMotion ? "100%" : lineWidth }} /><motion.div className="pipeline-rail-beam" style={reduceMotion ? undefined : { left: glowX }} /></div>
        <div className="pipeline-cards">
          {stages.map((stage, index) => <StageCard key={stage.number} stage={stage} index={index} progress={progress} reduceMotion={!!reduceMotion} />)}
        </div>
        <div className="pipeline-bottom">
          <span className="pipeline-bottom-note"><i /> BUILT TO WORK BEYOND THE DEMO</span>
          <span className="mono">DATA <b>→</b> MODELS <b>→</b> EVALUATION <b>→</b> PRODUCTION</span>
        </div>
      </div>
    </section>
  );
}
