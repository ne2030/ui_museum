/**
 * Flexible theme system for UI Museum
 * Each exhibit defines its complete visual and behavioral context
 */

// === VISUAL DNA ===

export interface ThemeBackground {
  type: 'color' | 'gradient' | 'image' | 'pattern' | 'video';
  value: string; // CSS color, gradient, or URL
  overlay?: string; // Optional color overlay on images
  blur?: number; // Backdrop blur amount
  position?: string; // background-position
  size?: string; // background-size
}

export interface ThemeTypographyStyle {
  family: string;
  weight?: number | string;
  letterSpacing?: string;
  lineHeight?: string | number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ThemeTypography {
  heading?: ThemeTypographyStyle;
  body?: ThemeTypographyStyle;
  mono?: ThemeTypographyStyle;
  scale?: number; // Base font size multiplier
}

export interface ThemeSpacing {
  unit?: number; // Base unit (4, 8, etc.)
  density?: 'compact' | 'normal' | 'spacious';
}

export interface ThemeRadius {
  style: 'sharp' | 'subtle' | 'rounded' | 'pill';
  values?: {
    sm?: string;
    md?: string;
    lg?: string;
    full?: string;
  };
}

export interface ThemeGrain {
  enabled: boolean;
  opacity: number;
}

export interface ThemeGlow {
  enabled: boolean;
  color: string;
  spread: number;
}

export interface ThemeEffects {
  shadows?: 'none' | 'soft' | 'hard' | 'layered' | Record<string, string>;
  grain?: ThemeGrain;
  glow?: ThemeGlow;
  blur?: {
    enabled: boolean;
    amount: number;
  };
}

// === INTERACTION PATTERNS ===

export interface ThemeHoverInteraction {
  scale?: number;
  lift?: number; // translateY in px (negative = up)
  glow?: boolean;
  colorShift?: string; // Target color on hover
  timing?: number; // ms
  easing?: string; // CSS easing or spring config
}

export interface ThemeClickInteraction {
  scale?: number;
  feedback?: 'ripple' | 'press' | 'bounce' | 'none';
}

export interface ThemeFocusInteraction {
  outline?: boolean;
  ring?: {
    color: string;
    width: number;
  };
}

export interface ThemeInteractions {
  hover?: ThemeHoverInteraction;
  click?: ThemeClickInteraction;
  focus?: ThemeFocusInteraction;
}

// === ANIMATION LOGIC ===

export interface ThemeEnterAnimation {
  type: 'fade' | 'slide' | 'scale' | 'spring' | 'blur';
  duration: number;
  delay?: number;
  stagger?: number; // For children
  from?: Record<string, unknown>; // Initial state
}

export interface ThemeIdleAnimation {
  type: 'float' | 'pulse' | 'shimmer' | 'none';
  duration?: number;
}

export interface ThemeCustomAnimation {
  name: string;
  keyframes: string; // CSS keyframes
  trigger: 'hover' | 'click' | 'focus' | 'always';
}

export interface ThemeAnimations {
  enter?: ThemeEnterAnimation;
  exit?: ThemeEnterAnimation;
  idle?: ThemeIdleAnimation;
  custom?: ThemeCustomAnimation[];
}

// === DESIGN CONTEXT ===

export interface ThemeMeta {
  service: string; // "Stripe", "Linear", etc.
  designSystem?: string; // "Vercel Geist", "Linear Design"
  era?: string; // "2024", "v3.0"
  philosophy?: string; // Design philosophy notes
  changes?: string; // How theme evolved over time
}

// === COMPLETE THEME ===

export interface ExhibitTheme {
  // Visual DNA
  background?: ThemeBackground;
  colors?: Record<string, string>; // Flexible: { primary, accent, surface, text, ... }
  typography?: ThemeTypography;
  spacing?: ThemeSpacing;
  radius?: ThemeRadius;
  effects?: ThemeEffects;

  // Interaction Patterns
  interactions?: ThemeInteractions;

  // Animation Logic
  animations?: ThemeAnimations;

  // Design Context
  meta?: ThemeMeta;
}

// === EXHIBIT ===

export interface ExhibitSource {
  designer: string;
  designerUrl?: string;
  company?: string;
  originalUrl?: string;
  designSystem?: string;
}

export type ExhibitCategory =
  | 'buttons'
  | 'cards'
  | 'navigation'
  | 'forms'
  | 'modals'
  | 'animations'
  | 'layouts'
  | 'data-display'
  | 'other';

export interface Exhibit {
  title: string;
  slug: string;
  description?: string;
  source: ExhibitSource;
  theme: ExhibitTheme;
  tags?: string[];
  category: ExhibitCategory;
  featured?: boolean;
  thumbnail?: string;
  code?: string; // Compiled MDX code from Velite
}

// === THEME ENGINE OPTIONS ===

export interface ApplyThemeOptions {
  preview?: boolean; // Partial application for hover preview
  blend?: number; // 0-1, how much to blend with current theme
  full?: boolean; // Full override for focus mode
  transition?: number; // Override transition duration in ms
}
