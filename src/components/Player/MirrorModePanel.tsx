import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface MirrorModePanelProps {
  prompt: string;
}

export const MirrorModePanel = ({ prompt }: MirrorModePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 text-text-secondary hover:text-primary"
      >
        <Eye className="w-4 h-4" />
        {isOpen ? 'Скрыть промпт' : 'Показать промпт (Mirror Mode)'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-surface-elevated rounded-xl border border-border-default relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="text-xs font-mono text-text-secondary whitespace-pre-wrap max-h-60 overflow-y-auto">
                {prompt}
              </div>
              
              <div className="mt-2 pt-2 border-t border-border-default text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Security Audit Log: Gemini 1.5 Flash Request
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
