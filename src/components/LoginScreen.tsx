import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoginScreenProps {
  onLogin: (password: string) => Promise<boolean>;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(false);

    try {
      const success = await onLogin(password);
      if (!success) {
        setError(true);
        setPassword('');
      }
    } catch (e) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Доступ ограничен</h1>
          <p className="text-slate-400">Введите пароль для доступа к системе Цифровой Штат</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Пароль доступа"
              className={cn(
                "w-full bg-slate-900/50 border-2 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 outline-none transition-all duration-300",
                error 
                  ? "border-red-500/50 focus:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]" 
                  : "border-slate-800 focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              )}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className={cn(
              "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
              (isLoading || !password) && "opacity-50 cursor-not-allowed",
              !isLoading && password && "hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-[1.02]"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Войти в систему
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-600">
          Protected by End-to-End Encryption
        </p>
      </div>
    </div>
  );
};
