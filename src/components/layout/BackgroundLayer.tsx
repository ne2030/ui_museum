'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/lib/theme/engine';
import { isAllowedURL } from '@/lib/theme/utils';
import { useEffect, useRef, useState } from 'react';

// ============================================
// Types
// ============================================

type RGB = [number, number, number];

interface GradientStop {
  color: RGB;
  position: number; // 0-100
}

interface ParsedGradient {
  type: 'linear' | 'radial' | 'solid';
  angle: number;
  stops: GradientStop[];
}

// ============================================
// Color Parsing & Interpolation
// ============================================

// Convert oklch to RGB
function oklchToRgb(l: number, c: number, h: number): RGB {
  // Convert oklch to oklab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert oklab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Convert linear RGB to sRGB
  const toSrgb = (x: number) => {
    if (x <= 0.0031308) return x * 12.92;
    return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  };

  return [
    Math.round(Math.max(0, Math.min(255, toSrgb(r) * 255))),
    Math.round(Math.max(0, Math.min(255, toSrgb(g) * 255))),
    Math.round(Math.max(0, Math.min(255, toSrgb(bl) * 255))),
  ];
}

function parseColor(color: string): RGB | null {
  // Handle hex
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
  }

  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
  }

  // Handle oklch
  const oklchMatch = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (oklchMatch) {
    const l = parseFloat(oklchMatch[1]);
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    return oklchToRgb(l, c, h);
  }

  return null;
}

function lerpRgb(from: RGB, to: RGB, t: number): RGB {
  return [
    Math.round(from[0] + (to[0] - from[0]) * t),
    Math.round(from[1] + (to[1] - from[1]) * t),
    Math.round(from[2] + (to[2] - from[2]) * t),
  ];
}

function rgbToString(rgb: RGB): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// ============================================
// Gradient Parsing
// ============================================

function parseGradient(gradient: string): ParsedGradient | null {
  // Try linear-gradient
  const linearMatch = gradient.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
  if (linearMatch) {
    const angle = parseInt(linearMatch[1]);
    const stops = parseColorStops(linearMatch[2]);
    if (stops.length > 0) {
      return { type: 'linear', angle, stops };
    }
  }

  // Try radial-gradient (treat as linear with 180deg for interpolation)
  const radialMatch = gradient.match(/radial-gradient\([^,]*,\s*(.+)\)/);
  if (radialMatch) {
    const stops = parseColorStops(radialMatch[1]);
    if (stops.length > 0) {
      return { type: 'radial', angle: 180, stops };
    }
  }

  // Try solid color
  const solidColor = parseColor(gradient);
  if (solidColor) {
    return {
      type: 'solid',
      angle: 180,
      stops: [
        { color: solidColor, position: 0 },
        { color: solidColor, position: 100 },
      ],
    };
  }

  return null;
}

function parseColorStops(stopsStr: string): GradientStop[] {
  const stops: GradientStop[] = [];
  // Match color followed by optional percentage
  const regex = /(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))\s*(\d+)?%?/g;
  let match;

  while ((match = regex.exec(stopsStr)) !== null) {
    const color = parseColor(match[1]);
    const position = match[2] ? parseInt(match[2]) : null;
    if (color) {
      stops.push({ color, position: position ?? -1 }); // -1 means auto
    }
  }

  // Fill in auto positions
  if (stops.length > 0) {
    // First and last default to 0 and 100
    if (stops[0].position === -1) stops[0].position = 0;
    if (stops[stops.length - 1].position === -1) stops[stops.length - 1].position = 100;

    // Fill middle ones
    for (let i = 1; i < stops.length - 1; i++) {
      if (stops[i].position === -1) {
        // Find next defined position
        let nextDefined = i + 1;
        while (nextDefined < stops.length && stops[nextDefined].position === -1) {
          nextDefined++;
        }
        // Interpolate
        const prevPos = stops[i - 1].position;
        const nextPos = stops[nextDefined].position;
        const count = nextDefined - i + 1;
        stops[i].position = prevPos + ((nextPos - prevPos) * (1)) / count;
      }
    }
  }

  return stops;
}

// ============================================
// Gradient Normalization (match stop counts)
// ============================================

function sampleGradientAt(stops: GradientStop[], position: number): RGB {
  // Find surrounding stops
  let left = stops[0];
  let right = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (stops[i].position <= position && stops[i + 1].position >= position) {
      left = stops[i];
      right = stops[i + 1];
      break;
    }
  }

  if (left.position === right.position) {
    return left.color;
  }

  const t = (position - left.position) / (right.position - left.position);
  return lerpRgb(left.color, right.color, t);
}

