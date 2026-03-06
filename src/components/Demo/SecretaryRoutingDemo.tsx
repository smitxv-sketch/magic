import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Mail, ArrowRight, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export const SecretaryRoutingDemo = () => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const startDemo = () => {
    setStatus('scanning');
    setProgress(0);
  };

  const resetDemo = () => {
    setStatus('idle');
    setProgress(0);
  };

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('processing');
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }

    if (status === 'processing') {
      const timer = setTimeout(() => {
        setStatus('complete');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="w-full h-full min-h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-4 text-sm font-medium text-slate-500">Симуляция: Агент-Секретарь (Матрица №1)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetDemo} className="text-slate-400 hover:text-emerald-600">
          <RefreshCw className={cn("w-4 h-4 mr-2", status === 'scanning' && "animate-spin")} />
          Рестарт
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel: Incoming Email */}
        <div className="p-8 border-r border-slate-200 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20" />
          
          <div className="mb-6 flex items-center gap-3 text-slate-400 uppercase text-xs font-bold tracking-wider">
            <Mail className="w-4 h-4" />
            Входящее письмо
          </div>

          <div className="space-y-4 relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Предписание №45-ГЖИ</h3>
                <p className="text-sm text-slate-500">От: Жилищная Инспекция (gzi@gov.ru)</p>
              </div>
              <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium">Важно</span>
            </div>

            <div className="prose prose-slate text-sm leading-relaxed text-slate-600 relative">
              {/* Scanner Effect */}
              {status === 'scanning' && (
                <motion.div 
                  className="absolute inset-0 bg-emerald-500/10 z-10 pointer-events-none"
                  initial={{ height: '0%' }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  style={{ borderBottom: '2px solid #10B981' }}
                />
              )}

              <p>
                В ходе проверки выявлены нарушения <span className={cn("transition-colors duration-500", status !== 'idle' && "bg-amber-100 text-amber-800 font-medium")}>порядка начисления платы</span> за 
                <span className={cn("transition-colors duration-500", status !== 'idle' && "bg-amber-100 text-amber-800 font-medium")}> электроэнергию</span> по лицевым счетам № 4500... 
                согласно выгрузке из <span className={cn("transition-colors duration-500", status !== 'idle' && "bg-amber-100 text-amber-800 font-medium")}>ГИС ЖКХ</span>.
              </p>
              <p>
                Требуем предоставить пояснения и перерасчет в течение 3 рабочих дней.
                Приложение: реестр лицевых счетов.xls
              </p>
            </div>

            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                <Button onClick={startDemo} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Запустить анализ
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: CRM Card */}
        <div className="p-8 bg-slate-50 relative">
          <div className="mb-6 flex items-center gap-3 text-slate-400 uppercase text-xs font-bold tracking-wider">
            <FileText className="w-4 h-4" />
            Карточка документа (СЭД)
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            {/* Field 1 */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase block mb-2">Тематика</label>
              <div className="h-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center px-3 text-sm font-medium text-slate-700">
                {status === 'complete' ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Порядок начисления платы (ГИС ЖКХ)
                  </motion.span>
                ) : status === 'processing' ? (
                  <span className="animate-pulse w-24 h-2 bg-slate-200 rounded" />
                ) : null}
              </div>
            </div>

            {/* Field 2 */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase block mb-2">Куратор (Ответственный)</label>
              <div className={cn(
                "h-12 rounded-lg border flex items-center px-3 gap-3 transition-colors duration-500",
                status === 'complete' ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"
              )}>
                {status === 'complete' ? (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-900">Директор по работе с клиентами</div>
                      <div className="text-xs text-emerald-600">Авто-назначение (Confidence: 98%)</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
                  </motion.div>
                ) : status === 'processing' ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                    <div className="space-y-1 flex-1">
                      <div className="w-3/4 h-2 bg-slate-200 rounded animate-pulse" />
                      <div className="w-1/2 h-2 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Field 3 */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase block mb-2">В копию (Рассылка)</label>
              <div className="min-h-[3rem] bg-slate-50 rounded-lg border border-slate-100 p-2 flex flex-wrap gap-2">
                {status === 'complete' ? (
                  <>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">Генеральный директор</motion.span>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">Директор по правовым вопросам</motion.span>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">Нач. правового управления</motion.span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", 
                status === 'idle' ? "bg-slate-300" :
                status === 'scanning' ? "bg-amber-400 animate-pulse" :
                status === 'processing' ? "bg-blue-400 animate-pulse" :
                "bg-emerald-500"
              )} />
              <span className="text-xs font-mono text-slate-500">
                {status === 'idle' ? 'Ожидание документа...' :
                 status === 'scanning' ? 'Сканирование текста...' :
                 status === 'processing' ? 'Поиск в Матрице №1...' :
                 'Маршрутизировано успешно (0.8s)'}
              </span>
            </div>
            {status === 'complete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                AI AGENT ACTIVE
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
