'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { CalculationResult, CalculatorAssumptions } from '../lib/calculator/types';
import { Download, X, Share2, Check } from 'lucide-react';

interface PinterestCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  assumptions: CalculatorAssumptions;
  currencySymbol?: string;
}

export const PinterestCardModal: React.FC<PinterestCardModalProps> = ({
  isOpen,
  onClose,
  result,
  assumptions,
  currencySymbol = '$',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2, // 2x crisp rendering for Pinterest & retina displays
      });

      const link = document.createElement('a');
      link.download = `cashfloor-runway-${result.runwayMonths}mo.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16232B]/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#F8FAF9] hairline rounded-sm max-w-xl w-full p-5 sm:p-6 shadow-md my-8">
        <div className="flex items-center justify-between pb-3 hairline-b mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#2F6F62]" />
            <h3 className="text-sm font-semibold text-[#16232B] font-sans">
              Shareable Pinterest & Social Card
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5C6D77] hover:text-[#16232B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Card Container to capture (2:3 aspect ratio, ~500x750 rendered scaled down for preview, 1000x1500px in 2x export) */}
        <div className="w-full flex justify-center py-2">
          <div
            ref={cardRef}
            className="w-full max-w-[400px] bg-[#F1F4F2] border border-[#D8E0DC] p-6 sm:p-8 text-center flex flex-col justify-between shadow-xs"
            style={{ minHeight: '560px' }}
          >
            {/* Masthead */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="w-6 h-6 rounded-xs bg-[#2F6F62] text-[#F1F4F2] font-serif font-bold text-xs flex items-center justify-center">
                  C
                </span>
                <span className="text-xs font-semibold text-[#16232B] tracking-wider uppercase font-sans">
                  CashFloor
                </span>
              </div>

              {/* The Viral Hook */}
              <p className="text-xs text-[#5C6D77] font-sans mb-3">
                Calculated with conservative income floor logic
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#16232B] font-normal leading-tight mb-4">
                &ldquo;I found out I can survive{' '}
                <span className="text-[#2F6F62] font-medium">
                  {result.isInfiniteRunway ? '∞' : result.runwayMonths}{' '}
                  {result.runwayMonths === 1 ? 'month' : 'months'}
                </span>{' '}
                with $0 income.&rdquo;
              </h2>
            </div>

            {/* Micro-Ledger Breakdown */}
            <div className="hairline rounded-sm bg-[#F8FAF9] p-4 text-left my-4 font-sans text-xs">
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#5C6D77]">Income floor (20th %tile)</span>
                <span className="font-medium text-[#16232B] tabular-nums">
                  {currencySymbol}
                  {Math.round(result.floorIncome).toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#5C6D77]">Sustainable monthly salary</span>
                <span className="font-medium text-[#2F6F62] tabular-nums">
                  {currencySymbol}
                  {Math.round(result.sustainablePaycheck).toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#5C6D77]">Liquid safety buffer</span>
                <span className="font-medium text-[#16232B] tabular-nums">
                  {currencySymbol}
                  {Math.round(result.currentSavings).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#5C6D77]">Target buffer goal</span>
                <span className="font-medium text-[#16232B] tabular-nums">
                  {currencySymbol}
                  {Math.round(result.bufferTarget).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#D8E0DC] text-[11px] text-[#5C6D77] font-sans">
              <p className="font-medium text-[#16232B]">
                Budget off your floor, not your average.
              </p>
              <p className="mt-1 text-[10px]">cashfloor.app · Free & anonymous</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 hairline-t">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs text-[#5C6D77] hover:text-[#16232B] flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2F6F62]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link copied!' : 'Copy tool link'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#5C6D77] hover:text-[#16232B] px-3 py-2 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="text-xs font-medium text-[#F1F4F2] bg-[#2F6F62] hover:bg-[#225148] px-4 py-2 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Rendering card...' : 'Download vertical card (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
