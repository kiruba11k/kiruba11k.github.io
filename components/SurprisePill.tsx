"use client";

import { motion } from "framer-motion";
import { Shuffle, Sparkles } from "lucide-react";

export default function SurprisePill({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      className="surprise-pill"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.035, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 430, damping: 22 }}
    >
      <Sparkles size={15} />
      <span>Surprise me</span>
      <span className="surprise-divider" />
      <Shuffle size={14} />
    </motion.button>
  );
}
