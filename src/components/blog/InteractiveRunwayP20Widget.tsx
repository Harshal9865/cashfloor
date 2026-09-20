'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Share2, ShieldAlert, Sparkles, Check, Bookmark } from 'lucide-react';

export const InteractiveRunwayP20Widget: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(8500);
  const [delayDays, setDelayDays] = useState(24);
  const [churnRisk, setChurnRisk] = useState(15);
  const [monthlyBurn, setMonthlyBurn] = useState(5200);
  const [cashBuffer, setCashBuffer] = useState(22000);
  const [copied, setCopied] = useState(false);

  // Calculations
  const stats = useMemo(() => {
    // Naive net monthly flow
    const naiveNet = monthlyRevenue - monthlyBurn;
    const naiveMonths = naiveNet >= 0 
      ? Infinity 
      : Math.abs(cashBuffer / naiveNet);

    // P20 Conservative Math:
    // 1. Churn discount: 15% lower floor
    const revenueFloor = monthlyRevenue * (1 - churnRisk / 100);
    // 2. Invoice delay drag: cash deferred into following periods (loss of liquidity during critical window)
    const delayDrag = (delayDays / 30) * (revenueFloor * 0.35);
    // 3. Self-employment tax reserve reserve (approx 25% of net profit)
    const taxReserve = Math.max(0, (revenueFloor - 1200) * 0.25);

    const effectiveP20Revenue = Math.max(0, revenueFloor - delayDrag);
    const effectiveP20Expenditure = monthlyBurn + taxReserve;
    const p20NetBurn = effectiveP20Expenditure - effectiveP20Revenue;

    const p20Months = p20NetBurn <= 0 
      ? 24 
      : Math.min(36, Math.max(0.5, cashBuffer / p20NetBurn));

    const gap = naiveMonths === Infinity ? 12 : Math.max(0, naiveMonths - p20Months);

    return {
      naiveMonths: naiveMonths === Infinity ? 'Infinite' : naiveMonths.toFixed(1) + ' Mo',
      p20Months: p20Months.toFixed(1) + ' Mo',
      gapMonths: naiveMonths === Infinity ? 'Critical Divergence' : `${gap.toFixed(1)} Months False Buffer`,
      p20Floor: Math.round(effectiveP20Revenue),
      taxDrag: Math.round(taxReserve)
    };
  }, [monthlyRevenue, delayDays, churnRisk, monthlyBurn, cashBuffer]);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(
      `"The 20th-Percentile Rule: Always calibrate your freelance financial runway to the 20th percentile cash flow floor ($${stats.p20Floor}/mo), not your average invoice volume ($${monthlyRevenue}/mo)." — Calm Ledger (https://calmledger.com/blog/the-20th-percentile-math)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const pinterestShareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
    'https://calmledger.com/blog/the-20th-percentile-math'
  )}&media=${encodeURIComponent(
    'https://calmledger.com/pinterest-pin.png'
  )}&description=${encodeURIComponent(
    'The 20th Percentile Rule for Freelancers: Why averages kill independent businesses and how to calculate your true cash floor.'
  )}`;

  return (
    <div className="my-10 border border-[#16232B]/15 bg-white shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-[#16232B] text-[#F1F4F2] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#C18C5D]" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#C18C5D]">
            Interactive Simulation / P20 Stress Test
          </h3>
        </div>
        <span className="font-mono text-[11px] text-[#F1F4F2]/60">
          Live Client-Side Calculation
        </span>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls column */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#5C6D77]">Average Invoiced Revenue / Mo</span>
                <span className="font-bold text-[#16232B]">${monthlyRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={25000}
                step={500}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F1F4F2] accent-[#2F6F62] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#5C6D77]">Avg Payment Delay on Invoices</span>
                <span className="font-bold text-[#875205]">{delayDays} Days Past Due</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={2}
                value={delayDays}
                onChange={(e) => setDelayDays(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F1F4F2] accent-[#875205] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#5C6D77]">Client Churn / Scope Dispute Risk</span>
                <span className="font-bold text-[#B4573F]">{churnRisk}% Volatility</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={5}
                value={churnRisk}
                onChange={(e) => setChurnRisk(Number(e.target.value))}
                className="w-full h-1.5 bg-[#F1F4F2] accent-[#B4573F] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#16232B]/10">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#5C6D77]">Monthly Burn</span>
                  <span className="font-bold text-[#16232B]">${monthlyBurn.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={12000}
                  step={200}
                  value={monthlyBurn}
                  onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F1F4F2] accent-[#16232B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#5C6D77]">Bank Buffer</span>
                  <span className="font-bold text-[#2F6F62]">${cashBuffer.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={80000}
                  step={1000}
                  value={cashBuffer}
                  onChange={(e) => setCashBuffer(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F1F4F2] accent-[#2F6F62] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Comparison Card */}
          <div className="lg:col-span-5 bg-[#F1F4F2] p-5 border border-[#16232B]/10 flex flex-col justify-between space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C6D77] block mb-1">
                Runway Discrepancy Analysis
              </span>
              <div className="space-y-3 mt-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#16232B]/10">
                  <span className="text-xs text-[#5C6D77]">Naive Mean Projection:</span>
                  <span className="font-mono text-sm font-semibold text-[#16232B] line-through opacity-60">
                    {stats.naiveMonths}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#16232B]/10">
                  <span className="text-xs font-semibold text-[#2F6F62]">P20 Calm Reality:</span>
                  <span className="font-serif text-2xl font-bold text-[#2F6F62]">
                    {stats.p20Months}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5C6D77]">
                  <span>P20 Revenue Floor:</span>
                  <span>${stats.p20Floor.toLocaleString()}/mo</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#875205]">
                  <span>Est. Tax Drag:</span>
                  <span>-${stats.taxDrag.toLocaleString()}/mo</span>
                </div>
              </div>
            </div>

            <div className="bg-[#B4573F]/10 border-l-2 border-[#B4573F] p-3">
              <div className="flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#B4573F] shrink-0 mt-0.5" />
                <p className="text-xs text-[#16232B] leading-relaxed">
                  <strong className="font-semibold">{stats.gapMonths}:</strong> Averages assume clients pay like clockwork. The 20th percentile forces your reserve to withstand the 1-in-5 worst drought.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 bg-[#16232B] hover:bg-[#2F6F62] text-white text-xs font-mono uppercase tracking-wider py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors text-center"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              <a
                href={pinterestShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#B4573F] text-[#B4573F] hover:bg-[#B4573F] hover:text-white text-xs font-mono uppercase tracking-wider py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors text-center"
                title="Pin this visualization to Pinterest"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Pin</span>
              </a>

              <button
                type="button"
                onClick={handleCopyCitation}
                className="border border-[#16232B]/20 hover:border-[#16232B] text-[#16232B] text-xs font-mono uppercase tracking-wider py-2.5 px-3 flex items-center justify-center space-x-1 transition-colors"
                title="Copy citation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2F6F62]" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
