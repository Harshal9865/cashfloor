'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  content: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'runway',
    title: 'Your Survival Metric',
    content: 'Welcome to CashFloor. This is your core runway. It tells you exactly how many months you can survive if you earn $0 starting today, based on your P20 floor.'
  },
  {
    targetId: 'assumptions',
    title: 'Financial Levers',
    content: 'Play with these levers. See how lowering your monthly overhead or adjusting your tax reserve immediately extends your runway in real-time.'
  },
  {
    targetId: 'partitions',
    title: 'Capital Partitioning',
    content: 'This is where the magic happens. We partition your cash into distinct buckets (Taxes, Paycheck, Buffer) so you never spend money you don\'t actually own.'
  },
  {
    targetId: 'monte-carlo',
    title: 'Monte Carlo Risk Lab',
    content: 'For the ultimate stress test, we run 10,000 simulations against your historical income to find your true probability of survival over the next 12 months.'
  }
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setTargetRect(null);
      return;
    }

    const step = TOUR_STEPS[currentStep];
    const element = document.getElementById(step.targetId);
    
    if (element) {
      // Scroll into view with some padding
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // We need a slight delay for smooth scrolling to finish before measuring
      const timeoutId = setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }, 500);

      // Handle window resize
      const handleResize = () => {
        setTargetRect(element.getBoundingClientRect());
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    } else {
      // If element is not found on page, skip to next step or close
      console.warn(`Tour target #${step.targetId} not found.`);
    }
  }, [isOpen, currentStep]);

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  if (!isOpen) return null;

  const stepInfo = TOUR_STEPS[currentStep];

  // Calculate popover position. Default to below the element, or above if near bottom.
  let popoverStyle: React.CSSProperties = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  if (targetRect) {
    const isNearBottom = targetRect.bottom > window.innerHeight - 200;
    popoverStyle = {
      position: 'fixed',
      top: isNearBottom ? targetRect.top - 20 : targetRect.bottom + 20,
      left: Math.max(20, Math.min(targetRect.left + (targetRect.width / 2), window.innerWidth - 320)),
      transform: 'translate(-50%, 0)', // Center horizontally relative to left pin
      zIndex: 10000,
    };
    
    // Adjust transform origin for animation
    if (isNearBottom) popoverStyle.transform = 'translate(-50%, -100%)';
  }

  return (
    <>
      {/* Dark overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9998]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Spotlight cutout */}
      <AnimatePresence>
        {isOpen && targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              top: targetRect.top - 10,
              left: targetRect.left - 10,
              width: targetRect.width + 20,
              height: targetRect.height + 20,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed z-[9999] rounded-2xl pointer-events-none ring-4 ring-[#2F6F62] ring-offset-4 ring-offset-black"
            style={{ 
              boxShadow: '0 0 0 9999px rgba(0,0,0,0)', // Fallback if bg overlay fails
            }}
          />
        )}
      </AnimatePresence>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && targetRect && (
          <motion.div
            key={currentStep} // Animate on step change
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#16232B]/10"
            style={popoverStyle}
          >
            {/* Header */}
            <div className="bg-[#2F6F62] text-white p-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#C98A3E]" />
                <h3 className="font-serif font-semibold tracking-tight">{stepInfo.title}</h3>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-5 text-sm text-[#5C6D77] leading-relaxed">
              {stepInfo.content}
            </div>

            {/* Footer / Controls */}
            <div className="px-5 pb-5 flex items-center justify-between font-mono text-[11px]">
              <div className="text-[#8E9EA7]">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </div>
              
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button 
                    onClick={prevStep}
                    className="px-3 py-1.5 rounded-lg border border-[#16232B]/20 text-[#16232B] hover:bg-[#F1F4F2] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" /> Back
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  className="px-3 py-1.5 rounded-lg bg-[#16232B] text-white hover:bg-[#16232B]/90 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
