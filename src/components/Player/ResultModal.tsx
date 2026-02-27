import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LLMResponse } from '@/schemas/llmResponse';
import { Button } from '@/components/ui/button';
import { MirrorModePanel } from './MirrorModePanel';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ResultModalProps {
  isOpen: boolean;
  result: LLMResponse | null;
  onContinue: () => void;
  promptUsed: string;
}

export const ResultModal = ({ isOpen, result, onContinue, promptUsed }: ResultModalProps) => {
  if (!result) return null;

  const { action_id, comment_to_user } = result.execution_command;
  const { findings, severity_score } = result.ai_analysis;

  const isSuccess = action_id === 'approve';
  const isWarning = action_id === 'escalate';
  const isError = action_id === 'return_to_author';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header Section */}
            <div className={cn(
              "px-8 pt-8 pb-6 text-center relative overflow-hidden",
              isSuccess ? "bg-emerald-50" : 
              isWarning ? "bg-amber-50" : 
              isError ? "bg-red-50" : "bg-gray-50"
            )}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
              />

              <div className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm",
                  isSuccess ? "bg-emerald-100 text-emerald-600" : 
                  isWarning ? "bg-amber-100 text-amber-600" : 
                  isError ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                )}>
                  {isSuccess ? <CheckCircle2 className="w-8 h-8" /> : 
                   isWarning ? <AlertTriangle className="w-8 h-8" /> : 
                   isError ? <XCircle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {isSuccess ? 'Проверка пройдена' : 
                   isWarning ? 'Требуется внимание' : 
                   isError ? 'Отклонено' : 'Результат'}
                </h2>
                
                {result.time_saved_minutes && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur text-xs font-medium text-gray-600 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Сэкономлено ~{result.time_saved_minutes} мин</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Findings List */}
              <div className="mb-8">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Результаты анализа</h3>
                    <div className={cn(
                        "text-xs font-bold px-2 py-1 rounded-md",
                        severity_score === 0 ? "bg-emerald-100 text-emerald-700" :
                        severity_score < 5 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                        SCORE: {severity_score}/10
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    {findings.map((finding, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                            <div className={cn(
                                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                isSuccess ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                            )}>
                                <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                            <span className="text-gray-700 leading-snug font-medium">{finding}</span>
                        </div>
                    ))}
                 </div>
              </div>

              {/* AI Comment Box */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 relative">
                 <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Комментарий AI
                 </div>
                 <p className="text-gray-600 italic leading-relaxed">
                    "{comment_to_user}"
                 </p>
              </div>

              {/* Mirror Mode Toggle (Subtle) */}
              <div className="mb-6">
                <MirrorModePanel prompt={promptUsed} />
              </div>

              {/* Action Button */}
              <Button 
                onClick={onContinue} 
                className={cn(
                    "w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
                    isError ? "bg-gray-900 hover:bg-gray-800" : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {isError ? 'Завершить сценарий' : 'Ок, дальше...'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
