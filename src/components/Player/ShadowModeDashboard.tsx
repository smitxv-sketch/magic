import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scenario } from '@/schemas/scenarioConfig';
import { Terminal, Shield, Sparkles, ArrowRight, Database, Lock, Search, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ShadowModeDashboardProps {
  scenario: Scenario;
}

export const ShadowModeDashboard = ({ scenario }: ShadowModeDashboardProps) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState(scenario.collected_payloads || []);

  const handleGenerateRules = () => {
    setIsScrubbing(true);

    // Step 1: Data Scrubbing Animation (0-2s)
    setTimeout(() => {
      setLogs(prevLogs => prevLogs.map(log => ({
        ...log,
        raw_text: log.raw_text
          .replace(/ООО "[^"]+"/g, '[Контрагент_1]')
          .replace(/ИП [^,]+,/g, '[Контрагент_2],')
          .replace(/ПАО "[^"]+"/g, '[Контрагент_3]')
          .replace(/ИНН \d+/g, '[ИНН_Скрыт]')
          .replace(/Сумма: [\d\s]+ руб\./g, 'Сумма: [Скрыто]')
      })));
    }, 1000);

    // Step 2: Cloud Synthesis (2-4s)
    setTimeout(() => {
      setIsScrubbing(false);
      setIsSynthesizing(true);
    }, 2500);

    // Step 3: Materialization (4s+)
    setTimeout(() => {
      setIsSynthesizing(false);
      setIsCompleted(true);
    }, 5000);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-6 bg-slate-50/50 backdrop-blur-sm rounded-3xl overflow-hidden">
      
      {/* Left Column: Data Lake (Logs) */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider">Data Lake / Raw Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-500 font-medium">Live Stream</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs relative">
          {isScrubbing && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-0 z-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2 rounded mb-4 flex items-center gap-2 backdrop-blur-md"
            >
              <Shield className="w-4 h-4" />
              <span>⚠️ Деперсонализация перед отправкой в LLM (152-ФЗ)...</span>
            </motion.div>
          )}

          <AnimatePresence>
            {logs.map((log, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-slate-800/50 rounded border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-1 opacity-50 text-[10px]">
                  <span className="text-emerald-500">{log.timestamp}</span>
                  <span>|</span>
                  <span>SOURCE: 1C_ERP_V8</span>
                </div>
                <div className={cn(
                  "transition-all duration-500",
                  isScrubbing ? "text-emerald-400" : "text-slate-300"
                )}>
                  {log.raw_text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Right Column: AI Architect / Canvas */}
      <div className="flex-[1.5] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Process Mining
            </h2>
            <p className="text-sm text-slate-500 mt-1">Анализ теневых логов и поиск паттернов автоматизации</p>
          </div>
          {isCompleted && (
             <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-200">
               <CheckCircle2 className="w-3 h-3" />
               Конфигурация готова
             </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center bg-slate-50/30 p-8">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          {!isScrubbing && !isSynthesizing && !isCompleted && (
            <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <Database className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Правила не заданы</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Система накопила достаточно данных для автоматического построения графа проверок.
              </p>
              
              <button
                onClick={handleGenerateRules}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-emerald-500 font-lg rounded-2xl hover:bg-emerald-600 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 focus:outline-none ring-offset-2 focus:ring-2 ring-emerald-500"
              >
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40" />
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                <span>AI-Архитектор: Сгенерировать правила</span>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  на базе 100 прогонов
                </div>
              </button>
            </div>
          )}

          {/* Loading State: Synthesis */}
          {isSynthesizing && (
            <div className="text-center relative z-10">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
                <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Синтез в Облаке</h3>
              <p className="text-slate-500 animate-pulse">
                Отправка анонимного графа в GPT-4... <br/>
                Анализ паттернов и поиск аномалий...
              </p>
            </div>
          )}

          {/* Completed State: Generated Nodes */}
          {isCompleted && (
            <div className="w-full max-w-2xl space-y-6 relative z-10">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-xl border border-emerald-200 shadow-lg flex items-start gap-4 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Search className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">AI: Проверка ИНН по базе</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Auto-Generated</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Автоматическая сверка ИНН контрагента с реестром неблагонадежных поставщиков (API ФНС).
                  </p>
                </div>
              </motion.div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-5 rounded-xl border border-amber-200 shadow-lg flex items-start gap-4 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Lock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">AI: Блокировка заявок без договора</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Auto-Generated</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Если сумма &gt; 10 000 руб. и в поле "Основание" нет ссылки на договор — блокировать оплату.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
              >
                <p className="text-emerald-800 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Конфигурация создана. Потенциал автоматизации: 85% рутины.
                </p>
              </motion.div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
