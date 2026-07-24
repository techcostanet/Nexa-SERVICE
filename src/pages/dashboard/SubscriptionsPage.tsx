import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Lock,
  Unlock,
  KeyRound,
  Search,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Clock
} from 'lucide-react';
import { mockStore } from '../../lib/firebase';
import { Tenant } from '../../types';

export const SubscriptionsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(mockStore.getTenants());
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ email: string; tempPass: string } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [expirationDate, setExpirationDate] = useState('2026-12-31');

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    t.document.includes(search) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName || !email || !document) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    mockStore.addTenant({
      slug,
      name,
      companyName: companyName || name,
      ownerName,
      document,
      email,
      phone,
      plan,
      status: 'active',
      expirationDate: expirationDate || '2026-12-31',
      settings: {
        primaryColor: '#0066ff',
        termsAndConditions: 'Termos padrão de uso do sistema.'
      }
    });

    setTenants([...mockStore.getTenants()]);
    setShowAddModal(false);
    // Reset Form
    setName('');
    setCompanyName('');
    setOwnerName('');
    setDocument('');
    setEmail('');
    setPhone('');
  };

  const handleToggleStatus = (tenantId: string, currentStatus: Tenant['status']) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    mockStore.updateTenantStatus(tenantId, newStatus);
    setTenants([...mockStore.getTenants()]);
  };

  const handleResetPassword = (tenant: Tenant) => {
    const res = mockStore.resetTenantPassword(tenant.id);
    setResetFeedback({ email: res.email, tempPass: res.tempPassword });
  };

  const statusBadge = (status: Tenant['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ativo / Liberado
          </span>
        );
      case 'blocked':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Bloqueado (Falta Pagamento)
          </span>
        );
      case 'trial':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Período de Teste
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            Gestão de Licenças & Clientes SaaS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cadastre os clientes que compraram o Nexa SERVICE, gerencie renovações e bloqueie/libere o acesso.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="glass-button-primary text-xs"
        >
          <UserPlus className="w-4 h-4" />
          Cadastrar Novo Licenciado
        </button>
      </div>

      {/* Reset Password Alert Modal */}
      {resetFeedback && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Senha temporária gerada para {resetFeedback.email}:
            </p>
            <p className="text-sm font-mono font-bold mt-1 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-blue-200 dark:border-blue-800 inline-block">
              {resetFeedback.tempPass}
            </p>
          </div>
          <button
            onClick={() => setResetFeedback(null)}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome, empresa, CPF/CNPJ ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-10 text-xs"
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Total de Licenciados: <strong className="text-slate-900 dark:text-slate-200">{tenants.length}</strong>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Cliente / Empresa</th>
                <th className="p-4">Responsável & Contato</th>
                <th className="p-4">Documento (CPF/CNPJ)</th>
                <th className="p-4">Status do Acesso</th>
                <th className="p-4">Validade da Licença</th>
                <th className="p-4 text-right">Ações de Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Name & Company */}
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px] mt-0.5">
                      <Building className="w-3 h-3" />
                      <span>{t.companyName || t.name}</span>
                    </div>
                  </td>

                  {/* Owner & Contact */}
                  <td className="p-4 space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {t.ownerName}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {t.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {t.phone}</span>
                    </div>
                  </td>

                  {/* Document */}
                  <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {t.document}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {statusBadge(t.status)}
                  </td>

                  {/* Expiration */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {t.expirationDate}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(t.id, t.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 ${
                        t.status === 'active'
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                      }`}
                      title={t.status === 'active' ? 'Bloquear Acesso' : 'Liberar Acesso'}
                    >
                      {t.status === 'active' ? (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Bloquear
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Liberar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleResetPassword(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1"
                      title="Resetar Senha do Cliente"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Resetar Senha
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro de Novo Licenciado */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Cadastrar Novo Comprador / Licenciado
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Empresa / Nome Fantasia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ClimaTech Serviços LTDA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Documento (CPF ou CNPJ) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail do Cliente (Login) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 99999-8888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plano Escolhido
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="glass-input w-full text-xs"
                  >
                    <option value="free">Básico (Grátis)</option>
                    <option value="pro">Pro (Recomendado)</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Validade da Licença
                  </label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="glass-button-primary text-xs"
                >
                  Confirmar & Liberar Licença
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
