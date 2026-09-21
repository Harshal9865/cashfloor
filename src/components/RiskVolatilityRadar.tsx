'use client';

import React, { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { VolatilityMetrics, ClientConcentration } from '../lib/calculator/types';
import { AlertTriangle, CheckCircle2, Gauge, Users, Lock, TrendingDown } from 'lucide-react';

interface RiskVolatilityRadarProps {
  volatility: VolatilityMetrics;
  clientConcentrations: ClientConcentration[]
  currencySymbol?: string;
  isLocked?: boolean;
  onUnlockRequest?: () => void;
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];

  let interpretation = '';
  if (item?.payload?.metric === 'Income Variance') {
    interpretation = item.value > 50 ? 'Your income is highly unpredictable month-to-month. A larger cash buffer is essential.' : 'Your income is relatively stable.';
  } else if (item?.payload?.metric === 'Peak/Trough Gap') {
    interpretation = item.value > 50 ? 'Huge difference between your best and worst months. Beware of lifestyle creep during peaks.' : 'Consistent monthly earnings.';
  } else if (item?.payload?.metric === 'Client Risk') {
    interpretation = item.value > 40 ? 'DANGER: Too much revenue tied to one client. If they churn, your cash flow collapses.' : 'Healthy diversification of clients.';
  } else if (item?.payload?.metric === 'Income Stability') {
    interpretation = item.value > 50 ? 'Your standard deviation is very high relative to your average income.' : 'Predictable monthly revenue.';
  } else if (item?.payload?.metric === 'Lean Month Freq') {
    interpretation = item.value > 0 ? 'You regularly earn less than your required survival floor. You are burning cash.' : 'You consistently beat your survival floor.';
  }

  return (
    <div className="rounded-xl text-xs overflow-hidden"
      style={{
        background: 'var(--cf-surface)',
        border: '1px solid var(--cf-border)',
        boxShadow: 'var(--cf-shadow-lg)',
        minWidth: 180,
        maxWidth: 240,
      }}>
      <div className="px-4 py-2.5 font-semibold flex justify-between items-center" style={{ background: 'var(--cf-surface-alt)', borderBottom: '1px solid var(--cf-border)', color: 'var(--cf-text)' }}>
        <span>{item?.payload?.metric}</span>
        <span className="font-mono font-bold" style={{ color: item.value > 50 ? 'var(--cf-caution)' : 'var(--cf-accent)' }}>{item?.value}/100</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
          {item?.payload?.description}
        </div>
        <div className="text-[11px] p-2 rounded" style={{ background: item.value > 50 ? 'var(--cf-caution-bg)' : 'var(--cf-accent-bg)', color: item.value > 50 ? 'var(--cf-caution)' : 'var(--cf-accent)' }}>
          <strong>AI Insight:</strong> {interpretation}
        </div>
      </div>
    </div>
  );
};

