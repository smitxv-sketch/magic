import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { PresentationBlock } from '@/types/presentation';

export const DirectorsCutModal = ({ block, isOpen, onClose }: { block: PresentationBlock, isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-400" />
              Режиссёрский сценарий
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {block.speakerScript && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Текст спикера (Акцент на боли)</h4>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-800 leading-relaxed border border-slate-100">
                  {block.speakerScript}
                </div>
              </div>
            )}

            {block.hiddenQnA && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Q&A (Ответы на вопросы)</h4>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <div className="font-bold text-amber-900 mb-2 flex gap-2">
                    <span className="shrink-0">❓</span>
                    {block.hiddenQnA.question}
                  </div>
                  <div className="text-amber-800 pl-6 border-l-2 border-amber-200">
                    {block.hiddenQnA.answer}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
