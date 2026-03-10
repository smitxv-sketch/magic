import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Play, Cpu, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { TenantImage } from '@/components/ui/TenantImage';

export const HeroBlock = ({ block, onAction }: { block: PresentationBlock, onAction: (id: string) => void }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  // Animation variants for the typewriter effect
  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-32 pb-20 bg-[#030712] mt-[-120px]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <TenantImage 
            src={block.imageUrl || '/images/hero-ai-core.jpg'} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
            fallbackText="Hero Background"
          />
        </motion.div>
        {/* Dark overlays for readability - balanced for visibility and contrast */}
        <div className="absolute inset-0 bg-[#030712]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_100%)] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />
        
        {/* Subtle grid texture */}
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
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Central Composition */}
        <div className="relative w-full flex flex-col items-center justify-center mt-10">
          
          {/* Glassmorphism Text Panel (Background removed) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto p-8 md:p-12"
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
              {/* Neon / Glitch Title Effect */}
              <motion.h1 
                animate={{ 
                  textShadow: [
                    "0px 0px 10px rgba(16,185,129,0.4)", 
                    "0px 0px 20px rgba(16,185,129,0.7)", 
                    "0px 0px 10px rgba(16,185,129,0.4)"
                  ] 
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl md:text-7xl font-sans font-bold tracking-tight mb-6 leading-[1.1] text-white drop-shadow-sm"
              >
                {block.title}
              </motion.h1>
              <button 
                onClick={() => setShowDirectorsCut(true)}
                className="absolute -top-4 -right-4 md:-right-12 p-2 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Режиссёрский сценарий"
              >
                <Info className="w-6 h-6" />
              </button>
            </div>

            {/* Typewriter / Fade-in Subtitle with HTML support for bold keywords */}
            <motion.div 
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-2xl text-slate-300/90 mb-10 leading-relaxed max-w-4xl mx-auto font-light tracking-wide [&>b]:font-semibold [&>b]:text-white [&>b]:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              dangerouslySetInnerHTML={{ __html: block.subtitle || '' }}
            />
            
            {block.primaryAction && (
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0px 0px 20px rgba(16,185,129,0.3)", 
                    "0px 0px 40px rgba(16,185,129,0.6)", 
                    "0px 0px 20px rgba(16,185,129,0.3)"
                  ] 
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl"
              >
                <Button 
                  size="lg"
                  onClick={() => onAction(block.primaryAction!.actionId)}
                  className="relative overflow-hidden group bg-emerald-600/90 hover:bg-emerald-500 text-white text-lg px-10 py-7 rounded-2xl backdrop-blur-md border border-emerald-400/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Play className="w-5 h-5 mr-3 fill-current relative z-10" />
                  <span className="relative z-10 font-medium tracking-wide">{block.primaryAction.label}</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
