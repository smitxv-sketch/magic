import React from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';
import * as Select from '@radix-ui/react-select';
import { scenarios } from '@/data/scenarioRegistry';

interface PlayerControlsProps {
  onScenarioSelect: (id: string) => void;
  isEmbedded?: boolean;
}

export const PlayerControls = ({ onScenarioSelect, isEmbedded = false }: PlayerControlsProps) => {
  const { playerState, startPlayer, pausePlayer, resetPlayer, currentScenario } = useAppStore();

  const isPlaying = playerState === 'ANIMATING' || playerState === 'WAITING_LLM';
  const isPaused = playerState === 'PAUSED';
  const isCompleted = playerState === 'COMPLETED';

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 flex items-center gap-6 z-50 transition-all duration-300 hover:scale-[1.02]">
      
      {/* Scenario Selector */}
      {!isEmbedded && (
        <div className="flex items-center gap-4">
          <Select.Root 
              value={currentScenario?.scenario_id || ''} 
              onValueChange={onScenarioSelect} 
              disabled={isPlaying || isPaused}
          >
            <Select.Trigger className="inline-flex items-center justify-between rounded-full px-4 py-2 text-sm leading-none h-10 gap-2 bg-white/10 border border-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 w-[240px] data-[placeholder]:text-gray-400 outline-none transition-colors">
              <Select.Value placeholder="Выберите сценарий..." />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl z-[60] min-w-[240px] text-white">
                <Select.Viewport className="p-1">
                  {scenarios.map(scenario => (
                      <Select.Item key={scenario.scenario_id} value={scenario.scenario_id} className="relative flex items-center h-10 px-4 text-sm leading-none text-gray-200 rounded-lg select-none hover:bg-white/10 hover:text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white outline-none cursor-pointer">
                          <Select.ItemText>{scenario.scenario_name}</Select.ItemText>
                      </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
  
          <div className="h-8 w-px bg-white/10" />
  
          <Button
              variant="ghost"
              size="icon"
              onClick={resetPlayer}
              disabled={!currentScenario}
              className="h-10 w-10 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              title="Сбросить"
          >
              <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Play/Pause Control */}
      <Button
          onClick={isPlaying ? pausePlayer : startPlayer}
          disabled={!currentScenario || isCompleted}
          className={cn(
              "h-12 px-8 rounded-full text-base font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 border-0",
              isPlaying 
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
          )}
      >
          {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
          ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
          )}
      </Button>

      {/* Status Indicator */}
      <div className="flex items-center gap-3 pl-2">
        <div className="relative">
            <div className={cn(
                "w-3 h-3 rounded-full transition-colors duration-500",
                isPlaying ? "bg-emerald-500 shadow-[0_0_10px_theme(colors.emerald.500)]" : 
                isPaused ? "bg-amber-500" : 
                isCompleted ? "bg-blue-500" : "bg-gray-500"
            )} />
            {isPlaying && <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />}
        </div>
        <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider w-[100px]">
            {playerState === 'IDLE' && 'Готов'}
            {playerState === 'ANIMATING' && 'Выполнение'}
            {playerState === 'WAITING_LLM' && 'AI думает...'}
            {playerState === 'PAUSED' && 'Пауза'}
            {playerState === 'COMPLETED' && 'Завершено'}
            {playerState === 'LLM_ERROR' && 'Ошибка'}
        </span>
      </div>
    </div>
  );
};
