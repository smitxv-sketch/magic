import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KnowledgeDropZone } from './KnowledgeDropZone';
import { Sparkles, BookOpen, Cpu, Wrench, Plus, Trash2, CheckSquare, Info } from 'lucide-react';
import { PromptBuilderModal } from './PromptBuilderModal';
import { generateBooleanKey } from '@/utils/keyGenerator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const AIConfigPanel = () => {
  const { activeCube, updateActiveCube } = useAppStore();
  const [isPromptBuilderOpen, setIsPromptBuilderOpen] = useState(false);
  const [newCheckLabel, setNewCheckLabel] = useState('');

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

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Prompt (Moved to Top) */}
      <div className="space-y-3 flex-1 flex flex-col">
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
          placeholder="Опишите задачу для AI-контролёра на естественном языке. Используйте переменные из левой панели..."
          className="flex-1 resize-none font-mono text-sm leading-relaxed p-4 shadow-sm focus-visible:ring-[#009845] border-border-default bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Knowledge Base */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-text-primary font-medium">
          <BookOpen className="w-4 h-4 text-[#009845]" />
          Документ приложение
        </Label>
        <KnowledgeDropZone />
      </div>

      {/* Boolean Checks Configuration */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-text-primary font-medium">
          <CheckSquare className="w-4 h-4 text-[#009845]" />
          Булевы проверки (Да/Нет)
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
      <div className="space-y-3">
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
          <SelectContent>
            <SelectItem value="gemini-flash">🌐 Google Gemini Flash (Cloud)</SelectItem>
            <SelectItem value="gigachat">🇷🇺 Sber GigaChat (Cloud RF)</SelectItem>
            <SelectItem value="local-llama">🔒 Local Llama 3 (On-Premise)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PromptBuilderModal isOpen={isPromptBuilderOpen} onClose={() => setIsPromptBuilderOpen(false)} />
    </div>
  );
};
