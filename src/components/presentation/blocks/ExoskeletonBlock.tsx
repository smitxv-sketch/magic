import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PresentationBlock } from '@/types/presentation';
import { FileText, ArrowRight, ShieldAlert, FileSearch, CheckCircle2, RotateCcw, Bot, User, Calculator } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ExoskeletonBlock = ({ block }: { block: PresentationBlock }) => {
  const [activeMode, setActiveMode] = useState<'standard' | 'firewall' | 'copilot'>('standard');
  const [docPosition, setDocPosition] = useState(0); // 0: Start, 1: Process, 2: End/Return
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation cycle
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const runCycle = () => {
      setDocPosition(0);
      
      // Step 1: Move to processing
      timer = setTimeout(() => {
        setDocPosition(1);
        
        // Step 2: Decide outcome based on mode
        timer = setTimeout(() => {
          if (activeMode === 'firewall') {
            setDocPosition(3); // Return
          } else {
            setDocPosition(2); // Success
          }
        }, 2000); // Processing time
        
      }, 1000); // Initial delay
    };

    runCycle();
    const interval = setInterval(runCycle, 8000); // Increased cycle to 8s for 5s pause

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [activeMode]);

  return (
    <section className="py-24 px-6 bg-slate-50 min-h-screen flex flex-col justify-center overflow-hidden relative">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-4 block">
            {block.badge || 'Концепция'}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            {block.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {block.subtitle}
          </p>
        </div>

        {/* Interactive Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Controls (Left) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => setActiveMode('standard')}
              className={cn(
                "w-full text-left p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                activeMode === 'standard' 
                  ? "bg-white border-slate-300 shadow-lg scale-105" 
                  : "bg-slate-100 border-transparent hover:bg-white hover:shadow-md text-slate-500"
              )}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <User className={cn("w-6 h-6", activeMode === 'standard' ? "text-slate-900" : "text-slate-400")} />
                  <h3 className="font-bold text-lg">1. Стандартный процесс</h3>
                </div>
                <p className="text-sm opacity-80 pl-9">
                  Линейное движение документа. Человек проверяет всё вручную. Ошибки проходят незамеченными.
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveMode('firewall')}
              className={cn(
                "w-full text-left p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                activeMode === 'firewall' 
                  ? "bg-white border-amber-200 shadow-lg shadow-amber-100 scale-105" 
                  : "bg-slate-100 border-transparent hover:bg-white hover:shadow-md text-slate-500"
              )}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className={cn("w-6 h-6", activeMode === 'firewall' ? "text-amber-600" : "text-slate-400")} />
                  <h3 className="font-bold text-lg">2. Режим Блокировки (Контроль)</h3>
                </div>
                <p className="text-sm opacity-80 pl-9">
                  AI находит критическую ошибку и <strong>возвращает</strong> документ на доработку. Человек не тратит время.
                </p>
              </div>
              {activeMode === 'firewall' && <div className="absolute inset-0 bg-amber-50/50 -z-0" />}
            </button>

            <button
              onClick={() => setActiveMode('copilot')}
              className={cn(
                "w-full text-left p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                activeMode === 'copilot' 
                  ? "bg-white border-emerald-200 shadow-lg shadow-emerald-100 scale-105" 
                  : "bg-slate-100 border-transparent hover:bg-white hover:shadow-md text-slate-500"
              )}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <FileSearch className={cn("w-6 h-6", activeMode === 'copilot' ? "text-emerald-600" : "text-slate-400")} />
                  <h3 className="font-bold text-lg">3. Режим Ассистента (Обогащение)</h3>
                </div>
                <p className="text-sm opacity-80 pl-9">
                  AI анализирует документ и прикрепляет <strong>справку (артефакт)</strong>. Человек принимает решение быстрее.
                </p>
              </div>
              {activeMode === 'copilot' && <div className="absolute inset-0 bg-emerald-50/50 -z-0" />}
            </button>
          </div>

          {/* Visualization (Right) */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-slate-200 p-12 relative min-h-[500px] flex items-center justify-center overflow-hidden">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Process Nodes */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-3xl gap-4 lg:gap-0">
              
              {/* Node 1: Start */}
              <div className="flex flex-col items-center gap-4 relative z-20">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center shadow-sm">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <span className="font-bold text-slate-600">Создание</span>
                
                {/* Document Animation */}
                <AnimatePresence>
                  {docPosition === 0 && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-6 left-6 w-12 h-16 bg-white border border-slate-200 shadow-md rounded-lg flex items-center justify-center z-20"
                    >
                      <div className="w-8 h-1 bg-slate-200 rounded-full mb-1" />
                      <div className="w-6 h-1 bg-slate-200 rounded-full mb-1" />
                      <div className="w-8 h-1 bg-slate-200 rounded-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Arrow 1 */}
              <div className="flex-1 w-1 h-16 lg:w-auto lg:h-1 bg-slate-200 relative mx-0 lg:mx-4 my-2 lg:my-0">
                <div className="absolute bottom-0 lg:right-0 lg:top-[-6px] left-[-5px] lg:left-auto w-3 h-3 border-b-2 border-r-2 lg:border-b-0 lg:border-t-2 lg:border-r-2 border-slate-200 rotate-45" />
                
                {/* Moving Doc */}
                {docPosition === 1 && (
                  <motion.div 
                    layoutId="doc"
                    initial={{ x: 0, y: 0 }}
                    animate={isMobile ? { y: '100%' } : { x: '100%' }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute top-0 lg:top-1/2 left-1/2 lg:left-0 -translate-x-1/2 lg:-translate-y-1/2 w-8 h-10 bg-white border border-slate-300 shadow-sm rounded flex flex-col items-center justify-center gap-1 z-30 opacity-0" // Hide moving doc
                    style={{ width: '32px', height: '40px' }} // Ensure size
                  >
                    <div className="w-5 h-0.5 bg-slate-300 rounded-full" />
                    <div className="w-3 h-0.5 bg-slate-300 rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Node 2: Processing / AI */}
              <div className="flex flex-col items-center gap-4 relative z-20">
                <div className={cn(
                  "w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500 border-4 relative",
                  activeMode === 'standard' ? "bg-slate-50 border-slate-200" :
                  activeMode === 'firewall' ? "bg-amber-50 border-amber-400 shadow-amber-200" :
                  "bg-emerald-50 border-emerald-400 shadow-emerald-200"
                )}>
                  {activeMode === 'standard' ? (
                    <CheckCircle2 className="w-12 h-12 text-slate-400" />
                  ) : (
                    <Bot className={cn(
                      "w-12 h-12 transition-colors duration-300",
                      activeMode === 'firewall' ? "text-amber-600" : "text-emerald-600"
                    )} />
                  )}

                  {/* Processing Indicator */}
                  {docPosition === 1 && activeMode !== 'standard' && (
                    <>
                      <div className="absolute -top-2 -right-2 z-20">
                         <span className="relative flex h-6 w-6">
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", activeMode === 'firewall' ? "bg-amber-400" : "bg-emerald-400")}></span>
                            <span className={cn("relative inline-flex rounded-full h-6 w-6", activeMode === 'firewall' ? "bg-amber-500" : "bg-emerald-500")}></span>
                          </span>
                      </div>
                      
                      {/* Scanning Beam Effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        <motion.div 
                          initial={{ top: "-100%" }}
                          animate={{ top: "200%" }}
                          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                          className={cn(
                            "absolute left-0 right-0 h-1/2 w-full opacity-30",
                            activeMode === 'firewall' 
                              ? "bg-gradient-to-b from-transparent via-amber-400 to-transparent" 
                              : "bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
                <span className={cn(
                  "font-bold transition-colors duration-300",
                  activeMode === 'standard' ? "text-slate-600" : 
                  activeMode === 'firewall' ? "text-amber-700" : "text-emerald-700"
                )}>
                  {activeMode === 'standard' ? 'Согласование' : 'ИИ-Экзоскелет'}
                </span>

                {/* Return Path (Firewall) */}
                <AnimatePresence>
                  {docPosition === 3 && activeMode === 'firewall' && (
                    <motion.div 
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[400%] h-24 pointer-events-none hidden lg:block"
                    >
                       <svg className="w-full h-full overflow-visible" viewBox="0 0 500 60" preserveAspectRatio="none">
                         <path d="M 250 0 Q 250 60 125 60 Q 0 60 0 0" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
                         <circle cx="0" cy="0" r="4" fill="#f59e0b" />
                       </svg>
                       <motion.div 
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          style={{ offsetPath: "path('M 250 0 Q 250 60 125 60 Q 0 60 0 0')", offsetRotate: "0deg" }}
                          className="absolute left-0 top-0 w-16 h-16 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center justify-center -ml-8 -mt-8 shadow-lg z-50"
                       >
                          <ShieldAlert className="w-10 h-10 text-amber-600" />
                       </motion.div>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                          Возврат на доработку
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Arrow 2 */}
              <div className={cn(
                "flex-1 w-1 h-16 lg:w-auto lg:h-1 bg-slate-200 relative mx-0 lg:mx-4 my-2 lg:my-0 transition-opacity duration-300",
                activeMode === 'standard' ? "opacity-0" : "opacity-100"
              )}>
                <div className="absolute bottom-0 lg:right-0 lg:top-[-6px] left-[-5px] lg:left-auto w-3 h-3 border-b-2 border-r-2 lg:border-b-0 lg:border-t-2 lg:border-r-2 border-slate-200 rotate-45" />
                
                {/* Moving Doc (Success) */}
                {docPosition === 2 && (
                  <motion.div 
                    initial={{ left: 0 }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-0 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 w-8 h-10 bg-white border border-slate-300 shadow-sm rounded flex flex-col items-center justify-center gap-1 z-30 opacity-0" // Hide moving doc
                  >
                    <div className="w-5 h-0.5 bg-slate-300 rounded-full" />
                    <div className="w-3 h-0.5 bg-slate-300 rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Node 3: End */}
              <div className="flex flex-col items-center gap-4 relative z-20">
                {activeMode === 'standard' ? (
                  <div className="w-64 text-center">
                    <p className="text-sm font-medium text-slate-500 italic border-l-4 border-slate-300 pl-4 py-2 bg-slate-50 rounded-r-lg">
                      "Ответственность за достоверность и качество на исполнителе и согласующем"
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center shadow-sm relative">
                      <CheckCircle2 className="w-10 h-10 text-slate-400" />
                      
                      {/* Copilot Artifacts (Success) */}
                      <AnimatePresence>
                        {docPosition === 2 && activeMode === 'copilot' && (
                          <>
                            <motion.div 
                              initial={{ scale: 0, x: -50, y: -50, opacity: 0 }}
                              animate={{ scale: 1, x: -60, y: -60, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: 0.1, type: "spring" }}
                              className="absolute z-30 bg-slate-800/95 backdrop-blur-sm text-white p-3 rounded-xl border border-slate-600 shadow-2xl flex items-center gap-3 min-w-[140px]"
                            >
                              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                 <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider">Орфография: OK</span>
                            </motion.div>
                            
                            <motion.div 
                              initial={{ scale: 0, x: -70, y: 0, opacity: 0 }}
                              animate={{ scale: 1, x: -80, y: 0, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="absolute z-40 bg-slate-800/95 backdrop-blur-sm text-white p-3 rounded-xl border border-slate-600 shadow-2xl flex items-center gap-3 min-w-[140px]"
                            >
                              <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                                 <ShieldAlert className="w-4 h-4 text-emerald-400" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider">Риски: Низкие</span>
                            </motion.div>

                            <motion.div 
                              initial={{ scale: 0, x: -50, y: 50, opacity: 0 }}
                              animate={{ scale: 1, x: -60, y: 60, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: 0.3, type: "spring" }}
                              className="absolute z-50 bg-slate-800/95 backdrop-blur-sm text-white p-3 rounded-xl border border-slate-600 shadow-2xl flex items-center gap-3 min-w-[140px]"
                            >
                              <div className="p-1.5 bg-amber-500/20 rounded-lg">
                                 <Calculator className="w-4 h-4 text-amber-400" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider">Сумма: Верна</span>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="font-bold text-slate-600">Согласование</span>
                  </>
                )}
              </div>

            </div>
            
            {/* Legend/Status */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 text-sm text-slate-400">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-300" />
                 <span>Этап процесса</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-400" />
                 <span>AI-Модуль</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
