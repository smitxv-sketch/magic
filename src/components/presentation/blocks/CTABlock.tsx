import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';

export const CTABlock = ({ block, onAction }: { block: PresentationBlock, onAction: (id: string) => void }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="py-32 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 z-0" />
       
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="relative z-10 max-w-4xl mx-auto"
       >
         <div className="relative inline-block group">
           <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
             {block.title}
           </h2>
           <button 
             onClick={() => setShowDirectorsCut(true)}
             className="absolute -top-4 -right-12 p-2 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
           >
             <Info className="w-6 h-6" />
           </button>
         </div>

         <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
           {block.subtitle}
         </p>
         
         {block.primaryAction && (
           <Button 
             size="lg"
             onClick={() => onAction(block.primaryAction!.actionId)}
             className="bg-white text-slate-900 hover:bg-slate-100 text-xl px-10 py-8 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
           >
             {block.primaryAction.label}
             <ArrowRight className="w-6 h-6 ml-3" />
           </Button>
         )}
       </motion.div>
       <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
