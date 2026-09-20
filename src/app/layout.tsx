import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { TransitionProvider } from '@/components/TransitionProvider';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cashfloor.app'),
  title: {
    default: 'CashFloor — Irregular Income & Cash Runway Calculator',
    template: '%s | CashFloor',
  },
  description:
    'A quiet, mathematically conservative runway and income floor calculator for freelancers, consultants, and independent contractors. Stress-test delayed invoices and tax obligations without bank logins.',
  keywords: [
    'freelance runway calculator',
    'irregular income calculator',
    'consultant cash flow simulator',
    '20th percentile cash floor',
    'cash floor calculator',
    'quarterly estimated taxes freelancer',
    'independent contractor financial planning',
  ],
  authors: [{ name: 'CashFloor Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cashfloor.app',
    title: 'CashFloor — 20th Percentile Freelance Runway Simulator',
    description:
      'Stop relying on optimistic averages. Model worst-case payment delays, client churn, and quarterly tax drag with zero bank surveillance.',
    siteName: 'CashFloor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CashFloor Conservative Cash Flow Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CashFloor — 20th Percentile Freelance Runway Simulator',
    description:
      'Conservative runway and cash flow stress testing for independent consultants and freelancers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CashFloor',
  operatingSystem: 'Any web browser',
  applicationCategory: 'FinanceApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Conservative 20th-percentile cash flow runway calculator and stress tester for freelancers, solopreneurs, and independent consultants.',
  featureList: [
    '20th-percentile conservative runway simulation',
    'Quarterly estimated tax drag modeling',
    'Invoice payment delay stress testing',
    'Zero-telemetry client-side privacy',
    'Double-entry CSV export',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('cf-theme');
                const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const resolved = stored ?? (system ? 'dark' : 'dark');
                document.documentElement.setAttribute('data-theme', resolved);
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-[var(--cf-accent)] selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <AuthModal />
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
