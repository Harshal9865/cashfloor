'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/marketing/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

const BLOG_POSTS = [
  {
    slug: 'the-20th-percentile-math',
    title: 'The 20th Percentile Math: Why Average Income is a Trap',
    excerpt: 'Most freelancers calculate their runway based on their average monthly income. Here is the mathematical proof of why that leads to anxiety and insolvency.',
    date: 'Sep 12, 2026',
    category: 'Finance Methodology'
  },
  {
    slug: 'fx-volatility-freelance',
    title: 'Surviving FX Volatility with Foreign Clients',
    excerpt: 'Working across borders means dealing with exchange rates and hidden fees. Learn how applying a 3% conservative haircut protects your runway.',
    date: 'Sep 18, 2026',
    category: 'Advanced Strategy'
  },
  {
    slug: 'feast-or-famine-cycle',
    title: 'Breaking the Feast or Famine Cycle',
    excerpt: 'A comprehensive guide on structuring your emergency buffer and tax escrow to completely eliminate financial anxiety during lean months.',
    date: 'Sep 21, 2026',
    category: 'Mental Health'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-24 px-6 relative z-10 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[600px] rounded-[100%] blur-[120px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} />

        <div className="w-full max-w-4xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
            >
              The CashFloor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-accent)] to-[var(--cf-steady)]">Journal</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              Insights, mathematical modeling, and strategies for modern freelancers to achieve ultimate financial peace of mind.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {BLOG_POSTS.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="h-full p-8 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex flex-col gap-4 shadow-sm transition-all hover:shadow-md hover:border-[var(--cf-text-muted)]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[var(--cf-surface-alt)] text-[var(--cf-accent)] border border-[var(--cf-border)]">
                      {post.category}
                    </span>
                    <span className="text-xs font-mono text-[var(--cf-text-faint)]">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 mt-auto">
                    <span className="text-sm font-semibold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] flex items-center gap-1">
                      Read Article &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
