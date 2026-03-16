import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { ICON_MAP } from '../icons';
import { TenantImage } from '@/components/ui/TenantImage';

export const ProblemChaosSection = ({ block }: { block: PresentationBlock }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-[#050b14]">
      {/* Deep technological background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px]" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 lg:order-1"
        >
          {block.badge && (
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 border shadow-lg backdrop-blur-sm bg-red-950/50 text-red-400 border-red-800/50 shadow-[0_0_15px_rgba(248,113,113,0.1)]">
              {block.badge}
            </span>
          )}
          <div className="relative inline-block group w-full">
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 leading-[1.15] bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 drop-shadow-sm">
              {block.title}
            </h2>
            <button 
              onClick={() => setShowDirectorsCut(true)}
              className="absolute top-0 right-0 lg:right-auto lg:left-full lg:ml-4 p-1 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xl text-slate-300/90 mb-10 leading-relaxed font-light">
            {block.subtitle}
          </p>
          
          <div className="space-y-4">
            {block.content?.map((item, idx) => {
              const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : CheckCircle;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                  key={idx} 
                  className="flex items-start gap-5 p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-lg hover:shadow-xl hover:bg-slate-800/50 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl shrink-0 transition-colors duration-300 bg-red-950/50 text-red-400 group-hover:bg-red-900/60">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1.5 tracking-wide">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-sm md:text-base">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Image or Interactive Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-1 lg:order-2 relative"
        >
          {/* Deep volumetric glow behind the image container */}
          <div className="absolute inset-0 blur-[80px] rounded-full transform scale-90 opacity-50 bg-red-600/20" />

          <div className="relative rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-900/50 backdrop-blur-xl p-2 group h-full min-h-[400px]">
            {/* Glassmorphism reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />
            
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#0a0f1a]">
              <TenantImage 
                src={block.imageUrl || ''} 
                alt={block.title} 
                className="w-full h-full object-cover aspect-[4/3] mix-blend-screen opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                fallbackText={block.title}
              />
              {/* Bokeh overlay effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,#050b14_100%)] pointer-events-none mix-blend-multiply" />
            </div>
          </div>
        </motion.div>
      </div>
      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
