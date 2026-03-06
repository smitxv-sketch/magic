import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Bot, User, Loader2, CheckCircle2 } from 'lucide-react';
import { AIChecklist } from './AIChecklist';

export const ActiveStepInfo = () => {
  const { currentScenario, currentNodeIndex, playerState } = useAppStore();

  if (!currentScenario) return null;

  const activeNode = currentScenario.visual_pipeline[currentNodeIndex];
  if (!activeNode) return null;

  const isAI = activeNode.type === 'ai_node';
  const isWaiting = playerState === 'WAITING_LLM';
  const hasChecks = isAI && activeNode.boolean_checks_config && activeNode.boolean_checks_config.length > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeNode.step_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 flex items-start gap-5 border border-white/50">
          {/* Icon Section */}
          <div className={`p-3 rounded-xl shrink-0 ${isAI ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
            {isAI ? <Bot className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${isAI ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isAI ? 'ИИ-агент' : 'Выполняет человек'}
              </span>
              {isAI && (
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                   GigaChat Pro
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{activeNode.title}</h3>
            <p className="text-slate-600 leading-relaxed">
              {activeNode.subtitle || (isAI 
                ? "Выполняется автоматический анализ документа на соответствие регламентам..." 
                : "Ожидание действия пользователя..."
              )}
            </p>

            {/* AI Checklist */}
            {hasChecks && (
              <AIChecklist checks={activeNode.boolean_checks_config!} />
            )}

            {/* Status Indicator */}
            {!hasChecks && (
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
      </motion.div>
    </AnimatePresence>
  );
};
