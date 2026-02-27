import React from 'react';
import { ActionCard } from './ActionCard';
import { 
  Undo2, 
  Rocket, 
  CheckCircle2, 
  FileEdit, 
  MessageSquare, 
  BellRing 
} from 'lucide-react';

export const ActionLibrary = () => {
  const actions = [
    {
      title: 'Возврат инициатору',
      description: 'Вернуть документ автору с комментарием AI и списком ошибок.',
      icon: Undo2,
      color: 'bg-red-500'
    },
    {
      title: 'Эскалация',
      description: 'Передать задачу руководителю подразделения при высоких рисках.',
      icon: Rocket,
      color: 'bg-amber-500'
    },
    {
      title: 'Автосогласование',
      description: 'Перевести документ в статус "Согласовано AI" без участия человека.',
      icon: CheckCircle2,
      color: 'bg-green-500'
    },
    {
      title: 'Запись в карточку',
      description: 'Сохранить саммари AI анализа в поле комментария 1С.',
      icon: FileEdit,
      color: 'bg-blue-500'
    },
    {
      title: 'Уведомление автору',
      description: 'Отправить персональный совет по улучшению качества документов.',
      icon: MessageSquare,
      color: 'bg-indigo-500'
    },
    {
      title: 'Алерт руководителю',
      description: 'Мгновенное уведомление начальника при критических рисках.',
      icon: BellRing,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Библиотека действий</h2>
        <p className="text-text-secondary">Выберите действие для настройки реакции AI-контролёра</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <ActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};
