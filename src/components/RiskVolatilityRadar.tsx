'use client';

import React from 'react';
import { VolatilityMetrics, ClientConcentration } from '../lib/calculator/types';
import { AlertTriangle, CheckCircle2, Gauge, Users, Lock } from 'lucide-react';

interface RiskVolatilityRadarProps {
  volatility: VolatilityMetrics;
  clientConcentrations: ClientConcentration[];
  currencySymbol?: string;
  isLocked?: boolean;
  onUnlockRequest?: () => void;
}

export const RiskVolatilityRadar: React.FC<RiskVolatilityRadarProps> = ({
  volatility,
  clientConcentrations,
  currencySymbol = '$',
  isLocked = false,
  onUnlockRequest,
}) => {
  const getVolatilityBadge = () => {
    switch (volatility.volatilityTier) {
      case 'calm':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#2F6F62] bg-[#2F6F62]/10 border border-[#2F6F62]/30 px-2.5 py-0.5 uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Calm Equilibrium
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#875205] bg-[#C98A3E]/10 border border-[#C98A3E]/40 px-2.5 py-0.5 uppercase tracking-wider">
            <Gauge className="w-3 h-3" /> Moderate Variance
          </span>
        );
      case 'volatile':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B4573F] bg-[#B4573F]/10 border border-[#B4573F]/30 px-2.5 py-0.5 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" /> Elevated Volatility
          </span>
        );
    }
  };

  const highRiskClient = clientConcentrations.find((c) => c.isHighRisk);

  return (
    <section className="bg-white hairline-all p-6 md:p-8 space-y-6 transition-colors relative" id="risk-radar">
      {isLocked && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <button 
            onClick={onUnlockRequest}
            className="bg-[#16232B] hover:bg-[#2F6F62] text-white px-6 py-3 flex items-center gap-2 text-sm font-mono uppercase tracking-widest shadow-xl transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Unlock Volatility Radar</span>
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 hairline-b pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#16232B] font-normal tracking-tight">
              Volatility &amp; Concentration Risk Radar
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-[#E8EDE9] px-2 py-0.5 border border-[#16232B]/10 text-[#5C6D77]">
              HHI Risk Model
            </span>
          </div>
          <p className="font-sans text-xs text-[#5C6D77] mt-0.5">
            Statistical measurement of cash swing variance and client revenue dependency.
          </p>
        </div>
        {getVolatilityBadge()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {/* Volatility Metrics */}
        <div className="space-y-3 p-4 bg-[#F5FAFF] hairline-all">
          <div className="font-mono text-[10px] text-[#5C6D77] uppercase font-semibold pb-1 hairline-b flex justify-between">
            <span>Statistical Dispersion</span>
            <span>CV = σ / μ</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#5C6D77]">Coefficient of Variation (CV)</span>
            <span className="font-mono font-bold text-sm text-[#16232B] tabular-nums">
              {volatility.coefficientOfVariation}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#5C6D77]">Monthly Standard Dev (σ)</span>
            <span className="font-mono font-semibold text-[#16232B] tabular-nums">
              ±{currencySymbol}{volatility.standardDeviation.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#5C6D77]">Peak to Trough Ratio</span>
            <span className="font-mono font-semibold text-[#16232B] tabular-nums">
              {volatility.peakToTroughRatio}x ({currencySymbol}{volatility.maxMonth.toLocaleString()} vs {currencySymbol}{volatility.minMonth.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Client Concentration Risk */}
        <div className="space-y-3 p-4 bg-[#F5FAFF] hairline-all">
          <div className="font-mono text-[10px] text-[#5C6D77] uppercase font-semibold pb-1 hairline-b flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Client Revenue Split
            </span>
            <span>{clientConcentrations.length} sources tracked</span>
          </div>

          <div className="space-y-2">
            {clientConcentrations.slice(0, 4).map((c, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-[#16232B] truncate max-w-[180px] font-medium">{c.tag}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="tabular-nums font-semibold text-[#16232B]">
                    {c.percentageOfTotal}%
                  </span>
                  {c.isHighRisk && (
                    <span className="text-[10px] text-[#B4573F] bg-[#B4573F]/10 border border-[#B4573F]/30 px-1.5 py-0.5 uppercase tracking-wider">
                      Single Point Failure
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {highRiskClient && (
            <p className="text-[11px] text-[#B4573F] pt-2 hairline-t font-mono leading-relaxed">
              Alert: &ldquo;{highRiskClient.tag}&rdquo; represents {highRiskClient.percentageOfTotal}% of your gross billings. Losing this contract would drop you immediately into cash burn.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
