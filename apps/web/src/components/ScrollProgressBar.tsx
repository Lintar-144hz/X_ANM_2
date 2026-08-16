import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 z-[999] origin-left shadow-[0_1px_8px_rgba(251,191,36,0.5)] pointer-events-none"
      style={{ scaleX }}
    />
  );
};
