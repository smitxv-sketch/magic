import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Bot, User, Loader2, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Clock, Check, ArrowRight } from 'lucide-react';
import { AIChecklist } from './AIChecklist';
import { LLMResponse } from '@/schemas/llmResponse';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface ActiveStepInfoProps {
  result?: LLMResponse | null;
  onContinue?: () => void;
}

export const ActiveStepInfo = ({ result, onContinue }: ActiveStepInfoProps) => {
  const { currentScenario, currentNodeIndex, playerState } = useAppStore();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (playerState === 'SHOWING_RESULT') {
      // Small delay to allow checklist to finish visually if needed, though state change usually happens after
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [playerState]);

  if (!currentScenario) return null;

  const activeNode = currentScenario.visual_pipeline[currentNodeIndex];
  if (!activeNode) return null;

  const isAI = activeNode.type === 'ai_node';
  const isWaiting = playerState === 'WAITING_LLM';
  const hasChecks = isAI && activeNode.boolean_checks_config && activeNode.boolean_checks_config.length > 0;

  // Result Data
  const isSuccess = result?.execution_command.action_id === 'continue_process' || result?.execution_command.action_id === 'approve';
  const isWarning = result?.execution_command.action_id === 'escalate';
  const isError = result?.execution_command.action_id === 'return_to_author';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeNode.step_id} // Stable key to prevent unmounting
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl"
      >
        <div className={cn(
          "backdrop-blur-md shadow-2xl rounded-2xl border transition-all duration-500 overflow-hidden",
          showResult 
            ? (isSuccess ? "bg-emerald-50/95 border-emerald-200" : isWarning ? "bg-amber-50/95 border-amber-200" : "bg-red-50/95 border-red-200")
            : "bg-white/90 border-white/50"
        )}>
          
          {/* Header / Main Content */}
          <div className="p-6">
            <div className="flex items-start gap-5">
              {/* Icon Section */}
              <div className={cn(
                "p-3 rounded-xl shrink-0 transition-colors duration-500",
                showResult 
                  ? (isSuccess ? "bg-emerald-100 text-emerald-600" : isWarning ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600")
                  : (isAI ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600')
              )}>
                {showResult ? (
                  isSuccess ? <CheckCircle2 className="w-8 h-8" /> : 
                  isWarning ? <AlertTriangle className="w-8 h-8" /> : 
                  <XCircle className="w-8 h-8" />
                ) : (
                  isAI ? <Bot className="w-8 h-8" /> : <User className="w-8 h-8" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Top Label */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      showResult ? "text-slate-600" : (isAI ? 'text-emerald-600' : 'text-slate-500')
                    )}>
                      {showResult ? 'Результат этапа' : (isAI ? 'ИИ-агент' : 'Выполняет человек')}
                    </span>
                    {!showResult && isAI && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                        GigaChat Pro
                      </span>
                    )}
                  </div>
                  
                  {showResult && result?.analysis?.severity_score !== undefined && (
                     <div className={cn(
                        "text-xs font-bold px-2 py-1 rounded-lg border",
                        result.analysis.severity_score === 0 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        result.analysis.severity_score < 5 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-red-100 text-red-700 border-red-200"
                    )}>
                        СКОРИНГ: {result.analysis.severity_score}/10
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {showResult ? (
                    isSuccess ? 'Проверка успешно пройдена' : 
                    isWarning ? 'Обнаружены риски' : 'Проверка не пройдена'
                  ) : activeNode.title}
                </h3>

                {!showResult && (
                  <p className="text-slate-600 leading-relaxed">
                    {activeNode.subtitle || (isAI 
                      ? "Выполняется автоматический анализ документа на соответствие регламентам..." 
                      : "Ожидание действия пользователя..."
                    )}
                  </p>
                )}

                {/* AI Checklist - Always visible if checks exist */}
                {hasChecks && (
                  <AIChecklist checks={activeNode.boolean_checks_config!} />
                )}

                {/* Result Content */}
                {showResult && result && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 mt-4"
                  >
                    {/* Findings */}
                    <div className="space-y-2 bg-white/50 rounded-xl p-4 border border-black/5">
                      {result.analysis.findings.map((finding, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                              <span className="text-slate-700">{typeof finding === 'string' ? finding : finding.text}</span>
                          </div>
                      ))}
                    </div>

                    {/* Comment */}
                    <div className="text-sm text-slate-600 italic bg-white/50 p-3 rounded-lg border border-black/5">
                      "{result.execution_command.comment_to_user}"
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4 pt-2">
                       {result.time_saved_minutes && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>-{result.time_saved_minutes} мин</span>
                        </div>
                      )}
                      
                      <div className="flex-1" />

                      <Button 
                        onClick={onContinue}
                        className={cn(
                          "gap-2 shadow-lg transition-all hover:scale-105 active:scale-95",
                          isError ? "bg-slate-800 hover:bg-slate-900" : "bg-emerald-600 hover:bg-emerald-700"
                        )}
                      >
                        {isError ? 'Завершить' : 'Далее'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Status Indicator (Only when not showing result) */}
                {!showResult && !hasChecks && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                    {isWaiting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span className="text-emerald-700">Обработка запроса...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-slate-500">Активный этап</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
