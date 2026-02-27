import React from 'react';
import { useAppStore } from '@/store/appStore';
import { PlaceholderBadge } from './PlaceholderBadge';
import { Database, FileJson } from 'lucide-react';

export const InputContextPanel = () => {
  const { activeCube, updateActiveCube } = useAppStore();

  const handlePlaceholderClick = (key: string) => {
    // Insert into prompt at cursor position (simplified: just append for now, 
    // real implementation needs ref to textarea)
    // For this demo, we'll just append to the prompt in the store
    updateActiveCube({ prompt: activeCube.prompt + ` {{${key}}} ` });
  };

  // Mock placeholders from 1C
  const mockPlaceholders = [
    { key: 'Сумма_договора', displayName: 'Сумма договора', exampleValue: '1 500 000' },
    { key: 'Контрагент_Название', displayName: 'Контрагент', exampleValue: 'ООО Ромашка' },
    { key: 'Контрагент_ИНН', displayName: 'ИНН', exampleValue: '7700123456' },
    { key: 'Дата_документа', displayName: 'Дата', exampleValue: '20.02.2026' },
    { key: 'Тип_документа', displayName: 'Тип', exampleValue: 'Договор поставки' },
    { key: 'Ответственный', displayName: 'Автор', exampleValue: 'Иванов И.И.' },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-1 text-text-primary font-semibold">
          <Database className="w-4 h-4 text-primary" />
          <h3>Переменные из 1С</h3>
        </div>
        <p className="text-xs text-text-muted mb-4">
          Данные, которые автоматически подтягиваются из карточки документа в 1С.
        </p>
        <div className="flex flex-wrap gap-2">
          {mockPlaceholders.map((p) => (
            <PlaceholderBadge
              key={p.key}
              label={p.key}
              onClick={() => handlePlaceholderClick(p.key)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1 text-text-primary font-semibold">
          <FileJson className="w-4 h-4 text-primary" />
          <h3>Артефакты процесса</h3>
        </div>
        <p className="text-xs text-text-muted mb-4">
          Результаты работы предыдущих AI-агентов в цепочке (например, извлеченные сущности).
        </p>
        {activeCube.inputArtifacts && activeCube.inputArtifacts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeCube.inputArtifacts.map((p) => (
              <PlaceholderBadge
                key={p.key}
                label={p.key}
                onClick={() => handlePlaceholderClick(p.key)}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 bg-surface-elevated rounded-xl border border-border-default text-sm text-text-muted text-center border-dashed">
            Нет доступных артефактов от предыдущих этапов
          </div>
        )}
      </div>
    </div>
  );
};
