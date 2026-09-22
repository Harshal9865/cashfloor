import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import { getFullArticleBySlug, CORNERSTONE_POSTS } from '@/lib/blog/blogService';
import { REAL_BLOG_ARTICLES } from '@/lib/blog/articles';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  BarChart3, 
  ArrowRight,
  Share2
} from 'lucide-react';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return REAL_BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getFullArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found | CashFloor' };

  return {
    title: `${article.title} | CashFloor Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const article = getFullArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300 flex flex-col font-sans">
      <MarketingNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-20 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Journal</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] border border-[var(--cf-accent)]/20">
            {article.category}
          </span>
        </div>

        {/* Article Hero */}
        <header className="space-y-5">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--cf-text)] leading-[1.2]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--cf-text-muted)] leading-relaxed font-sans">
            {article.subtitle}
          </p>

          {/* Author Card & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--cf-border)]">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[var(--cf-border)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--cf-text)]">{article.author.name}</p>
                <p className="text-xs text-[var(--cf-text-muted)]">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[var(--cf-text-muted)]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readingTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {article.coverImage && (
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-[var(--cf-border)] relative shadow-lg">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-serif font-bold text-base">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Executive Summary &amp; Key Takeaways</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--cf-text-muted)] leading-relaxed">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mathematical Formula Box (if applicable) */}
        {article.formulaTex && (
          <div className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3 shadow-sm">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--cf-accent)] uppercase tracking-wider font-semibold">
              <BarChart3 className="w-4 h-4" />
              <span>{article.formulaTitle || 'Financial Engineering Derivation'}</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] font-mono text-sm sm:text-base text-[var(--cf-text)] overflow-x-auto text-center font-bold">
              {article.formulaTex}
            </div>
            {article.formulaExplanation && (
              <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed italic">
                {article.formulaExplanation}
              </p>
            )}
          </div>
        )}

        {/* Worked Numerical Example */}
        {article.workedExample && (
          <div className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[var(--cf-text)]">
                Worked Numerical Example
              </h3>
              <p className="text-xs text-[var(--cf-text-muted)]">{article.workedExample.scenario}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-[var(--cf-border)] text-[var(--cf-text-muted)]">
                    <th className="py-2.5 px-3">Decision Metric</th>
                    <th className="py-2.5 px-3 text-rose-500">Naive / Unhedged Approach</th>
                    <th className="py-2.5 px-3 text-emerald-600">CashFloor Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cf-border-soft)]">
                  {article.workedExample.table.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--cf-surface-alt)]/50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[var(--cf-text)]">{row.metric}</td>
                      <td className="py-2.5 px-3 text-[var(--cf-text-muted)]">{row.naiveApproach}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.cashFloorApproach}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              <strong>Verdict:</strong> {article.workedExample.verdict}
            </div>
          </div>
        )}

        {/* Long-form Article Content Sections */}
        <div className="space-y-8 font-sans text-sm sm:text-base leading-relaxed text-[var(--cf-text)]">
          {article.contentSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--cf-text)] tracking-tight">
                {section.heading}
              </h2>

              <div className="space-y-4 text-[var(--cf-text-muted)]">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {section.callout && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                    section.callout.type === 'warning'
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                      : section.callout.type === 'tip'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {section.callout.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  ) : section.callout.type === 'tip' ? (
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <span>{section.callout.text}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Card: Model This in Your Studio Dashboard */}
        <div className="p-8 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-5 text-center shadow-xl relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: 'var(--cf-accent)' }}
          />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Financial Engineering</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cf-text)]">
            Ready to calculate your true survival runway?
          </h3>

          <p className="text-sm text-[var(--cf-text-muted)] max-w-xl mx-auto leading-relaxed">
            Stop guessing your cash floor. Ingest your banking statement or paste your last 12 months of client receipts to calculate your P20 floor and safe weekly owner draw in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white transition-all shadow-lg hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <span>Open Studio Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read More Guides</span>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
