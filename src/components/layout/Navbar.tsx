import React from 'react';
import { Wrench, Bell, UserCircle2, ExternalLink } from 'lucide-react';
import { DEMO_TENANT } from '../../lib/firebase';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-100 tracking-tight leading-none text-base">
              {DEMO_TENANT.name}
            </h1>
            <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/20 font-medium">
              Multi-Tenant PRO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">CNPJ: {DEMO_TENANT.document}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`/solicitar/${DEMO_TENANT.slug}`}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 font-medium transition-colors"
        >
          <span>Página Pública de Chamados</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-2 pl-1">
          <UserCircle2 className="w-8 h-8 text-slate-400" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-200">Administrador</p>
            <p className="text-[10px] text-slate-400">admin@nexa.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
