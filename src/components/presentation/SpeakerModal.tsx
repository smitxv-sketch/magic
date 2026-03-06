import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MessageSquare } from 'lucide-react';
import { PresentationBlock } from '@/types/presentation';

interface SpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  block?: PresentationBlock;
}

export const SpeakerModal = ({ isOpen, onClose, block }: SpeakerModalProps) => {
  // Always render AnimatePresence, control visibility with isOpen inside
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-slate-900/95 backdrop-blur-md border-l border-slate-700 z-[100] shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900">
            <div className="flex items-center gap-3 text-emerald-500">
              <Mic className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Суфлер Спикера</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {block ? (
              <>
                <div>
                  <h3 className="text-slate-500 text-sm uppercase tracking-widest mb-4 font-semibold">Сценарий (Script)</h3>
                  <div className="text-2xl md:text-3xl font-medium text-white leading-relaxed font-sans">
                    {block.speakerScript || "Для этого слайда нет сценария."}
                  </div>
                </div>

                {block.hiddenQnA && (
                  <div className="pt-8 border-t border-slate-800">
                    <h3 className="text-slate-500 text-sm uppercase tracking-widest mb-4 font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Q&A (Ответы на вопросы)
                    </h3>
                    
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-inner">
                      <div className="text-amber-500 font-bold text-lg mb-3 leading-snug">
                        Q: {block.hiddenQnA.question}
                      </div>
                      <div className="text-emerald-400 text-xl leading-relaxed font-medium">
                        A: {block.hiddenQnA.answer}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-500 text-center mt-20">
                Нет активного слайда
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-950 text-center text-slate-600 text-xs border-t border-slate-900">
             Director's Cut Mode • Confidential • Shift + ? to toggle
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
