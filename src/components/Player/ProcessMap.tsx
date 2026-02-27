import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scenario } from '@/schemas/scenarioConfig';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';
import { Bot, User, CheckCircle2, Circle, FileText } from 'lucide-react';

interface ProcessMapProps {
  scenario: Scenario;
}

export const ProcessMap = ({ scenario }: ProcessMapProps) => {
  const { currentNodeIndex, playerState } = useAppStore();
  const [markerPosition, setMarkerPosition] = useState(0);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate marker position based on active node
  useEffect(() => {
    const activeElement = nodeRefs.current[currentNodeIndex];
    if (activeElement) {
      const offsetLeft = activeElement.offsetLeft;
      const width = activeElement.offsetWidth;
      // Center the marker: offsetLeft + half width - half marker width (20px)
      setMarkerPosition(offsetLeft + width / 2 - 20);
    }
  }, [currentNodeIndex, scenario.visual_pipeline.length]);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-20 px-10">
      
      {/* 1. Track Line (Background) */}
      <div className="absolute top-[calc(50%+40px)] left-10 right-10 h-1.5 bg-gray-200 -translate-y-1/2 z-0 rounded-full" />

      {/* 2. Progress Line (Filled) */}
      <motion.div 
        className="absolute top-[calc(50%+40px)] left-10 h-1.5 bg-emerald-500 -translate-y-1/2 z-0 rounded-full origin-left"
        animate={{ width: markerPosition }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* 3. Animated Document Marker */}
      <motion.div
        className="absolute top-[calc(50%+40px)] h-10 w-10 bg-white border-4 border-emerald-500 rounded-full shadow-lg z-20 flex items-center justify-center text-lg"
        initial={false}
        animate={{ 
          x: markerPosition,
          y: '-50%',
          scale: playerState === 'WAITING_LLM' ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 20 },
          scale: { repeat: Infinity, duration: 1.5 }
        }}
      >
        <FileText className="w-5 h-5 text-emerald-600" />
      </motion.div>

      {/* 4. Node Cards */}
      <div className="relative flex justify-between items-start z-10 w-full">
        {scenario.visual_pipeline.map((node, index) => {
          const isActive = index === currentNodeIndex;
          const isPassed = index < currentNodeIndex;
          const isAI = node.type === 'ai_node';

          return (
            <div 
              key={node.step_id} 
              ref={(el) => { nodeRefs.current[index] = el; }}
              className="flex flex-col items-center group w-64 mx-4"
            >
              {/* Card */}
              <div className={cn(
                "relative w-full p-4 rounded-xl border-2 transition-all duration-300 bg-white mb-8",
                isActive 
                  ? "border-emerald-500 shadow-lg shadow-emerald-500/10 scale-105 ring-4 ring-emerald-50" 
                  : "border-gray-200 hover:border-gray-300",
                isPassed && "border-emerald-200 bg-emerald-50/30 opacity-80 grayscale-[0.5]",
                isAI && isActive && "border-purple-500 shadow-purple-500/10 ring-purple-50"
              )}>
                
                {/* Status Icon Badge */}
                <div className={cn(
                  "absolute -top-3 -right-3 h-6 w-6 rounded-full border-2 bg-white flex items-center justify-center transition-colors shadow-sm",
                  isPassed ? "border-emerald-500 text-emerald-500" : "border-gray-200 text-gray-300",
                  isActive && "border-emerald-500 text-emerald-500"
                )}>
                  {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isAI ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                  )}>
                    {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider truncate",
                      isAI ? "text-purple-600" : "text-gray-500"
                    )}>
                      {isAI ? "AI Agent" : "Human"}
                    </p>
                  </div>
                </div>

                <h3 className={cn(
                  "font-semibold text-sm truncate mb-1",
                  isActive ? "text-gray-900" : "text-gray-600"
                )}>
                  {node.title}
                </h3>
                
                <p className="text-[10px] text-gray-400 truncate">
                  {node.subtitle || (isAI ? "Automated Check" : "Manual Review")}
                </p>
              </div>

              {/* Connector Dot (Visual anchor to the track) */}
              <div className={cn(
                "h-4 w-4 rounded-full border-2 bg-white z-10 transition-colors shadow-sm",
                isActive || isPassed ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
              )} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
