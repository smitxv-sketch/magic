import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { TenantImage } from '@/components/ui/TenantImage';

export const HeroBlock = ({ block, onAction }: { block: PresentationBlock, onAction: (id: string) => void }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-28 pb-20 bg-slate-900 mt-[-120px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-4xl mx-auto mt-32"
      >
        {block.badge && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-900/80 text-emerald-300 text-sm font-bold uppercase tracking-wider mb-6 border border-emerald-700 shadow-lg backdrop-blur-sm">
            {block.badge}
          </span>
        )}
        <div className="relative inline-block group">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
            {block.title}
          </h1>
          <button 
            onClick={() => setShowDirectorsCut(true)}
            className="absolute -top-4 -right-8 p-2 text-slate-400 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
            title="Режиссёрский сценарий"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xl md:text-2xl text-slate-100 mb-10 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-md">
          {block.subtitle}
        </p>
        
        {block.primaryAction && (
          <Button 
            size="lg"
            onClick={() => onAction(block.primaryAction!.actionId)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 mr-3 fill-current" />
            {block.primaryAction.label}
          </Button>
        )}
      </motion.div>

      {block.imageUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 relative z-10 w-full max-w-5xl"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-2">
             <TenantImage 
               src={block.imageUrl} 
               alt="Hero Visual" 
               className="w-full h-auto rounded-2xl bg-slate-100"
               fallbackText="Hero Image Placeholder"
             />
          </div>
        </motion.div>
      )}

      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
