import React, { useState } from 'react';
import { Wrench, Bell, UserCircle2, ExternalLink, Sun, Moon, Sparkles } from 'lucide-react';
import { DEMO_TENANT } from '../../lib/firebase';
import { useTheme } from '../../lib/ThemeContext';
import { ChangelogModal } from './ChangelogModal';
import packageJson from '../../../package.json';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none text-base">
                {DEMO_TENANT.name}
              </h1>
              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] px-2 py-0.5 rounded-full border border-blue-500/20 font-semibold">
                Multi-Tenant PRO
              </span>
              <button
                onClick={() => setIsChangelogOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 font-mono transition-colors flex items-center gap-1"
                title="Clique para ver o histórico de mudanças"
              >
                <span>v{packageJson.version}</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">CNPJ: {DEMO_TENANT.document}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/solicitar/${DEMO_TENANT.slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 font-medium transition-colors"
          >
            <span>Página Pública de Chamados</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
            title={theme === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden lg:inline text-slate-600">Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline text-amber-300">Claro</span>
              </>
            )}
          </button>

          {/* Changelog Modal Trigger Button */}
          <button
            onClick={() => setIsChangelogOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors relative"
            title="Histórico de Atualizações"
          >
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </button>

          <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800 ml-1 pl-3">
          <UserCircle2 className="w-8 h-8 text-slate-500 dark:text-slate-400" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Administrador</p>
            <a href="/login" className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline block">
              Sair / Trocar de Conta
            </a>
          </div>
        </div>
        </div>
      </header>

      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
    </>
  );
};

