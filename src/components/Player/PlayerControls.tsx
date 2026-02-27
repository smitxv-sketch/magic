import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store/appStore';
import { Scenario } from '@/schemas/scenarioConfig';
import { cn } from '@/utils/cn';

interface PlayerControlsProps {
  scenarios: string[]; // List of scenario IDs
  onScenarioSelect: (id: string) => void;
}

export const PlayerControls = ({ scenarios, onScenarioSelect }: PlayerControlsProps) => {
  const { playerState, startPlayer, pausePlayer, resetPlayer, currentScenario } = useAppStore();

  const isPlaying = playerState === 'ANIMATING' || playerState === 'WAITING_LLM';
  const isPaused = playerState === 'PAUSED';
  const isCompleted = playerState === 'COMPLETED';

  return (
    <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border-default shadow-sm">
      <Select onValueChange={onScenarioSelect} disabled={isPlaying || isPaused}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Выберите сценарий..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="contract_review">Согласование договора</SelectItem>
          <SelectItem value="outgoing_letter">Исходящее письмо</SelectItem>
        </SelectContent>
      </Select>

      <div className="h-8 w-px bg-border-default mx-2" />

      <Button
        variant="default"
        size="icon"
        onClick={isPlaying ? pausePlayer : startPlayer}
        disabled={!currentScenario || isCompleted}
        className={cn(isPlaying ? "bg-amber-500 hover:bg-amber-600" : "bg-primary")}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={resetPlayer}
        disabled={!currentScenario}
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      <div className="ml-auto text-sm font-mono text-text-muted">
        STATUS: <span className={cn(
          "font-bold",
          isPlaying ? "text-primary" : "text-text-secondary",
          playerState === 'LLM_ERROR' && "text-red-500"
        )}>{playerState}</span>
      </div>
    </div>
  );
};
