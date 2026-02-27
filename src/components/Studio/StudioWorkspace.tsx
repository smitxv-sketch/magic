import React, { useState } from 'react';
import { InputContextPanel } from './InputContextPanel';
import { AIConfigPanel } from './AIConfigPanel';
import { OutputRulesPanel } from './OutputRulesPanel';
import { LiveTestPanel } from './LiveTestPanel';
import { Button } from '@/components/ui/button';
import { Play, Save, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { StudioScenarioList } from './StudioScenarioList';

export const StudioWorkspace = () => {
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const { activeCubeId, activeCube, setActiveCubeId } = useAppStore();

  if (!activeCubeId) {
    return <StudioScenarioList />;
  }

  return (
    <div className="h-full flex flex-col relative bg-gray-50">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveCubeId(null)}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Назад
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">{activeCube.scenarioName || 'Сценарий'}</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{activeCube.title}</span>
          </div>
        </div>
        <Button size="sm" className="bg-[#009845] text-white hover:bg-[#007d39] shadow-lg shadow-[#009845]/20 rounded-xl px-4">
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Context */}
        <div className="w-1/4 border-r border-gray-200 p-6 bg-white overflow-y-auto">
          <InputContextPanel />
        </div>

        {/* Column 2: AI Config */}
        <div className="w-2/4 border-r border-gray-200 p-6 bg-gray-50/50 overflow-y-auto shadow-inner">
          <AIConfigPanel />
        </div>

        {/* Column 3: Rules */}
        <div className="w-1/4 p-6 bg-white flex flex-col overflow-y-auto">
          <OutputRulesPanel />
          
          <div className="mt-auto pt-6 border-t border-gray-100">
            <Button 
              onClick={() => setIsTestPanelOpen(true)} 
              className="w-full shadow-xl shadow-[#009845]/20 bg-gradient-to-r from-[#009845] to-[#4CAF50] hover:from-[#007d39] hover:to-[#388E3C] text-white border-0 h-12 rounded-xl text-md font-semibold"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Протестировать
            </Button>
          </div>
        </div>
      </div>

      {/* Test Panel Drawer */}
      <LiveTestPanel isOpen={isTestPanelOpen} onClose={() => setIsTestPanelOpen(false)} />
    </div>
  );
};
