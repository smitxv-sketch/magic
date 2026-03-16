import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useTenantInitializer } from '@/hooks/useTenantInitializer';
import { Settings, Settings2, Zap, Terminal, Briefcase, Home, Menu, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { TenantLogo } from '@/components/ui/TenantLogo';
import { SettingsModal } from './SettingsModal';
import { StudioWorkspace } from '../Studio/StudioWorkspace';
import { ActionsView } from '../../views/ActionsView';
import { ITHubView } from '../../views/ITHubView';
import { CasesView } from '../../views/CasesView';
import { PresentationView } from '../presentation/PresentationView';
import { PlayerWorkspace } from '../Player/PlayerWorkspace';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { LoginScreen } from '../LoginScreen';

export const AppShell = () => {
  const { activeMode, setActiveMode, setSettingsOpen, geminiApiKey, isPlayerOpen, setPlayerOpen } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize Tenant Data
  const { isLoading: isTenantLoading, tenantConfig } = useTenantInitializer();

  useEffect(() => {
    // Check local storage for auth token
    const token = localStorage.getItem('timeline_auth_token');
    if (token === 'valid_session') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = async (password: string): Promise<boolean> => {
    // In a real app, this would call the API endpoint from auth.tsx
    // For this environment, we'll use a simple client-side check or mock
    // Since we can't easily set up the backend route in this specific container environment without Express config
    
    // Hardcoded check for demo purposes as requested to "take as basis"
    // Ideally this should hit /api/auth but we are in a Vite SPA mode primarily
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check against environment variable first, then fallback
    const correctPassword = (import.meta as any).env.VITE_TIMELINE_PASSWORD || 'ues2024';
    
    if (password === correctPassword) {
      localStorage.setItem('timeline_auth_token', 'valid_session');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  if (isCheckingAuth || isTenantLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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

  const handleMobileNav = (mode: any) => {
    setActiveMode(mode);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-slate-200 font-sans text-text-primary flex flex-col">
      {/* Navbar */}
      <header className="fixed top-4 left-4 right-4 z-50 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl h-16 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveMode('presentation' as any)}>
          <TenantLogo 
            alt={tenantConfig?.name || 'Logo'} 
            className="h-8 w-auto"
          />
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
          <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:inline">
            Цифровой штат
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-white/50">
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
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveMode('it-hub')}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                activeMode === 'it-hub' 
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden lg:inline">Для ИТ</span>
            </button>

            <button
              onClick={() => setActiveMode('presentation')}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                activeMode === 'presentation' 
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Презентация</span>
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2" />
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-3 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 active:scale-95"
            title="Настройки API"
          >
            <Settings className="w-6 h-6" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-4 right-4 z-40 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-4 md:hidden flex flex-col gap-2"
          >
            <NavButton
              active={activeMode === 'presentation'}
              onClick={() => handleMobileNav('presentation')}
              icon={<Home className="w-4 h-4" />}
              label="Главная"
            />
            <NavButton
              active={activeMode === 'studio'}
              onClick={() => handleMobileNav('studio')}
              icon={<Settings2 className="w-4 h-4" />}
              label="Студия"
            />
            <NavButton
              active={activeMode === 'action-library'}
              onClick={() => handleMobileNav('action-library')}
              icon={<Zap className="w-4 h-4" />}
              label="Действия"
            />
            <NavButton
              active={activeMode === 'cases'}
              onClick={() => handleMobileNav('cases')}
              icon={<Briefcase className="w-4 h-4" />}
              label="Кейсы"
            />
            <div className="h-px bg-slate-200 my-2" />
            <NavButton
              active={activeMode === 'it-hub'}
              onClick={() => handleMobileNav('it-hub')}
              icon={<Terminal className="w-4 h-4" />}
              label="Для ИТ"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
        ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5 scale-100"
        : "text-slate-500 hover:text-slate-900 hover:bg-white/50 scale-95 hover:scale-100"
    )}
  >
    {icon}
    {label}
  </button>
);
