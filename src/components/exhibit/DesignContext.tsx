'use client';

import { motion } from 'motion/react';
import type { ThemeMeta } from '@/lib/theme/types';

interface DesignContextProps {
  meta?: ThemeMeta;
}

/**
 * Displays design philosophy and context information
 */
export function DesignContext({ meta }: DesignContextProps) {
  if (!meta) return null;

  const hasContent =
    meta.philosophy || meta.designSystem || meta.era || meta.changes;

  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] px-6 py-4"
    >
      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
        {meta.service && (
          <span className="font-medium text-[var(--color-text)]">
            {meta.service}
          </span>
        )}
        {meta.designSystem && (
          <>
            <span>•</span>
            <span>{meta.designSystem}</span>
          </>
        )}
        {meta.era && (
          <>
            <span>•</span>
            <span>{meta.era}</span>
          </>
        )}
      </div>

      {meta.philosophy && (
        <p className="mt-2 text-sm text-[var(--color-muted)] italic">
          &ldquo;{meta.philosophy}&rdquo;
        </p>
      )}

      {meta.changes && (
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Evolution: {meta.changes}
        </p>
      )}
    </motion.div>
  );
}
