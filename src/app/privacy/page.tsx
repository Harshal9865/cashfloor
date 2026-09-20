import DashboardNav from '@/components/DashboardNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CashFloor',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--cf-bg)] text-[var(--cf-text)] font-[var(--font-plex)]">
      <DashboardNav />
      
      <main className="max-w-3xl mx-auto px-6 py-24 pb-32">
        <h1 className="text-4xl font-[var(--font-fraunces)] mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="space-y-8 opacity-80 leading-relaxed text-sm md:text-base">
          <p><strong>Last Updated: September 2026</strong></p>
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-[var(--cf-text)]">1. Introduction</h2>
            <p>Welcome to CashFloor. We are committed to protecting your personal information and your right to privacy. Because we deal with sensitive financial simulations, our architecture is designed to minimize the data we store on our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[var(--cf-text)]">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Anonymous Usage:</strong> If you use the core calculator without an account, all financial data and ledger inputs are processed locally in your browser memory. We do not store or transmit this data to our servers.</li>
              <li><strong>Registered Users:</strong> When you create an account to unlock advanced stress-testing features, we collect your email address for authentication purposes (via magic links).</li>
              <li><strong>Saved Ledger Data:</strong> If you elect to sync your ledger to the cloud, your inputs are stored in our secure database with Row Level Security (RLS) ensuring strict isolation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[var(--cf-text)]">3. How We Use Your Information</h2>
            <p>We use your information exclusively to provide, operate, and maintain the CashFloor platform. We do not sell your personal or financial data to third parties, advertisers, or data brokers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[var(--cf-text)]">4. Security</h2>
            <p>We implement industry-standard security measures, including HTTPS encryption and strict database isolation, to protect any synced data. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-[var(--cf-text)]">5. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us via our official support channels.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
