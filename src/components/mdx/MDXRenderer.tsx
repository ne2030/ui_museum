'use client';

import React, { useMemo } from 'react';

interface MDXRendererProps {
  /** Compiled MDX code string from Velite */
  code: string;
  /** Additional class name for wrapper */
  className?: string;
}

/**
 * Renders compiled MDX code from Velite
 * Executes the code string and renders the resulting React component
 *
 * SECURITY NOTE:
 * This component uses `new Function()` to execute compiled MDX code.
 * This is safe in our context because:
 * 1. Code is compiled by Velite at BUILD TIME from trusted MDX files in content/
 * 2. No user input or external sources can inject code at runtime
 * 3. Only pre-vetted MDX content from the repository is executed
 *
 * If the content source changes (e.g., CMS, user uploads), this approach
 * should be replaced with a sandboxed iframe or server-side rendering.
 */
export function MDXRenderer({ code, className = '' }: MDXRendererProps) {
  const Component = useMemo(() => {
    if (!code) return null;

    try {
      // The compiled MDX code from Velite destructures jsx/jsxs from arguments[0]
      // Format: const{jsx:e,jsxs:t}=arguments[0]; ... return{default:...}
      // Create jsx runtime that the compiled code expects via arguments[0]

      // Helper to ensure array children have keys
      const ensureKeys = (children: unknown): React.ReactNode => {
        if (Array.isArray(children)) {
          return children.map((child, index) => {
            if (React.isValidElement(child) && child.key == null) {
              return React.cloneElement(child, { key: index });
            }
            return child;
          });
        }
        return children as React.ReactNode;
      };

      const runtime = {
        jsx: (type: string | React.ComponentType, props: Record<string, unknown>, maybeKey?: string) => {
          const { children, key: propsKey, ...rest } = props;
          const key = maybeKey ?? propsKey;
          return React.createElement(type, key != null ? { ...rest, key } : rest, ensureKeys(children));
        },
        jsxs: (type: string | React.ComponentType, props: Record<string, unknown>, maybeKey?: string) => {
          const { children, key: propsKey, ...rest } = props;
          const key = maybeKey ?? propsKey;
          return React.createElement(type, key != null ? { ...rest, key } : rest, ensureKeys(children));
        },
        Fragment: React.Fragment,
      };

      // Create function with React in scope, code will access runtime via arguments[0]
      const fn = new Function('React', `return (function() { ${code} }).apply(this, [arguments[1]])`);

      // Execute with React as named param and runtime as arguments[1] -> becomes arguments[0] inside
      const result = fn(React, runtime);

      // Return the default export (the MDX component)
      return result?.default || null;
    } catch (error) {
      console.error('Error rendering MDX:', error);
      return null;
    }
  }, [code]);

  if (!Component) {
    return (
      <div className={`text-center text-[var(--color-muted)] py-8 ${className}`}>
        <p>Failed to render component</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Component />
    </div>
  );
}
