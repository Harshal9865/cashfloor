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

export const metadata: Metadata = {
  title: 'The 20th Percentile Rule: Why Averages Kill Freelance Businesses',
  description:
    'Discover why smart independent consultants calculate runway using the 20th percentile cash floor rather than mean monthly billing. Includes interactive stress simulator.',
  openGraph: {
    title: 'The 20th Percentile Rule: Why Averages Kill Freelance Businesses',
    description:
      'Discover why smart independent consultants calculate runway using the 20th percentile cash floor rather than mean monthly billing.',
    type: 'article',
    url: 'https://calmledger.com/blog/the-20th-percentile-math',
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
    image: ['https://calmledger.com/pinterest-pin.png'],
    datePublished: '2026-09-20T08:00:00+00:00',
    dateModified: '2026-09-20T08:00:00+00:00',
    author: [
      {
        '@type': 'Organization',
        name: 'Calm Ledger Financial Research',
        url: 'https://calmledger.com',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Calm Ledger',
      logo: {
        '@type': 'ImageObject',
        url: 'https://calmledger.com/favicon.ico',
      },
    },
    description:
      'Mathematical breakdown of how independent consultants and freelancers should calculate conservative runway under extreme cash flow clustering.',
  };

  return (
    <div className="min-h-screen bg-[#F1F4F2] text-[#16232B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      {/* Editorial Header */}
      <header className="border-b border-[#16232B]/15 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-mono text-[#5C6D77] hover:text-[#16232B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Calm Ledger</span>
          </Link>

          <Link
            href="/dashboard"
            className="bg-[#2F6F62] hover:bg-[#16232B] text-white px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Launch Calculator
          </Link>
        </div>
      </header>

      {/* Main Editorial Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Article Meta */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#5C6D77]">
            <span className="bg-[#2F6F62]/10 text-[#2F6F62] px-2.5 py-1 border border-[#2F6F62]/20 font-semibold uppercase tracking-wider">
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

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#16232B] leading-[1.15]">
            The 20th Percentile Rule: Why Averages Kill Freelance Businesses
          </h1>

          <p className="text-lg text-[#5C6D77] leading-relaxed font-serif italic border-l-2 border-[#2F6F62] pl-4">
            If your financial safety margin is calibrated to your average monthly earnings, you are quietly operating on borrowed time. Here is the mathematical defense.
          </p>
        </div>

        {/* Lead Content */}
        <article className="prose prose-slate max-w-none space-y-6 text-[#16232B] leading-relaxed text-base">
          <p>
            Every veteran independent consultant remembers the month the averages failed them. 
            On paper, the business was thriving: trailing twelve-month revenue was $115,000, 
            equating to an ostensibly healthy $9,580 per month. Living and business overhead was $5,200.
            The spreadsheet insisted the founder possessed an infinite runway.
          </p>

          <p>
            Then November happened:
          </p>

          <ul className="list-none pl-0 space-y-3 font-mono text-xs bg-white border border-[#16232B]/10 p-5">
            <li className="flex items-start space-x-2">
              <span className="text-[#B4573F] font-bold">01.</span>
              <span><strong>Client A</strong> delayed Net-30 invoice sign-off for 44 days due to enterprise corporate holiday budget freezes.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#B4573F] font-bold">02.</span>
              <span><strong>Client B</strong> unexpectedly churned after an internal re-org eliminated their marketing contractor budget.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#B4573F] font-bold">03.</span>
              <span><strong>Q4 Estimated Taxes</strong> arrived simultaneously on January 15th: $4,800 due to federal and state revenue departments.</span>
            </li>
          </ul>

          <p>
            The cash buffer vaporized within 45 days. The consultant was forced to accept desperate, 
            low-margin subcontracting work just to pay rent. <em>The business did not fail because it wasn&apos;t profitable. It failed because averages conceal variance.</em>
          </p>

          {/* Callout Box */}
          <div className="bg-[#16232B] text-[#F1F4F2] p-6 border-l-4 border-[#C18C5D] my-8">
            <div className="flex items-center space-x-2 text-[#C18C5D] font-mono text-xs uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Axiom</span>
            </div>
            <p className="font-serif text-lg italic text-[#F1F4F2]/90 leading-snug">
              &quot;Never calculate your survival margin against your mean performance. 
              The financial markets do not reward optimism in solvency; they reward resilience against the 20th percentile trough.&quot;
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#16232B] pt-6 border-t border-[#16232B]/10">
            What Is the 20th Percentile (P20) Cash Floor?
          </h2>

          <p>
            In statistical distributions of irregular cash flow, the <strong>20th percentile</strong> represents 
            the revenue threshold below which your income falls only 20% of the time (1 out of every 5 months).
            It reflects the simultaneous clustering of predictable headwinds:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 bg-white border border-[#16232B]/10">
              <div className="font-mono text-xs text-[#2F6F62] uppercase tracking-wider font-semibold mb-1">Factor 01</div>
              <h4 className="font-serif font-bold text-sm text-[#16232B]">Payment Velocity Lag</h4>
              <p className="text-xs text-[#5C6D77] mt-1.5 leading-normal">
                Receivables are delayed by an average of 18 to 32 days beyond stated Net terms.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#16232B]/10">
              <div className="font-mono text-xs text-[#B4573F] uppercase tracking-wider font-semibold mb-1">Factor 02</div>
              <h4 className="font-serif font-bold text-sm text-[#16232B]">Project Gaps</h4>
              <p className="text-xs text-[#5C6D77] mt-1.5 leading-normal">
                The seasonal dead zone between Thanksgiving and mid-January when project kickoffs stall.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#16232B]/10">
              <div className="font-mono text-xs text-[#875205] uppercase tracking-wider font-semibold mb-1">Factor 03</div>
              <h4 className="font-serif font-bold text-sm text-[#16232B]">Quarterly Tax Drag</h4>
              <p className="text-xs text-[#5C6D77] mt-1.5 leading-normal">
                Self-employment (15.3%) plus income taxes biting precisely when liquidity is low.
              </p>
            </div>
          </div>

          {/* Interactive Widget Embedded Right in the Editorial */}
          <h2 className="font-serif text-2xl font-bold text-[#16232B] pt-4">
            Stress-Test Your Own Runway Below
          </h2>
          <p className="text-sm text-[#5C6D77]">
            Drag the sliders to see how payment delays and client churn depress your realistic runway compared to naive arithmetic.
          </p>

          <InteractiveRunwayP20Widget />

          <h2 className="font-serif text-2xl font-bold text-[#16232B] pt-4 border-t border-[#16232B]/10">
            The 4 Rules for Implementing Calm Solvency
          </h2>

          <div className="space-y-4 my-6">
            <div className="flex items-start space-x-3 p-4 bg-white border border-[#16232B]/10">
              <CheckCircle2 className="w-5 h-5 text-[#2F6F62] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[#16232B]">
                  1. Maintain a Dedicated Tax Escrow Sub-Account
                </h4>
                <p className="text-xs text-[#5C6D77] mt-1 leading-relaxed">
                  Every time an invoice is paid into your operating checking account, immediately skim 25% to 30% into a secondary high-yield savings account labeled &quot;Tax Escrow&quot;. Treat that money as if it already belongs to the state.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-[#16232B]/10">
              <CheckCircle2 className="w-5 h-5 text-[#2F6F62] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[#16232B]">
                  2. Budget Base Living Expenses to the P20 Floor, Not the Peak
                </h4>
                <p className="text-xs text-[#5C6D77] mt-1 leading-relaxed">
                  Fixed personal and business obligations (rent, insurance, software, baseline nutrition) must never exceed your P20 floor. When windfall months happen, direct 80% to replenishing your 6-month buffer.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-[#16232B]/10">
              <CheckCircle2 className="w-5 h-5 text-[#2F6F62] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[#16232B]">
                  3. Enforce 50% Upfront Retainers
                </h4>
                <p className="text-xs text-[#5C6D77] mt-1 leading-relaxed">
                  Never finance client corporate operations out of your pocket. Billing 50% deposit upfront shifts liquidity risk back to the capitalized institution and guarantees cash inflows before work commences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-[#16232B]/10">
              <CheckCircle2 className="w-5 h-5 text-[#2F6F62] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[#16232B]">
                  4. Review Your Double-Entry Ledger Monthly
                </h4>
                <p className="text-xs text-[#5C6D77] mt-1 leading-relaxed">
                  Use Calm Ledger to run scenario simulations each month. If your P20 runway dips below 3.0 months, trigger immediate business conservation protocols before an emergency strikes.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="my-12 p-8 bg-[#16232B] text-[#F1F4F2] text-center border border-[#16232B]/20 shadow-md">
            <h3 className="font-serif text-2xl font-bold text-[#F1F4F2]">
              Ready to Model Your Complete Runway?
            </h3>
            <p className="text-xs text-[#F1F4F2]/70 max-w-lg mx-auto mt-2 mb-6 leading-relaxed font-sans">
              Enter your income streams, ongoing fixed retainers, and expenses into Calm Ledger. 
              No bank logins or surveillance required — 100% private, client-side financial clarity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard"
                className="bg-[#2F6F62] hover:bg-[#3d8c7c] text-white px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold transition-colors inline-flex items-center justify-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Open Calm Ledger Workspace</span>
              </Link>
              <Link
                href="/"
                className="border border-[#F1F4F2]/30 hover:border-white text-[#F1F4F2] px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#16232B]/15 bg-white py-8 text-center text-xs font-mono text-[#5C6D77]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Calm Ledger. Mathematical conservatism for independent professionals.</p>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-[#16232B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#16232B] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
