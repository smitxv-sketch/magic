import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Database, Server, Activity, FileJson, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const DataStreamPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { playerState, currentScenario, currentNodeIndex, artifacts } = useAppStore();
  const [logs, setLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock data generation based on active node
  useEffect(() => {
    if (!currentScenario || playerState === 'IDLE') {
        setLogs([]);
        return;
    }

    const node = currentScenario.visual_pipeline[currentNodeIndex];
    if (!node) return;

    // Fix: Check against valid PlayerState enum values
    if (playerState === 'EXECUTING_NODE' || playerState === 'WAITING_LLM') {
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        nodeId: node.step_id, // Fix: Use step_id instead of id
        nodeName: node.title,
        type: node.type,
        data: generateMockData(node, artifacts), // Fix: Pass artifacts
        status: 'collecting'
      };

      setLogs(prev => [...prev, newLog]);

      // Simulate completion after delay
      setTimeout(() => {
        setLogs(prev => prev.map(log => 
          log.id === newLog.id ? { ...log, status: 'completed' } : log
        ));
      }, 1500);
    }
  }, [currentNodeIndex, playerState]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const generateMockData = (node: any, artifacts: any) => {
    if (node.type === 'ai_node') {
      return {
        context: {
          document_id: "DOC-2024-001",
          file_type: "pdf",
          size: "2.4MB"
        },
        inputs: {
          prompt_template: "Analyze contract risks...",
          artifacts_available: Object.keys(artifacts).length
        },
        system: {
          model: "GigaChat Pro",
          temperature: 0.1
        }
      };
    } else if (node.type === 'human_task') {
       return {
        assignee: "Manager",
        form_data: {
            decision: "pending",
            comments: ""
        }
      };
    }
    return { status: "active" };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-40 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity className="w-5 h-5" />
              <span className="font-bold tracking-wider uppercase text-sm">Поток Данных</span>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Logs Stream */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {logs.length === 0 && (
                <div className="text-slate-500 text-center mt-10 italic">
                    Ожидание запуска процесса...
                </div>
            )}
            
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
              >
                <div className="bg-slate-900/50 p-2 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            log.status === 'collecting' ? "bg-amber-500" : "bg-emerald-500"
                        )} />
                        <span className="text-slate-300 font-bold">{log.nodeName}</span>
                    </div>
                    <span className="text-slate-600">{log.timestamp}</span>
                </div>
                
                <div className="p-3 space-y-2">
                    <div className="flex items-start gap-2">
                        <Database className="w-3 h-3 text-blue-400 mt-0.5" />
                        <span className="text-blue-400 font-bold">DATA_COLLECTION_EVENT</span>
                    </div>
                    
                    <div className="bg-slate-950 rounded p-2 text-slate-400 overflow-x-auto">
                        <pre>{JSON.stringify(log.data, null, 2)}</pre>
                    </div>

                    {log.status === 'completed' && (
                        <div className="flex items-center gap-1 text-emerald-500 mt-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Synced to Data Lake</span>
                        </div>
                    )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Status */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-slate-500 text-[10px] flex justify-between">
            <div className="flex items-center gap-1">
                <Server className="w-3 h-3" />
                <span>Connected: wss://api.cortex.ai/stream</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Live</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
