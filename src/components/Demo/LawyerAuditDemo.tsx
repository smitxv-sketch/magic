import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, CheckCircle, FileText, ArrowRight, RefreshCw, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export const LawyerAuditDemo = () => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'found' | 'fixing' | 'fixed'>('idle');

  const startAudit = () => {
    setStatus('scanning');
    setTimeout(() => setStatus('found'), 2000);
  };

  const fixErrors = () => {
    setStatus('fixing');
    setTimeout(() => setStatus('fixed'), 1500);
  };

  const resetDemo = () => {
    setStatus('idle');
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-4 text-sm font-medium text-slate-500">Симуляция: Агент-Юрист (Нормоконтроль)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetDemo} className="text-slate-400 hover:text-emerald-600">
          <RefreshCw className={cn("w-4 h-4 mr-2", status === 'scanning' && "animate-spin")} />
          Рестарт
        </Button>
      </div>

      <div className="flex-1 p-8 relative">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl min-h-[500px] p-12 relative border border-slate-100">
          
          {/* Document Header */}
          <div className="text-center mb-12 border-b border-slate-100 pb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">ДОГОВОР ПОСТАВКИ № 2024/Э-45</h2>
            <p className="text-sm text-slate-500">г. Челябинск, 12 октября 2024 г.</p>
          </div>

          {/* Document Body */}
          <div className="prose prose-slate max-w-none font-serif text-slate-800 leading-loose relative">
            <p>
              ООО "Уралэнергосбыт", именуемое в дальнейшем "Покупатель", в лице Генерального директора...
            </p>
            
            <div className="relative group">
              <p>
                3.1. Оплата товара производится Покупателем в течение 
                <span className={cn(
                  "mx-1 px-1 rounded transition-colors duration-300 relative inline-block",
                  (status === 'found' || status === 'fixing') ? "bg-red-100 text-red-800 border-b-2 border-red-400 cursor-help" : "",
                  status === 'fixed' ? "bg-emerald-100 text-emerald-800 border-b-2 border-emerald-400" : ""
                )}>
                  {status === 'fixed' ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>60 (шестидесяти)</motion.span>
                  ) : (
                    "5 (пяти)"
                  )}
                  
                  {/* Tooltip for Error */}
                  <AnimatePresence>
                    {status === 'found' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs font-sans p-3 rounded-lg shadow-xl z-20 pointer-events-none"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-red-200 block mb-1">Риск кассового разрыва</span>
                            Стандартный срок оплаты для данной категории поставщиков — не менее 45 дней.
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
                 календарных дней с момента приемки.
              </p>
            </div>

            <p>
              4.2. В случае просрочки оплаты Покупатель уплачивает пени в размере 
              <span className={cn(
                  "mx-1 px-1 rounded transition-colors duration-300 relative inline-block",
                  (status === 'found' || status === 'fixing') ? "bg-red-100 text-red-800 border-b-2 border-red-400 cursor-help" : "",
                  status === 'fixed' ? "bg-emerald-100 text-emerald-800 border-b-2 border-emerald-400" : ""
                )}>
                  {status === 'fixed' ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>0.1%</motion.span>
                  ) : (
                    "0.5%"
                  )}
                  
                   {/* Tooltip for Error */}
                   <AnimatePresence>
                    {status === 'found' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900 text-white text-xs font-sans p-3 rounded-lg shadow-xl z-20 pointer-events-none"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-red-200 block mb-1">Завышенная неустойка</span>
                            Превышает ключевую ставку ЦБ РФ. Рекомендуем снизить до 0.1%.
                          </div>
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
              </span>
               за каждый день просрочки.
            </p>

            <p>
              8.1. Споры решаются в Арбитражном суде 
              <span className={cn(
                  "mx-1 px-1 rounded transition-colors duration-300 relative inline-block",
                  (status === 'found' || status === 'fixing') ? "bg-red-100 text-red-800 border-b-2 border-red-400 cursor-help" : "",
                  status === 'fixed' ? "bg-emerald-100 text-emerald-800 border-b-2 border-emerald-400" : ""
                )}>
                  {status === 'fixed' ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Челябинской области</motion.span>
                  ) : (
                    "г. Москвы"
                  )}

                   {/* Tooltip for Error */}
                   <AnimatePresence>
                    {status === 'found' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs font-sans p-3 rounded-lg shadow-xl z-20 pointer-events-none"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-red-200 block mb-1">Неудобная подсудность</span>
                            Необходимо изменить на место нахождения Истца (Челябинск).
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
              </span>.
            </p>
          </div>

          {/* Scanner Overlay */}
          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div 
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: "100%", opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Actions Overlay */}
          <div className="absolute bottom-8 right-8 flex gap-4">
            {status === 'idle' && (
              <Button onClick={startAudit} size="lg" className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl">
                <Search className="w-5 h-5 mr-2" />
                Начать проверку
              </Button>
            )}
            
            {status === 'found' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Button onClick={fixErrors} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Исправить автоматически (3 ошибки)
                </Button>
              </motion.div>
            )}

            {status === 'fixed' && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200 font-bold">
                <CheckCircle className="w-5 h-5" />
                Документ согласован
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
