import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';

export const KnowledgeDropZone = () => {
  const { activeCube, updateActiveCube } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      alert('Пожалуйста, загрузите .md или .txt файл');
      return;
    }

    const text = await file.text();
    updateActiveCube({
      knowledgeBase: text,
      knowledgeBaseFileName: file.name
    });
  };

  const handleRemove = () => {
    updateActiveCube({
      knowledgeBase: null,
      knowledgeBaseFileName: null
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (activeCube.knowledgeBaseFileName) {
    return (
      <div className="p-3 bg-primary-light border border-primary rounded-xl flex items-center justify-between group">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-primary truncate">
              {activeCube.knowledgeBaseFileName}
            </span>
            <span className="text-xs text-primary/70">
              {(activeCube.knowledgeBase?.length || 0)} символов
            </span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 hover:bg-white/50 rounded-full text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
        isDragging
          ? "border-primary bg-primary-light"
          : "border-border-default hover:border-primary/50 hover:bg-surface-elevated"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".md,.txt"
        className="hidden"
      />
      <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center mb-3">
        <Upload className="w-5 h-5 text-text-secondary" />
      </div>
      <p className="text-sm font-medium text-text-primary text-center">
        Перетащите регламент (.md)
      </p>
      <p className="text-xs text-text-muted mt-1 text-center">
        или нажмите для выбора
      </p>
    </div>
  );
};
