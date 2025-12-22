'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Exhibit } from '@/lib/theme/types';

// === CONTEXT ===

interface GalleryContextValue {
  /** Currently focused exhibit (null = gallery view) */
  focusedExhibit: Exhibit | null;

  /** Whether an exhibit is currently focused */
  isFocused: boolean;

  /** Focus on an exhibit (opens detail view) */
  focus: (exhibit: Exhibit) => void;

  /** Unfocus current exhibit (returns to gallery) */
  unfocus: () => void;

  /** Currently hovered exhibit for preview */
  hoveredExhibit: Exhibit | null;

  /** Set hovered exhibit */
  setHovered: (exhibit: Exhibit | null) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

// === PROVIDER ===

interface GalleryProviderProps {
  children: ReactNode;
}

export function GalleryProvider({ children }: GalleryProviderProps) {
  const [focusedExhibit, setFocusedExhibit] = useState<Exhibit | null>(null);
  const [hoveredExhibit, setHoveredExhibit] = useState<Exhibit | null>(null);

  const focus = useCallback((exhibit: Exhibit) => {
    setFocusedExhibit(exhibit);
    setHoveredExhibit(null);
  }, []);

  const unfocus = useCallback(() => {
    setFocusedExhibit(null);
  }, []);

  const setHovered = useCallback((exhibit: Exhibit | null) => {
    // Only set hovered if not focused
    if (!focusedExhibit) {
      setHoveredExhibit(exhibit);
    }
  }, [focusedExhibit]);

  return (
    <GalleryContext.Provider
      value={{
        focusedExhibit,
        isFocused: focusedExhibit !== null,
        focus,
        unfocus,
        hoveredExhibit,
        setHovered,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

// === HOOK ===

export function useGallery(): GalleryContextValue {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}
