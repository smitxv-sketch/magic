import React, { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Settings, Settings2, Zap, Terminal, Briefcase, Home } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SettingsModal } from './SettingsModal';
import { StudioWorkspace } from '../Studio/StudioWorkspace';
import { ActionsView } from '../../views/ActionsView';
import { ITHubView } from '../../views/ITHubView';
import { CasesView } from '../../views/CasesView';
import { PresentationView } from '../presentation/PresentationView';
import { PlayerWorkspace } from '../Player/PlayerWorkspace';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

export const AppShell = () => {
  const { activeMode, setActiveMode, setSettingsOpen, geminiApiKey, isPlayerOpen, setPlayerOpen } = useAppStore();

  const renderContent = () => {
    switch (activeMode) {
      case 'presentation':
        return <PresentationView />;
      case 'studio':
        return <StudioWorkspace />;
      case 'action-library':
        return <ActionsView />;
      case 'cases':
        return <CasesView />;
      case 'it-hub':
        return <ITHubView />;
      default:
        return <PresentationView />;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-slate-200 font-sans text-text-primary flex flex-col">
      {/* Navbar */}
      <header className="sticky top-4 mx-4 z-50 bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl h-16 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveMode('presentation' as any)}>
          <img 
            src="https://uralsbyt.ru/local/templates/delement/frontend/assets/images/logo-ues.svg" 
            alt="Уралэнергосбыт" 
            className="h-8 w-auto"
          />
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <span className="font-bold text-xl tracking-tight text-gray-800">
            Цифровой штат
          </span>
        </div>

        <nav className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-white/20 shadow-inner">
          <NavButton
            active={activeMode === 'presentation'}
            onClick={() => setActiveMode('presentation' as any)}
            icon={<Home className="w-4 h-4" />}
            label="Главная"
          />
          <NavButton
            active={activeMode === 'studio'}
            onClick={() => setActiveMode('studio')}
            icon={<Settings2 className="w-4 h-4" />}
            label="Студия"
          />
          <NavButton
            active={activeMode === 'action-library'}
            onClick={() => setActiveMode('action-library')}
            icon={<Zap className="w-4 h-4" />}
            label="Действия"
          />
          <NavButton
            active={activeMode === 'cases'}
            onClick={() => setActiveMode('cases')}
            icon={<Briefcase className="w-4 h-4" />}
            label="Кейсы"
          />
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode('it-hub')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              activeMode === 'it-hub' 
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Terminal className="w-4 h-4" />
            <span>Для ИТ</span>
          </button>

          <button
            onClick={() => setActiveMode('presentation')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              activeMode === 'presentation' 
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Презентация</span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-2" />

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-3 text-gray-500 hover:text-[#009845] hover:bg-[#009845]/10 rounded-xl transition-all duration-200 active:scale-95"
            title="Настройки API"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
        {renderContent()}
      </main>

      <SettingsModal />

      {/* Global Player Modal */}
      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white"
          >
            <PlayerWorkspace onClose={() => setPlayerOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
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
