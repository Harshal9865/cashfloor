'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/marketing/Footer';
import { Shield, Lock, Server, CheckCircle, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col font-sans">
      <Header />
      
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
              <Shield className="w-10 h-10 text-[var(--cf-steady)]" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
            >
              Bank-Grade Security.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-text)] to-[var(--cf-text-muted)]">
                Zero Compromise.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              At CashFloor, your financial data is your business. Our architecture is designed from the ground up to ensure your numbers remain private, encrypted, and secure.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <SecurityCard 
              icon={<Lock />}
              title="End-to-End Encryption"
              description="All data transmitted between your browser and our servers is encrypted using industry-standard TLS 1.3. Your data at rest is encrypted using AES-256."
            />
            <SecurityCard 
              icon={<Server />}
              title="Enterprise Infrastructure"
              description="We use Supabase and AWS to host our infrastructure, benefiting from compliance with SOC2, ISO 27001, and PCI DSS standards."
            />
            <SecurityCard 
              icon={<CheckCircle />}
              title="Row Level Security (RLS)"
              description="Your data is isolated at the database level. Strict RLS policies guarantee that your ledger can only be queried and modified by your authenticated session."
            />
            <SecurityCard 
              icon={<Key />}
              title="Secure Authentication"
              description="We use state-of-the-art authentication protocols, ensuring your login credentials and sessions are protected against modern attack vectors."
            />
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function SecurityCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-[var(--cf-surface-alt)] flex items-center justify-center text-[var(--cf-accent)] border border-[var(--cf-border)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[var(--cf-text)]">{title}</h3>
      <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
