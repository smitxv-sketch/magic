import React from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';
import * as Select from '@radix-ui/react-select';

interface PlayerControlsProps {
  scenarios: string[]; // List of scenario IDs
  onScenarioSelect: (id: string) => void;
}

export const PlayerControls = ({ scenarios, onScenarioSelect }: PlayerControlsProps) => {
  const { playerState, startPlayer, pausePlayer, resetPlayer, currentScenario } = useAppStore();

  const isPlaying = playerState === 'ANIMATING' || playerState === 'WAITING_LLM';
  const isPaused = playerState === 'PAUSED';
  const isCompleted = playerState === 'COMPLETED';

  // Map scenario IDs to readable names
  const SCENARIO_NAMES: Record<string, string> = {
    'contract_review': 'Согласование договора',
    'outgoing_letter': 'Исходящее письмо'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
      
      {/* Scenario Selector */}
      <div className="flex items-center gap-4">
        <Select.Root 
            value={currentScenario?.scenario_id || ''} 
            onValueChange={onScenarioSelect} 
            disabled={isPlaying || isPaused}
        >
          <Select.Trigger className="inline-flex items-center justify-between rounded-xl px-4 py-2.5 text-sm leading-none h-12 gap-2 bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-[300px] data-[placeholder]:text-gray-400 outline-none">
            <Select.Value placeholder="Выберите сценарий..." />
            <Select.Icon>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-xl z-50 min-w-[300px]">
              <Select.Viewport className="p-1">
                {scenarios.map(id => (
                    <Select.Item key={id} value={id} className="relative flex items-center h-10 px-8 text-sm leading-none text-gray-700 rounded-lg select-none hover:bg-emerald-50 hover:text-emerald-900 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900 outline-none cursor-pointer">
                        <Select.ItemText>{SCENARIO_NAMES[id] || id}</Select.ItemText>
                    </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <Button
            variant="outline"
            size="icon"
            onClick={resetPlayer}
            disabled={!currentScenario}
            className="h-12 w-12 rounded-xl border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            title="Сбросить"
        >
            <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Play/Pause Control - Centered or Prominent */}
      <div className="flex items-center gap-4">
        <Button
            onClick={isPlaying ? pausePlayer : startPlayer}
            disabled={!currentScenario || isCompleted}
            className={cn(
                "h-12 px-8 rounded-xl text-base font-semibold shadow-lg transition-all hover:scale-105 active:scale-95",
                isPlaying 
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
            )}
        >
            {isPlaying ? (
                <>
                    <Pause className="w-5 h-5 mr-2 fill-current" />
                    Пауза
                </>
            ) : (
                <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    {isPaused ? "Продолжить" : "Запустить"}
                </>
            )}
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
        <div className={cn(
            "w-2.5 h-2.5 rounded-full animate-pulse",
            isPlaying ? "bg-emerald-500" : 
            isPaused ? "bg-amber-500" : 
            isCompleted ? "bg-blue-500" : "bg-gray-300"
        )} />
        <span className="text-xs font-mono font-medium text-gray-500 uppercase tracking-wider">
            {playerState === 'IDLE' && 'Готов к запуску'}
            {playerState === 'ANIMATING' && 'Выполнение...'}
            {playerState === 'WAITING_LLM' && 'AI думает...'}
            {playerState === 'PAUSED' && 'На паузе'}
            {playerState === 'COMPLETED' && 'Завершено'}
            {playerState === 'LLM_ERROR' && 'Ошибка AI'}
        </span>
      </div>
    </div>
  );
};
