import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Bot, User, Loader2, CheckCircle2 } from 'lucide-react';

export const ActiveStepInfo = () => {
  const { currentScenario, currentNodeIndex, playerState } = useAppStore();

  if (!currentScenario) return null;

  const activeNode = currentScenario.visual_pipeline[currentNodeIndex];
  if (!activeNode) return null;

  const isAI = activeNode.type === 'ai_node';
  const isWaiting = playerState === 'WAITING_LLM';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeNode.step_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 flex items-start gap-5">
          {/* Icon Section */}
          <div className={`p-3 rounded-xl shrink-0 ${isAI ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
            {isAI ? <Bot className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${isAI ? 'text-purple-600' : 'text-gray-500'}`}>
                {isAI ? 'AI Agent' : 'Human Step'}
              </span>
              {isAI && (
                <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                   GigaChat Pro
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{activeNode.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {activeNode.subtitle || (isAI 
                ? "Выполняется автоматический анализ документа на соответствие регламентам..." 
                : "Ожидание действия пользователя..."
              )}
            </p>

            {/* Status Indicator */}
            <div className="mt-4 flex items-center gap-2 text-sm font-medium">
              {isWaiting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="text-emerald-700">Обработка запроса...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-500">Активный этап</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
