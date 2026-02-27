import React from 'react';
import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export const ActionCard = ({ title, description, icon: Icon, color, onClick }: ActionCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-surface rounded-2xl p-6 border border-border-default shadow-sm hover:shadow-card-hover hover:scale-[1.02] transition-all cursor-pointer group"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
};
