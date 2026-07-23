import React, { useState } from 'react';
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';
import { FinancialTransaction } from '../../types';

export const FinancialPage: React.FC = () => {
  const [financial, setFinancial] = useState<FinancialTransaction[]>(mockStore.getFinancial());
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Expense Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Despesas Operacionais');
  const [amount, setAmount] = useState(0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    mockStore.addTransaction({
      tenantId: DEMO_TENANT.id,
      type: 'expense',
      category,
      description,
      amount,
      status: 'paid',
      dueDate: new Date().toISOString().split('T')[0],
      paidAt: new Date().toISOString()
    });

    setFinancial(mockStore.getFinancial());
    setShowExpenseModal(false);
    setDescription('');
    setAmount(0);
  };

  const totalIncomes = financial
    .filter(f => f.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = financial
    .filter(f => f.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncomes - totalExpenses;

  const filtered = financial.filter(f => filterType === 'all' || f.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <CircleDollarSign className="w-6 h-6 text-emerald-500" />
            Gestão Financeira Integrada
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Receitas automáticas geradas por orçamentos aprovados e lançamento manual de despesas.
          </p>
        </div>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="glass-button-secondary text-xs text-red-400 hover:bg-red-950/30 border-red-900/40"
        >
          <Plus className="w-4 h-4" />
          Registrar Saída / Despesa
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 space-y-2 border-emerald-500/20">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Entradas (Receitas)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">R$ {totalIncomes.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500">Orçamentos aprovados & vendas</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-red-500/20">
          <div className="flex justify-between items-center text-red-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Saídas (Despesas)</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-400">R$ {totalExpenses.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500">Custos operacionais e materiais</p>
        </div>

        <div className="glass-panel p-5 space-y-2 border-blue-500/20">
          <div className="flex justify-between items-center text-blue-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo em Caixa</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            R$ {netBalance.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500">Resultado operacional líquido</p>
        </div>
      </div>

      {/* Filtros e Extrato */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="font-bold text-slate-200 text-sm">Extrato de Transações</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="glass-input text-xs bg-slate-900 border-slate-800"
            >
              <option value="all">Todas as Movimentações</option>
              <option value="income">Apenas Entradas (Receitas)</option>
              <option value="expense">Apenas Saídas (Despesas)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  item.type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">{item.description}</h3>
                  <span className="text-[10px] text-slate-500">{item.category} • {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-bold text-sm block ${
                  item.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {item.status === 'paid' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Registrar Saída */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel max-w-md w-full p-6 space-y-4 border-slate-700">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 text-red-400">
              <ArrowDownRight className="w-5 h-5" />
              Registrar Nova Saída / Despesa
            </h2>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Descrição da Despesa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de materiais de limpeza"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input w-full text-xs bg-slate-900 border-slate-800"
                >
                  <option value="Material de Consumo">Material de Consumo</option>
                  <option value="Combustível & Transporte">Combustível & Transporte</option>
                  <option value="Aluguel & Ferramentas">Aluguel & Ferramentas</option>
                  <option value="Despesas Operacionais">Despesas Operacionais</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Valor da Despesa (R$) *</label>
                <input
                  type="number"
                  required
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="glass-button-primary text-xs bg-red-600 hover:from-red-600 hover:to-red-700">
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
