import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DocumentMarkerProps {
  targetX: number;
  isAIProcessing: boolean;
}

export const DocumentMarker = ({ targetX, isAIProcessing }: DocumentMarkerProps) => {
  return (
    <motion.div
      className={cn(
        "absolute top-[3.5rem] -ml-6 w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center z-20 shadow-lg",
        isAIProcessing ? "border-primary" : "border-text-primary"
      )}
      animate={{ 
        left: targetX,
        scale: isAIProcessing ? 1.1 : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 60, 
        damping: 15 
      }}
    >
      {isAIProcessing ? (
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      ) : (
        <FileText className="w-6 h-6 text-text-primary" />
      )}
      
      {/* Glow effect when processing */}
      {isAIProcessing && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};
