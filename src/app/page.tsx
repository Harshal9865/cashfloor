import MarketingNav from '@/components/MarketingNav';
import HeroTeaser from '@/components/marketing/HeroTeaser';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import CtaSection from '@/components/marketing/CtaSection';
import ScrollAnimationSection from '@/components/marketing/ScrollAnimationSection';
import Footer from '@/components/marketing/Footer';
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
      <Footer />
    </div>
  );
}
