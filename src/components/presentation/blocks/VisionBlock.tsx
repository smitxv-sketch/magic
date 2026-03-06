import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Bot } from 'lucide-react';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { ICON_MAP } from '../icons';

export const VisionBlock = ({ block }: { block: PresentationBlock }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        {block.badge && (
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-4 block">
            {block.badge}
          </span>
        )}
        <div className="relative inline-block group">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {block.title}
          </h2>
          <button 
            onClick={() => setShowDirectorsCut(true)}
            className="absolute -top-2 -right-10 p-2 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
        <p className="text-xl text-slate-300 mb-16 max-w-3xl mx-auto">
          {block.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {block.content?.map((item, idx) => {
            const Icon = item.icon ? ICON_MAP[item.icon] : Bot;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-3xl p-10 shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
