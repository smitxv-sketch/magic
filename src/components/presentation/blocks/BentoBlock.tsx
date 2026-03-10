import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PresentationBlock } from '@/types/presentation';
import { DirectorsCutModal } from './DirectorsCutModal';
import { TenantImage } from '@/components/ui/TenantImage';

export const BentoBlock = ({ block }: { block: PresentationBlock }) => {
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  return (
    <section className="py-24 px-6 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {block.badge && (
            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-4 block">
              {block.badge}
            </span>
          )}
          <div className="relative inline-block group">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              {block.title}
            </h2>
            <button 
              onClick={() => setShowDirectorsCut(true)}
              className="absolute -top-2 -right-10 p-2 text-slate-300 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {block.metrics?.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={cn(
                "text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r",
                metric.trend === 'down' ? "from-emerald-600 to-teal-500" : "from-emerald-600 to-teal-600"
              )}>
                {metric.value}
              </div>
              <p className="text-lg font-medium text-slate-600 leading-snug">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        {block.imageUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
          >
            <TenantImage 
              src={block.imageUrl} 
              alt="ROI Visual" 
              className="w-full h-auto bg-white"
              fallbackText="ROI Chart Placeholder"
            />
          </motion.div>
        )}
      </div>
      <DirectorsCutModal block={block} isOpen={showDirectorsCut} onClose={() => setShowDirectorsCut(false)} />
    </section>
  );
};
