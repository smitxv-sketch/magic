import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Play, Cpu, Network, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { TenantImage } from '@/components/ui/TenantImage';

export const HeroBlock = ({ block, onAction }: { block: PresentationBlock, onAction: (id: string) => void }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-32 pb-20 bg-[#030712] mt-[-120px]">
      {/* Deep textured background with grids and gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#030712] to-[#030712]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating geometric shapes & data lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"
        />
        {/* Vertical data line */}
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Central Composition: Image behind/integrated with the text panel */}
        <div className="relative w-full flex flex-col items-center justify-center mt-10">
          
          {/* The AI Cube Image with deep volumetric glow */}
          {block.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-0 pointer-events-none"
            >
              {/* Volumetric glow behind the image */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full transform scale-110" />
              
              <div className="relative rounded-[2.5rem] overflow-hidden opacity-40 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]">
                 <TenantImage 
                   src={block.imageUrl} 
                   alt="Hero Visual" 
                   className="w-full h-auto object-cover"
                   fallbackText="Hero Image Placeholder"
                 />
              </div>
            </motion.div>
          )}

          {/* Glassmorphism Text Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.15)]"
          >
            {/* Small digital displays / badges floating around */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-12 hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-lg"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-300">AI Core Active</span>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-8 -right-8 hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-lg"
            >
              <Network className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-300">Routing: 100%</span>
            </motion.div>

            {block.badge && (
              <span className="inline-block px-5 py-1.5 rounded-full bg-emerald-950/50 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-emerald-800/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {block.badge}
              </span>
            )}
            
            <div className="relative inline-block group w-full">
              <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight mb-6 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-emerald-200 drop-shadow-sm">
                {block.title}
              </h1>
              <button 
                onClick={() => setShowDirectorsCut(true)}
                className="absolute -top-4 -right-4 md:-right-12 p-2 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Режиссёрский сценарий"
              >
                <Info className="w-6 h-6" />
              </button>
            </div>

            <p className="text-lg md:text-xl text-slate-300/90 mb-10 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
              {block.subtitle}
            </p>
            
            {block.primaryAction && (
              <Button 
                size="lg"
                onClick={() => onAction(block.primaryAction!.actionId)}
                className="relative overflow-hidden group bg-emerald-600/80 hover:bg-emerald-500/90 text-white text-lg px-10 py-7 rounded-2xl backdrop-blur-md border border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Play className="w-5 h-5 mr-3 fill-current relative z-10" />
                <span className="relative z-10 font-medium tracking-wide">{block.primaryAction.label}</span>
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
