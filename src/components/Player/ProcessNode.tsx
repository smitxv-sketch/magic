import React from 'react';
import { ScenarioNode } from '@/schemas/scenarioConfig';
import { cn } from '@/utils/cn';
import { User, FileText, Bot, ShieldCheck, FileSignature } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcessNodeProps {
  node: ScenarioNode;
  isActive: boolean;
  isPassed: boolean;
  index: number;
}

export const ProcessNode = ({ node, isActive, isPassed, index }: ProcessNodeProps) => {
  const isAI = node.type === 'ai_node';

  const getIcon = () => {
    if (isAI) return <Bot className="w-5 h-5 text-primary" />;
    
    // Simple heuristic for icons based on step_id or title
    const lowerId = node.step_id.toLowerCase();
    if (lowerId.includes('initiator') || lowerId.includes('executor')) return <User className="w-5 h-5 text-text-secondary" />;
    if (lowerId.includes('sign') || lowerId.includes('approval')) return <FileSignature className="w-5 h-5 text-text-secondary" />;
    if (lowerId.includes('dept')) return <ShieldCheck className="w-5 h-5 text-text-secondary" />;
    return <FileText className="w-5 h-5 text-text-secondary" />;
  };

  return (
    <div className="flex flex-col items-center relative z-10" style={{ width: '140px' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300",
          isAI 
            ? "bg-ai-node-bg border-ai-node-border shadow-sm" 
            : "bg-surface border-border-default",
          isActive && isAI && "shadow-[0_0_20px_theme(colors.ai-node-glow)] border-primary animate-pulse-slow",
          isActive && !isAI && "border-text-secondary shadow-md",
          isPassed && !isActive && "opacity-50 grayscale"
        )}
      >
        {getIcon()}
      </motion.div>
      
      <div className="mt-3 text-center">
        <div className={cn(
          "text-sm font-semibold leading-tight mb-1",
          isActive ? "text-text-primary" : "text-text-secondary"
        )}>
          {node.title}
        </div>
        {node.subtitle && (
          <div className="text-xs text-text-muted leading-tight">
            {node.subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
