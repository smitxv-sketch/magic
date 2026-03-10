import React from 'react';
import { cn } from "@/utils/cn";

interface PlaceholderBadgeProps {
  label: string;
  onClick: () => void;
  isUsed?: boolean;
}

export const PlaceholderBadge = ({ label, onClick, isUsed }: PlaceholderBadgeProps) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border",
        isUsed 
          ? "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200" 
          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border-indigo-100"
      )}
    >
      {`{{${label}}}`}
    </span>
  );
};
