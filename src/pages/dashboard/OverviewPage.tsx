import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  FileSpreadsheet,
  Users,
  CircleDollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';

export const OverviewPage: React.FC = () => {
  const requests = mockStore.getRequests();
  const quotes = mockStore.getQuotes();
  const financial = mockStore.getFinancial();

  // Metrics
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
  const totalIncome = financial
    .filter(f => f.type === 'income' && f.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = financial
    .filter(f => f.type === 'expense' && f.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border-blue-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Painel de Controle - {DEMO_TENANT.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe em tempo real suas solicitações, orçamentos e fluxo financeiro.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/orcamentos" className="glass-button-primary text-xs">
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </Link>
          <a
            href={`/solicitar/${DEMO_TENANT.slug}`}
            target="_blank"
            rel="noreferrer"
            className="glass-button-secondary text-xs"
          >
            Portal de Soluções do Cliente
          </a>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Chamados Pendentes</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center border border-yellow-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{pendingRequests}</div>
          <p className="text-[11px] text-slate-500">Aguardando análise e orçamento</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Orçamentos Aprovados</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{approvedQuotes}</div>
          <p className="text-[11px] text-emerald-400 font-medium">Prontos para execução</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Receita Total do Mês</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-400">R$ {totalIncome.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500">Integrado aos orçamentos</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Líquido</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">R$ {netBalance.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500">Entradas vs. Saídas</p>
        </div>
      </div>

      {/* Grid com Chamados Recentes & Orçamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chamados Recentes */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-400" />
              Solicitações Recentes de Clientes
            </h3>
            <Link to="/chamados" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-200">{req.clientInfo.name}</span>
                  <p className="text-xs text-slate-400 line-clamp-1">{req.description}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(req.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  req.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {req.status === 'pending' ? 'Pendente' : req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orçamentos Recentes */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Últimos Orçamentos Gerados
            </h3>
            <Link to="/orcamentos" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              Criar Novo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{q.id}</span>
                    <span className="text-xs text-slate-400">- {q.clientInfo.name}</span>
                  </div>
                  <p className="text-xs text-blue-400 font-bold">R$ {q.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    q.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {q.status === 'approved' ? 'Aprovado' : 'Enviado'}
                  </span>
                  <a
                    href={`/aprovar/${q.token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Ver página de aprovação"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
