import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileSpreadsheet,
  Users,
  Package,
  CircleDollarSign,
  QrCode,
  Sparkles
} from 'lucide-react';
import { DEMO_TENANT } from '../../lib/firebase';
import packageJson from '../../../package.json';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { to: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { to: '/chamados', label: 'Solicitações / Chamados', icon: ClipboardList },
    { to: '/orcamentos', label: 'Gerador de Orçamentos', icon: FileSpreadsheet },
    { to: '/clientes', label: 'Cadastro de Clientes', icon: Users },
    { to: '/catalogo', label: 'Produtos & Serviços', icon: Package },
    { to: '/financeiro', label: 'Gestão Financeira', icon: CircleDollarSign },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] transition-colors">
      <div className="p-4 space-y-1">
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          Menu Principal
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 space-y-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
            <QrCode className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Portal do Cliente</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Link de captação de clientes:</p>
          <div className="bg-white dark:bg-slate-950 px-2 py-1 rounded text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate border border-slate-200 dark:border-slate-800">
            /solicitar/{DEMO_TENANT.slug}
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800/60 pt-3">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" /> Nexa SERVICE
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
            v{packageJson.version}
          </span>
        </div>
      </div>
    </aside>
  );
};

