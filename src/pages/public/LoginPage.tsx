import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, LogIn, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Building, Lock } from 'lucide-react';
import { mockStore } from '../../lib/firebase';
import packageJson from '../../../package.json';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [blockedTenantName, setBlockedTenantName] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBlockedTenantName(null);

    if (!email) {
      setError('Por favor, informe seu e-mail de acesso.');
      return;
    }

    const tenants = mockStore.getTenants();
    const foundTenant = tenants.find(t => t.email.toLowerCase() === email.toLowerCase());

    if (!foundTenant) {
      setError('Nenhuma conta ou empresa encontrada com este e-mail.');
      return;
    }

    // Verificar Bloqueio por Pagamento
    if (foundTenant.status === 'blocked') {
      setBlockedTenantName(foundTenant.name);
      return;
    }

    // Sucesso - redireciona para a visão geral do sistema
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      
      {/* Background Decorator */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel p-8 space-y-6 shadow-2xl relative z-10 border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Nexa SERVICE
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Portal Unificado de Acesso do Cliente & Prestador
          </p>
        </div>

        {/* Error / Blocked Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {blockedTenantName && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              Acesso Bloqueado por Inadimplência
            </div>
            <p className="text-xs leading-relaxed">
              A empresa <strong className="underline">{blockedTenantName}</strong> está com a assinatura suspensa devido a pendência financeira.
            </p>
            <div className="pt-2 border-t border-amber-200 dark:border-amber-800 flex justify-between items-center text-[11px]">
              <span>Regularize via Pix ou Fatura</span>
              <a
                href="/licencas"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Gerenciar Licença →
              </a>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              E-mail Corporativo de Acesso
            </label>
            <input
              type="email"
              required
              placeholder="seu-email@suaempresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Senha de Acesso
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Solicite a redefinição de senha com a administração.'); }} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="glass-button-primary w-full py-3 text-sm font-semibold shadow-lg shadow-blue-500/20"
          >
            <LogIn className="w-4 h-4" />
            Entrar no Sistema
          </button>
        </form>

        {/* Quick Demo Access Credentials */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
            Contas de Teste Rápido
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setEmail('contato@nexasolucoes.com.br'); setPassword('123456'); }}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left space-y-0.5 transition-colors"
            >
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Conta Ativa
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">contato@nexasolucoes.com.br</p>
            </button>

            <button
              onClick={() => { setEmail('inadimplente@demo.com.br'); setPassword('123456'); }}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left space-y-0.5 transition-colors"
            >
              <div className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Conta Bloqueada
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">inadimplente@demo.com.br</p>
            </button>
          </div>
        </div>

      </div>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6 space-y-1 relative z-10">
        <p>Nexa SERVICE Multi-Tenant SaaS Platform &copy; 2026</p>
        <p className="font-mono text-[11px]">Versão {packageJson.version}</p>
      </footer>

    </div>
  );
};
