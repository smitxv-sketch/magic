import React, { useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Shield,
  Scale,
  Car,
  Briefcase,
  Wand2,
  VenetianMask,
  Lightbulb
} from 'lucide-react';
import actionCasesData from '@/data/action_cases.json';
import { ActionId } from '@/store/appStore';
import { cn } from '@/utils/cn';

// --- Types ---

interface ActionCase {
  title: string;
  problem: string;
  setup: string;
  actions: ActionId[];
  comment: string;
}

// --- Constants ---

const ACTION_LABELS: Record<ActionId, string> = {
  continue_process: 'Пропустить дальше',
  return_to_author: 'Вернуть автору',
  escalate:         'Эскалировать',
  add_comment:      'Оставить комментарий',
  start_subprocess: 'Запустить БП',
  set_field:        'Изменить поле',
  skip_node:        'Системный пропуск'
};

const ACTION_COLORS: Record<ActionId, string> = {
  continue_process: 'bg-green-100 text-green-700 border-green-200',
  return_to_author: 'bg-red-100 text-red-700 border-red-200',
  escalate:         'bg-orange-100 text-orange-700 border-orange-200',
  add_comment:      'bg-blue-100 text-blue-700 border-blue-200',
  start_subprocess: 'bg-purple-100 text-purple-700 border-purple-200',
  set_field:        'bg-indigo-100 text-indigo-700 border-indigo-200',
  skip_node:        'bg-gray-100 text-gray-700 border-gray-200'
};

const GROUP_ICONS: Record<string, React.ElementType> = {
  '🛡️': Shield,
  '⚖️': Scale,
  '🏎️': Car,
  '👔': Briefcase,
  '🪄': Wand2,
  '🥷': VenetianMask
};

// --- Components ---

const CaseCard = ({ caseData }: { caseData: ActionCase }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="p-2 bg-amber-100 rounded-lg shrink-0 mt-1">
        <Lightbulb className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{caseData.title}</h3>
        <p className="text-base text-gray-800 leading-relaxed font-medium">
          {caseData.problem}
        </p>
      </div>
    </div>

    <div className="ml-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Настройка правила</span>
            </div>
            <p className="font-mono text-xs text-gray-600 break-words">{caseData.setup}</p>
        </div>

        <div>
             <div className="mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Реакция системы</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
            {caseData.actions.map(actionId => (
                <span 
                key={actionId} 
                className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    ACTION_COLORS[actionId] || "bg-gray-100 text-gray-800 border-gray-200"
                )}
                >
                {ACTION_LABELS[actionId] || actionId}
                </span>
            ))}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-500 italic bg-blue-50/50 p-2 rounded-lg">
                <span className="text-lg not-italic">🤖</span>
                <p>{caseData.comment}</p>
            </div>
        </div>
    </div>
  </motion.div>
);

export const CasesView = () => {
  const [activeGroup, setActiveGroup] = useState<string>(actionCasesData.action_cases_library[0].group_id);

  const currentGroup = actionCasesData.action_cases_library.find(g => g.group_id === activeGroup);

  return (
    <div className="flex h-full flex-col bg-gray-50/50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-emerald-600" />
          Кейсы и практики
        </h1>
        <p className="mt-2 text-gray-500">
          Изучите реальные сценарии автоматизации и защиты бизнеса.
        </p>
      </div>

      <div className="flex h-full gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 min-w-[280px] flex flex-col border-r border-gray-200 pr-4">
            <ScrollArea.Root className="h-full w-full overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full">
                <div className="space-y-1">
                {actionCasesData.action_cases_library.map((group) => {
                    const Icon = GROUP_ICONS[group.icon] || Zap;
                    return (
                    <button
                        key={group.group_id}
                        onClick={() => setActiveGroup(group.group_id)}
                        className={cn(
                        "w-full text-left px-4 py-4 rounded-xl transition-all group border border-transparent",
                        activeGroup === group.group_id 
                            ? "bg-white border-gray-200 shadow-sm" 
                            : "hover:bg-gray-100 text-gray-700"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-1">
                        <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            activeGroup === group.group_id ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 group-hover:bg-white"
                        )}>
                             <Icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "font-semibold text-sm",
                            activeGroup === group.group_id ? "text-gray-900" : "text-gray-600"
                        )}>{group.group_title}</span>
                        </div>
                        <p className="text-xs text-gray-500 pl-[3.25rem] line-clamp-2 leading-relaxed">
                        {group.description}
                        </p>
                    </button>
                    );
                })}
                </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5">
                <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px]" />
            </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>

        {/* Content Area */}
        <div className="flex-1 h-full">
            <ScrollArea.Root className="h-full w-full overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full pr-4">
                <AnimatePresence mode="wait">
                {currentGroup && (
                    <motion.div
                    key={currentGroup.group_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    >
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {(() => {
                            const Icon = GROUP_ICONS[currentGroup.icon] || Zap;
                            return <Icon className="h-8 w-8 text-emerald-600" />;
                        })()}
                        {currentGroup.group_title}
                        </h2>
                        <p className="text-gray-600 mt-2 text-lg">{currentGroup.description}</p>
                    </div>

                    <div className="space-y-6 pb-20">
                        {currentGroup.cases.map((caseItem, idx) => (
                        <CaseCard key={idx} caseData={caseItem as ActionCase} />
                        ))}
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5">
                <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px]" />
            </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>
        </div>
    </div>
  );
};
