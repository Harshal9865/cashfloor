'use client';

import React, { useState, useEffect } from 'react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  fetchLiveFreelanceArticles, 
  BlogPost, 
  CORNERSTONE_POSTS 
} from '@/lib/blog/blogService';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(CORNERSTONE_POSTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    let active = true;
    fetchLiveFreelanceArticles().then((fetched) => {
      if (active) {
        setPosts(fetched);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const categories = ['All', 'Methodology', 'Cash Management', 'Cross-Border', 'Taxes & Compliance', 'Invoicing & DSO'];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col font-sans transition-colors duration-300">
      <MarketingNav />
      
      <main className="flex-1 flex flex-col items-center justify-start pt-6 pb-24 px-4 sm:px-6 md:px-8 relative z-10 overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none" 
          style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} 
        />

        <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10">
          
          {/* Header Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Financial Engineering</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
            >
              The CashFloor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-accent)] to-emerald-500">Journal</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-base sm:text-lg text-[var(--cf-text-muted)] leading-relaxed"
            >
              Deterministic runway math, 5-pillar cash partitioning, and stress-tested volatility survival guides for consultants, contractors, and global freelancers.
            </motion.p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[var(--cf-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics, tags, math..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--cf-accent)] transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[var(--cf-accent)] text-white shadow-sm'
                        : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial Standard Notice */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Field-Tested Quantitative Research:</strong> Every journal entry contains reproducible mathematical equations, worked numerical tables, and actionable CashFloor ledger protocols.
              </span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline shrink-0"
            >
              <span>Test In Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post, index) => {
              const isExt = post.isExternal;
              
              const CardContent = (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full flex flex-col rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden shadow-sm hover:shadow-xl hover:border-[var(--cf-accent)]/50 transition-all duration-300 group cursor-pointer"
                >
                  {/* Cover image if available */}
                  {post.coverImage && (
                    <div className="h-44 w-full overflow-hidden relative bg-[var(--cf-surface-alt)]">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta badges */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--cf-text-muted)]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{post.readingTime}</span>
                        </div>
                        <span>{post.date}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    {/* Author & External Status */}
                    <div className="pt-4 border-t border-[var(--cf-border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {post.author.avatar ? (
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name} 
                            className="w-6 h-6 rounded-full object-cover border border-[var(--cf-border)]" 
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[var(--cf-surface-alt)] flex items-center justify-center text-[10px] font-bold text-[var(--cf-text-muted)]">
                            {post.author.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs font-medium text-[var(--cf-text)] truncate max-w-[120px]">
                          {post.author.name}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--cf-accent)] group-hover:translate-x-0.5 transition-transform">
                        <span>Read</span>
                        {isExt ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );

              if (isExt) {
                return (
                  <a 
                    key={post.id} 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="h-full block focus:outline-none"
                  >
                    {CardContent}
                  </a>
                );
              }

              return (
                <Link key={post.id} href={post.url} className="h-full block focus:outline-none">
                  {CardContent}
                </Link>
              );
            })}
          </div>

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-16 space-y-3">
              <BookOpen className="w-8 h-8 text-[var(--cf-text-muted)] mx-auto opacity-50" />
              <p className="text-sm text-[var(--cf-text-muted)]">No articles found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-xs font-semibold text-[var(--cf-accent)] hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
