import React, { useState } from 'react';
import { PlayerWorkspace } from '@/components/Player/PlayerWorkspace';
import { getScenarioById } from '@/data/scenarioRegistry';
import { PresentationBlock } from '@/types/presentation';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpeakerModal } from '../SpeakerModal';

export const DemoSecretarySection = ({ block }: { block: PresentationBlock }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  const scenarioId = 'incoming_letter';
  const scenario = getScenarioById(scenarioId);

  return (
    <section className="py-24 px-6 bg-slate-900 relative overflow-hidden min-h-screen flex flex-col justify-center">
       {/* Background Effects */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 z-0" />

       <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative group">
          {block.badge && (
            <span className="text-emerald-400 font-bold tracking-wider text-sm uppercase mb-4 block">
              {block.badge}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {block.title}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {block.subtitle}
          </p>

          {/* Hidden trigger for Director's Cut (hover area) */}
          <button 
             onClick={() => setShowDirectorsCut(true)}
             className="absolute top-0 right-0 w-8 h-8 opacity-0 hover:opacity-10 cursor-help"
             title="Director's Cut"
          />
        </div>

        {/* Player Container */}
        <div className="relative aspect-video w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
           {!isPlaying ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20">
                <Button 
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xl px-10 py-8 rounded-full shadow-2xl shadow-emerald-600/30 transition-all hover:scale-110 active:scale-95 group"
                >
                  <Play className="w-8 h-8 mr-4 fill-current group-hover:scale-110 transition-transform" />
                  Запустить симуляцию
                </Button>
                <p className="mt-6 text-slate-400 text-sm uppercase tracking-widest font-medium">
                   Интерактивный режим
                </p>
             </div>
           ) : (
             <div className="absolute inset-0 animate-in fade-in duration-700">
                {scenario ? (
                  <PlayerWorkspace embeddedScenario={scenario} />
                ) : (
                  <div className="flex items-center justify-center h-full text-red-400">
                    Сценарий не найден: {scenarioId}
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      <SpeakerModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
