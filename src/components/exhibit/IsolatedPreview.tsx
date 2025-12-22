'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { ExhibitTheme } from '@/lib/theme/types';
import { generateThemeCSSVariables } from '@/lib/theme/utils';

interface IsolatedPreviewProps {
  /** The component to render in isolation */
  children: ReactNode;
  /** The theme to apply inside the isolation boundary */
  theme: ExhibitTheme;
  /** Additional class name */
  className?: string;
}

/**
 * Isolated preview container that prevents external theme leakage
 *
 * Uses CSS containment and scoped CSS variables to ensure the component
 * inside sees only its own theme, not the gallery's external theme.
 */
export function IsolatedPreview({ children, theme, className = '' }: IsolatedPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Apply theme variables directly to this container (not :root)
  useEffect(() => {
    if (!containerRef.current) return;

    const cssVars = generateThemeCSSVariables(theme);

    // Apply all CSS variables to this element
    Object.entries(cssVars).forEach(([key, value]) => {
      containerRef.current?.style.setProperty(key, value);
    });

    // Cleanup on unmount or theme change
    return () => {
      Object.keys(cssVars).forEach((key) => {
        containerRef.current?.style.removeProperty(key);
      });
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`isolated-preview ${className}`}
      style={{
        // CSS containment to prevent style leakage
        contain: 'style',
        // Ensure this is a new stacking context
        isolation: 'isolate',
        // Set font family directly from theme
        fontFamily: theme.typography?.body?.family || 'system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
