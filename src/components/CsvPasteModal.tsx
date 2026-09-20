'use client';

import React, { useState } from 'react';
import { parsePastedData } from '../lib/csv/parser';
import { MonthlyRecord } from '../lib/calculator/types';
import { X, ClipboardPaste, AlertCircle } from 'lucide-react';

interface CsvPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (records: MonthlyRecord[]) => void;
}

export const CsvPasteModal: React.FC<CsvPasteModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [pasteContent, setPasteContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    setError(null);
    const parsed = parsePastedData(pasteContent);
    if (parsed.length === 0) {
      setError(
        'Could not parse valid income data. Ensure you have lines with at least month and income, or columns copied from Excel / Google Sheets.'
      );
      return;
    }
    onApply(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16232B]/40 backdrop-blur-xs">
      <div className="bg-[#F8FAF9] hairline rounded-sm max-w-lg w-full p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 hairline-b mb-4">
          <div className="flex items-center gap-2">
            <ClipboardPaste className="w-5 h-5 text-[#2F6F62]" />
            <h3 className="text-base font-semibold text-[#16232B] font-sans">
              Paste from Excel, Google Sheets, or CSV
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

        <p className="text-xs text-[#5C6D77] mb-3">
          Copy 2 or 3 columns from your spreadsheet (e.g. Month, Income, Expenses) and paste them below:
        </p>

        <textarea
          rows={7}
          value={pasteContent}
          onChange={(e) => setPasteContent(e.target.value)}
          placeholder={`Jan\t$4,500\t$2,100\nFeb\t$2,800\t$1,950\nMar\t$5,200\t$2,050`}
          className="w-full bg-[#E7ECE9]/60 border border-[#D8E0DC] rounded-sm p-3 font-mono text-xs text-[#16232B] focus:border-[#2F6F62] transition-colors"
        />

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-[#B4573F] mt-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#5C6D77] hover:text-[#16232B] px-3 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParse}
            className="text-xs font-medium text-[#F1F4F2] bg-[#2F6F62] hover:bg-[#225148] px-4 py-2 rounded-sm transition-colors"
          >
            Import data
          </button>
        </div>
      </div>
    </div>
  );
};
