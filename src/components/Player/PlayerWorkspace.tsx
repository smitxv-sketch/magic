import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useScenarioLoader } from '@/hooks/useScenarioLoader';
import { usePlayerEngine } from '@/hooks/usePlayerEngine';
import { compilePrompt } from '@/utils/promptCompiler';
import { ProcessMap } from './ProcessMap';
import { PlayerControls } from './PlayerControls';
import { ResultModal } from './ResultModal';
import { ArtifactBadge } from './ArtifactBadge';
import { ActiveStepInfo } from './ActiveStepInfo';
import { Scenario } from '@/schemas/scenarioConfig';
import { Loader2, X, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PlayerWorkspaceProps {
  onClose?: () => void;
  embeddedScenario?: Scenario;
}

export const PlayerWorkspace = ({ onClose, embeddedScenario }: PlayerWorkspaceProps) => {
  const { 
    currentScenario, 
    loadScenario, 
    playerState, 
    lastLLMResult, 
    advanceToNextNode, 
    setPlayerState,
    currentNodeIndex,
    artifacts
  } = useAppStore();
  
  const { loadScenario: fetchScenario, isLoading } = useScenarioLoader();
  const [lastPrompt, setLastPrompt] = useState<string>('');

  // Initialize Engine
  usePlayerEngine();

  // Load default scenario on mount if none selected
  useEffect(() => {
    if (embeddedScenario) {
      loadScenario(embeddedScenario);
    } else if (!currentScenario) {
      handleScenarioSelect('contract_review');
    }
  }, [embeddedScenario]);

  // Capture prompt for Mirror Mode when entering WAITING_LLM
  useEffect(() => {
    const capturePrompt = async () => {
      if (playerState === 'WAITING_LLM' && currentScenario) {
        const node = currentScenario.visual_pipeline[currentNodeIndex];
        if (node.type === 'ai_node') {
          const p = await compilePrompt(node, currentScenario, artifacts);
          setLastPrompt(p);
        }
      }
    };
    capturePrompt();
  }, [playerState, currentScenario, currentNodeIndex, artifacts]);

  const handleScenarioSelect = async (id: string) => {
    const scenario = await fetchScenario(id);
    if (scenario) {
      loadScenario(scenario);
    }
  };

  const handleContinue = () => {
    if (lastLLMResult?.execution_command.action_id === 'return_to_author') {
      setPlayerState('COMPLETED');
    } else {
      advanceToNextNode();
    }
  };

  const handleRestart = () => {
    if (embeddedScenario) {
      loadScenario(embeddedScenario);
    } else if (currentScenario) {
      handleScenarioSelect(currentScenario.scenario_id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 backdrop-blur-3xl relative overflow-hidden rounded-3xl">
      {/* Close Button (if onClose provided) */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white text-slate-500 hover:text-slate-900 shadow-lg border border-white/50 transition-all hover:scale-110 active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Restart Button (for embedded mode) */}
      {embeddedScenario && (
        <button 
          onClick={handleRestart}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white text-slate-500 hover:text-emerald-600 shadow-lg border border-white/50 transition-all hover:scale-110 active:scale-95"
          title="Перезапустить демо"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      )}

      {/* Main Stage */}
      <div className="flex-1 relative flex flex-col items-center overflow-y-auto pb-48 pt-12">
        {currentScenario ? (
          <>
            <div className="w-full max-w-7xl px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">{currentScenario.scenario_name}</h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-slate-200 text-slate-600 text-sm font-medium">
                  <span>📄</span>
                  <span>{currentScenario.document_mock.file_name}</span>
                </div>
              </div>
              
              <ProcessMap scenario={currentScenario} />
              
              {/* Artifacts Display */}
              <div className="mt-20 flex justify-center gap-4 flex-wrap px-4">
                {Object.keys(artifacts).map(key => (
                  <ArtifactBadge key={key} artifactKey={key} label={key} />
                ))}
              </div>
            </div>

            {/* Active Step Info Overlay */}
            <ActiveStepInfo />
          </>
        ) : (
          <div className="text-slate-400 mt-20 text-lg font-medium">Выберите сценарий для запуска</div>
        )}
      </div>

      {/* Floating Controls */}
      <PlayerControls 
        onScenarioSelect={handleScenarioSelect} 
        isEmbedded={!!embeddedScenario}
      />

      {/* Modals */}
      <ResultModal 
        isOpen={playerState === 'SHOWING_RESULT'} 
        result={lastLLMResult} 
        onContinue={handleContinue}
        promptUsed={lastPrompt}
      />

      {/* Completed Screen Overlay */}
      {playerState === 'COMPLETED' && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center max-w-2xl p-8 bg-surface rounded-3xl shadow-modal border border-border-default relative">
            <button 
                onClick={() => setPlayerState('IDLE')}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">Процесс завершён</h2>
            <p className="text-text-secondary mb-8">
              Документ успешно прошел маршрут согласования.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-sm text-green-800 font-medium flex items-center gap-2 mb-2">
                        <span className="text-xl">⏱️</span> Сэкономлено времени
                    </div>
                    <div className="text-2xl font-bold text-green-900">~15 минут</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="text-sm text-purple-800 font-medium flex items-center gap-2 mb-2">
                        <span className="text-xl">🤖</span> AI-агенты
                    </div>
                    <div className="text-sm text-purple-900 space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Проверка реквизитов (GigaChat)
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Анализ рисков (GigaChat)
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-border-default">
                <QRCodeSVG value={window.location.href} size={120} />
                <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest">Scan to Share</div>
              </div>
            </div>

            <button 
              onClick={() => handleScenarioSelect(currentScenario?.scenario_id || 'contract_review')}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              Запустить снова
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
