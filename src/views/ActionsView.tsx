import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  CheckCircle, 
  Undo2, 
  Rocket, 
  MessageSquare, 
  GitBranch, 
  Edit3, 
  AlertTriangle,
  Shield,
  Scale,
  Car,
  Briefcase,
  Wand2,
  VenetianMask
} from 'lucide-react';
import actionCasesData from '@/data/action_cases.json';
import { ActionId } from '@/store/appStore';
import { cn } from '@/lib/utils';

// --- Types ---

interface ActionCase {
  title: string;
  problem: string;
  setup: string;
  actions: ActionId[];
  comment: string;
}

interface ActionCaseGroup {
  group_id: string;
  group_title: string;
  icon: string;
  description: string;
  cases: ActionCase[];
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

const ActionCard = ({ id, icon: Icon, colorClass, description }: { id: ActionId, icon: any, colorClass: string, description: string }) => (
  <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/40 p-6 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/60 hover:shadow-lg">
    <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm", colorClass)}>
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900">{ACTION_LABELS[id]}</h3>
    <code className="mb-3 block text-xs font-mono text-gray-400">{id}</code>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const CaseCard = ({ caseData }: { caseData: ActionCase }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
  >
    <h3 className="mb-3 text-lg font-semibold text-gray-900">{caseData.title}</h3>
    
    <div className="mb-4 space-y-1">
      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Ситуация</span>
      <p className="text-sm text-gray-600">{caseData.problem}</p>
    </div>

    <div className="mb-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 p-3">
      <p className="font-mono text-sm text-emerald-900">{caseData.setup}</p>
    </div>

    <div className="mb-4 flex flex-wrap gap-2">
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

    <div className="flex items-start gap-2 text-sm text-gray-500 italic">
      <span className="text-lg not-italic">🤖</span>
      <p>{caseData.comment}</p>
    </div>
  </motion.div>
);

export const ActionsView = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [activeGroup, setActiveGroup] = useState<string>(actionCasesData.action_cases_library[0].group_id);

  const currentGroup = actionCasesData.action_cases_library.find(g => g.group_id === activeGroup);

  return (
    <div className="flex h-full flex-col bg-gray-50/50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Zap className="h-8 w-8 text-emerald-600" />
          Действия AI-контролёра
        </h1>
        <p className="mt-2 text-gray-500">
          Настройте реакции системы на найденные риски или изучите готовые сценарии автоматизации.
        </p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <Tabs.List className="mb-6 flex w-fit items-center rounded-lg bg-gray-200/50 p-1">
          <Tabs.Trigger 
            value="library"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
          >
            Библиотека действий
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="cases"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
          >
            Кейсы и практики
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="library" className="flex-1 outline-none">
          <ScrollArea.Root className="h-full w-full overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 pb-10">
                <ActionCard 
                  id="continue_process" 
                  icon={CheckCircle} 
                  colorClass="text-green-600"
                  description="Ошибок нет или они не критичны. Документ едет к следующему человеку по стандартному маршруту."
                />
                <ActionCard 
                  id="return_to_author" 
                  icon={Undo2} 
                  colorClass="text-red-600"
                  description="Жесткий стоп. Возврат документа на этап доработки с прикреплением списка ошибок от AI."
                />
                <ActionCard 
                  id="escalate" 
                  icon={Rocket} 
                  colorClass="text-orange-600"
                  description="Смена маршрута. Принудительная передача документа руководителю из-за найденных высоких рисков."
                />
                <ActionCard 
                  id="add_comment" 
                  icon={MessageSquare} 
                  colorClass="text-blue-600"
                  description="Документ не останавливается, но AI оставляет запись с советом в истории/таймлайне согласования."
                />
                <ActionCard 
                  id="start_subprocess" 
                  icon={GitBranch} 
                  colorClass="text-purple-600"
                  description="Фоновый триггер нового бизнес-процесса в СЭД (например, параллельная проверка СБ)."
                />
                <ActionCard 
                  id="set_field" 
                  icon={Edit3} 
                  colorClass="text-indigo-600"
                  description="Запись извлеченного AI значения (сумма, дата, тег риска) в системное поле документа."
                />
                <ActionCard 
                  id="skip_node" 
                  icon={AlertTriangle} 
                  colorClass="text-gray-600"
                  description="Техническое действие. Применяется при таймауте LLM, чтобы не блокировать движение документа."
                />
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5">
              <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="cases" className="flex-1 outline-none overflow-hidden">
          <div className="flex h-full gap-6">
            {/* Sidebar */}
            <div className="w-1/3 min-w-[250px] flex flex-col border-r border-gray-200 pr-4">
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
                            "w-full text-left px-3 py-3 rounded-lg transition-all group",
                            activeGroup === group.group_id 
                              ? "bg-emerald-50 text-emerald-900" 
                              : "hover:bg-gray-100 text-gray-700"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl">{group.icon}</span>
                            <span className="font-medium text-sm">{group.group_title}</span>
                          </div>
                          <p className="text-xs text-gray-500 pl-8 line-clamp-2 leading-relaxed">
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
                        <div className="mb-6">
                          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span>{currentGroup.icon}</span>
                            {currentGroup.group_title}
                          </h2>
                          <p className="text-gray-500 mt-1">{currentGroup.description}</p>
                        </div>

                        <div className="space-y-4 pb-10">
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
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};