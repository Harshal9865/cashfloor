'use client';

import React from 'react';
import { CalendarClock, AlertCircle } from 'lucide-react';

export const TaxDeadlineReminders: React.FC = () => {
  // Hardcoded for US Estimated Tax Deadlines for Freelancers
  const deadlines = [
    { period: 'Q1 (Jan-Mar)', date: 'April 15' },
    { period: 'Q2 (Apr-May)', date: 'June 15' },
    { period: 'Q3 (Jun-Aug)', date: 'Sept 15' },
    { period: 'Q4 (Sep-Dec)', date: 'Jan 15' },
  ];

  // Simple heuristic for "next" deadline based on current month
  const currentMonth = new Date().getMonth(); // 0-11
  let nextIndex = 0;
  if (currentMonth >= 3 && currentMonth < 5) nextIndex = 1;
  else if (currentMonth >= 5 && currentMonth < 8) nextIndex = 2;
  else if (currentMonth >= 8 && currentMonth <= 11) nextIndex = 3;

  return (
    <div className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full rounded-2xl border"
         style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full" style={{ background: 'var(--cf-accent-bg)' }}>
          <CalendarClock className="w-4 h-4" style={{ color: 'var(--cf-accent)' }} />
        </div>
        <div>
          <h3 className="font-serif tracking-wide text-[var(--cf-text)]">Estimated Tax Deadlines</h3>
          <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
            Avoid underpayment penalties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
        {deadlines.map((d, i) => {
          const isNext = i === nextIndex;
          return (
            <div 
              key={d.period}
              className="px-3 py-2 border rounded-xl"
              style={{
                borderColor: isNext ? 'var(--cf-accent)' : 'var(--cf-border)',
                background: isNext ? 'var(--cf-accent-bg)' : 'transparent',
              }}
            >
              <div className="flex items-center gap-1.5">
                {isNext && <AlertCircle className="w-3 h-3" style={{ color: 'var(--cf-accent)' }} />}
                <span className="text-[10px] font-mono tracking-wider" 
                      style={{ color: isNext ? 'var(--cf-accent)' : 'var(--cf-text-muted)' }}>
                  {d.period}
                </span>
              </div>
              <div className="font-semibold text-sm mt-0.5" 
                   style={{ color: isNext ? 'var(--cf-text)' : 'var(--cf-text-faint)' }}>
                {d.date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
