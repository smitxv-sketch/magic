import React, { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BooleanCheck {
  check_name?: string;
  label?: string;
  is_passed?: boolean;
  result_text?: string;
  key?: string;
  expected_in_doc?: boolean;
}

interface AIChecklistProps {
  checks: BooleanCheck[];
  onComplete?: () => void;
}

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed((prev) => {
          if (prev.length < text.length) {
            return prev + text.charAt(prev.length);
          }
          clearInterval(interval);
          return prev;
        });
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayed}</span>;
};

export const AIChecklist = ({ checks, onComplete }: AIChecklistProps) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < checks.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [visibleCount, checks.length, onComplete]);

  return (
    <div className="space-y-3 mt-4">
      {checks.slice(0, visibleCount).map((check, idx) => (
        <div 
          key={idx} 
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border transition-all duration-500 animate-in fade-in slide-in-from-left-2",
            check.is_passed 
              ? "bg-emerald-50/50 border-emerald-100/50" 
              : "bg-amber-50/50 border-amber-100/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          )}
        >
          <div className={cn(
            "mt-0.5 p-1 rounded-full",
            check.is_passed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          )}>
            {check.is_passed ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className={cn(
              "text-sm font-medium",
              check.is_passed ? "text-emerald-900" : "text-amber-900"
            )}>
              {check.check_name || check.label || 'Unnamed Check'}
            </div>
            <div className={cn(
              "text-xs font-mono",
              check.is_passed ? "text-emerald-700" : "text-amber-700 font-bold"
            )}>
              <TypewriterText text={check.result_text || (check.is_passed ? 'Passed' : 'Failed')} delay={200} />
            </div>
          </div>
        </div>
      ))}

      {visibleCount < checks.length && (
        <div className="flex items-center gap-3 p-3 text-slate-400 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Анализ нейросетью...</span>
        </div>
      )}
    </div>
  );
};
