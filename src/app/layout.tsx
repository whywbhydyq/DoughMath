import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import Link from 'next/link';
import { AdSenseAutoAds } from '@/components/AdSenseAutoAds';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://doughmath.ymirtool.com'),
  title: { default: 'Bread & Sourdough Calculators for Formula Math | DoughMath', template: '%s' },
  description: 'Use DoughMath to calculate baker’s percentages, sourdough hydration, starter feedings, dough scaling, and pizza dough weights locally in your browser.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'Bread & Sourdough Calculators for Formula Math | DoughMath',
    description: 'Use DoughMath to calculate baker’s percentages, sourdough hydration, starter feedings, dough scaling, and pizza dough weights locally in your browser.'
  },
  other: { 'google-adsense-account': 'ca-pub-1653188471819736' }
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const links = [
  ['bakers-percentage-calculator', 'Baker’s %'],
  ['sourdough-hydration-calculator', 'Hydration'],
  ['starter-feeding-calculator', 'Starter'],
  ['dough-scaling-calculator', 'Scaling'],
  ['pizza-dough-calculator', 'Pizza']
] as const;
const legal = [['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/disclaimer', 'Disclaimer'], ['/contact', 'Contact'], ['/affiliate-disclosure', 'Affiliate disclosure']];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdSenseAutoAds />
        <header className="no-print border-b bg-white">
          <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-2">
            <Link href="/" className="shrink-0 text-xl font-bold text-dough-900">DoughMath</Link>
            <nav className="no-scrollbar flex gap-3 overflow-x-auto whitespace-nowrap text-sm" aria-label="Main navigation">
              {links.map(([slug, label]) => <Link className="text-stone-700 hover:text-dough-700" key={slug} href={`/${slug}`}>{label}</Link>)}
            </nav>
          </div>
        </header>
        {children}
        <footer className="no-print mt-16 border-t bg-white">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-stone-600 sm:grid-cols-3">
            <p>DoughMath calculates bread formulas locally in your browser. No account, uploads, or cloud recipe storage.</p>
            {legal.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
