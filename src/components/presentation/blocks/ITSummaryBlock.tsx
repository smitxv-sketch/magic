import React, { useState } from 'react';
import { Info, Server } from 'lucide-react';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { ICON_MAP } from '../icons';

export const ITSummaryBlock = ({ block }: { block: PresentationBlock }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            {block.badge && (
              <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-4 block">
                {block.badge}
              </span>
            )}
            <div className="relative inline-block group w-full">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                {block.title}
              </h2>
              <button 
                onClick={() => setShowDirectorsCut(true)}
                className="absolute top-0 right-0 lg:right-auto lg:left-full lg:ml-4 p-1 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              {block.subtitle}
            </p>

            <div className="grid gap-6">
              {block.content?.map((item, idx) => {
                const Icon = item.icon ? ICON_MAP[item.icon] : Server;
                return (
                  <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0 h-fit">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-full min-h-[400px] bg-slate-800/50 rounded-3xl border border-white/10 p-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <Server className="w-48 h-48 text-slate-700 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl backdrop-blur-sm">
                  <p className="text-emerald-400 font-mono text-sm">
                    ЗАЩИЩЕННЫЙ КОНТУР<br/>
                    СТАТУС: АКТИВЕН<br/>
                    ПРОТОКОЛ: TLS 1.3
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
