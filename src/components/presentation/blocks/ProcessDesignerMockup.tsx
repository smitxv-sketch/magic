import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText, ArrowRight, CheckCircle2, Settings, Plus } from 'lucide-react';

export const ProcessDesignerMockup = () => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-50 rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col font-sans select-none">
      {/* Fake Window Header */}
      <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="ml-3 opacity-70">1С:Предприятие - Конструктор бизнес-процессов</span>
        </div>
        <div className="opacity-50">v8.3.24</div>
      </div>

      <div className="flex-1 flex bg-slate-100">
        {/* Sidebar (Palette) */}
        <div className="w-14 md:w-48 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
          <div className="p-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">
            Компоненты
          </div>
          <div className="p-2 space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded hover:bg-slate-50 text-slate-600 text-sm cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-200">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-3 h-3" />
              </div>
              <span className="hidden md:inline">Документ 1С</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded hover:bg-slate-50 text-slate-600 text-sm cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-200">
              <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Settings className="w-3 h-3" />
              </div>
              <span className="hidden md:inline">Обработка</span>
            </div>
            
            {/* Draggable AI Node */}
            <motion.div 
              className="flex items-center justify-center md:justify-start gap-2 p-2 rounded bg-emerald-50 text-emerald-700 text-sm cursor-grab border border-emerald-200 shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <Bot className="w-3 h-3" />
              </div>
              <span className="font-bold hidden md:inline">ИИ Агент</span>
              <Plus className="w-3 h-3 ml-auto opacity-50 hidden md:block" />
            </motion.div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]">
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* Process Chain */}
            <div className="flex items-center gap-2 md:gap-4 scale-[0.65] md:scale-100 origin-center">
              
              {/* Step 1: Start */}
              <div className="relative group">
                <div className="w-32 h-20 bg-white rounded-lg border border-slate-300 shadow-sm flex flex-col items-center justify-center p-2 z-10 relative">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                    <FileText className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">Поступление<br/>документа</span>
                </div>
                {/* Connector */}
                <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-slate-300" />
                <div className="absolute top-1/2 -right-6 -mt-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45 transform translate-x-4" />
              </div>

              {/* Step 2: AI Node (Animated Drop) */}
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0, y: -20 }}
                  whileInView={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="w-32 h-20 bg-emerald-50 rounded-lg border-2 border-emerald-400 shadow-lg shadow-emerald-100 flex flex-col items-center justify-center p-2 z-10 relative"
                >
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full text-white flex items-center justify-center shadow-sm">
                    <Bot className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 mb-1">ИИ Контроль</span>
                  <span className="text-[9px] text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">Проверка рисков</span>
                </motion.div>

                {/* Connection Lines (Animated) */}
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: 24 }}
                   transition={{ delay: 1, duration: 0.5 }}
                   className="absolute top-1/2 -right-6 h-0.5 bg-emerald-400"
                />
              </div>

              {/* Step 3: Human */}
              <motion.div 
                initial={{ opacity: 0.5, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="ml-6 relative"
              >
                <div className="w-32 h-20 bg-white rounded-lg border border-slate-300 shadow-sm flex flex-col items-center justify-center p-2 z-10 relative opacity-80">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">Согласование<br/>(Бухгалтерия)</span>
                </div>
              </motion.div>

            </div>

            {/* Cursor Animation */}
            <motion.div
              initial={{ x: -100, y: 100, opacity: 0 }}
              whileInView={{ 
                x: [50, -20, -20, 100], 
                y: [50, -10, -10, 100],
                opacity: [0, 1, 1, 0]
              }}
              transition={{ duration: 2, times: [0, 0.3, 0.8, 1], repeat: Infinity, repeatDelay: 3 }}
              className="absolute z-50 pointer-events-none"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19177L11.7841 12.3673H5.65376Z" fill="black" stroke="white"/>
              </svg>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
