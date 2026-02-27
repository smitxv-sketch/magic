import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

export const SettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen, geminiApiKey, setGeminiApiKey } = useAppStore();
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    if (isSettingsOpen) {
      setKeyInput(geminiApiKey || '');
    }
  }, [isSettingsOpen, geminiApiKey]);

  const handleSave = () => {
    setGeminiApiKey(keyInput);
    setSettingsOpen(false);
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Настройка API
          </DialogTitle>
          <DialogDescription>
            Для работы AI-оркестратора требуется ключ Google Gemini API.
            Ключ сохраняется только в вашем браузере.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="col-span-3"
            />
          </div>
          <div className="text-xs text-text-muted text-center">
            Нет ключа?{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Получить в Google AI Studio
            </a>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={!keyInput}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
