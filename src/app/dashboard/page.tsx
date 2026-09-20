'use client';

import React, { useState, useMemo } from 'react';
import { MonthlyRecord, CalculatorAssumptions } from '@/lib/calculator/types';
import { computeFullLedger } from '@/lib/calculator/engine';
import { exportLedgerToCsv } from '@/lib/export/csvExport';
import Header from '@/components/Header';
import { ScenarioSelectorBar } from '@/components/ScenarioSelectorBar';
import { HeroRunway } from '@/components/HeroRunway';
import { LedgerRows } from '@/components/LedgerRows';
import { CashFlowChart } from '@/components/CashFlowChart';
import { CashFlowWaterfall } from '@/components/CashFlowWaterfall';
import { ScenarioSimulator } from '@/components/ScenarioSimulator';
import { RiskVolatilityRadar } from '@/components/RiskVolatilityRadar';
import { AssumptionControls } from '@/components/AssumptionControls';
import { InputTable } from '@/components/InputTable';
import { CsvPasteModal } from '@/components/CsvPasteModal';
import { PinterestCardModal } from '@/components/PinterestCardModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { TaxDeadlineReminders } from '@/components/TaxDeadlineReminders';
import { createClient } from '@/lib/supabase/client';
import { loadUserLedger, saveUserLedger, SyncStatus } from '@/lib/supabase/ledgerService';
import { useEffect, useRef } from 'react';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { Share2, BookOpen, Download, Printer } from 'lucide-react';

// ... (keep REALISTIC_SAMPLE_RECORDS)
const REALISTIC_SAMPLE_RECORDS: MonthlyRecord[] = [
  { id: '1', month: 'Jul 2025', income: 4050, expenses: 2100, clientTag: 'Acme Retainer' },
  { id: '2', month: 'Aug', income: 4400, expenses: 2100, clientTag: 'Bolt Studio' },
  { id: '3', month: 'Sep', income: 2850, expenses: 2100, clientTag: 'Acme Retainer' },
  { id: '4', month: 'Oct (Lean)', income: 1600, expenses: 2100, clientTag: 'Direct Client C' },
  { id: '5', month: 'Nov', income: 3400, expenses: 2100, clientTag: 'Acme Retainer' },
  { id: '6', month: 'Dec (Peak)', income: 5900, expenses: 2300, clientTag: 'Apex Design' },
  { id: '7', month: 'Jan 2026', income: 4000, expenses: 2100, clientTag: 'Bolt Studio' },
  { id: '8', month: 'Feb', income: 4100, expenses: 2100, clientTag: 'Direct Client C' },
  { id: '9', month: 'Mar (Tax)', income: 3300, expenses: 2200, clientTag: 'Acme Retainer' },
  { id: '10', month: 'Apr', income: 4500, expenses: 2100, clientTag: 'Bolt Studio' },
  { id: '11', month: 'May', income: 4800, expenses: 2100, clientTag: 'Direct Client C' },
  { id: '12', month: 'Jun 2026', income: 4600, expenses: 2250, clientTag: 'Acme Retainer' },
];

