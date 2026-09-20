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
    <div className="bg-[#16232B] text-[#F1F4F2] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-[#F1F4F2]/10 rounded-full">
          <CalendarClock className="w-4 h-4 text-[#C98A3E]" />
        </div>
        <div>
          <h3 className="font-[var(--font-fraunces)] tracking-wide">Estimated Tax Deadlines</h3>
          <p className="text-[10px] font-mono text-[#5C6D77] uppercase tracking-widest mt-0.5">
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
              className={`px-3 py-2 border ${
                isNext 
                  ? 'border-[#C98A3E] bg-[#C98A3E]/10' 
                  : 'border-[rgba(241,244,242,0.1)] bg-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isNext && <AlertCircle className="w-3 h-3 text-[#C98A3E]" />}
                <span className={`text-[10px] font-mono tracking-wider ${isNext ? 'text-[#C98A3E]' : ''}`}>
                  {d.period}
                </span>
              </div>
              <div className={`font-semibold text-sm ${isNext ? 'text-white' : ''}`}>
                {d.date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
