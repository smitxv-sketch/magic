import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { PresentationData, PresentationBlock, BlockLayoutType } from '@/types/presentation';
import presentationData from '@/data/presentation_content.json';
import { 
  FileText, Shield, Zap, GitMerge, Server, Lock, Bot, HardHat, 
  ArrowRight, CheckCircle2, FileStack, Users, AlertTriangle, Play, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

// --- Icon Mapping ---
const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Shield, Zap, GitMerge, Server, Lock, Bot, HardHat, 
  FileStack, Users, AlertTriangle, ShieldCheck
};

// --- Block Renderers ---

const HeroBlock = ({ block, onAction }: { block: PresentationBlock, onAction: (id: string) => void }) => (
  <section className="min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden px-6 py-20">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent z-0" />
    
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 text-center max-w-4xl mx-auto"
    >
      {block.badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold uppercase tracking-wider mb-6 border border-emerald-200 shadow-sm">
          {block.badge}
        </span>
      )}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
        {block.title}
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
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
           <img 
             src={block.imageUrl} 
             alt="Hero Visual" 
             className="w-full h-auto rounded-2xl bg-slate-100"
             onError={(e) => {
               e.currentTarget.src = 'https://placehold.co/1200x600/e2e8f0/64748b?text=Hero+Image+Placeholder';
             }}
           />
        </div>
      </motion.div>
    )}
  </section>
);

const SplitBlock = ({ block, reverse = false }: { block: PresentationBlock, reverse?: boolean }) => (
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
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-4 block">
            {block.badge}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          {block.title}
        </h2>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          {block.subtitle}
        </p>
        
        <div className="space-y-6">
          {block.content?.map((item, idx) => {
            const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : CheckCircle2;
            return (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={cn("order-1", reverse ? "lg:order-1" : "lg:order-2")}
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/30 backdrop-blur-md p-2 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src={block.imageUrl} 
            alt={block.title} 
            className="w-full h-auto rounded-2xl bg-slate-100 object-cover aspect-[4/3]"
            onError={(e) => {
               e.currentTarget.src = `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(block.title)}`;
             }}
          />
        </div>
      </motion.div>
    </div>
  </section>
);

const BentoBlock = ({ block }: { block: PresentationBlock }) => (
  <section className="py-24 px-6 bg-slate-50 relative">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        {block.badge && (
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-4 block">
            {block.badge}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          {block.title}
        </h2>
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
              metric.trend === 'down' ? "from-emerald-600 to-teal-500" : "from-blue-600 to-indigo-600"
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
          <img 
            src={block.imageUrl} 
            alt="ROI Visual" 
            className="w-full h-auto bg-white"
            onError={(e) => {
               e.currentTarget.src = 'https://placehold.co/1200x400/e2e8f0/64748b?text=ROI+Chart+Placeholder';
             }}
          />
        </motion.div>
      )}
    </div>
  </section>
);

const ITSummaryBlock = ({ block }: { block: PresentationBlock }) => (
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
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {block.title}
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            {block.subtitle}
          </p>

          <div className="grid gap-6">
            {block.content?.map((item, idx) => {
              const Icon = item.icon ? ICON_MAP[item.icon] : Server;
              return (
                <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 shrink-0 h-fit">
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
                  SECURE ENCLAVE<br/>
                  STATUS: ACTIVE<br/>
                  PROTOCOL: TLS 1.3
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const VisionBlock = ({ block }: { block: PresentationBlock }) => (
  <section className="py-24 px-6 relative overflow-hidden">
    <div className="max-w-7xl mx-auto text-center">
      {block.badge && (
        <span className="text-purple-600 font-bold tracking-wider uppercase text-sm mb-4 block">
          {block.badge}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
        {block.title}
      </h2>
      <p className="text-xl text-slate-600 mb-16 max-w-3xl mx-auto">
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
              <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-500">
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
  </section>
);

const CTABlock = ({ block, onAction }: { block: PresentationBlock, onAction: (id: string) => void }) => (
  <section className="py-32 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 z-0" />
     
     <motion.div 
       initial={{ opacity: 0, y: 30 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       className="relative z-10 max-w-4xl mx-auto"
     >
       <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
         {block.title}
       </h2>
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
  </section>
);

// --- Main Component ---

export const PresentationView = () => {
  const { setActiveMode, setPlayerOpen, loadScenario } = useAppStore();
  const data = presentationData as PresentationData;

  const handleAction = (actionId: string) => {
    if (actionId === 'open-player') {
      // In a real app, we might load a specific scenario here
      // For now, we just open the player modal
      setPlayerOpen(true);
    } else if (actionId === 'open-studio') {
      setActiveMode('studio');
    }
  };

  const renderBlock = (block: PresentationBlock) => {
    switch (block.layout) {
      case 'hero':
        return <HeroBlock key={block.id} block={block} onAction={handleAction} />;
      case 'split-right':
        return <SplitBlock key={block.id} block={block} />;
      case 'split-left':
        return <SplitBlock key={block.id} block={block} reverse />;
      case 'bento':
        return <BentoBlock key={block.id} block={block} />;
      case 'it-summary':
        return <ITSummaryBlock key={block.id} block={block} />;
      case 'vision':
        return <VisionBlock key={block.id} block={block} />;
      case 'cta':
        return <CTABlock key={block.id} block={block} onAction={handleAction} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {data.blocks.map(block => renderBlock(block))}
      
      {/* Footer / Copyright */}
      <footer className="py-12 bg-slate-950 text-slate-600 text-center text-sm">
        <p>© {new Date().getFullYear()} {data.meta.company}. {data.meta.department}.</p>
        <p className="mt-2">Confidential. Internal Use Only.</p>
      </footer>
    </div>
  );
};
