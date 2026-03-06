import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scenario } from '@/schemas/scenarioConfig';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';
import { Bot, User, CheckCircle2, Circle, FileText, ArrowRight } from 'lucide-react';

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
    <div className="relative w-full max-w-full overflow-x-auto pt-12 pb-20 px-10 scrollbar-hide">
      <div className="min-w-max flex justify-center mx-auto">
        <div className="relative">
          
          {/* 2. Progress Line (Filled) */}
          <motion.div 
            className="absolute top-[212px] left-10 h-1.5 bg-emerald-500 -translate-y-1/2 z-0 rounded-full origin-left"
            animate={{ width: markerPosition }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />

          {/* 3. Animated Document Marker */}
          <motion.div
            className="absolute top-[212px] h-10 w-10 bg-white border-4 border-emerald-500 rounded-full shadow-lg z-20 flex items-center justify-center text-lg"
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
          <div className="relative flex items-start z-10">
            {scenario.visual_pipeline.map((node, index) => {
              const isActive = index === currentNodeIndex;
              const isPassed = index < currentNodeIndex;
              const isAI = node.type === 'ai_node';
              const isLast = index === scenario.visual_pipeline.length - 1;

              return (
                <React.Fragment key={node.step_id}>
                  <div 
                    ref={(el) => { nodeRefs.current[index] = el; }}
                    className="flex flex-col items-center group w-64 mx-4"
                  >
                    {/* Card */}
                    <div className={cn(
                      "relative w-full h-44 p-5 rounded-2xl border transition-all duration-500 mb-6 flex flex-col gap-3",
                      // Base style
                      "bg-white/80 backdrop-blur-md border-slate-200/50 shadow-sm",
                      
                      // Active State
                      isActive && "scale-105 z-10",
                      
                      // AI Active State (Premium Glow)
                      isActive && isAI && "ring-4 ring-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-gradient-to-b from-white to-emerald-50/50 border-emerald-500/50",
                      
                      // Human Active State
                      isActive && !isAI && "ring-4 ring-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-gradient-to-b from-white to-blue-50/50 border-blue-500/50",

                      // Passed State
                      isPassed && "opacity-80 grayscale-[0.3] border-emerald-200/50 bg-emerald-50/10"
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
                      "h-6 w-6 rounded-full border-2 bg-white z-10 transition-colors shadow-sm",
                      isActive || isPassed ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                    )} />
                  </div>

                  {/* Arrow between cards */}
                  {!isLast && (
                    <div className="flex items-center justify-center h-44 pt-0 text-gray-300/50 -mx-2 z-0">
                      <ArrowRight className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
