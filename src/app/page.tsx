import MarketingNav from '@/components/MarketingNav';
import HeroTeaser from '@/components/marketing/HeroTeaser';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import CtaSection from '@/components/marketing/CtaSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CashFloor | The Freelancer\'s Edge',
  description: 'A professional ledger for irregular income. Calculate your conservative survival floor and stress-test your cash flow.',
};

export default function MarketingPage() {
  return (
    <div
      className="min-h-screen text-white selection:bg-[#2F6F62] selection:text-white"
      style={{ background: '#080C10' }}
    >
      {/* Dark glassmorphism sticky navbar */}
      <MarketingNav />

      <main>
        {/* Full-screen immersive hero */}
        <HeroTeaser />

        {/* Feature cards */}
        <FeaturesSection />

        {/* CTA + How it works */}
        <CtaSection />
      </main>

      {/* Footer */}
      <footer
        className="py-10 text-center"
        style={{
          background: '#060A0F',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs mb-6" style={{ color: '#3A5060' }}>
            <a href="/blog/the-20th-percentile-math" className="hover:text-[#3DE8C8] transition-colors font-semibold">
              The 20th Percentile Rule
            </a>
            <a href="/privacy" className="hover:text-[#9BAFBC] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#9BAFBC] transition-colors">Terms of Service</a>
            <a href="/dashboard" className="hover:text-[#3DE8C8] transition-colors font-semibold">Dashboard →</a>
          </div>
          <p className="text-xs max-w-xl mx-auto mb-4 leading-relaxed" style={{ color: '#2A3F4C' }}>
            <strong className="text-[#3A5060]">Disclaimer:</strong> CashFloor is an educational simulation tool.
            It does not provide financial, tax, or legal advice.
          </p>
          <p style={{ color: '#2A3F4C' }} className="text-xs">
            &copy; {new Date().getFullYear()} CashFloor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
