'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HeroTeaser() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-12 pt-10 sm:pt-20 pb-20 sm:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 sm:gap-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[rgba(22,35,43,0.12)] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#2F6F62] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#16232B] opacity-70">The Freelancer's Edge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight font-[var(--font-fraunces)] text-[#16232B]">
            Stop guessing your runway. <br/>
            <span className="text-[#2F6F62] italic">Know your numbers.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-[#16232B] opacity-80 leading-relaxed max-w-xl">
            A professional ledger for irregular income. Automatically calculate your conservative survival floor, 
            capital reserves, and stress-test your cash flow before disaster strikes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#16232B] text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#2F6F62] transition-colors"
            >
              Enter the Ledger <ArrowRight size={16} />
            </Link>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center justify-center gap-2 bg-white border border-[#16232B]/20 text-[#16232B] px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#F1F4F2] transition-colors cursor-pointer"
            >
              <Play size={16} fill="currentColor" /> {isPlaying ? 'Pause Simulation' : 'See How It Works'}
            </button>
          </div>
          
          <div className="flex items-center gap-3 pt-4 sm:pt-6 opacity-60">
            <ShieldCheck size={18} className="text-[#2F6F62] shrink-0" />
            <p className="text-xs sm:text-sm">100% Client-Side Privacy. Zero server ingestion unless you choose to create an account.</p>
          </div>
        </motion.div>

        {/* Right Teaser Visual (Framer Motion) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full min-h-[460px] sm:h-[500px] bg-white hairline-all shadow-md p-6 sm:p-8 overflow-hidden flex flex-col justify-between"
        >
          {/* Mock App Chrome */}
          <div className="flex justify-between items-center hairline-b pb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#B4573F]/70" />
              <div className="w-3 h-3 rounded-full bg-[#C98A3E]/70" />
              <div className="w-3 h-3 rounded-full bg-[#2F6F62]/70" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#5C6D77] font-[var(--font-mono)]">
              Calm Ledger Live Simulation
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center my-6">
            <motion.div 
              animate={{ 
                y: isPlaying ? [0, -8, 0] : 0 
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="space-y-4"
            >
              <span className="inline-block text-[10px] uppercase tracking-widest text-[#2F6F62] bg-[#2F6F62]/10 border border-[#2F6F62]/20 px-2.5 py-0.5 font-mono">
                Conservative Survival Horizon
              </span>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#5C6D77]">
                Zero-Income Exhaustion Date
              </h3>
              <div className="text-4xl sm:text-5xl md:text-6xl font-[var(--font-fraunces)] text-[#16232B] tracking-tight">
                Nov 18, 2025
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <div className="px-3 py-1 bg-[#F1F4F2] border border-[#16232B]/10 text-xs font-[var(--font-mono)] text-[#16232B]">
                  Buffer: <strong className="text-[#0f564a]">4.2 Mo</strong>
                </div>
                <div className="px-3 py-1 bg-[#F1F4F2] border border-[#16232B]/10 text-xs font-[var(--font-mono)] text-[#16232B]">
                  Floor: <strong>$3,300/mo</strong>
                </div>
                <div className="px-3 py-1 bg-[#F1F4F2] border border-[#16232B]/10 text-xs font-[var(--font-mono)] text-[#5C6D77]">
                  Burn: $76/day
                </div>
              </div>
            </motion.div>

            {/* Simulated Chart */}
            <div className="absolute bottom-4 left-0 w-full h-16 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                <motion.path 
                  d="M0,24 Q25,10 50,14 T100,5"
                  fill="none"
                  stroke="#2F6F62"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isPlaying ? 1 : 0.85 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </div>

          <div className="pt-4 hairline-t flex items-center justify-between text-[11px] font-mono text-[#5C6D77] relative z-10 bg-white">
            <span>Audited Balance: Balanced</span>
            <span className="text-[#0f564a] font-semibold">20th Percentile Safe</span>
          </div>

          {isPlaying && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
               <h4 className="font-[var(--font-fraunces)] text-2xl text-[#16232B]">
                 Ready to audit your real cash flow?
               </h4>
               <p className="text-xs text-[#5C6D77] max-w-xs leading-relaxed">
                 Enter your freelance invoices or load sample numbers to reveal your true survival horizon.
               </p>
               <Link href="/dashboard" className="bg-[#16232B] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#2F6F62] transition-colors shadow-lg">
                 Enter The Full Workstation
               </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
