import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Vercel
  output: 'export',

  // Fix workspace root detection
  outputFileTracingRoot: __dirname,

  // Required for static export
  images: {
    unoptimized: true,
  },

  // Empty turbopack config to silence the warning (we use webpack for Velite)
  turbopack: {},

  // Webpack configuration for Velite
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

// Velite webpack plugin to run velite before build
class VeliteWebpackPlugin {
  static started = false;

  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = process.argv.includes('dev');
      const { build } = await import('velite');
      await build({ watch: dev, clean: !dev });
    });
  }
}

export default nextConfig;
