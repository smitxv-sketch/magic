import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { 
  Zap, 
  CheckCircle, 
  Undo2, 
  Rocket, 
  MessageSquare, 
  GitBranch, 
  Edit3, 
  AlertTriangle
} from 'lucide-react';
import { ActionId } from '@/store/appStore';
import { cn } from '@/utils/cn';

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

export const ActionsView = () => {
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

      <div className="flex-1 outline-none">
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
      </div>
    </div>
  );
};