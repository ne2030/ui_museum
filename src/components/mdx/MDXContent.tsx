'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';
import type { ComponentType, ReactNode } from 'react';

/**
 * Custom MDX components that can be used in exhibit MDX files
 */
const mdxComponents = {
  // Motion-enhanced components
  motion,

  // Theme-aware wrapper
  ThemeBox: ({
    children,
    className = '',
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] ${className}`}
    >
      {children}
    </div>
  ),

  // Interactive button with theme interactions
  InteractiveButton: ({
    children,
    variant = 'primary',
    className = '',
    onClick,
  }: {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
    onClick?: () => void;
  }) => {
    const variantStyles = {
      primary:
        'bg-[var(--color-primary)] text-white hover:opacity-90',
      secondary:
        'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-border)]',
      ghost:
        'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)]',
    };

    return (
      <motion.button
        className={`px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors ${variantStyles[variant]} ${className}`}
        whileHover={{ scale: 'var(--hover-scale, 1.02)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {children}
      </motion.button>
    );
  },

  // Card component
  Card: ({
    children,
    className = '',
    padding = 'md',
  }: {
    children: ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
  }) => {
    const paddingStyles = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] ${paddingStyles[padding]} ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
  },

  // Text components with theme typography
  Heading: ({
    children,
    level = 2,
    className = '',
  }: {
    children: ReactNode;
    level?: 1 | 2 | 3 | 4;
    className?: string;
  }) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
    const sizes = {
      1: 'text-4xl',
      2: 'text-2xl',
      3: 'text-xl',
      4: 'text-lg',
    };

    return (
      <Tag
        className={`font-[var(--font-heading)] font-[var(--font-heading-weight)] tracking-[var(--font-heading-tracking)] text-[var(--color-text)] ${sizes[level]} ${className}`}
      >
        {children}
      </Tag>
    );
  },

  // Muted text
  Muted: ({
    children,
    className = '',
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <span className={`text-[var(--color-muted)] ${className}`}>{children}</span>
  ),

  // Accent text
  Accent: ({
    children,
    className = '',
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <span className={`text-[var(--color-accent)] ${className}`}>{children}</span>
  ),

  // Badge component
  Badge: ({
    children,
    variant = 'default',
    className = '',
  }: {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'accent';
    className?: string;
  }) => {
    const variantStyles = {
      default: 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]',
      primary: 'bg-[var(--color-primary)] text-white',
      accent: 'bg-[var(--color-accent)] text-white',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-full)] text-xs font-medium ${variantStyles[variant]} ${className}`}
      >
        {children}
      </span>
    );
  },

  // Divider
  Divider: ({ className = '' }: { className?: string }) => (
    <hr className={`border-t border-[var(--color-border)] my-4 ${className}`} />
  ),

  // Spacer
  Spacer: ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const sizes = { sm: 'h-2', md: 'h-4', lg: 'h-8', xl: 'h-12' };
    return <div className={sizes[size]} />;
  },

  // Input field
  Input: ({
    placeholder,
    type = 'text',
    className = '',
  }: {
    placeholder?: string;
    type?: string;
    className?: string;
  }) => (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow ${className}`}
    />
  ),

  // Flex container
  Flex: ({
    children,
    direction = 'row',
    align = 'center',
    justify = 'start',
    gap = 'md',
    className = '',
  }: {
    children: ReactNode;
    direction?: 'row' | 'col';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
  }) => {
    const gapSizes = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
    const alignMap = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
    const justifyMap = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' };

    return (
      <div
        className={`flex ${direction === 'col' ? 'flex-col' : 'flex-row'} ${alignMap[align]} ${justifyMap[justify]} ${gapSizes[gap]} ${className}`}
      >
        {children}
      </div>
    );
  },

  // Grid container
  Grid: ({
    children,
    cols = 2,
    gap = 'md',
    className = '',
  }: {
    children: ReactNode;
    cols?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
  }) => {
    const colsMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
    const gapSizes = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };

    return (
      <div className={`grid ${colsMap[cols]} ${gapSizes[gap]} ${className}`}>
        {children}
      </div>
    );
  },
};

interface MDXContentProps {
  /** The compiled MDX code from Velite */
  code?: string;
  /** The MDX component (if already compiled) */
  Component?: ComponentType<{ components: typeof mdxComponents }>;
  /** Additional class name */
  className?: string;
}

/**
 * Renders MDX content with theme-aware components
 */
export function MDXContent({ code, Component, className = '' }: MDXContentProps) {
  // Hook must be called unconditionally - before any early returns
  // If code is provided, we need to evaluate it
  // Note: This is a simplified version - in production you'd use a proper MDX runtime
  const renderedContent = useMemo(() => {
    if (!code) return null;

    // For now, just render a placeholder
    // In a full implementation, you'd use @mdx-js/mdx runtime
    return (
      <div className="text-[var(--color-muted)] text-center py-8">
        <p>Component preview</p>
      </div>
    );
  }, [code]);

  // If a Component is provided, render it directly
  if (Component) {
    return (
      <div className={`mdx-content ${className}`}>
        <Component components={mdxComponents} />
      </div>
    );
  }

  return (
    <div className={`mdx-content ${className}`}>
      {renderedContent}
    </div>
  );
}

// Export components for use in MDX files
export { mdxComponents };
