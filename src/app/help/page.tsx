'use client';

import React from 'react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import { HelpCircle, Mail, MessageCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col font-sans">
      <MarketingNav />
      
      <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-24 px-6 relative z-10 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[600px] rounded-[100%] blur-[120px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} />

        <div className="w-full max-w-4xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] mb-4"
            >
              <HelpCircle className="w-10 h-10 text-[var(--cf-accent)]" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
            >
              How can we help?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              Whether you need help understanding the 20th Percentile math, configuring your emergency buffer, or integrating your bank, we're here for you.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <HelpCard 
              icon={<FileText />}
              title="Documentation"
              description="Read our comprehensive guides on how to export CSVs from your bank, Upwork, and Stripe."
              actionText="Read Docs"
            />
            <HelpCard 
              icon={<Mail />}
              title="Email Support"
              description="Drop us a line at support@cashfloor.com. We typically reply within 24 hours."
              actionText="Email Us"
            />
            <HelpCard 
              icon={<MessageCircle />}
              title="Community Discord"
              description="Join hundreds of other freelancers discussing finances, pricing, and runway math."
              actionText="Join Discord"
            />
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function HelpCard({ icon, title, description, actionText }: { icon: React.ReactNode, title: string, description: string, actionText: string }) {
  return (
    <div className="p-8 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-[var(--cf-surface-alt)] flex items-center justify-center text-[var(--cf-accent)] border border-[var(--cf-border)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[var(--cf-text)]">{title}</h3>
      <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed flex-1">
        {description}
      </p>
      <button className="mt-4 px-4 py-2 self-start rounded-lg text-sm font-semibold transition-colors border hover:bg-[var(--cf-surface-alt)]" style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}>
        {actionText}
      </button>
    </div>
  );
}
