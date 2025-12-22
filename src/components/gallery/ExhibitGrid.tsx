'use client';

import { motion } from 'motion/react';
import { ExhibitCard } from './ExhibitCard';
import type { Exhibit } from '@/lib/theme/types';

interface ExhibitGridProps {
  exhibits: Exhibit[];
}

/**
 * Simple CSS grid layout for exhibits
 * Responsive: 1 col mobile, 2 col tablet, 3 col desktop
 */
export function ExhibitGrid({ exhibits }: ExhibitGridProps) {
  if (exhibits.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-muted)]">No exhibits yet.</p>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Add MDX files to content/exhibits/ to get started.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {exhibits.map((exhibit) => (
        <ExhibitCard key={exhibit.slug} exhibit={exhibit} />
      ))}
    </motion.div>
  );
}
