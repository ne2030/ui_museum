'use client';

import { motion } from 'motion/react';
import type { Exhibit } from '@/lib/theme/types';
import { SourceAttribution } from '@/components/exhibit/SourceAttribution';
import { DesignContext } from '@/components/exhibit/DesignContext';

interface FocusedExhibitProps {
  exhibit: Exhibit;
}

/**
 * Focused exhibit view
 * Shows enlarged component with source attribution and design context
 */
export function FocusedExhibit({ exhibit }: FocusedExhibitProps) {
  // Get enter animation from theme
  const enterAnimation = exhibit.theme.animations?.enter;
  const animationType = enterAnimation?.type || 'spring';
  const animationDuration = (enterAnimation?.duration || 500) / 1000;

  // Build initial state based on animation type
  const getInitialState = () => {
    const from = enterAnimation?.from || {};
    switch (animationType) {
      case 'fade':
        return { opacity: 0, ...from };
      case 'slide':
        return { opacity: 0, y: 40, ...from };
      case 'scale':
        return { opacity: 0, scale: 0.9, ...from };
      case 'blur':
        return { opacity: 0, filter: 'blur(10px)', ...from };
      case 'spring':
      default:
        return { opacity: 0, y: 20, scale: 0.95, ...from };
    }
  };

  return (
    <motion.div
      layoutId={`exhibit-${exhibit.slug}`}
      className="w-full max-w-4xl"
      initial={getInitialState()}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{
        type: animationType === 'spring' ? 'spring' : 'tween',
        duration: animationDuration,
        stiffness: 100,
        damping: 20,
      }}
    >
      {/* Source attribution */}
      <SourceAttribution source={exhibit.source} />

      {/* Component stage */}
      <motion.div
        className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
        style={{
          boxShadow: 'var(--shadow)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Title bar */}
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium">
            {exhibit.category}
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-text)]">
            {exhibit.title}
          </h1>
          {exhibit.description && (
            <p className="mt-2 text-[var(--color-muted)]">{exhibit.description}</p>
          )}
        </div>

        {/* Component preview area */}
        <div className="p-8 min-h-[300px] flex items-center justify-center">
          {/* The actual component will be rendered here via MDX */}
          <div className="text-center text-[var(--color-muted)]">
            <p className="text-lg font-medium">{exhibit.title}</p>
            <p className="text-sm mt-2">Component will render here</p>
          </div>
        </div>

        {/* Tags */}
        {exhibit.tags && exhibit.tags.length > 0 && (
          <div className="px-6 py-3 border-t border-[var(--color-border)] flex flex-wrap gap-2">
            {exhibit.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-[var(--color-border)] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Design context */}
      <DesignContext meta={exhibit.theme.meta} />
    </motion.div>
  );
}
