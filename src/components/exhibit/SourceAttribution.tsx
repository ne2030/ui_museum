'use client';

import { motion } from 'motion/react';
import { ExternalLink, User } from 'lucide-react';
import type { ExhibitSource } from '@/lib/theme/types';

interface SourceAttributionProps {
  source: ExhibitSource;
}

/**
 * Credit bar showing original designer and source
 */
export function SourceAttribution({ source }: SourceAttributionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <User className="w-4 h-4 text-[var(--color-muted)]" />
        <span className="text-sm text-[var(--color-text)]">
          Designed by{' '}
          {source.designerUrl ? (
            <a
              href={source.designerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-[var(--color-accent)] underline-offset-2 hover:underline transition-colors"
            >
              {source.designer}
            </a>
          ) : (
            <span className="font-medium">{source.designer}</span>
          )}
          {source.company && (
            <span className="text-[var(--color-muted)]"> at {source.company}</span>
          )}
        </span>
      </div>

      {source.originalUrl && (
        <a
          href={source.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          View original
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </motion.div>
  );
}
