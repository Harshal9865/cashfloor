import type { Metadata } from 'next';
import Link from 'next/link';
import { InteractiveRunwayP20Widget } from '@/components/blog/InteractiveRunwayP20Widget';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';

export const metadata: Metadata = {
  title: 'The 20th Percentile Rule: Why Averages Kill Freelance Businesses',
  description:
    'Discover why smart independent consultants calculate runway using the 20th percentile cash floor rather than mean monthly billing. Includes interactive stress simulator.',
  openGraph: {
    title: 'The 20th Percentile Rule: Why Averages Kill Freelance Businesses',
    description:
      'Discover why smart independent consultants calculate runway using the 20th percentile cash floor rather than mean monthly billing.',
    type: 'article',
    url: 'https://cashfloor.app/blog/the-20th-percentile-math',
    images: [
      {
        url: '/pinterest-pin.png',
        width: 1000,
        height: 1500,
        alt: 'The 20th Percentile Cash Flow Formula for Freelancers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The 20th Percentile Rule: Why Averages Kill Freelance Businesses',
    description:
      'Why naive averages leave independent consultants exposed to cash flow ruin.',
    images: ['/pinterest-pin.png'],
  },
};

export default function BlogPostPage() {
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The 20th Percentile Rule: Why Averages Kill Freelance Businesses',
    image: ['https://cashfloor.app/pinterest-pin.png'],
    datePublished: '2026-09-20T08:00:00+00:00',
    dateModified: '2026-09-20T08:00:00+00:00',
    author: [
      {
        '@type': 'Organization',
        name: 'CashFloor Financial Research',
        url: 'https://cashfloor.app',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'CashFloor',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cashfloor.app/favicon.ico',
      },
    },
    description:
      'Mathematical breakdown of how independent consultants and freelancers should calculate conservative runway under extreme cash flow clustering.',
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--cf-bg)] text-[var(--cf-text)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <DashboardNav />

      {/* Main Editorial Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Article Meta */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--cf-text-muted)]">
            <span className="bg-[var(--cf-accent-bg)] text-[var(--cf-accent-bright)] px-2.5 py-1 border border-[var(--cf-accent)]/20 font-semibold uppercase tracking-wider">
              Fintech Research Note #04
            </span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>September 2026</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>6 min read</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--cf-text)] leading-[1.15]">
            The 20th Percentile Rule: Why Averages Kill Freelance Businesses
          </h1>

          <p className="text-lg text-[var(--cf-text-muted)] leading-relaxed font-serif italic border-l-2 border-[var(--cf-accent)] pl-4">
            If your financial safety margin is calibrated to your average monthly earnings, you are quietly operating on borrowed time. Here is the mathematical defense.
          </p>
        </div>

        {/* Lead Content */}
        <article className="prose prose-slate max-w-none space-y-6 text-[var(--cf-text)] leading-relaxed text-base">
          <p>
            Every veteran independent consultant remembers the month the averages failed them. 
            On paper, the business was thriving: trailing twelve-month revenue was $115,000, 
            equating to an ostensibly healthy $9,580 per month. Living and business overhead was $5,200.
            The spreadsheet insisted the founder possessed an infinite runway.
          </p>

          <p>
            Then November happened:
          </p>

          <ul className="list-none pl-0 space-y-3 font-mono text-xs bg-[var(--cf-surface)] border border-[var(--cf-border)] p-5">
            <li className="flex items-start space-x-2">
              <span className="text-[var(--cf-caution)] font-bold">01.</span>
              <span><strong>Client A</strong> delayed Net-30 invoice sign-off for 44 days due to enterprise corporate holiday budget freezes.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[var(--cf-caution)] font-bold">02.</span>
              <span><strong>Client B</strong> unexpectedly churned after an internal re-org eliminated their marketing contractor budget.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[var(--cf-caution)] font-bold">03.</span>
              <span><strong>Q4 Estimated Taxes</strong> arrived simultaneously on January 15th: $4,800 due to federal and state revenue departments.</span>
            </li>
          </ul>

          <p>
            The cash buffer vaporized within 45 days. The consultant was forced to accept desperate, 
            low-margin subcontracting work just to pay rent. <em>The business did not fail because it wasn&apos;t profitable. It failed because averages conceal variance.</em>
          </p>

          {/* Callout Box */}
          <div className="bg-[var(--cf-surface-alt)] text-[var(--cf-text)] p-6 border-l-4 border-[var(--cf-warm)] my-8">
            <div className="flex items-center space-x-2 text-[var(--cf-warm)] font-mono text-xs uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Axiom</span>
            </div>
            <p className="font-serif text-lg italic leading-snug">
              &quot;Never calculate your survival margin against your mean performance. 
              The financial markets do not reward optimism in solvency; they reward resilience against the 20th percentile trough.&quot;
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[var(--cf-text)] pt-6 border-t border-[var(--cf-hairline)]">
            What Is the 20th Percentile (P20) Cash Floor?
          </h2>

          <p>
            In statistical distributions of irregular cash flow, the <strong>20th percentile</strong> represents 
            the revenue threshold below which your income falls only 20% of the time (1 out of every 5 months).
            It reflects the simultaneous clustering of predictable headwinds:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <div className="font-mono text-xs text-[var(--cf-accent-bright)] uppercase tracking-wider font-semibold mb-1">Factor 01</div>
              <h4 className="font-serif font-bold text-sm text-[var(--cf-text)]">Payment Velocity Lag</h4>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1.5 leading-normal">
                Receivables are delayed by an average of 18 to 32 days beyond stated Net terms.
              </p>
            </div>

            <div className="p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <div className="font-mono text-xs text-[var(--cf-caution)] uppercase tracking-wider font-semibold mb-1">Factor 02</div>
              <h4 className="font-serif font-bold text-sm text-[var(--cf-text)]">Project Gaps</h4>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1.5 leading-normal">
                The seasonal dead zone between Thanksgiving and mid-January when project kickoffs stall.
              </p>
            </div>

            <div className="p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <div className="font-mono text-xs text-[var(--cf-warm)] uppercase tracking-wider font-semibold mb-1">Factor 03</div>
              <h4 className="font-serif font-bold text-sm text-[var(--cf-text)]">Quarterly Tax Drag</h4>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1.5 leading-normal">
                Self-employment (15.3%) plus income taxes biting precisely when liquidity is low.
              </p>
            </div>
          </div>

          {/* Interactive Widget Embedded Right in the Editorial */}
          <h2 className="font-serif text-2xl font-bold text-[var(--cf-text)] pt-4">
            Stress-Test Your Own Runway Below
          </h2>
          <p className="text-sm text-[var(--cf-text-muted)]">
            Drag the sliders to see how payment delays and client churn depress your realistic runway compared to naive arithmetic.
          </p>

          <InteractiveRunwayP20Widget />

          <h2 className="font-serif text-2xl font-bold text-[var(--cf-text)] pt-4 border-t border-[var(--cf-hairline)]">
            The 4 Rules for Implementing Calm Solvency
          </h2>

          <div className="space-y-4 my-6">
            <div className="flex items-start space-x-3 p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--cf-accent)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[var(--cf-text)]">
                  1. Maintain a Dedicated Tax Escrow Sub-Account
                </h4>
                <p className="text-xs text-[var(--cf-text-muted)] mt-1 leading-relaxed">
                  Every time an invoice is paid into your operating checking account, immediately skim 25% to 30% into a secondary high-yield savings account labeled &quot;Tax Escrow&quot;. Treat that money as if it already belongs to the state.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--cf-accent)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[var(--cf-text)]">
                  2. Budget Base Living Expenses to the P20 Floor, Not the Peak
                </h4>
                <p className="text-xs text-[var(--cf-text-muted)] mt-1 leading-relaxed">
                  Fixed personal and business obligations (rent, insurance, software, baseline nutrition) must never exceed your P20 floor. When windfall months happen, direct 80% to replenishing your 6-month buffer.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--cf-accent)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[var(--cf-text)]">
                  3. Enforce 50% Upfront Retainers
                </h4>
                <p className="text-xs text-[var(--cf-text-muted)] mt-1 leading-relaxed">
                  Never finance client corporate operations out of your pocket. Billing 50% deposit upfront shifts liquidity risk back to the capitalized institution and guarantees cash inflows before work commences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-[var(--cf-surface)] border border-[var(--cf-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--cf-accent)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[var(--cf-text)]">
                  4. Review Your Double-Entry Ledger Monthly
                </h4>
                <p className="text-xs text-[var(--cf-text-muted)] mt-1 leading-relaxed">
                  Use CashFloor to run scenario simulations each month. If your P20 runway dips below 3.0 months, trigger immediate business conservation protocols before an emergency strikes.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="my-12 p-8 bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] shadow-md text-center rounded-xl">
            <h3 className="font-serif text-2xl font-bold text-[var(--cf-text)]">
              Ready to Model Your Complete Runway?
            </h3>
            <p className="text-xs text-[var(--cf-text-muted)] max-w-lg mx-auto mt-2 mb-6 leading-relaxed font-sans">
              Enter your income streams, ongoing fixed retainers, and expenses into CashFloor. 
              No bank logins or surveillance required — 100% private, client-side financial clarity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard"
                className="bg-[var(--cf-accent)] hover:bg-[var(--cf-accent-bright)] text-white px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold transition-colors inline-flex items-center justify-center space-x-2 rounded-lg"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Open CashFloor Workspace</span>
              </Link>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--cf-border)] bg-[var(--cf-bg-deep)] py-8 text-center text-xs font-mono text-[var(--cf-text-muted)]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CashFloor. Mathematical conservatism for independent professionals.</p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-[var(--cf-text)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--cf-text)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
