import { defineConfig, defineCollection, s } from 'velite';

// === THEME SCHEMAS ===

const backgroundSchema = s.object({
  type: s.enum(['color', 'gradient', 'image', 'pattern', 'video']),
  value: s.string(),
  overlay: s.string().optional(),
  blur: s.number().optional(),
  position: s.string().optional(),
  size: s.string().optional(),
});

const typographyStyleSchema = s.object({
  family: s.string(),
  weight: s.union([s.number(), s.string()]).optional(),
  letterSpacing: s.string().optional(),
  lineHeight: s.union([s.string(), s.number()]).optional(),
  textTransform: s.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
});

const typographySchema = s.object({
  heading: typographyStyleSchema.optional(),
  body: typographyStyleSchema.optional(),
  mono: typographyStyleSchema.optional(),
  scale: s.number().optional(),
});

const spacingSchema = s.object({
  unit: s.number().optional(),
  density: s.enum(['compact', 'normal', 'spacious']).optional(),
});

const radiusSchema = s.object({
  style: s.enum(['sharp', 'subtle', 'rounded', 'pill']),
  values: s
    .object({
      sm: s.string().optional(),
      md: s.string().optional(),
      lg: s.string().optional(),
      full: s.string().optional(),
    })
    .optional(),
});

const grainSchema = s.object({
  enabled: s.boolean(),
  opacity: s.number(),
});

const glowSchema = s.object({
  enabled: s.boolean(),
  color: s.string(),
  spread: s.number(),
});

const effectsSchema = s.object({
  shadows: s
    .union([s.enum(['none', 'soft', 'hard', 'layered']), s.record(s.string())])
    .optional(),
  grain: grainSchema.optional(),
  glow: glowSchema.optional(),
  blur: s
    .object({
      enabled: s.boolean(),
      amount: s.number(),
    })
    .optional(),
});

const hoverInteractionSchema = s.object({
  scale: s.number().optional(),
  lift: s.number().optional(),
  glow: s.boolean().optional(),
  colorShift: s.string().optional(),
  timing: s.number().optional(),
  easing: s.string().optional(),
});

const clickInteractionSchema = s.object({
  scale: s.number().optional(),
  feedback: s.enum(['ripple', 'press', 'bounce', 'none']).optional(),
});

const focusInteractionSchema = s.object({
  outline: s.boolean().optional(),
  ring: s
    .object({
      color: s.string(),
      width: s.number(),
    })
    .optional(),
});

const interactionsSchema = s.object({
  hover: hoverInteractionSchema.optional(),
  click: clickInteractionSchema.optional(),
  focus: focusInteractionSchema.optional(),
});

const enterAnimationSchema = s.object({
  type: s.enum(['fade', 'slide', 'scale', 'spring', 'blur']),
  duration: s.number(),
  delay: s.number().optional(),
  stagger: s.number().optional(),
  from: s.record(s.any()).optional(),
});

const idleAnimationSchema = s.object({
  type: s.enum(['float', 'pulse', 'shimmer', 'none']),
  duration: s.number().optional(),
});

const customAnimationSchema = s.object({
  name: s.string(),
  keyframes: s.string(),
  trigger: s.enum(['hover', 'click', 'focus', 'always']),
});

const animationsSchema = s.object({
  enter: enterAnimationSchema.optional(),
  exit: enterAnimationSchema.optional(),
  idle: idleAnimationSchema.optional(),
  custom: s.array(customAnimationSchema).optional(),
});

const metaSchema = s.object({
  service: s.string(),
  designSystem: s.string().optional(),
  era: s.string().optional(),
  philosophy: s.string().optional(),
  changes: s.string().optional(),
});

const themeSchema = s.object({
  background: backgroundSchema.optional(),
  colors: s.record(s.string()).optional(),
  typography: typographySchema.optional(),
  spacing: spacingSchema.optional(),
  radius: radiusSchema.optional(),
  effects: effectsSchema.optional(),
  interactions: interactionsSchema.optional(),
  animations: animationsSchema.optional(),
  meta: metaSchema.optional(),
});

const sourceSchema = s.object({
  designer: s.string(),
  designerUrl: s.string().url().optional(),
  company: s.string().optional(),
  originalUrl: s.string().url().optional(),
  designSystem: s.string().optional(),
});

// === EXHIBIT COLLECTION ===

const exhibits = defineCollection({
  name: 'Exhibit',
  pattern: 'exhibits/**/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.slug('exhibits'),
    description: s.string().optional(),
    source: sourceSchema,
    theme: themeSchema,
    tags: s.array(s.string()).optional(),
    category: s
      .enum([
        'buttons',
        'cards',
        'navigation',
        'forms',
        'modals',
        'animations',
        'layouts',
        'data-display',
        'other',
      ])
      .default('other'),
    featured: s.boolean().default(false),
    thumbnail: s.string().optional(),
    code: s.mdx(),
    metadata: s.metadata(),
  }),
});

// === CONFIG ===

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { exhibits },
  mdx: {
    gfm: true,
    removeComments: true,
    copyLinkedFiles: true,
  },
});
