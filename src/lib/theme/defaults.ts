import type { ExhibitTheme } from './types';

/**
 * Default Museum Theme
 * Warm, refined, gallery-like atmosphere
 * Serves as the base that all transitions return to
 */
export const defaultTheme: ExhibitTheme = {
  background: {
    type: 'color',
    value: 'oklch(0.97 0.01 80)', // Warm cream
  },

  colors: {
    primary: 'oklch(0.45 0.03 60)', // Warm brown
    secondary: 'oklch(0.55 0.02 65)', // Lighter warm
    surface: 'oklch(0.98 0.008 75)', // Off-white
    text: 'oklch(0.25 0.02 60)', // Dark warm
    muted: 'oklch(0.65 0.02 70)', // Muted warm
    border: 'oklch(0.88 0.015 75)', // Soft border
    accent: 'oklch(0.55 0.12 50)', // Terracotta
  },

  typography: {
    heading: {
      family: 'Inter',
      weight: 500,
      letterSpacing: '-0.02em',
    },
    body: {
      family: 'Inter',
      weight: 400,
      lineHeight: 1.6,
    },
    mono: {
      family: 'JetBrains Mono',
      weight: 400,
    },
    scale: 1,
  },

  spacing: {
    unit: 4,
    density: 'normal',
  },

  radius: {
    style: 'subtle',
    values: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
  },

  effects: {
    shadows: 'soft',
    grain: {
      enabled: true,
      opacity: 0.03,
    },
  },

  interactions: {
    hover: {
      scale: 1.02,
      lift: -2,
      timing: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    click: {
      scale: 0.98,
      feedback: 'press',
    },
    focus: {
      outline: false,
      ring: {
        color: 'oklch(0.55 0.12 50)', // Terracotta
        width: 2,
      },
    },
  },

  animations: {
    enter: {
      type: 'fade',
      duration: 600,
    },
  },

  meta: {
    service: 'UI Museum',
    philosophy: 'Warm, refined, gallery-like atmosphere',
  },
};

/**
 * Get shadow CSS based on shadow style
 */
export function getShadowCSS(style: string | Record<string, string> | undefined): string {
  if (!style || style === 'none') return 'none';

  if (typeof style === 'object') {
    return Object.values(style).join(', ');
  }

  switch (style) {
    case 'soft':
      return '0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.04)';
    case 'hard':
      return '0 2px 4px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)';
    case 'layered':
      return '0 1px 1px rgba(0,0,0,0.04), 0 2px 2px rgba(0,0,0,0.04), 0 4px 4px rgba(0,0,0,0.04), 0 8px 8px rgba(0,0,0,0.04), 0 16px 16px rgba(0,0,0,0.04)';
    default:
      return 'none';
  }
}

/**
 * Get radius CSS based on radius style
 */
export function getRadiusValues(radius: ExhibitTheme['radius']): Record<string, string> {
  if (radius?.values) return radius.values;

  switch (radius?.style) {
    case 'sharp':
      return { sm: '0px', md: '0px', lg: '2px', full: '9999px' };
    case 'subtle':
      return { sm: '4px', md: '8px', lg: '12px', full: '9999px' };
    case 'rounded':
      return { sm: '8px', md: '12px', lg: '16px', full: '9999px' };
    case 'pill':
      return { sm: '9999px', md: '9999px', lg: '9999px', full: '9999px' };
    default:
      return { sm: '4px', md: '8px', lg: '12px', full: '9999px' };
  }
}
