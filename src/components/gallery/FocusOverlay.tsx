'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useGallery } from '@/lib/gallery/context';
import { useTheme } from '@/lib/theme/engine';
import { FocusedExhibit } from './FocusedExhibit';

/**
 * Focus mode overlay
 * Shows focused exhibit in center with full theme transformation
 */
export function FocusOverlay() {
  const { focusedExhibit, unfocus, isFocused } = useGallery();
  const { applyTheme, resetTheme } = useTheme();

  // Apply full theme when exhibit is focused
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

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      unfocus();
    }
  };

  return (
    <AnimatePresence>
      {isFocused && focusedExhibit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-40 flex items-center justify-center p-8"
          onClick={handleBackdropClick}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={unfocus}
            className="absolute top-6 right-6 p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors z-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Focused exhibit */}
          <FocusedExhibit exhibit={focusedExhibit} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
