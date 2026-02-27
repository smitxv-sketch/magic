import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/appStore';
import { Sparkles, Code, Play, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PromptBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptBuilderModal = ({ isOpen, onClose }: PromptBuilderModalProps) => {
  const { activeCube, updateActiveCube } = useAppStore();
  const [userPrompt, setUserPrompt] = useState(activeCube.prompt);

  useEffect(() => {
    setUserPrompt(activeCube.prompt);
  }, [activeCube.prompt, isOpen]);

  const handleSave = () => {
    updateActiveCube({ prompt: userPrompt });
    onClose();
  };

  // Generate System Instruction Mock
  const booleanChecksJson = activeCube.boolean_checks_config?.map(c => `      "${c.key}": true_or_false`).join(',\n') || '      // нет булевых проверок';
  
  const systemInstruction = `[РОЛЬ]
Ты — AI-контролёр документов. Твоя задача — проанализировать текст и вернуть СТРОГО JSON.

[ФОРМАТ ОТВЕТА]
{
  "status": "success",
  "document_profile": {
    "category": "договор_закупки | исходящее_письмо | ...",
    "risk_types": ["юридический", "финансовый"],
    "confidence": 0.0_to_1.0
  },
  "analysis": {
    "severity_score": 0_to_10,
    "violations_count": число,
    "has_blocking_issue": true_or_false,
    "boolean_checks": {
${booleanChecksJson}
    },
    "findings": [
      { "type": "тип_риска", "text": "описание", "blocking": bool }
    ],
    "artifact": "саммари"
  },
  "execution_command": {
    "action_id": "approve | return | escalate | skip",
    "comment_to_user": "текст"
  }
}`;

  // Generate Preview JSON
  const previewJson = {
    status: "success",
    document_profile: {
      category: "договор_закупки",
      risk_types: ["юридический"],
      confidence: 0.95
    },
    analysis: {
      severity_score: 7,
      violations_count: 2,
      has_blocking_issue: false,
      boolean_checks: activeCube.boolean_checks_config?.reduce((acc, c) => ({ ...acc, [c.key]: c.expected_in_doc }), {}) || {},
      findings: [
        { type: "юридический", text: "Отсутствует пункт о форс-мажоре", blocking: false }
      ],
      artifact: "Договор требует доработки"
    },
    execution_command: {
      action_id: "return_to_author",
      comment_to_user: "Пожалуйста, добавьте пункт о форс-мажоре."
    }
  };

  // Highlight logic (simplified)
  const isFieldUsedInRules = (field: string) => {
    return activeCube.rules.some(r => r.metric === field || (field === 'boolean_checks' && r.metric === 'boolean_check'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[85vh] flex flex-col p-0 gap-0 bg-gray-50 overflow-hidden">
        <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Конструктор промпта
          </DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">Применить и закрыть</Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Column 1: System Instruction */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-100/50">
            <div className="p-4 border-b border-gray-200 bg-gray-100 font-medium text-sm text-gray-500 uppercase tracking-wider">
              Что система добавляет сама
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
              {systemInstruction}
            </div>
          </div>

          {/* Column 2: User Prompt */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200 bg-white font-medium text-sm text-gray-900 uppercase tracking-wider flex justify-between items-center">
              Твоя задача
              <span className="text-xs text-gray-400 normal-case font-normal">Опишите ЧТО проверять</span>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-4">
              <Textarea 
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="flex-1 resize-none border-0 focus-visible:ring-0 p-0 text-sm leading-relaxed"
                placeholder="Например: Проверь, что сумма аванса не превышает 30%. Если больше — считай это нарушением..."
              />
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {['Проверь пени', 'Найди риски', 'Сверь с регламентом'].map(chip => (
                  <button 
                    key={chip}
                    onClick={() => setUserPrompt(prev => prev + (prev ? '\n' : '') + chip)}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs hover:bg-indigo-100 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: JSON Preview */}
          <div className="w-1/3 flex flex-col bg-gray-900 text-gray-300">
            <div className="p-4 border-b border-gray-800 bg-gray-900 font-medium text-sm text-gray-400 uppercase tracking-wider flex justify-between items-center">
              Пример ответа LLM
              <span className="text-xs text-indigo-400 normal-case font-normal flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Поля для правил подсвечены
              </span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed">
              <pre>
                {JSON.stringify(previewJson, null, 2).split('\n').map((line, i) => {
                  // Simple highlighting logic
                  const isKeyLine = line.includes(':');
                  let className = "text-gray-500";
                  
                  if (isKeyLine) {
                    const key = line.split(':')[0].trim().replace(/"/g, '');
                    if (['severity_score', 'violations_count', 'has_blocking_issue', 'category', 'risk_types', 'confidence'].includes(key) && isFieldUsedInRules(key === 'category' ? 'document_category' : key === 'risk_types' ? 'risk_type_present' : key)) {
                      className = "text-indigo-400 font-bold";
                    } else if (key === 'boolean_checks' && isFieldUsedInRules('boolean_check')) {
                      className = "text-indigo-400 font-bold";
                    } else {
                      className = "text-gray-300";
                    }
                  }
                  
                  return (
                    <div key={i} className={className}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
            <div className="p-4 border-t border-gray-800">
               <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                 <Play className="w-4 h-4 mr-2" />
                 Запустить живой тест
               </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
