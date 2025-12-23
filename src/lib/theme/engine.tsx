'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { ExhibitTheme, ApplyThemeOptions } from './types';
import { defaultTheme } from './defaults';
import {
  applyThemeToRoot,
  loadThemeFonts,
  mergeThemes,
  blendThemes,
} from './utils';

// === CONTEXT ===

interface ThemeContextValue {
  /** Current active theme */
  theme: ExhibitTheme;

  /** Whether a theme transition is in progress */
  isTransitioning: boolean;

  /** Apply a new theme (full or partial) */
  applyTheme: (theme: ExhibitTheme, options?: ApplyThemeOptions) => void;

  /** Preview a theme on hover (blended with current) */
  previewTheme: (theme: ExhibitTheme, blend?: number) => void;

  /** Reset to default museum theme */
  resetTheme: () => void;

  /** Get the default theme */
  getDefaultTheme: () => ExhibitTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// === PROVIDER ===

interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme (defaults to museum theme) */
  initialTheme?: ExhibitTheme;
  /** Transition duration in ms */
  transitionDuration?: number;
}

export function ThemeProvider({
  children,
  initialTheme = defaultTheme,
  transitionDuration = 1000,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ExhibitTheme>(initialTheme);
  const [baseTheme, setBaseTheme] = useState<ExhibitTheme>(initialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply initial theme on mount
  useEffect(() => {
    applyThemeToRoot(initialTheme);
    loadThemeFonts(initialTheme);
  }, [initialTheme]);

  const applyTheme = useCallback(
    (newTheme: ExhibitTheme, options: ApplyThemeOptions = {}) => {
      const { preview = false, blend = 1, full = false, transition } = options;

      setIsTransitioning(true);

      let themeToApply: ExhibitTheme;

      if (full) {
        // Full override for focus mode
        themeToApply = mergeThemes(defaultTheme, newTheme);
        setBaseTheme(themeToApply);
      } else if (preview && blend < 1) {
        // Partial blend for hover preview
        themeToApply = blendThemes(baseTheme, newTheme, blend);
      } else {
        // Standard apply
        themeToApply = mergeThemes(baseTheme, newTheme);
      }

      // Load fonts before applying
      loadThemeFonts(themeToApply);

      // Apply to DOM
      applyThemeToRoot(themeToApply);
      setTheme(themeToApply);

      // End transition after duration
      const duration = transition ?? transitionDuration;
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    },
    [baseTheme, transitionDuration]
  );

  const previewTheme = useCallback(
    (previewTheme: ExhibitTheme, blend = 0.3) => {
      applyTheme(previewTheme, { preview: true, blend });
    },
    [applyTheme]
  );

  const resetTheme = useCallback(() => {
    setIsTransitioning(true);
    applyThemeToRoot(defaultTheme);
    setTheme(defaultTheme);
    setBaseTheme(defaultTheme);

    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, [transitionDuration]);

  const getDefaultTheme = useCallback(() => defaultTheme, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isTransitioning,
        applyTheme,
        previewTheme,
        resetTheme,
        getDefaultTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// === HOOK ===

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// === RE-EXPORT ===

export { defaultTheme } from './defaults';
export type { ExhibitTheme, ApplyThemeOptions } from './types';
