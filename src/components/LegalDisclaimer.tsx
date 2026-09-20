'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export const LegalDisclaimer: React.FC = () => {
  return (
    <footer className="w-full max-w-2xl mx-auto px-4 mt-12 pb-16 text-center text-xs text-[#5C6D77] font-sans">
      <div className="hairline-t pt-6 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-[#2F6F62] font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>General Educational Calculator</span>
        </div>
        <p className="max-w-xl mx-auto leading-relaxed">
          This tool provides general calculations based on numbers you enter. It is not personalized financial, tax, legal, or investment advice. Always consult a licensed CPA or financial advisor for individual tax planning and business structure guidance.
        </p>
        <p className="text-[11px] text-[#8E9EA7]">
          Privacy guarantee: 100% of calculations execute directly in your browser. No financial records, income figures, or personal telemetry are transmitted to any remote servers.
        </p>
        <div className="pt-4 flex justify-center gap-6">
          <a href="/privacy" className="hover:text-[#16232B] transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-[#16232B] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
