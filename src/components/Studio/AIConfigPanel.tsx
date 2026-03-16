import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KnowledgeDropZone } from './KnowledgeDropZone';
import { Sparkles, BookOpen, Cpu, Wrench, Plus, Trash2, CheckSquare, Info, Loader2, Wand2, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { PromptBuilderModal } from './PromptBuilderModal';
import { generateBooleanKey } from '@/utils/keyGenerator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

export const AIConfigPanel = () => {
  const { activeCube, updateActiveCube } = useAppStore();
  const [isPromptBuilderOpen, setIsPromptBuilderOpen] = useState(false);
  const [newCheckLabel, setNewCheckLabel] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [step, setStep] = useState<'description' | 'config'>('config');
  const [processDescription, setProcessDescription] = useState('');
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [exampleCount, setExampleCount] = useState('10');

  const addBooleanCheck = () => {
    if (!newCheckLabel) return;
    const generatedKey = generateBooleanKey(newCheckLabel);
    const newConfig = [
      ...(activeCube.boolean_checks_config || []),
      { key: generatedKey, label: newCheckLabel, expected_in_doc: true }
    ];
    updateActiveCube({ boolean_checks_config: newConfig });
    setNewCheckLabel('');
  };

  const removeBooleanCheck = (index: number) => {
    const newConfig = [...(activeCube.boolean_checks_config || [])];
    newConfig.splice(index, 1);
    updateActiveCube({ boolean_checks_config: newConfig });
  };

  const handleSuggestConfiguration = () => {
    setIsSuggesting(true);
    // Simulate AI analysis
    setTimeout(() => {
      updateActiveCube({
        prompt: `Ты — AI-аудитор. Твоя задача проанализировать входящий документ и сверить его с данными из учетной системы.

Входные данные из системы:
- ИНН Контрагента: {{inn_kontragenta}}
- Номер договора: {{nomer_dogovora}}
- Ожидаемая сумма: {{summa_scheta}}

Инструкция:
1. Проверь наличие обязательных реквизитов: дата, номер, подпись, печать.
2. Сверь ИНН из документа с {{inn_kontragenta}}.
3. Убедись, что итоговая сумма в документе совпадает с {{summa_scheta}}.
4. Выяви риски, связанные с отсутствием полномочий подписанта.`,
        boolean_checks_config: [
          { key: "has_date", label: "Дата документа", expected_in_doc: true },
          { key: "has_number", label: "Номер документа", expected_in_doc: true },
          { key: "has_signature", label: "Подпись", expected_in_doc: true },
          { key: "has_stamp", label: "Печать", expected_in_doc: true },
          { key: "inn_match", label: "ИНН совпадает", expected_in_doc: true },
          { key: "sum_match", label: "Сумма совпадает", expected_in_doc: true }
        ]
      });
      setIsSuggesting(false);
      setStep('config');
    }, 2000);
  };

  if (step === 'description') {
    return (
      <div className="h-full flex flex-col gap-6 p-4 overflow-y-auto">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Опишите задачу</h3>
          <p className="text-sm text-slate-500">
            Расскажите, что именно должен проверять AI в этом процессе. Мы автоматически настроим промпт и проверки.
          </p>
        </div>

        <Textarea
          value={processDescription}
          onChange={(e) => setProcessDescription(e.target.value)}
          placeholder="Например: Нужно проверить входящий счет на оплату. Убедиться, что есть печать и подпись, проверить реквизиты контрагента по базе ФНС и сверить сумму с договором..."
          className="h-[160px] resize-none p-4 text-base shadow-sm border-slate-200 focus:ring-[#009845]"
        />

        {/* Data Context Section */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setIsContextExpanded(!isContextExpanded)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Database className="w-4 h-4 text-[#009845]" />
              Контекст данных для анализа
            </div>
            {isContextExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          
          {isContextExpanded && (
            <div className="p-4 border-t border-slate-200 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500 uppercase tracking-wider">Доступные поля из 1С</Label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">ИНН</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">Дата</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">Сумма</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">Номер_Договора</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-sm text-slate-700">Количество примеров документов для анализа</Label>
                <p className="text-xs text-slate-500 mb-2">
                  AI проанализирует исторические данные, чтобы лучше понять специфику ваших документов.
                </p>
                <Select value={exampleCount} onValueChange={setExampleCount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите количество" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 документов (Быстрый анализ)</SelectItem>
                    <SelectItem value="10">10 документов (Оптимально)</SelectItem>
                    <SelectItem value="20">20 документов (Глубокий анализ)</SelectItem>
                    <SelectItem value="50">50 документов (Максимальная точность)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={handleSuggestConfiguration}
          disabled={!processDescription || isSuggesting}
          className="w-full h-12 bg-[#009845] hover:bg-[#007d39] text-white shadow-lg shadow-[#009845]/20 text-lg font-medium mt-auto"
        >
          {isSuggesting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Анализируем {exampleCount} документов...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Сгенерировать промпт
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
         <h3 className="text-lg font-bold text-slate-800">Конфигурация AI</h3>
         <Button 
            variant="ghost"
            size="sm"
            onClick={() => setStep('description')}
            className="text-slate-500 hover:text-slate-900"
         >
            Назад к описанию
         </Button>
      </div>

      {/* Prompt */}
      <div className="space-y-2 flex-1 flex flex-col min-h-[300px]"> {/* Increased height */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-text-primary font-medium">
            <Sparkles className="w-4 h-4 text-[#009845]" />
            Промпт для AI
          </Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPromptBuilderOpen(true)}
            className="h-7 text-xs gap-1.5 bg-[#009845]/5 text-[#009845] border-[#009845]/20 hover:bg-[#009845]/10"
          >
            <Wrench className="w-3 h-3" />
            Конструктор
          </Button>
        </div>
        <Textarea
          value={activeCube.prompt}
          onChange={(e) => updateActiveCube({ prompt: e.target.value })}
          placeholder="Опишите задачу для AI-контролёра..."
          className="flex-1 resize-none font-mono text-sm leading-relaxed p-4 shadow-sm focus-visible:ring-[#009845] border-border-default bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Knowledge Base */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-text-primary font-medium">
          <BookOpen className="w-4 h-4 text-[#009845]" />
          Документ приложение
        </Label>
        <p className="text-xs text-slate-500 mb-2">
          Например регламент оформления исходящих писем или финансовая политика...
        </p>
        <div className="h-24"> {/* Reduced height (approx 40% less than default) */}
            <KnowledgeDropZone />
        </div>
      </div>

      {/* Boolean Checks Configuration */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-text-primary font-medium">
          <CheckSquare className="w-4 h-4 text-[#009845]" />
          Проверки (Да/Нет)
        </Label>
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(activeCube.boolean_checks_config || []).map((check, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-[#009845]/5 pl-3 pr-2 py-1.5 rounded-full border border-[#009845]/10 text-sm group cursor-help">
                      <span className="text-[#009845] font-medium">{check.label}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeBooleanCheck(idx); }} 
                        className="text-[#009845]/60 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">key: {check.key}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {(activeCube.boolean_checks_config || []).length === 0 && (
              <div className="text-center text-xs text-gray-400 py-2 w-full">Нет активных проверок</div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Название проверки (напр. Есть печать)" 
              value={newCheckLabel}
              onChange={(e) => setNewCheckLabel(e.target.value)}
              className="h-9 text-sm flex-1 focus-visible:ring-[#009845]"
              onKeyDown={(e) => e.key === 'Enter' && addBooleanCheck()}
            />
            <Button size="sm" onClick={addBooleanCheck} className="h-9 px-3 bg-[#009845] hover:bg-[#007d39] text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Provider */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-text-primary font-medium">
          <Cpu className="w-4 h-4 text-[#009845]" />
          AI Провайдер
        </Label>
        <Select
          value={activeCube.selectedProvider}
          onValueChange={(val: any) => updateActiveCube({ selectedProvider: val })}
        >
          <SelectTrigger className="bg-white/50 backdrop-blur-sm border-border-default">
            <SelectValue placeholder="Выберите провайдера" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 shadow-xl">
            <SelectItem value="gigachat">🇷🇺 Sber GigaChat</SelectItem>
            <SelectItem value="local-ai">🔒 Local AI (Deepseek, Qwen...)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PromptBuilderModal isOpen={isPromptBuilderOpen} onClose={() => setIsPromptBuilderOpen(false)} />
    </div>
  );
};
