import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useScenarioLoader } from '@/hooks/useScenarioLoader';
import { usePlayerEngine } from '@/hooks/usePlayerEngine';
import { ProcessMap } from './ProcessMap';
import { PlayerControls } from './PlayerControls';
import { ResultModal } from './ResultModal';
import { ArtifactBadge } from './ArtifactBadge';
import { Loader2 } from 'lucide-react';
import { compilePrompt } from '@/utils/promptCompiler';
import { QRCodeSVG } from 'qrcode.react';

export const PlayerWorkspace = () => {
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

  // Load default scenario on mount
  useEffect(() => {
    if (!currentScenario) {
      handleScenarioSelect('contract_review');
    }
  }, []);

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Top Controls */}
      <div className="p-6 pb-0 z-20">
        <PlayerControls 
          scenarios={['contract_review', 'outgoing_letter']} 
          onScenarioSelect={handleScenarioSelect} 
        />
      </div>

      {/* Main Stage */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
        {currentScenario ? (
          <>
            <div className="w-full max-w-5xl">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-text-primary mb-2">{currentScenario.scenario_name}</h1>
                <div className="text-text-secondary flex items-center justify-center gap-2">
                  <span>📄 {currentScenario.document_mock.file_name}</span>
                </div>
              </div>
              
              <ProcessMap scenario={currentScenario} />
              
              {/* Artifacts Display */}
              <div className="mt-16 flex justify-center gap-4 flex-wrap px-4">
                {Object.keys(artifacts).map(key => (
                  <ArtifactBadge key={key} artifactKey={key} label={key} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-text-muted">Выберите сценарий для запуска</div>
        )}
      </div>

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
          <div className="text-center max-w-md p-8 bg-surface rounded-3xl shadow-modal border border-border-default">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">Процесс завершён</h2>
            <p className="text-text-secondary mb-8">
              Документ успешно прошел маршрут согласования.
              Все проверки выполнены автоматически.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <div className="text-sm text-green-800 font-medium flex items-center justify-center gap-2">
                <span className="text-xl">⏱️</span> Сэкономлено времени: ~15 минут
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
