'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '@/components/layout/Header';
import { useGallery } from '@/lib/gallery/context';
import { useTheme } from '@/lib/theme/engine';
import { MDXRenderer } from '@/components/mdx/MDXRenderer';
import { IsolatedPreview } from '@/components/exhibit/IsolatedPreview';
import { exhibits } from '#velite';
import type { Exhibit } from '@/lib/theme/types';
import { X } from 'lucide-react';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';

// Transform Velite exhibits to our Exhibit type
const galleryExhibits: Exhibit[] = exhibits.map((exhibit) => ({
  title: exhibit.title,
  slug: exhibit.slug,
  description: exhibit.description,
  source: exhibit.source,
  theme: exhibit.theme,
  tags: exhibit.tags,
  category: exhibit.category,
  featured: exhibit.featured,
  code: exhibit.code,
}));

export default function GalleryPage() {
  const { focusedExhibit, isFocused, unfocus, focus, setHovered } = useGallery();
  const { applyTheme, resetTheme, previewTheme } = useTheme();

  // Apply theme when exhibit is focused
  useEffect(() => {
    if (focusedExhibit) {
      applyTheme(focusedExhibit.theme, { full: true });
    } else {
      resetTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedExhibit]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocused) {
        unfocus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, unfocus]);

  const handleCardHover = (exhibit: Exhibit) => {
    if (!isFocused) {
      setHovered(exhibit);
    }
  };

  const handleCardLeave = () => {
    if (!isFocused) {
      setHovered(null);
    }
  };

  return (
    <main className="min-h-screen relative">
      <BackgroundEffects />
      <Header />

      {/* Hero section - always visible */}
      <section className="pt-24 pb-8">
        <div className="px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display text-[clamp(2.5rem,6vw,4.5rem)] text-[var(--color-text)]">
              A curated collection
            </h1>
            <p className="mt-4 text-base text-[var(--color-muted)] max-w-lg">
              Exceptional interface components from the best design teams.
              Each exhibit transforms the gallery to match its original context.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery section */}
      <section className="pb-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {galleryExhibits.map((exhibit, index) => {
                const isSelected = focusedExhibit?.slug === exhibit.slug;
                const isOther = isFocused && !isSelected;
                const glowColor = exhibit.theme.colors?.primary || exhibit.theme.colors?.accent || '#888';

                // Don't render other cards when focused (they fade out)
                if (isOther) {
                  return (
                    <motion.article
                      key={exhibit.slug}
                      initial={{ opacity: 1, scale: 1, y: 0 }}
                      animate={{ opacity: 0, scale: 0.95, y: 10 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative pointer-events-none"
                    >
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-md">
                        <div
                          className="aspect-[4/3] flex items-center justify-center p-4 overflow-hidden"
                          style={{
                            background: exhibit.theme.background?.type === 'gradient'
                              ? exhibit.theme.background.value
                              : exhibit.theme.colors?.surface || exhibit.theme.background?.value || '#f8f8f8',
                          }}
                        >
                          <div className="w-full h-full relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="transform scale-[0.45]">
                                {exhibit.code && (
                                  <IsolatedPreview theme={exhibit.theme}>
                                    <MDXRenderer code={exhibit.code} />
                                  </IsolatedPreview>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t border-[var(--color-border)]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                                {exhibit.category}
                              </span>
                              <h3 className="mt-1 text-base font-medium text-[var(--color-text)] truncate">
                                {exhibit.title}
                              </h3>
                              <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                                {exhibit.source.designer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                }

                return (
                  <motion.article
                    key={exhibit.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isSelected ? 1.03 : 1,
                      zIndex: isSelected ? 10 : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: isFocused ? 0 : index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => !isFocused && focus(exhibit)}
                    onMouseEnter={() => handleCardHover(exhibit)}
                    onMouseLeave={handleCardLeave}
                    className={`group/card relative ${!isFocused ? 'cursor-pointer' : ''}`}
                    style={{
                      // CSS custom property for glow color
                      '--glow-color': glowColor,
                    } as React.CSSProperties}
                  >
                    <motion.div
                      whileHover={!isFocused ? {
                        y: -4,
                        scale: 1.01,
                        boxShadow: `0 0 50px 10px ${glowColor}40, 0 0 80px 25px ${glowColor}20`,
                      } : undefined}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-xl"
                    >
                      {/* Close button - only on focused card */}
                      {isSelected && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            unfocus();
                          }}
                          className="absolute -top-3 -right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors shadow-lg"
                          aria-label="Close"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}

                      <div
                        className={`relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-all duration-500 ${
                          isSelected ? 'shadow-2xl ring-2 ring-[var(--color-accent)]/20' : 'shadow-md'
                        }`}
                      >
                        {/* Component preview area - shows actual component */}
                        <div
                          className="aspect-[4/3] flex items-center justify-center p-4 overflow-hidden"
                          style={{
                            background: exhibit.theme.background?.type === 'gradient'
                              ? exhibit.theme.background.value
                              : exhibit.theme.colors?.surface || exhibit.theme.background?.value || '#f8f8f8',
                          }}
                        >
                          <div className="w-full h-full relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="transform scale-[0.45]">
                                {exhibit.code ? (
                                  <IsolatedPreview theme={exhibit.theme}>
                                    <MDXRenderer code={exhibit.code} />
                                  </IsolatedPreview>
                                ) : (
                                  <div className="text-center text-[var(--color-muted)]">
                                    <p className="text-sm">Preview</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card info */}
                        <div className="p-4 border-t border-[var(--color-border)]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                                {exhibit.category}
                              </span>
                              <h3 className="mt-1 text-base font-medium text-[var(--color-text)] truncate">
                                {exhibit.title}
                              </h3>
                              <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                                {exhibit.source.designer}
                              </p>
                            </div>
                            {exhibit.theme.meta?.service && (
                              <span className="text-[10px] font-mono text-[var(--color-muted)] shrink-0 bg-[var(--color-border)]/50 px-2 py-0.5 rounded">
                                {exhibit.theme.meta.service}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer - always visible */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--color-muted)]">
              UI Museum — A curated collection of interface design
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              2024
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
