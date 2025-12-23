'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/lib/theme/engine';
import { useGallery } from '@/lib/gallery/context';
import type { Exhibit } from '@/lib/theme/types';

interface ExhibitCardProps {
  exhibit: Exhibit;
}

/**
 * Gallery card that shows exhibit preview
 * On hover: partial theme preview
 * On click: focuses the exhibit
 */
export function ExhibitCard({ exhibit }: ExhibitCardProps) {
  const { previewTheme, resetTheme } = useTheme();
  const { focus, setHovered, focusedExhibit, isFocused } = useGallery();

  // Get hover interaction from exhibit's theme
  const hoverScale = exhibit.theme.interactions?.hover?.scale || 1.02;
  const hoverLift = exhibit.theme.interactions?.hover?.lift || -4;
  const hoverTiming = (exhibit.theme.interactions?.hover?.timing || 400) / 1000;

  // Is this card the focused one?
  const isThisCard = focusedExhibit?.slug === exhibit.slug;

  const handleMouseEnter = () => {
    if (!isFocused) {
      setHovered(exhibit);
      previewTheme(exhibit.theme, 0.3);
    }
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      setHovered(null);
      resetTheme();
    }
  };

  const handleClick = () => {
    focus(exhibit);
  };

  // Get preview color from exhibit theme
  const previewBg =
    exhibit.theme.colors?.surface || exhibit.theme.colors?.primary || '#fff';
  const previewAccent = exhibit.theme.colors?.accent || exhibit.theme.colors?.primary;

  return (
    <motion.article
      layoutId={`exhibit-${exhibit.slug}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isFocused && !isThisCard ? 0.1 : 1,
        y: 0,
        scale: isFocused && !isThisCard ? 0.95 : 1,
      }}
      whileHover={
        !isFocused
          ? {
              scale: hoverScale,
              y: hoverLift,
            }
          : undefined
      }
      transition={{
        duration: hoverTiming,
        ease: [0.4, 0, 0.2, 1],
        layout: {
          duration: 0.8,
          type: 'spring',
          stiffness: 100,
          damping: 20,
        },
      }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--hover-timing)]"
        style={{
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Preview area - shows component colors */}
        <div
          className="aspect-[4/3] flex items-center justify-center p-8 transition-colors duration-500"
          style={{
            background: previewBg,
          }}
        >
          {/* Abstract preview showing exhibit's design language */}
          <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
            {/* Preview card shape */}
            <div
              className="w-full aspect-video rounded-md transition-all duration-300"
              style={{
                background: previewAccent,
                borderRadius:
                  exhibit.theme.radius?.values?.md ||
                  (exhibit.theme.radius?.style === 'sharp' ? '0' : '8px'),
                boxShadow:
                  exhibit.theme.effects?.shadows === 'none'
                    ? 'none'
                    : '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            {/* Preview lines */}
            <div className="w-full space-y-2">
              <div
                className="h-2 rounded-full opacity-60"
                style={{ background: exhibit.theme.colors?.text || '#333', width: '80%' }}
              />
              <div
                className="h-2 rounded-full opacity-40"
                style={{ background: exhibit.theme.colors?.text || '#333', width: '60%' }}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium">
                {exhibit.category}
              </span>
              <h3 className="mt-1 font-semibold text-[var(--color-text)]">
                {exhibit.title}
              </h3>
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                by {exhibit.source.designer}
              </p>
            </div>

            {/* Service badge */}
            {exhibit.theme.meta?.service && (
              <span
                className="text-xs px-2 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] whitespace-nowrap"
              >
                {exhibit.theme.meta.service}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
