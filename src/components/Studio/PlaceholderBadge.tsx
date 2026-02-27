import React from 'react';
import { cn } from "@/utils/cn";

interface PlaceholderBadgeProps {
  label: string;
  onClick: () => void;
}

export const PlaceholderBadge = ({ label, onClick }: PlaceholderBadgeProps) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors cursor-pointer border border-indigo-100"
      )}
    >
      {`{{${label}}}`}
    </span>
  );
};
