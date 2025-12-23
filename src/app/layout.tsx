import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme/engine';
import { GalleryProvider } from '@/lib/gallery/context';
import { BackgroundLayer } from '@/components/layout/BackgroundLayer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UI Museum | A Curated Gallery of Interface Design',
  description:
    'Explore beautiful UI components from the best designers and products. Each exhibit transforms the gallery to match its design context.',
  keywords: ['UI', 'design', 'components', 'gallery', 'museum', 'interface'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased grain-overlay theme-transition">
        <ThemeProvider>
          <GalleryProvider>
            <BackgroundLayer />
            <div className="relative z-10">{children}</div>
          </GalleryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
