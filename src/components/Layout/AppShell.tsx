import React, { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Settings, Play, Settings2, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SettingsModal } from './SettingsModal';
import { StudioWorkspace } from '../Studio/StudioWorkspace';
import { PlayerWorkspace } from '../Player/PlayerWorkspace';
import { ActionsView } from '../../views/ActionsView';

export const AppShell = () => {
  const { activeMode, setActiveMode, setSettingsOpen, geminiApiKey } = useAppStore();

  // Auto-open settings if no key
  useEffect(() => {
    if (!geminiApiKey) {
      setSettingsOpen(true);
    }
  }, [geminiApiKey, setSettingsOpen]);

  const renderContent = () => {
    switch (activeMode) {
      case 'studio':
        return <StudioWorkspace />;
      case 'player':
        return <PlayerWorkspace />;
      case 'action-library':
        return <ActionsView />;
      default:
        return <StudioWorkspace />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text-primary flex flex-col">
      {/* Navbar */}
      <header className="h-20 bg-white/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4">
          <img 
            src="https://uralsbyt.ru/local/templates/delement/frontend/assets/images/logo-ues.svg" 
            alt="Уралэнергосбыт" 
            className="h-12 w-auto"
          />
          <div className="h-10 w-px bg-gray-200 mx-2" />
          <span className="font-bold text-2xl tracking-tight text-gray-800">
            Цифровой штат
          </span>
        </div>

        <nav className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-white/20 shadow-inner">
          <NavButton
            active={activeMode === 'studio'}
            onClick={() => setActiveMode('studio')}
            icon={<Settings2 className="w-4 h-4" />}
            label="Студия"
          />
          <NavButton
            active={activeMode === 'player'}
            onClick={() => setActiveMode('player')}
            icon={<Play className="w-4 h-4" />}
            label="Плеер"
          />
          <NavButton
            active={activeMode === 'action-library'}
            onClick={() => setActiveMode('action-library')}
            icon={<Zap className="w-4 h-4" />}
            label="Действия"
          />
        </nav>

        <button
          onClick={() => setSettingsOpen(true)}
          className="p-3 text-gray-500 hover:text-[#009845] hover:bg-[#009845]/10 rounded-xl transition-all duration-200 active:scale-95"
          title="Настройки API"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
        {renderContent()}
      </main>

      <SettingsModal />
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton = ({ active, onClick, icon, label }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
      active
        ? "bg-white text-primary shadow-sm ring-1 ring-black/5 scale-100"
        : "text-text-secondary hover:text-text-primary hover:bg-white/50 scale-95 hover:scale-100"
    )}
  >
    {icon}
    {label}
  </button>
);
