import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Calm Ledger',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F1F4F2] text-[#16232B] font-[var(--font-plex)] selection:bg-[#2F6F62] selection:text-white">
      <Header isMarketingPage={true} />
      
      <main className="max-w-3xl mx-auto px-6 py-24 pb-32">
        <h1 className="text-4xl font-[var(--font-fraunces)] mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="space-y-8 opacity-80 leading-relaxed text-sm md:text-base">
          <p><strong>Last Updated: September 2026</strong></p>
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-[#16232B]">1. Acceptance of Terms</h2>
            <p>By accessing or using Calm Ledger ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#16232B]">2. Important Disclaimer</h2>
            <div className="p-4 bg-[#C98A3E]/10 border border-[#C98A3E]/30 text-[#875205] rounded-xs font-medium">
              Calm Ledger is an educational simulation tool designed to model hypothetical cash flow scenarios for freelancers. <strong>It does not provide financial, tax, or legal advice.</strong> You should not rely solely on the calculations provided by this Service for critical business decisions. Always consult with a certified financial planner, accountant, or legal professional.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#16232B]">3. Freemium Model and Accounts</h2>
            <p>Certain core features of the Service are available without an account. Advanced features (such as 12-month projections and stress tests) require creating an account. You are responsible for maintaining the confidentiality of your authentication links.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#16232B]">4. Limitation of Liability</h2>
            <p>In no event shall Calm Ledger, its creators, or its affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[#16232B]">5. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
