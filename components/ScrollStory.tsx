"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Database, BrainCircuit, FlaskConical, Rocket, ArrowDown, Activity } from "lucide-react";

const stages = [
  { number: "01", title: "Ingest", subtitle: "Raw signals", detail: "Bring images, documents and structured data into a reliable pipeline.", icon: Database, output: "Clean inputs" },
  { number: "02", title: "Understand", subtitle: "Model intelligence", detail: "Apply vision, language and retrieval models to extract useful signals.", icon: BrainCircuit, output: "Model predictions" },
  { number: "03", title: "Evaluate", subtitle: "Measure quality", detail: "Validate outputs, inspect failure cases and iterate against real metrics.", icon: FlaskConical, output: "Reliable results" },
  { number: "04", title: "Ship", subtitle: "Production systems", detail: "Expose capabilities through APIs and integrate them into applications.", icon: Rocket, output: "Useful software" }
];

function PipelineNode({ stage, index, progress }: { stage: typeof stages[number]; index: number; progress: MotionValue<number> }) {
  const start = index * 0.22;
  const opacity = useTransform(progress, [Math.max(0, start - 0.08), Math.min(1, start + 0.12), Math.min(1, start + 0.34)], [0.48, 1, 1]);
  const scale = useTransform(progress, [Math.max(0, start - 0.08), Math.min(1, start + 0.12)], [0.96, 1]);
  const Icon = stage.icon;
  return (
    <motion.article className="story-node" style={{ opacity, scale }}>
      <div className="story-node-top"><span className="mono">{stage.number} / STAGE</span><Icon size={19} strokeWidth={1.6} /></div>
      <h3>{stage.title}</h3>
      <span className="story-node-subtitle">{stage.subtitle}</span>
      <p>{stage.detail}</p>
      <div className="story-node-output"><Activity size={12} /><span>{stage.output}</span></div>
    </motion.article>
  );
}

export default function ScrollStory() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });
  const lineWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(progress, [0, 1], [42, -42]);
  const glowRotate = useTransform(progress, [0, 1], [-8, 8]);

  return (
    <section ref={target} id="build-process" className="scroll-story">
      <div className="story-sticky">
        <motion.div className="story-orb story-orb-one" style={{ y: glowY, rotate: glowRotate }} />
        <motion.div className="story-orb story-orb-two" style={{ y: useTransform(progress, [0, 1], [-24, 34]), rotate: useTransform(progress, [0, 1], [12, -12]) }} />
        <div className="story-heading">
          <div className="section-overline mono">HOW I APPROACH ENGINEERING / 04</div>
          <h2>From raw signal to <span>real-world impact.</span></h2>
          <p>Scroll through the stages. Each layer turns a technical capability into something a product can use.</p>
        </div>
        <div className="story-progress-label mono"><span>THE BUILD PIPELINE</span><span>SCROLL TO EXPLORE <ArrowDown size={11} /></span></div>
        <div className="story-track">
          <div className="story-track-base" />
          <motion.div className="story-track-fill" style={{ width: lineWidth }} />
          <div className="story-nodes">
            {stages.map((stage, index) => <PipelineNode key={stage.number} stage={stage} index={index} progress={progress} />)}
          </div>
        </div>
        <div className="story-footer"><span className="mono">DATA → INTELLIGENCE → VALIDATION → DEPLOYMENT</span><span className="story-live"><i /> SYSTEM THINKING, END TO END</span></div>
      </div>
    </section>
  );
}
