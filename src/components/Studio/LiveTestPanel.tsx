import React, { useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { useFileParser } from '@/hooks/useFileParser';
import { useLLMInference } from '@/hooks/useLLMInference';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Play, FileText } from 'lucide-react';
import { ResultModal } from '@/components/Player/ResultModal';
import { cn } from '@/utils/cn';

interface LiveTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTestPanel = ({ isOpen, onClose }: LiveTestPanelProps) => {
  const { activeCube, testDocument, setTestDocument, geminiApiKey } = useAppStore();
  const { parseFile, isParsing } = useFileParser();
  const { infer } = useLLMInference();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTestDocument({ fileName: file.name, isLoading: true });
    try {
      const text = await parseFile(file);
      setTestDocument({ extractedText: text, isLoading: false });
    } catch (e) {
      console.error(e);
      setTestDocument({ isLoading: false });
      alert('Ошибка чтения файла');
    }
  };

  const handleRunTest = async () => {
    if (!testDocument.extractedText || !activeCube.prompt) return;

    setTestDocument({ isLoading: true, result: null });
    
    // Compile prompt for test (simplified version of promptCompiler)
    const prompt = `
[СИСТЕМНАЯ ИНСТРУКЦИЯ]
Ты — AI-контролер документооборота. Твоя задача: проверить документ согласно корпоративному регламенту и вернуть результат СТРОГО в формате JSON без какого-либо текста до или после JSON.

[РЕГЛАМЕНТ КОМПАНИИ]
${activeCube.knowledgeBase || '(Нет регламента)'}

[КОНТЕКСТ ДОКУМЕНТА]
Название документа: ${testDocument.fileName}
Текст документа:
${testDocument.extractedText}

[ЗАДАЧА]
${activeCube.prompt}

[ФОРМАТ ОТВЕТА — СТРОГО JSON]
{
  "status": "success",
  "ai_analysis": {
    "severity_score": <число от 0 до 10>,
    "findings": ["находка 1", "находка 2"],
    "artifact": "<краткое саммари для следующего кубика, если нужно>"
  },
  "execution_command": {
    "action_id": "<approve|return_to_author|escalate|skip_node>",
    "comment_to_user": "<понятный комментарий для сотрудника>"
  },
  "time_saved_minutes": <число>
}
`;

    try {
      const result = await infer(prompt);
      setTestDocument({ result, isLoading: false });
    } catch (e) {
      console.error(e);
      setTestDocument({ isLoading: false });
      alert('Ошибка анализа');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-[400px] bg-surface shadow-2xl border-l border-border-default z-40 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
        <div className="p-4 border-b border-border-default flex items-center justify-between bg-surface-elevated">
          <h3 className="font-semibold text-lg">🧪 Тестирование</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Закрыть</Button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {/* File Upload */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-default rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-elevated transition-colors"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".docx,.txt,.md" 
            className="hidden" 
          />
          <Upload className="w-8 h-8 text-text-muted mb-2" />
          <div className="text-sm font-medium text-center">
            {testDocument.fileName || "Загрузить документ (.docx)"}
          </div>
        </div>

        {/* Status */}
        {testDocument.extractedText && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600" />
            <div className="text-xs text-green-800">
              Текст извлечён ({testDocument.extractedText.length} символов)
            </div>
          </div>
        )}

        {/* Run Button */}
        <Button 
          onClick={handleRunTest} 
          disabled={!testDocument.extractedText || !activeCube.prompt || !geminiApiKey || testDocument.isLoading}
          className="w-full"
          size="lg"
        >
          {testDocument.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Анализ...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Запустить тест
            </>
          )}
        </Button>

        {/* Result */}
        {testDocument.result && (
          <div className="space-y-4">
            <h4 className="font-semibold border-b pb-2">Результат:</h4>
            <div className={cn(
              "p-4 rounded-xl border text-sm",
              testDocument.result.execution_command.action_id === 'approve' ? "bg-green-50 border-green-200" :
              testDocument.result.execution_command.action_id === 'return_to_author' ? "bg-red-50 border-red-200" :
              "bg-yellow-50 border-yellow-200"
            )}>
              <div className="font-bold mb-2 uppercase">
                {testDocument.result.execution_command.action_id}
              </div>
              <ul className="list-disc pl-4 space-y-1 mb-3">
                {/* Fix: Use analysis instead of ai_analysis */}
                {testDocument.result.analysis.findings.map((f: { type: string; text: string; blocking: boolean } | string, i: number) => (
                  <li key={i}>{typeof f === 'string' ? f : f.text}</li>
                ))}
              </ul>
              <div className="italic opacity-80">
                "{testDocument.result.execution_command.comment_to_user}"
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};
