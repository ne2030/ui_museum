import type { ExhibitTheme, ThemeBackground } from './types';
import { defaultTheme, getShadowCSS, getRadiusValues } from './defaults';

/**
 * Deep merge two theme objects
 * Source properties override target properties
 */
export function mergeThemes(
  target: ExhibitTheme,
  source: Partial<ExhibitTheme>
): ExhibitTheme {
  const result = { ...target } as Record<keyof ExhibitTheme, ExhibitTheme[keyof ExhibitTheme]>;

  for (const key of Object.keys(source) as Array<keyof ExhibitTheme>) {
    const sourceValue = source[key];
    if (sourceValue === undefined) continue;

    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue)
    ) {
      result[key] = {
        ...(target[key] as Record<string, unknown>),
        ...(sourceValue as Record<string, unknown>),
      } as ExhibitTheme[typeof key];
    } else {
      result[key] = sourceValue as ExhibitTheme[typeof key];
    }
  }

  return result as ExhibitTheme;
}

/**
 * Blend two themes based on a ratio (0 = target, 1 = source)
 */
export function blendThemes(
  target: ExhibitTheme,
  source: ExhibitTheme,
  ratio: number
): ExhibitTheme {
  if (ratio <= 0) return target;
  if (ratio >= 1) return source;

  // For simplicity, just merge colors with blend
  // Full color blending would require oklch parsing
  const result = mergeThemes(target, {});

  // Blend colors if both have them
  if (target.colors && source.colors) {
    result.colors = { ...target.colors };
    // In a full implementation, we'd interpolate oklch values
    // For now, just use source colors at higher blend ratios
    if (ratio > 0.5) {
      result.colors = { ...result.colors, ...source.colors };
    }
  }

  return result;
}

/**
 * Generate CSS variables from a theme
 */
export function themeToCSS(theme: ExhibitTheme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      vars[`--color-${key}`] = value;
    }
  }

  // Background
  if (theme.background) {
    vars['--bg-type'] = theme.background.type;
    vars['--bg-value'] = getBackgroundCSS(theme.background);
    if (theme.background.overlay) {
      vars['--bg-overlay'] = theme.background.overlay;
    }
  }

  // Typography
  if (theme.typography) {
    if (theme.typography.heading) {
      vars['--font-heading'] = theme.typography.heading.family;
      if (theme.typography.heading.weight) {
        vars['--font-heading-weight'] = String(theme.typography.heading.weight);
      }
      if (theme.typography.heading.letterSpacing) {
        vars['--font-heading-tracking'] = theme.typography.heading.letterSpacing;
      }
    }
    if (theme.typography.body) {
      vars['--font-body'] = theme.typography.body.family;
      if (theme.typography.body.weight) {
        vars['--font-body-weight'] = String(theme.typography.body.weight);
      }
      if (theme.typography.body.lineHeight) {
        vars['--font-body-leading'] = String(theme.typography.body.lineHeight);
      }
    }
    if (theme.typography.mono) {
      vars['--font-mono'] = theme.typography.mono.family;
    }
    if (theme.typography.scale) {
      vars['--font-scale'] = String(theme.typography.scale);
    }
  }

  // Radius
  if (theme.radius) {
    const radiusValues = getRadiusValues(theme.radius);
    vars['--radius-sm'] = radiusValues.sm || '4px';
    vars['--radius-md'] = radiusValues.md || '8px';
    vars['--radius-lg'] = radiusValues.lg || '12px';
    vars['--radius-full'] = radiusValues.full || '9999px';
  }

  // Shadows
  if (theme.effects?.shadows) {
    vars['--shadow'] = getShadowCSS(theme.effects.shadows);
  }

  // Grain
  if (theme.effects?.grain) {
    vars['--grain-enabled'] = theme.effects.grain.enabled ? '1' : '0';
    vars['--grain-opacity'] = String(theme.effects.grain.opacity);
  }

  // Glow
  if (theme.effects?.glow) {
    vars['--glow-enabled'] = theme.effects.glow.enabled ? '1' : '0';
    vars['--glow-color'] = theme.effects.glow.color;
    vars['--glow-spread'] = `${theme.effects.glow.spread}px`;
  }

  // Interactions
  if (theme.interactions?.hover) {
    const hover = theme.interactions.hover;
    if (hover.scale) vars['--hover-scale'] = String(hover.scale);
    if (hover.lift) vars['--hover-lift'] = `${hover.lift}px`;
    if (hover.timing) vars['--hover-timing'] = `${hover.timing}ms`;
    if (hover.easing) vars['--hover-easing'] = hover.easing;
  }

  return vars;
}

/**
 * Get background CSS value
 */
export function getBackgroundCSS(bg: ThemeBackground): string {
  switch (bg.type) {
    case 'color':
      return bg.value;
    case 'gradient':
      return bg.value;
    case 'image':
      return `url(${bg.value})`;
    case 'pattern':
      return `url(${bg.value})`;
    case 'video':
      return 'transparent'; // Video handled separately
    default:
      return bg.value;
  }
}

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeToRoot(theme: ExhibitTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const vars = themeToCSS(theme);

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

/**
 * Reset theme to default
 */
export function resetThemeOnRoot(): void {
  applyThemeToRoot(defaultTheme);
}

/**
 * Load Google Font dynamically
 */
export function loadFont(family: string): void {
  if (typeof document === 'undefined') return;

  const fontId = `font-${family.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

/**
 * Load all fonts from a theme
 */
export function loadThemeFonts(theme: ExhibitTheme): void {
  if (theme.typography?.heading?.family) {
    loadFont(theme.typography.heading.family);
  }
  if (theme.typography?.body?.family) {
    loadFont(theme.typography.body.family);
  }
  if (theme.typography?.mono?.family) {
    loadFont(theme.typography.mono.family);
  }
}

/**
 * Alias for themeToCSS - generates CSS variables from a theme
 * Used by IsolatedPreview for scoped theming
 */
export const generateThemeCSSVariables = themeToCSS;