function normalizeGradients(
  from: ParsedGradient,
  to: ParsedGradient
): [ParsedGradient, ParsedGradient] {
  const maxStops = Math.max(from.stops.length, to.stops.length);

  const normalizedFrom = expandStops(from, maxStops);
  const normalizedTo = expandStops(to, maxStops);

  return [normalizedFrom, normalizedTo];
}

function expandStops(gradient: ParsedGradient, targetCount: number): ParsedGradient {
  if (gradient.stops.length >= targetCount) {
    return gradient;
  }

  const newStops: GradientStop[] = [];

  // Create evenly distributed positions
  for (let i = 0; i < targetCount; i++) {
    const position = (i / (targetCount - 1)) * 100;
    const color = sampleGradientAt(gradient.stops, position);
    newStops.push({ color, position });
  }

  return { ...gradient, stops: newStops };
}

// ============================================
// Gradient Interpolation
// ============================================

function interpolateGradients(
  from: ParsedGradient,
  to: ParsedGradient,
  t: number
): string {
  // Normalize to same number of stops
  const [normFrom, normTo] = normalizeGradients(from, to);

  // Interpolate angle
  const angle = Math.round(normFrom.angle + (normTo.angle - normFrom.angle) * t);

  // Interpolate each stop
  const stops = normFrom.stops.map((fromStop, i) => {
    const toStop = normTo.stops[i];
    const color = lerpRgb(fromStop.color, toStop.color, t);
    const position = fromStop.position + (toStop.position - fromStop.position) * t;
    return { color, position: Math.round(position) };
  });

  // Build gradient string
  const stopsStr = stops.map((s) => `${rgbToString(s.color)} ${s.position}%`).join(', ');

  // Use target type for output (prefer linear for mixed)
  const type = to.type === 'radial' && from.type === 'radial' ? 'radial' : 'linear';

  if (type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`;
  }
  return `linear-gradient(${angle}deg, ${stopsStr})`;
}

// Main interpolation function
function interpolateBackground(from: string, to: string, progress: number): string {
  const fromParsed = parseGradient(from);
  const toParsed = parseGradient(to);

  if (!fromParsed || !toParsed) {
    // Can't parse, just switch at midpoint
    return progress > 0.5 ? to : from;
  }

  return interpolateGradients(fromParsed, toParsed, progress);
}

// Easing function (ease-out cubic)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Dynamic background layer that transitions with theme changes
 * Uses JS color interpolation for smooth gradient transitions
 */
export function BackgroundLayer() {
  const { theme } = useTheme();

  const bgType = theme.background?.type || 'color';
  const bgValue = theme.background?.value || '#f5f5f5';
  const bgOverlay = theme.background?.overlay;

  // Track previous background for interpolation
  const prevBgRef = useRef<string>(bgValue);
  const [displayBg, setDisplayBg] = useState(bgValue);
  const animationRef = useRef<number | null>(null);

  // When background changes, animate the transition
  useEffect(() => {
    const prevValue = prevBgRef.current;

    // Skip if same value
    if (prevValue === bgValue) {
      return;
    }

    // For images/patterns/videos, just set directly
    if (bgType === 'image' || bgType === 'pattern' || bgType === 'video') {
      setDisplayBg(bgValue);
      prevBgRef.current = bgValue;
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Animation parameters
    const duration = 500; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeOutCubic(rawProgress);

      const interpolated = interpolateBackground(prevValue, bgValue, progress);
      setDisplayBg(interpolated);

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        prevBgRef.current = bgValue;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bgValue, bgType]);

  // Determine background style based on type
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (bgType) {
      case 'image':
      case 'pattern':
        // Validate URL before using in CSS
        if (!isAllowedURL(bgValue)) {
          console.warn(`Blocked unsafe background URL: ${bgValue}`);
          return { background: '#f5f5f5' };
        }
        return {
          backgroundImage: `url(${bgValue})`,
          backgroundSize: theme.background?.size || 'cover',
          backgroundPosition: theme.background?.position || 'center',
          backgroundRepeat: bgType === 'pattern' ? 'repeat' : 'no-repeat',
        };
      case 'gradient':
      case 'color':
      default:
        return {
          background: displayBg,
        };
    }
  };

  return (
    <>
      {/* Main background with JS-interpolated gradients */}
      <div className="fixed inset-0 -z-20" style={getBackgroundStyle()} />

      {/* Optional overlay for images */}
      {bgOverlay && (
        <motion.div
          className="fixed inset-0 -z-10"
          style={{ background: bgOverlay }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      )}

      {/* Blur effect if enabled */}
      {theme.background?.blur && theme.background.blur > 0 && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            backdropFilter: `blur(${theme.background.blur}px)`,
          }}
        />
      )}

      {/* Video background - only render if URL is safe */}
      {bgType === 'video' && isAllowedURL(bgValue) && (
        <video
          className="fixed inset-0 -z-20 w-full h-full object-cover"
          src={bgValue}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </>
  );
}
