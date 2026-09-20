import MarketingNav from '@/components/MarketingNav';
import HeroTeaser from '@/components/marketing/HeroTeaser';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import CtaSection from '@/components/marketing/CtaSection';
import ScrollAnimationSection from '@/components/marketing/ScrollAnimationSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CashFloor | The Freelancer\'s Edge',
  description: 'A professional ledger for irregular income. Calculate your conservative survival floor and stress-test your cash flow.',
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      {/* Dark glassmorphism sticky navbar */}
      <MarketingNav />

      <main>
        {/* Full-screen immersive hero */}
        <HeroTeaser />

        {/* Scroll Animation Section */}
        <ScrollAnimationSection />

        {/* Feature cards */}
        <FeaturesSection />

        {/* CTA + How it works */}
        <CtaSection />
      </main>

      {/* Footer */}
      <footer
        className="py-10 text-center bg-[var(--cf-bg-deep)] border-t border-[var(--cf-border)]"
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs mb-6 text-[var(--cf-text-muted)]">
            <a href="/blog/the-20th-percentile-math" className="hover:text-[var(--cf-accent-bright)] transition-colors font-semibold">
              The 20th Percentile Rule
            </a>
            <a href="/privacy" className="hover:text-[var(--cf-text)] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[var(--cf-text)] transition-colors">Terms of Service</a>
            <a href="/dashboard" className="hover:text-[var(--cf-accent-bright)] transition-colors font-semibold">Dashboard →</a>
          </div>
          <p className="text-xs max-w-xl mx-auto mb-4 leading-relaxed text-[var(--cf-text-muted)]">
            <strong className="text-[var(--cf-text)]">Disclaimer:</strong> CashFloor is an educational simulation tool.
            It does not provide financial, tax, or legal advice.
          </p>
          <p className="text-[var(--cf-text-muted)] text-xs">
            &copy; {new Date().getFullYear()} CashFloor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