export default function Home() {
  const [records, setRecords] = useState<MonthlyRecord[]>(REALISTIC_SAMPLE_RECORDS);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const [assumptions, setAssumptions] = useState<CalculatorAssumptions>({
    taxReservePct: 0.25,
    bufferMonthsMultiplier: 3.5,
    currentSavings: 8820,
    percentile: 20,
    scenario: 'base',
    clientLossPercentage: 0.30,
    windfallAmount: 10000,
    retainerProbability: 0.85,
  });

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  
  // Auth & Cloud Sync State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | undefined>();

  // 1. Initial Load & Session Tracking
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUserId(session?.user?.id);

        if (session?.user?.id) {
          const { payload, source } = await loadUserLedger(session.user.id);
          if (payload.records.length > 0) {
            setRecords(payload.records);
            setAssumptions(payload.assumptions);
            setCurrencySymbol(payload.currencySymbol);
            setSyncStatus(source === 'cloud' ? 'synced' : 'offline');
            if (payload.updatedAt) {
              setLastSavedAt(new Date(payload.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }
          }
        } else {
          // Load local fallback if present
          const { payload } = await loadUserLedger(undefined);
          if (payload.records.length > 0) {
            setRecords(payload.records);
            setAssumptions(payload.assumptions);
            setCurrencySymbol(payload.currencySymbol);
          }
          setSyncStatus('offline');
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          setIsAuthenticated(!!session);
          setUserId(session?.user?.id);
          if (session?.user?.id) {
            // Auto-migrate in-memory data to newly authenticated cloud account
            setSyncStatus('saving');
            const res = await saveUserLedger(session.user.id, records, assumptions, currencySymbol);
            setSyncStatus(res.isCloud ? 'synced' : 'offline');
            setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            setSyncStatus('offline');
          }
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (e) {
        // Gracefully fallback to local offline mode
        setSyncStatus('offline');
      }
    };
    checkSession();
  }, []);

  // 2. Debounced Cloud & Local Auto-Save
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      const res = await saveUserLedger(userId, records, assumptions, currencySymbol);
      setSyncStatus(res.isCloud ? 'synced' : 'offline');
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [records, assumptions, currencySymbol, userId]);

  const handleUnlockRequest = (featureName: string) => {
    setAuthMessage(`Sign in to unlock ${featureName} and access the full suite.`);
    setIsAuthModalOpen(true);
  };

  const handleCurrencyChange = async (newSymbol: string) => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
      
      const symbolToCode: Record<string, string> = {
        '$': 'USD', '€': 'EUR', '£': 'GBP', '₹': 'INR', 'C$': 'CAD', 'A$': 'AUD'
      };
      
      const oldCode = symbolToCode[currencySymbol] || 'USD';
      const newCode = symbolToCode[newSymbol] || 'USD';
      
      const oldRate = data.rates[oldCode] || 1;
      const newRate = data.rates[newCode] || 1;
      const multiplier = newRate / oldRate;
      
      setRecords(prev => prev.map(r => ({
        ...r,
        income: Math.round(r.income * multiplier),
        expenses: Math.round(r.expenses * multiplier)
      })));
      
      setAssumptions(prev => ({
        ...prev,
        currentSavings: Math.round((prev.currentSavings || 0) * multiplier),
        windfallAmount: Math.round((prev.windfallAmount || 0) * multiplier)
      }));
      
      setCurrencySymbol(newSymbol);
    } catch (e) {
      console.error('Failed to fetch rates', e);
      setCurrencySymbol(newSymbol);
    }
  };

  // Pure reactive calculation
  const calculation = useMemo(() => {
    return computeFullLedger(records, assumptions);
  }, [records, assumptions]);

  const handleResetData = () => {
    const blank = Array.from({ length: 12 }, (_, i) => {
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return {
        id: `blank-${i + 1}`,
        month: months[i],
        income: 0,
        expenses: 0,
        clientTag: 'Standard',
      };
    });
    setRecords(blank);
    setAssumptions((prev) => ({ ...prev, currentSavings: 0, scenario: 'base' }));
  };

  const handleLoadSample = () => {
    setRecords(REALISTIC_SAMPLE_RECORDS);
    setAssumptions((prev) => ({
      ...prev,
      taxReservePct: 0.25,
      bufferMonthsMultiplier: 3.5,
      currentSavings: 8820,
      scenario: 'base',
      retainerProbability: 0.85,
    }));
  };

  const handleRevertDefaults = () => {
    setAssumptions((prev) => ({
      ...prev,
      taxReservePct: 0.25,
      bufferMonthsMultiplier: 3.5,
      currentSavings: 8820,
      retainerProbability: 0.85,
      scenario: 'base',
    }));
  };

  const handleApplyPastedRecords = (pasted: MonthlyRecord[]) => {
    setRecords(pasted);
  };

  const handleExportCsv = () => {
    exportLedgerToCsv(records, calculation, assumptions, currencySymbol);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F1F4F2] text-[#16232B] selection:bg-[#2F6F62] selection:text-white">
      {/* 1. Google Stitch Top Navigation Bar */}
      <Header
        onResetData={handleResetData}
        onLoadSample={handleLoadSample}
        onExportCsv={handleExportCsv}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isAuthenticated={isAuthenticated}
        syncStatus={syncStatus}
        lastSavedAt={lastSavedAt}
      />

      {/* 2. Google Stitch Sub-Header Scenario Selector Bar */}
      <ScenarioSelectorBar
        assumptions={assumptions}
        onChange={setAssumptions}
        liquidCash={calculation.currentSavings}
        floorIncome={calculation.floorIncome}
        exhaustionDate={calculation.exhaustionDate}
        currencySymbol={currencySymbol}
      />

      {/* 3. Main Editorial Canvas (max-w-7xl) */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-12 py-10 space-y-12">
        {/* Monumental Hero Runway Section */}
        <HeroRunway
          runwayMonths={calculation.runwayMonths}
          isInfiniteRunway={calculation.isInfiniteRunway}
          currentSavings={calculation.currentSavings}
          avgMonthlyExpenses={calculation.avgMonthlyExpenses}
          floorIncome={calculation.floorIncome}
          exhaustionDate={calculation.exhaustionDate}
          dailyBurnVelocity={calculation.dailyBurnVelocity}
          surplusMargin={calculation.surplusMargin}
          bufferFundingPercentage={calculation.bufferFundingPercentage}
          bufferMonthsMultiplier={assumptions.bufferMonthsMultiplier}
          currencySymbol={currencySymbol}
        />

        <TaxDeadlineReminders />

        {/* Capital Partitioning & Reserve Pillars 5-Column Table */}
        <LedgerRows
          result={calculation}
          assumptions={assumptions}
          currencySymbol={currencySymbol}
        />

        {/* 12-Month Cash Flow Horizon & Floor Overlay Timeline Chart */}
        <CashFlowChart
          records={records}
          floorIncome={calculation.floorIncome}
          avgExpenses={calculation.avgMonthlyExpenses}
          currentSavings={calculation.currentSavings}
          bufferTarget={calculation.bufferTarget}
          taxReservePct={assumptions.taxReservePct}
          currencySymbol={currencySymbol}
        />

        {/* Real-time Cash Flow Allocation Waterfall */}
        <CashFlowWaterfall
          steps={calculation.waterfallSteps}
          currencySymbol={currencySymbol}
        />

        {/* Dynamic Stress Testing & Scenario Simulator */}
        <ScenarioSimulator
          assumptions={assumptions}
          onChange={setAssumptions}
          windfallAllocation={calculation.windfallAllocation}
          currencySymbol={currencySymbol}
          scenarioImpactDescription={calculation.scenarioImpactDescription}
          isLocked={!isAuthenticated}
          onUnlockRequest={() => handleUnlockRequest('Advanced Stress Testing')}
        />

        {/* Equilibrium Levers & Sensitivity Modeling */}
        <AssumptionControls
          assumptions={assumptions}
          onChange={setAssumptions}
          currencySymbol={currencySymbol}
          onCurrencyChange={handleCurrencyChange}
          floorIncome={calculation.floorIncome}
          sensitivityDaysPer150={calculation.sensitivityDaysPer150}
          onRevertDefaults={handleRevertDefaults}
        />

        {/* Volatility & Concentration Risk Radar */}
        <RiskVolatilityRadar
          volatility={calculation.volatility}
          clientConcentrations={calculation.clientConcentrations}
          currencySymbol={currencySymbol}
          isLocked={!isAuthenticated}
          onUnlockRequest={() => handleUnlockRequest('Client Concentration Radar')}
        />

        {/* Detailed Double-Entry Cash Ledger & Forecast Table */}
        <InputTable
          records={records}
          onChange={setRecords}
          onOpenPasteModal={() => setIsPasteModalOpen(true)}
          taxReservePct={assumptions.taxReservePct}
          sustainablePaycheck={calculation.sustainablePaycheck}
          initialSavings={calculation.currentSavings}
          floorIncome={calculation.floorIncome}
          currencySymbol={currencySymbol}
          isLocked={!isAuthenticated}
          onUnlockRequest={() => handleUnlockRequest('12-Month Ledger')}
        />

        {/* Philosophy Drawer & Action Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 hairline-t">
          <button
            type="button"
            onClick={() => setShowPhilosophy(!showPhilosophy)}
            className="text-xs text-[#5C6D77] hover:text-[#2F6F62] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#2F6F62]" />
            <span className="font-medium">The 20th Percentile Income Floor Philosophy</span>
          </button>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs text-[#16232B] border border-[#16232B]/20 hover:border-[#2F6F62] bg-white px-3 py-2 transition-colors cursor-pointer font-mono whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#2F6F62]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs text-[#16232B] border border-[#16232B]/20 hover:border-[#2F6F62] bg-white px-3 py-2 transition-colors cursor-pointer font-mono whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-[#5C6D77]" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs text-white bg-[#2F6F62] hover:bg-[#0f564a] px-3.5 py-2 transition-colors font-mono cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Pinterest Card</span>
            </button>
          </div>
        </div>

        {/* Expandable Philosophy Drawer */}
        {showPhilosophy && (
          <div className="hairline-all p-6 bg-white space-y-3 font-sans text-xs text-[#5C6D77] leading-relaxed">
            <h3 className="font-serif text-base text-[#16232B] font-semibold">
              The Mathematical Reason Freelancers Go Broke on Average Income
            </h3>
            <p>
              When revenue swings between dry periods ($1,600) and windfall quarters ($6,000), averaging income creates a lethal mathematical illusion. If you budget or set your lifestyle to your <em>average</em> income, you will inevitably overspend during lean cycles, exhausting cash reserves and accumulating high-interest tax or credit debt.
            </p>
            <p>
              By computing the <strong>20th percentile income floor</strong>, Calm Ledger isolates the empirical baseline that was met or exceeded in 80% of all operating history. Budgeting for baseline personal living costs at this floor guarantees that lean months cause zero financial panic. Every dollar earned above the floor during peak quarters automatically cascades through our double-entry allocation protocol into statutory tax escrow and your safety buffer. Once your buffer is fully funded, excess capital becomes a safe, guilt-free dividend.
            </p>
          </div>
        )}
      </div>

      {/* 4. Google Stitch Editorial Footer */}
      <footer className="w-full hairline-t bg-[#E8EDE9] py-8 px-4 md:px-12 mt-12 text-xs font-mono text-[#5C6D77]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-[#16232B] text-sm font-semibold">Calm Ledger</span>
            <span className="opacity-40">•</span>
            <span>A Quiet Tool for Solitary Craft &amp; Variable Cash Horizons</span>
          </div>
          <div className="flex flex-wrap items-center space-x-6 text-[11px]">
            <button
              type="button"
              onClick={handleExportCsv}
              className="hover:text-[#2F6F62] transition-colors cursor-pointer"
            >
              Reconcile &amp; Export CSV
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-[#2F6F62] transition-colors cursor-pointer"
            >
              Pinterest 1000x1500 Card
            </button>
            <button
              type="button"
              onClick={() => setShowPhilosophy(true)}
              className="hover:text-[#2F6F62] transition-colors cursor-pointer"
            >
              20th Percentile Math
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CsvPasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onApply={handleApplyPastedRecords}
      />

      <PinterestCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={calculation}
        assumptions={assumptions}
        currencySymbol={currencySymbol}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        message={authMessage}
      />

      {/* Safe-harbor Legal Notice */}
      <LegalDisclaimer />
    </main>
  );
}
