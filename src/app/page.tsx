import Header from '@/components/Header';
import HeroTeaser from '@/components/marketing/HeroTeaser';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calm Ledger | The Freelancer\'s Edge',
  description: 'A professional ledger for irregular income. Calculate your conservative survival floor and stress-test your cash flow.',
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#F1F4F2] text-[#16232B] font-[var(--font-plex)] selection:bg-[#2F6F62] selection:text-white pb-24">
      {/* 
        We pass a prop to Header indicating we are on the marketing page, 
        so it shows "Go to Dashboard" instead of app controls.
      */}
      <Header isMarketingPage={true} />
      
      <main className="flex-1">
        <HeroTeaser />
        
        {/* Value Proposition Section */}
        <section className="max-w-5xl mx-auto px-4 md:px-12 py-24 border-t border-[rgba(22,35,43,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="text-xl font-[var(--font-fraunces)] mb-4">Zero Assumptions</h3>
              <p className="opacity-70 leading-relaxed">
                We calculate your runway based on a mathematically conservative 20th percentile floor, ignoring windfall spikes that distort simple averages.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-[var(--font-fraunces)] mb-4">Capital Partitioning</h3>
              <p className="opacity-70 leading-relaxed">
                Instantly route incoming gross payments into 5 strict reserve pillars: Taxes, Operating Buffer, Living Stipend, Client Deficits, and Discretionary Growth.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-[var(--font-fraunces)] mb-4">Stress-Testing Lab</h3>
              <p className="opacity-70 leading-relaxed">
                Run disaster simulations in one click. What happens if you lose your biggest client? What if a $20k invoice is 90 days late? Know before it happens.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(22,35,43,0.12)] py-12 text-center text-[#5C6D77] text-sm">
        <div className="max-w-5xl mx-auto px-4">
          <p className="mb-4 text-xs max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> Calm Ledger is an educational simulation tool designed to model hypothetical cash flow scenarios for freelancers. It does not provide financial, tax, or legal advice.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <a href="/blog/the-20th-percentile-math" className="text-[#2F6F62] hover:underline font-semibold transition-colors">The 20th Percentile Rule (Guide)</a>
            <a href="/privacy" className="hover:text-[#16232B] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#16232B] transition-colors">Terms of Service</a>
          </div>
          <p className="mt-6 opacity-60">
            &copy; {new Date().getFullYear()} Calm Ledger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