export const RiskVolatilityRadar: React.FC<RiskVolatilityRadarProps> = ({
  volatility,
  clientConcentrations,
  currencySymbol = '$',
  isLocked = false,
  onUnlockRequest,
}) => {
  const [activeClient, setActiveClient] = useState<number | null>(null);

  // Build radar data from volatility metrics
  const cv = parseFloat(volatility.coefficientOfVariation.toString()) || 0;
  const peakTrough = parseFloat(volatility.peakToTroughRatio.toString()) || 1;
  const topConcentration = clientConcentrations[0]?.percentageOfTotal ?? 0;
  const stdDev = volatility.standardDeviation ?? 0;
  const avgIncome = volatility.minMonth && volatility.maxMonth
    ? (volatility.minMonth + volatility.maxMonth) / 2
    : 3000;

  const radarData = [
    {
      metric: 'Income Variance',
      score: Math.min(100, Math.round(cv * 100)),
      description: `CV = ${volatility.coefficientOfVariation}. Higher means more unpredictable income.`,
    },
    {
      metric: 'Peak/Trough Gap',
      score: Math.min(100, Math.round((peakTrough - 1) / 4 * 100)),
      description: `${peakTrough}x swing between best and worst month.`,
    },
    {
      metric: 'Client Risk',
      score: Math.min(100, topConcentration),
      description: `Top client = ${topConcentration}% of revenue. Over 40% is high-risk.`,
    },
    {
      metric: 'Income Stability',
      score: Math.min(100, Math.round((stdDev / (avgIncome || 1)) * 100)),
      description: `σ = ${currencySymbol}${stdDev.toLocaleString()} monthly deviation.`,
    },
    {
      metric: 'Lean Month Freq',
      score: Math.min(100, Math.round(
        (clientConcentrations.filter(c => c.isHighRisk).length / Math.max(1, clientConcentrations.length)) * 100
      )),
      description: 'How often income drops below the floor. 0% is ideal.',
    },
  ];

  const overallScore = Math.round(radarData.reduce((s, d) => s + d.score, 0) / radarData.length);
  const riskTier = overallScore < 30 ? 'calm' : overallScore < 60 ? 'moderate' : 'volatile';

  const badgeConfig = {
    calm: { label: 'Calm Equilibrium', icon: CheckCircle2, color: 'var(--cf-accent)', bg: 'var(--cf-accent-bg)' },
    moderate: { label: 'Moderate Variance', icon: Gauge, color: 'var(--cf-warm)', bg: 'var(--cf-warm-bg)' },
    volatile: { label: 'Elevated Volatility', icon: AlertTriangle, color: 'var(--cf-caution)', bg: 'var(--cf-caution-bg)' },
  }[riskTier];

  const BadgeIcon = badgeConfig.icon;
  const highRiskClient = clientConcentrations.find(c => c.isHighRisk);

  return (
    <section
      className="space-y-5 transition-colors relative"
      style={{ background: 'var(--cf-surface)', padding: '1.5rem 2rem' }}
      id="risk-radar"
    >
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--cf-surface)', opacity: 0.95, backdropFilter: 'blur(4px)' }}>
          <div className="text-center space-y-4 p-8">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: 'var(--cf-surface-alt)', border: '1px solid var(--cf-border)' }}>
              <Lock className="w-6 h-6" style={{ color: 'var(--cf-accent)' }} />
            </div>
            <div>
              <p className="font-serif text-lg" style={{ color: 'var(--cf-text)' }}>Risk Radar is a Pro feature</p>
              <p className="text-sm mt-1" style={{ color: 'var(--cf-text-muted)' }}>See your client concentration risk and volatility score.</p>
            </div>
            <button
              onClick={onUnlockRequest}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
            >
              Unlock — Sign In Free
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--cf-border)', paddingBottom: '1rem' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight" style={{ color: 'var(--cf-text)' }}>
              Risk & Volatility Radar
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              How stable is your income? Hover each axis to understand your risk profile.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{ background: badgeConfig.bg, color: badgeConfig.color, border: `1px solid ${badgeConfig.color}33` }}>
            <BadgeIcon className="w-3.5 h-3.5" />
            {badgeConfig.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Radar chart */}
        <div>
          <div className="text-xs font-mono mb-3 flex items-center justify-between" style={{ color: 'var(--cf-text-muted)' }}>
            <span>Risk dimensions (0 = no risk, 100 = high risk)</span>
            <span className="font-bold text-sm" style={{ color: badgeConfig.color }}>
              Score: {overallScore}/100
            </span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="var(--cf-border)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-sans)' }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke={badgeConfig.color}
                  fill={badgeConfig.color}
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ fill: badgeConfig.color, r: 4 }}
                  activeDot={{ r: 6, fill: badgeConfig.color, stroke: 'var(--cf-surface)', strokeWidth: 2 }}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: stats + client concentration */}
        <div className="space-y-4">
          {/* Volatility metrics */}
          <div className="rounded-xl p-4 border space-y-3"
            style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider font-semibold flex justify-between"
              style={{ color: 'var(--cf-text-muted)' }}>
              <span>Income Statistics</span>
              <span>CV = σ / μ</span>
            </div>
            {[
              { label: 'Coefficient of Variation', value: volatility.coefficientOfVariation },
              { label: 'Monthly Std Deviation', value: `±${currencySymbol}${volatility.standardDeviation.toLocaleString()}` },
              { label: 'Peak / Trough', value: `${volatility.peakToTroughRatio}x (${currencySymbol}${volatility.maxMonth?.toLocaleString()} vs ${currencySymbol}${volatility.minMonth?.toLocaleString()})` },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-start justify-between py-1.5 border-b text-xs gap-1 sm:gap-2"
                style={{ borderColor: 'var(--cf-border)' }}>
                <span className="shrink-0" style={{ color: 'var(--cf-text-muted)' }}>{label}</span>
                <span className="font-mono font-semibold text-left sm:text-right break-words min-w-0" style={{ color: 'var(--cf-text)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Client concentration */}
          <div className="rounded-xl p-4 border space-y-3"
            style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center justify-between"
              style={{ color: 'var(--cf-text-muted)' }}>
              <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Client Revenue Split</span>
              <span>{clientConcentrations.length} clients</span>
            </div>
            <div className="space-y-2">
              {clientConcentrations.slice(0, 5).map((c, i) => (
                <div key={i}
                  className="relative"
                  onMouseEnter={() => setActiveClient(i)}
                  onMouseLeave={() => setActiveClient(null)}
                  onTouchStart={() => setActiveClient(i)}
                  onTouchEnd={() => setActiveClient(null)}
                >
                  <div className="flex justify-between items-center text-xs mb-1 gap-2">
                    <span className="font-medium truncate flex-1 min-w-0" style={{ color: 'var(--cf-text)' }}>{c.tag}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-semibold" style={{ color: 'var(--cf-text)' }}>{c.percentageOfTotal}%</span>
                      {c.isHighRisk && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--cf-caution-bg)', color: 'var(--cf-caution)' }}>
                          High Risk
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cf-border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${c.percentageOfTotal}%`,
                        background: c.isHighRisk ? 'var(--cf-caution)' : 'var(--cf-accent)',
                        opacity: activeClient === null || activeClient === i ? 1 : 0.4,
                      }}
                    />
                  </div>
                  {/* Hover tooltip */}
                  {activeClient === i && (
                    <div className="absolute right-0 top-8 z-20 text-xs rounded-lg px-3 py-2 pointer-events-none"
                      style={{ background: 'var(--cf-surface)', border: '1px solid var(--cf-border)', boxShadow: 'var(--cf-shadow-md)', color: 'var(--cf-text-muted)', minWidth: 180 }}>
                      <strong style={{ color: 'var(--cf-text)' }}>{c.tag}</strong> generates <strong>{c.percentageOfTotal}%</strong> of your revenue.
                      {c.isHighRisk && <span style={{ color: 'var(--cf-caution)' }}> Losing this client would be critical.</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {highRiskClient && (
            <div className="flex items-start gap-2.5 rounded-xl p-3 text-xs"
              style={{ background: 'var(--cf-caution-bg)', border: '1px solid var(--cf-caution)33', color: 'var(--cf-caution)' }}>
              <TrendingDown className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>"{highRiskClient.tag}"</strong> is {highRiskClient.percentageOfTotal}% of your gross revenue.
                Losing them would likely push you below your income floor immediately.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
