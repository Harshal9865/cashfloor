'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonthlyRecord, CalculatorAssumptions } from '@/lib/calculator/types';
import { computeFullLedger } from '@/lib/calculator/engine';
import { exportLedgerToCsv } from '@/lib/export/csvExport';
import DashboardNav from '@/components/DashboardNav';
import { ScenarioPillBar } from '@/components/ScenarioPillBar';
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
import { TaxDeadlineReminders } from '@/components/TaxDeadlineReminders';
import { InvoiceAgingPanel } from '@/components/InvoiceAgingPanel';
import { DeductionOptimizer } from '@/components/DeductionOptimizer';
import { MonteCarloRiskLab } from '@/components/MonteCarloRiskLab';
import { GuidedTour } from '@/components/GuidedTour';
import { loadUserLedger, saveUserLedger, SyncStatus } from '@/lib/supabase/ledgerService';
import { useAuth } from '@/lib/auth/AuthContext';
import { useEffect, useRef } from 'react';
import { RealDataWizardModal } from '@/components/RealDataWizardModal';
import { DailyPaymentLog } from '@/components/DailyPaymentLog';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { Share2, BookOpen, Download, Printer, Sparkles, ShieldCheck, HelpCircle, AlertTriangle, Upload } from 'lucide-react';

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
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const isViewingSample = useMemo(() => {
    if (records.length !== REALISTIC_SAMPLE_RECORDS.length) return false;
    return records.every((r, i) => r.income === REALISTIC_SAMPLE_RECORDS[i].income && r.expenses === REALISTIC_SAMPLE_RECORDS[i].expenses);
  }, [records]);

  const handleApplyWizardData = (newRecords: MonthlyRecord[], newAssumptions: Partial<CalculatorAssumptions>) => {
    setRecords(newRecords);
    setAssumptions(prev => ({ ...prev, ...newAssumptions }));
  };
  
  // Auth & Cloud Sync State
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const userId = user?.id;
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // 1. Initial Load & Session Tracking
  useEffect(() => {
    let active = true;
    const initData = async () => {
      try {
        const { payload, source } = await loadUserLedger(userId);
        if (active && payload.records.length > 0) {
          setRecords(payload.records);
          setAssumptions(payload.assumptions);
          setCurrencySymbol(payload.currencySymbol);
          setSyncStatus(source === 'cloud' ? 'synced' : 'offline');
          if (payload.updatedAt) {
            setLastSavedAt(new Date(payload.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        }
      } catch (e) {
        if (active) setSyncStatus('offline');
      }
    };
    initData();
    return () => { active = false; };
  }, [userId]);

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
    openAuthModal(`Unlock ${featureName} with free Pro access.`);
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
    <main className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      {/* 1. Clean Dashboard Navigation Bar */}
      <DashboardNav
        onResetData={handleResetData}
        onLoadSample={handleLoadSample}
        onExportCsv={handleExportCsv}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAuthModal={() => openAuthModal()}
        syncStatus={syncStatus}
        lastSavedAt={lastSavedAt}
      />

      {/* 2. Scenario Pill Bar */}
      <ScenarioPillBar
        assumptions={assumptions}
        onChange={setAssumptions}
        liquidCash={calculation.currentSavings}
        floorIncome={calculation.floorIncome}
        exhaustionDate={calculation.exhaustionDate}
        currencySymbol={currencySymbol}
      />

      {/* 3. Main Canvas */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-6">
        {/* ── Real Data Launchpad & Sample Status Banner ── */}
        <motion.div
          initial={false}
          animate={{
            boxShadow: isViewingSample
              ? ['0 0 0px rgba(245,158,11,0)', '0 0 15px rgba(245,158,11,0.2)', '0 0 0px rgba(245,158,11,0)']
              : '0 1px 2px rgba(0,0,0,0.02)',
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`rounded-2xl border p-4 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
            isViewingSample ? 'bg-amber-500/5 border-amber-500/30' : 'bg-[var(--cf-surface)] border-[var(--cf-border-soft)]'
          }`}
        >
          {isViewingSample && (
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl" />
          )}

          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                background: isViewingSample ? 'rgba(245, 158, 11, 0.15)' : 'var(--cf-accent-bg)',
                borderColor: isViewingSample ? 'rgba(245, 158, 11, 0.2)' : 'rgba(47,111,98,0.3)',
                color: isViewingSample ? '#f59e0b' : 'var(--cf-accent)',
              }}
            >
              {isViewingSample ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif font-bold tracking-tight text-[var(--cf-text)]">
                  {isViewingSample ? 'Calibration Required' : 'Ledger Calibrated'}
                </span>
                <span 
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold border hidden sm:inline-block"
                  style={{
                    background: isViewingSample ? 'rgba(245, 158, 11, 0.1)' : 'var(--cf-accent-bg)',
                    borderColor: isViewingSample ? 'rgba(245, 158, 11, 0.2)' : 'rgba(47,111,98,0.3)',
                    color: isViewingSample ? '#f59e0b' : 'var(--cf-accent)',
                  }}
                >
                  {isViewingSample ? 'Simulation Mode' : 'Real Numbers Active'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--cf-text-muted)] max-w-xl leading-relaxed mt-0.5">
                {isViewingSample
                  ? 'Your survival floor is simulating with sample data. Calibrate your real numbers to get your true runway.'
                  : `Your real numbers are driving the models. Baseline locked at ${currencySymbol}${calculation.floorIncome.toLocaleString()}/mo.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer hover:opacity-95`}
              style={{ 
                background: isViewingSample ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--cf-surface-alt)', 
                color: isViewingSample ? 'white' : 'var(--cf-text)', 
                border: isViewingSample ? 'none' : '1px solid var(--cf-border)' 
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: isViewingSample ? 'white' : 'var(--cf-accent)' }} />
              <span>{isViewingSample ? 'Calibrate My Runway' : 'Update Numbers'}</span>
            </button>

            {!isViewingSample && (
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer"
                style={{
                  color: 'var(--cf-text)',
                  background: 'var(--cf-surface)',
                  borderColor: 'var(--cf-border)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cf-text-muted)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import CSV</span>
              </button>
            )}

            {isViewingSample ? (
              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
                title="Clear sample rows to start from zero"
              >
                Clear Sample
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-2 py-1.5 rounded-lg text-[10px] font-mono font-medium text-[var(--cf-text-faint)] hover:text-[var(--cf-text-muted)] transition-colors cursor-pointer"
                title="Restore Alex Vance sample data"
              >
                Load Sample
              </button>
            )}
          </div>
        </motion.div>

        {/* Hero Runway (Command Center) */}
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
          inflationAdjusted={calculation.inflationAdjusted}
          primaryInsight={calculation.primaryInsight}
        />

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Charts & Ledgers (2/3 width) */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            
            {/* Timeline Chart */}
            <section id="cash-flow" className="dash-card p-6">
              <CashFlowChart
                records={records}
                floorIncome={calculation.floorIncome}
                avgExpenses={calculation.avgMonthlyExpenses}
                currentSavings={calculation.currentSavings}
                bufferTarget={calculation.bufferTarget}
                taxReservePct={assumptions.taxReservePct}
                currencySymbol={currencySymbol}
              />
            </section>

            {/* Invoice Aging & DSO Tracker — Phase 1 */}
            <InvoiceAgingPanel
              dso={calculation.dso}
              currencySymbol={currencySymbol}
            />

            {/* Daily Payment Feed & Cash Stream */}
            <section id="daily-log" className="dash-card p-6">
              <DailyPaymentLog currencySymbol={currencySymbol} />
            </section>

            {/* Capital Partitioning */}
            <section id="partitions" className="dash-card p-6">
              <LedgerRows
                result={calculation}
                assumptions={assumptions}
                currencySymbol={currencySymbol}
              />
            </section>

            {/* Ledger Archive */}
            <section id="ledger-archive" className="dash-card p-6">
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
            </section>
          </div>

          {/* RIGHT COLUMN: Controls & Risk (1/3 width, sticky) */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start min-w-0">
            
            <TaxDeadlineReminders />

            {/* Levers */}
            <section id="assumptions" className="dash-card p-5">
              <AssumptionControls
                assumptions={assumptions}
                onChange={setAssumptions}
                currencySymbol={currencySymbol}
                onCurrencyChange={handleCurrencyChange}
                floorIncome={calculation.floorIncome}
                sensitivityDaysPer150={calculation.sensitivityDaysPer150}
                onRevertDefaults={handleRevertDefaults}
              />
            </section>

            {/* Risk Radar */}
            <section className="dash-card p-5">
              <RiskVolatilityRadar
                volatility={calculation.volatility}
                clientConcentrations={calculation.clientConcentrations}
                currencySymbol={currencySymbol}
                isLocked={!isAuthenticated}
                onUnlockRequest={() => handleUnlockRequest('Client Concentration Radar')}
              />
            </section>

            {/* Waterfall */}
            <section className="dash-card p-5">
              <CashFlowWaterfall
                steps={calculation.waterfallSteps}
                currencySymbol={currencySymbol}
              />
            </section>

            {/* Deduction Optimizer — Phase 3 */}
            <DeductionOptimizer
              grossAnnualIncome={calculation.totalAnnualIncome}
              nominalTaxRate={assumptions.taxReservePct}
              monthlyExpenses={calculation.avgMonthlyExpenses}
              runwayMonths={calculation.runwayMonths}
              currencySymbol={currencySymbol}
              onOptimizedRateChange={(newRate) =>
                setAssumptions((prev) => ({ ...prev, taxReservePct: newRate }))
              }
            />

            {/* Monte Carlo Risk Lab — Phase 4 */}
            <MonteCarloRiskLab
              volatility={calculation.volatility}
              monthlyExpenses={calculation.avgMonthlyExpenses}
              currentSavings={calculation.currentSavings}
              currencySymbol={currencySymbol}
              isLocked={!isAuthenticated}
              onUnlockRequest={() => handleUnlockRequest('Monte Carlo Risk Lab')}
            />
          </div>
        </div>

        {/* Philosophy Drawer & Action Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 hairline-t">
          <button
            type="button"
            onClick={() => setShowPhilosophy(!showPhilosophy)}
            className="text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{ color: 'var(--cf-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cf-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cf-text-muted)')}
          >
            <BookOpen className="w-4 h-4 text-[#2F6F62]" />
            <span className="font-medium">The 20th Percentile Income Floor Philosophy</span>
          </button>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsTourOpen(true)}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer font-mono whitespace-nowrap border"
              style={{ color: 'var(--cf-accent)', borderColor: 'var(--cf-accent)', background: 'var(--cf-accent-bg)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Tour</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer font-mono whitespace-nowrap border"
              style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}
            >
              <Download className="w-3.5 h-3.5" style={{ color: 'var(--cf-accent)' }} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer font-mono whitespace-nowrap border"
              style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}
            >
              <Printer className="w-3.5 h-3.5" style={{ color: 'var(--cf-text-faint)' }} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 text-xs text-white px-3.5 py-2 rounded-lg transition-colors font-mono cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)', boxShadow: '0 2px 8px rgba(47,111,98,0.3)' }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Pinterest Card</span>
            </button>
          </div>
        </div>

        {/* Expandable Philosophy Drawer */}
        {showPhilosophy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-6 space-y-3 font-sans text-xs leading-relaxed border"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}
          >
            <h3 className="font-serif text-base font-semibold" style={{ color: 'var(--cf-text)' }}>
              The Mathematical Reason Freelancers Go Broke on Average Income
            </h3>
            <p>
              When revenue swings between dry periods ($1,600) and windfall quarters ($6,000), averaging income creates a lethal mathematical illusion. If you budget or set your lifestyle to your <em>average</em> income, you will inevitably overspend during lean cycles, exhausting cash reserves and accumulating high-interest tax or credit debt.
            </p>
            <p>
              By computing the <strong>20th percentile income floor</strong>, CashFloor isolates the empirical baseline that was met or exceeded in 80% of all operating history. Budgeting for baseline personal living costs at this floor guarantees that lean months cause zero financial panic. Every dollar earned above the floor during peak quarters automatically cascades through our double-entry allocation protocol into statutory tax escrow and your safety buffer.
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-8 mt-4" style={{ backgroundColor: 'var(--cf-bg-deep)', borderTop: '1px solid var(--cf-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-[#16232B] to-[#2F6F62] rounded flex items-center justify-center">
              <span className="text-white font-serif text-[10px] font-bold">C</span>
            </div>
            <span className="font-serif text-[var(--cf-text)] text-sm font-semibold">CashFloor</span>
            <span className="text-[var(--cf-text-faint)] text-xs">· Freelance Runway Calculator</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--cf-text-faint)]">
            <button type="button" onClick={handleExportCsv} className="hover:text-[#2F6F62] transition-colors cursor-pointer">Export CSV</button>
            <button type="button" onClick={() => setIsShareModalOpen(true)} className="hover:text-[#2F6F62] transition-colors cursor-pointer">Share Card</button>
            <a href="/blog/the-20th-percentile-math" className="hover:text-[#2F6F62] transition-colors">Guide</a>
            <a href="/" className="hover:text-[#16232B] transition-colors">Home</a>
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

      <RealDataWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyRealData={handleApplyWizardData}
        currencySymbol={currencySymbol}
        onOpenCsvModal={() => setIsPasteModalOpen(true)}
      />

      <GuidedTour 
        isOpen={isTourOpen} 
        onClose={() => setIsTourOpen(false)} 
      />

      {/* Safe-harbor Legal Notice */}
      <LegalDisclaimer />
    </main>
  );
}
