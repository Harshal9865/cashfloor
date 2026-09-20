import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  metadataBase: new URL('https://calmledger.com'),
  title: {
    default: 'Calm Ledger — Irregular Income & Cash Runway Calculator',
    template: '%s | Calm Ledger',
  },
  description:
    'A quiet, mathematically conservative runway and income floor calculator for freelancers, consultants, and independent contractors. Stress-test delayed invoices and tax obligations without bank logins.',
  keywords: [
    'freelance runway calculator',
    'irregular income calculator',
    'consultant cash flow simulator',
    '20th percentile cash flow',
    'quarterly estimated taxes freelancer',
    'independent contractor financial planning',
  ],
  authors: [{ name: 'Calm Ledger Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calmledger.com',
    title: 'Calm Ledger — 20th Percentile Freelance Runway Simulator',
    description:
      'Stop relying on optimistic averages. Model worst-case payment delays, client churn, and quarterly tax drag with zero bank surveillance.',
    siteName: 'Calm Ledger',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calm Ledger Conservative Cash Flow Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calm Ledger — 20th Percentile Freelance Runway Simulator',
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
  name: 'Calm Ledger',
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F1F4F2] text-[#16232B] font-sans selection:bg-[#2F6F62] selection:text-white">
        {children}
      </body>
    </html>
  );
}
