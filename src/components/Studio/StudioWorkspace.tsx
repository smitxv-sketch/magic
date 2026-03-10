import React, { useState } from 'react';
import { InputContextPanel } from './InputContextPanel';
import { AIConfigPanel } from './AIConfigPanel';
import { OutputRulesPanel } from './OutputRulesPanel';
import { LiveTestPanel } from './LiveTestPanel';
import { Button } from '@/components/ui/button';
import { Play, Save, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { StudioScenarioListV2 } from './StudioScenarioListV2';
import { motion } from 'framer-motion';

const bentoCardClass = "bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col h-full";

export const StudioWorkspace = () => {
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const { activeCubeId, activeCube, setActiveCubeId } = useAppStore();

  if (!activeCubeId) {
    return <StudioScenarioListV2 />;
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Header / Toolbar */}
      <div className="h-16 flex items-center justify-between px-8 shrink-0 z-20 mt-4">
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveCubeId(null)}
            className="text-gray-500 hover:text-gray-900 hover:bg-white/50 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Назад
          </Button>
          <div className="h-6 w-px bg-gray-400/30" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">{activeCube.scenarioName || 'Сценарий'}</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900 bg-white/50 px-3 py-1 rounded-lg shadow-sm">{activeCube.title}</span>
          </div>
        </div>
        
        <Button size="sm" className="bg-[#009845] text-white hover:bg-[#007d39] shadow-lg shadow-[#009845]/20 rounded-xl px-4 h-10">
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>

      {/* Bento Grid Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto h-full min-h-[600px]">
          {/* Column 1: Context */}
          <motion.div 
            className={`lg:col-span-3 ${bentoCardClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <InputContextPanel />
          </motion.div>

          {/* Column 2: AI Config */}
          <motion.div 
            className={`lg:col-span-6 ${bentoCardClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIConfigPanel />
          </motion.div>

          {/* Column 3: Rules */}
          <motion.div 
            className={`lg:col-span-3 ${bentoCardClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-1 overflow-y-auto">
              <OutputRulesPanel />
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-100/50">
              <Button 
                onClick={() => setIsTestPanelOpen(true)} 
                className="w-full shadow-xl shadow-[#009845]/20 bg-gradient-to-r from-[#009845] to-[#4CAF50] hover:from-[#007d39] hover:to-[#388E3C] text-white border-0 h-12 rounded-xl text-md font-semibold"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Протестировать
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Test Panel Drawer */}
      <LiveTestPanel isOpen={isTestPanelOpen} onClose={() => setIsTestPanelOpen(false)} />
    </div>
  );
};
