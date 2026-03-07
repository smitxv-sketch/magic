import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PresentationBlock } from '@/types/presentation';
import { Bot, Database, Calculator, Mail, FileText, ArrowRight, CheckCircle2, Server, Globe, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ToolOrchestratorBlock = ({ block }: { block: PresentationBlock }) => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Input, 2: Thinking/Calling, 3: Tools Working, 4: Synthesis, 5: Output

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runStep = (currentStep: number) => {
      let nextStep = (currentStep + 1) % 6;
      let delay = 2000; // Default delay

      if (currentStep === 4) { // Step 4 (AI-CORE Synthesis) -> Step 5 (Result)
         delay = 4000; // User requested 4 seconds for AI-CORE
      } else if (currentStep === 5) { // Step 5 (Result) -> Step 0 (Reset)
         delay = 5000; // Hold result for 5s
      }

      setStep(nextStep);
      timeout = setTimeout(() => runStep(nextStep), delay);
    };

    timeout = setTimeout(() => runStep(0), 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-24 px-6 bg-slate-900 min-h-screen flex flex-col justify-center overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-4 block">
            {block.badge || 'Технология'}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {block.title}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {block.subtitle}
          </p>
        </div>

        {/* Orchestration Diagram */}
        <div className="relative h-[600px] w-full max-w-6xl mx-auto">
          
          {/* Pillar Labels (Background) */}
          <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-30">
             <div className="border-r border-slate-700/50 flex justify-center pt-4">
                <span className="text-4xl font-black text-slate-700 uppercase tracking-widest rotate-90 origin-center translate-y-48 opacity-20">Контекст</span>
             </div>
             <div className="border-r border-slate-700/50 flex justify-center pt-4">
                <span className="text-4xl font-black text-emerald-900 uppercase tracking-widest rotate-90 origin-center translate-y-48 opacity-20">Интеллект</span>
             </div>
             <div className="flex justify-center pt-4">
                <span className="text-4xl font-black text-blue-900 uppercase tracking-widest rotate-90 origin-center translate-y-48 opacity-20">Инструменты</span>
             </div>
          </div>

          {/* Connections Layer (SVG) - Desktop */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {/* Context to Brain */}
            <line x1="15%" y1="25%" x2="50%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 1 && <motion.circle r="4" fill="#ffffff" animate={{ cx: ["15%", "50%"], cy: ["25%", "50%"] }} transition={{ duration: 1.5 }} />}

            {/* Brain to Tool 1 */}
            <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 2 && <motion.circle r="4" fill="#3b82f6" animate={{ cx: ["50%", "80%"], cy: ["50%", "20%"] }} transition={{ duration: 0.5 }} />}
            {step === 3 && <motion.circle r="4" fill="#3b82f6" animate={{ cx: ["80%", "50%"], cy: ["20%", "50%"] }} transition={{ duration: 0.5, delay: 1 }} />}

            {/* Brain to Tool 2 */}
            <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 2 && <motion.circle r="4" fill="#f59e0b" animate={{ cx: ["50%", "90%"], cy: ["50%", "50%"] }} transition={{ duration: 0.5 }} />}
            {step === 3 && <motion.circle r="4" fill="#f59e0b" animate={{ cx: ["90%", "50%"], cy: ["50%", "50%"] }} transition={{ duration: 0.5, delay: 1 }} />}

            {/* Brain to Tool 3 */}
            <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 2 && <motion.circle r="4" fill="#a855f7" animate={{ cx: ["50%", "80%"], cy: ["50%", "80%"] }} transition={{ duration: 0.5 }} />}
            {step === 3 && <motion.circle r="4" fill="#a855f7" animate={{ cx: ["80%", "50%"], cy: ["80%", "50%"] }} transition={{ duration: 0.5, delay: 1 }} />}

            {/* Brain to Result */}
            <line x1="50%" y1="50%" x2="15%" y2="80%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 4 && <motion.circle r="4" fill="#10b981" animate={{ cx: ["50%", "15%"], cy: ["50%", "80%"] }} transition={{ duration: 1 }} />}
          </svg>

          {/* Connections Layer (SVG) - Mobile */}
          <svg className="block md:hidden absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {/* Context to Brain */}
            <line x1="50%" y1="15%" x2="50%" y2="40%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 1 && <motion.circle r="4" fill="#ffffff" animate={{ cx: ["50%", "50%"], cy: ["15%", "40%"] }} transition={{ duration: 1.5 }} />}

            {/* Brain to Tool 1 (Left) */}
            <line x1="50%" y1="40%" x2="20%" y2="65%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 2 && <motion.circle r="4" fill="#3b82f6" animate={{ cx: ["50%", "20%"], cy: ["40%", "65%"] }} transition={{ duration: 0.5 }} />}
            {step === 3 && <motion.circle r="4" fill="#3b82f6" animate={{ cx: ["20%", "50%"], cy: ["65%", "40%"] }} transition={{ duration: 0.5, delay: 1 }} />}

            {/* Brain to Tool 2 (Center) */}
            <line x1="50%" y1="40%" x2="50%" y2="65%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 2 && <motion.circle r="4" fill="#f59e0b" animate={{ cx: ["50%", "50%"], cy: ["40%", "65%"] }} transition={{ duration: 0.5 }} />}
            {step === 3 && <motion.circle r="4" fill="#f59e0b" animate={{ cx: ["50%", "50%"], cy: ["65%", "40%"] }} transition={{ duration: 0.5, delay: 1 }} />}

            {/* Brain to Tool 3 (Right) */}
            <line x1="50%" y1="40%" x2="80%" y2="65%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 2 && <motion.circle r="4" fill="#a855f7" animate={{ cx: ["50%", "80%"], cy: ["40%", "65%"] }} transition={{ duration: 0.5 }} />}
            {step === 3 && <motion.circle r="4" fill="#a855f7" animate={{ cx: ["80%", "50%"], cy: ["65%", "40%"] }} transition={{ duration: 0.5, delay: 1 }} />}

            {/* Brain to Result */}
            <line x1="50%" y1="40%" x2="50%" y2="90%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {step === 4 && <motion.circle r="4" fill="#10b981" animate={{ cx: ["50%", "50%"], cy: ["40%", "90%"] }} transition={{ duration: 1 }} />}
          </svg>

          {/* Central Brain (LLM) - Pillar 2 */}
          <div className="absolute top-[40%] left-1/2 md:top-1/2 md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className={cn(
              "w-24 h-24 md:w-40 md:h-40 rounded-full bg-slate-800 border-4 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all duration-500 relative",
              step === 2 || step === 4 ? "border-emerald-500 scale-110 shadow-[0_0_80px_rgba(16,185,129,0.4)]" : "border-slate-600"
            )}>
              <Bot className={cn(
                "w-12 h-12 md:w-20 md:h-20 transition-colors duration-500",
                step === 2 || step === 4 ? "text-emerald-400" : "text-slate-500"
              )} />
              
              {/* Thinking Pulse */}
              {(step === 2 || step === 4) && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-50" />
              )}
            </div>
            <span className="mt-4 md:mt-6 text-emerald-400 font-bold text-lg md:text-xl tracking-wider">ИИ-ЯДРО</span>
          </div>

            {/* Input Node (Left) - Pillar 1: Context */}
            <div className="absolute top-[15%] left-1/2 md:top-[25%] md:left-[15%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-full px-4 md:w-auto">
              <div className={cn(
                "bg-slate-800 p-4 md:p-6 rounded-2xl border transition-all duration-500 shadow-2xl w-full max-w-[280px] relative overflow-hidden group",
                step === 0 || step === 1 ? "border-emerald-500 shadow-emerald-500/20 scale-105" : "border-slate-600"
              )}>
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-500" />
                <div className="flex items-center gap-3 mb-4 text-slate-300 text-sm uppercase tracking-wider font-bold border-b border-slate-700 pb-2">
                  <FileText className={cn("w-5 h-5", step === 0 || step === 1 ? "text-emerald-400" : "text-slate-400")} /> 
                  Этап процесса
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5" />
                    <span>Процесс: <strong className="text-base text-white block mt-1">Сверка</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5" />
                    <span>Шаг: <strong>Обогащение данными и расчет рисков</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5" />
                    <span>Контрагент: <strong>ООО "Вектор"</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5" />
                    <span>ИНН: <strong>7701234567</strong></span>
                  </div>
                   <div className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5" />
                    <span>Л/С: <strong>40702810400000001234</strong></span>
                  </div>
                  <div className="p-2 md:p-3 bg-slate-900/50 rounded border border-slate-700 text-xs md:text-sm text-slate-300 italic">
                    "Прошу предоставить акт сверки за 3 квартал..."
                  </div>
                </div>
              </div>
              
              {/* Input Flow Animation - Removed (Replaced by SVG) */}
            </div>

            {/* Tools (Satellites) - Pillar 3: Tools */}
            {/* Tool 1: 1C Database */}
            <div className="absolute top-[65%] left-[20%] md:top-[20%] md:left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className={cn(
                "w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-slate-800 border-2 flex items-center justify-center transition-colors duration-300 shadow-lg",
                step === 3 ? "border-blue-500 bg-blue-500/10 shadow-blue-500/20" : "border-slate-700"
              )}>
                <Database className={cn("w-6 h-6 md:w-10 md:h-10", step === 3 ? "text-blue-400" : "text-slate-500")} />
              </div>
              <span className="mt-2 md:mt-3 text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wide">1С:ERP</span>
            </div>

            {/* Tool 2: Billing */}
            <div className="absolute top-[65%] left-[50%] md:top-[50%] md:left-[90%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className={cn(
                "w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-slate-800 border-2 flex items-center justify-center transition-colors duration-300 shadow-lg",
                step === 3 ? "border-amber-500 bg-amber-500/10 shadow-amber-500/20" : "border-slate-700"
              )}>
                <Calculator className={cn("w-6 h-6 md:w-10 md:h-10", step === 3 ? "text-amber-400" : "text-slate-500")} />
              </div>
              <span className="mt-2 md:mt-3 text-amber-400 text-xs md:text-sm font-bold uppercase tracking-wide">Биллинг</span>
            </div>

            {/* Tool 3: External API */}
            <div className="absolute top-[65%] left-[80%] md:top-[80%] md:left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className={cn(
                "w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-slate-800 border-2 flex items-center justify-center transition-colors duration-300 shadow-lg",
                step === 3 ? "border-purple-500 bg-purple-500/10 shadow-purple-500/20" : "border-slate-700"
              )}>
                <Globe className={cn("w-6 h-6 md:w-10 md:h-10", step === 3 ? "text-purple-400" : "text-slate-500")} />
              </div>
              <span className="mt-2 md:mt-3 text-purple-400 text-xs md:text-sm font-bold uppercase tracking-wide">ФНС / ЕГРЮЛ</span>
            </div>

            {/* Output Node (Floating near Context) */}
            <div className="absolute top-[90%] left-1/2 md:top-[80%] md:left-[15%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-full px-4 md:w-auto">
              <div className={cn(
                "bg-slate-800 p-6 rounded-2xl border-2 shadow-2xl w-full max-w-[280px] transition-all duration-500 transform",
                step === 5 ? "border-emerald-500 shadow-emerald-500/30 scale-110 bg-slate-800" : "border-slate-700 opacity-50 scale-100"
              )}>
                <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm uppercase tracking-wider font-bold">
                  <CheckCircle2 className={cn("w-5 h-5", step === 5 ? "text-emerald-500" : "text-slate-500")} /> Результат
                </div>
                <div className="space-y-3">
                  <p className="text-base text-slate-300 font-medium">
                    {step === 5 ? "Сверка завершена." : "Ожидание..."}
                  </p>
                  {step === 5 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700">
                         <span className="text-xs text-slate-400">Долг:</span>
                         <span className="text-sm font-bold text-red-400">124 500 ₽</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700">
                         <span className="text-xs text-slate-400">Пени:</span>
                         <span className="text-sm font-bold text-red-400">9 800 ₽</span>
                      </div>
                      <div className="flex items-start gap-2 bg-amber-900/20 p-2 rounded border border-amber-700/50">
                         <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                         <span className="text-xs text-amber-200 leading-tight">Высокий риск неоплаты, последний платеж 5 мес назад</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

            </div>

        </div>

        {/* Legend */}
        <div className="mt-12 flex justify-center gap-8 text-sm text-slate-500">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
             <span>Поток данных</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span>Запрос к БД</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-amber-500" />
             <span>Вычисления</span>
           </div>
        </div>

      </div>
    </section>
  );
};
