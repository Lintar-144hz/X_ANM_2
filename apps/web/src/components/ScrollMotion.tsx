import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  scale?: boolean;
}

/**
 * Continuous Scroll-Driven Fade In & Fade Out element:
 * As you scroll it into view, it smoothly fades in and scales up.
 * As you scroll past it toward the top, it smoothly fades out and translates up.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  scale = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Track the element's position relative to the viewport window
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Noticeable, tangible continuous curves for fade-in, steady display, and fade-out
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    [0, 1, 1, 0.15]
  );

  // Subtle natural translation along scroll direction
  const yTranslate = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    direction === 'down' ? [-40, 0, 0, 40] : [40, 0, 0, -40]
  );

  const xTranslate = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    direction === 'left'
      ? [35, 0, 0, -35]
      : direction === 'right'
      ? [-35, 0, 0, 35]
      : [0, 0, 0, 0]
  );

  const scaleVal = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    scale ? [0.93, 1, 1, 0.95] : [1, 1, 1, 1]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          opacity,
          y: direction === 'left' || direction === 'right' ? 0 : yTranslate,
          x: xTranslate,
          scale: scaleVal,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 35,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.2]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y, opacity, willChange: 'transform, opacity' }}>
        {children}
      </motion.div>
    </div>
  );
};
