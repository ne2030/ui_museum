'use client';

import { motion } from 'motion/react';

/**
 * Editorial header - always visible with logo
 */
export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md"
    >
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            className="flex items-baseline gap-1"
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-display text-xl text-[var(--color-text)]">
              UI
            </span>
            <span className="text-lg text-[var(--color-muted)]">
              Museum
            </span>
          </motion.div>

          {/* Right side */}
          <span className="text-xs text-[var(--color-muted)] font-mono">
            est. 2024
          </span>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)',
        }}
      />
    </motion.header>
  );
}
