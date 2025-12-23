'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useGallery } from '@/lib/gallery/context';

const leaves = ['🍃', '🌿', '🍂', '🌱', '☘️'];

// Pre-compute random values at module level (outside component)
// This avoids impure function calls during render
const leafConfigs = Array.from({ length: 20 }, () => ({
  initialX: Math.random() * 100,
  animateX: Math.random() * 100,
  duration: 8 + Math.random() * 6,
  leftPosition: Math.random() * 100,
}));

/**
 * Animated background effects based on current theme
 */
export function BackgroundEffects() {
  const { focusedExhibit } = useGallery();

  // Check if current theme is nature/forest themed
  const isForestTheme = focusedExhibit?.slug === 'forest-tree-card';

  return (
    <AnimatePresence>
      {isForestTheme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {/* Floating leaves */}
          {leafConfigs.map((config, i) => (
            <motion.div
              key={i}
              initial={{
                y: -50,
                x: `${config.initialX}vw`,
                rotate: 0,
                opacity: 0
              }}
              animate={{
                y: '110vh',
                x: `${config.animateX}vw`,
                rotate: 360,
                opacity: [0, 0.8, 0.8, 0]
              }}
              transition={{
                duration: config.duration,
                delay: i * 0.8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute text-2xl md:text-3xl"
              style={{
                left: `${config.leftPosition}%`,
              }}
            >
              {leaves[i % leaves.length]}
            </motion.div>
          ))}

          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1f0d]/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
