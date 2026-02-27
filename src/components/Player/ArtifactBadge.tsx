import React from 'react';
import { FileCode, FileJson, FileType } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ArtifactBadgeProps {
  artifactKey: string;
  label?: string;
}

export const ArtifactBadge = ({ artifactKey, label }: ArtifactBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
      <FileJson className="w-3.5 h-3.5" />
      <span>{label || artifactKey}</span>
    </div>
  );
};
