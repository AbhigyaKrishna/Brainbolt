"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

export const ScoreDisplay = React.memo(function ScoreDisplay({
  score,
  className,
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    setDisplayScore(score);
  }, [score]);

  return (
    <motion.div
      className={cn("text-2xl font-bold", className)}
      key={score}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.3 }}
    >
      {formatNumber(displayScore)}
    </motion.div>
  );
});
