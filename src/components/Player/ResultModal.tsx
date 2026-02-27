import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LLMResponse } from '@/schemas/llmResponse';
import { Button } from '@/components/ui/button';
import { MirrorModePanel } from './MirrorModePanel';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Clock } from 'lucide-react';
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

  const getHeaderStyle = () => {
    switch (action_id) {
      case 'approve': return 'bg-status-success-bg text-status-success-text border-status-success-border';
      case 'escalate': return 'bg-status-warn-bg text-status-warn-text border-status-warn-border';
      case 'return_to_author': return 'bg-status-danger-bg text-status-danger-text border-status-danger-border';
      case 'skip_node': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-surface text-text-primary';
    }
  };

  const getIcon = () => {
    switch (action_id) {
      case 'approve': return <CheckCircle className="w-6 h-6" />;
      case 'escalate': return <AlertTriangle className="w-6 h-6" />;
      case 'return_to_author': return <XCircle className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getTitle = () => {
    switch (action_id) {
      case 'approve': return 'Проверка пройдена';
      case 'escalate': return 'Требуется внимание (Эскалация)';
      case 'return_to_author': return 'Возврат на доработку';
      case 'skip_node': return 'Пропуск проверки';
      default: return 'Результат анализа';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-modal overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className={cn("px-6 py-4 border-b flex items-center gap-3", getHeaderStyle())}>
              {getIcon()}
              <h3 className="text-lg font-bold">{getTitle()}</h3>
              {result.time_saved_minutes && (
                <div className="ml-auto flex items-center gap-1 text-xs font-medium opacity-80">
                  <Clock className="w-3 h-3" />
                  <span>-{result.time_saved_minutes} мин</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  Результаты анализа (Score: {severity_score}/10)
                </h4>
                <ul className="space-y-2">
                  {findings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-surface-elevated rounded-xl border border-border-default mb-6">
                <div className="text-xs text-text-muted mb-1">Комментарий для сотрудника:</div>
                <div className="text-sm italic text-text-secondary">"{comment_to_user}"</div>
              </div>

              <MirrorModePanel prompt={promptUsed} />
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 mt-auto">
              <Button onClick={onContinue} className="w-full gap-2" size="lg">
                {action_id === 'return_to_author' ? 'Завершить сценарий' : 'Продолжить'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
