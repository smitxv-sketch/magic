import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { ICON_MAP } from '../icons';
import { ProcessDesignerMockup } from './ProcessDesignerMockup';
import { TenantImage } from '@/components/ui/TenantImage';

export const SplitBlock = ({ block, reverse = false }: { block: PresentationBlock, reverse?: boolean }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={cn("order-2", reverse ? "lg:order-2" : "lg:order-1")}
        >
          {block.badge && (
            <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-4 block">
              {block.badge}
            </span>
          )}
          <div className="relative inline-block group w-full">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              {block.title}
            </h2>
            <button 
              onClick={() => setShowDirectorsCut(true)}
              className="absolute top-0 right-0 lg:right-auto lg:left-full lg:ml-4 p-1 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xl text-slate-100 mb-8 leading-relaxed">
            {block.subtitle}
          </p>
          
          <div className="space-y-6">
            {block.content?.map((item, idx) => {
              const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : CheckCircle;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:bg-slate-800/80">
                  <div className="p-3 bg-emerald-900/30 rounded-xl text-emerald-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-200 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Image or Interactive Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={cn("order-1", reverse ? "lg:order-1" : "lg:order-2")}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/30 backdrop-blur-md p-2 group h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {block.id === 'solution-routing' ? (
              <ProcessDesignerMockup />
            ) : (
              <TenantImage 
                src={block.imageUrl || ''} 
                alt={block.title} 
                className="w-full h-full rounded-2xl bg-slate-100 object-cover aspect-[4/3]"
                fallbackText={block.title}
              />
            )}
          </div>
        </motion.div>
      </div>
      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
