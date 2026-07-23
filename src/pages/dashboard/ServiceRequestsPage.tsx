import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, FilePlus, Phone, MapPin, Search, Filter } from 'lucide-react';
import { mockStore } from '../../lib/firebase';
import { ServiceRequest, RequestStatus } from '../../types';

export const ServiceRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>(mockStore.getRequests());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const statusLabels: Record<RequestStatus, { label: string; color: string }> = {
    pending: { label: 'Solicitado', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    quoting: { label: 'Em Orçamento', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    awaiting_approval: { label: 'Aguardando Aprovação', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    approved: { label: 'Aprovado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    rejected: { label: 'Recusado', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    completed: { label: 'Executado', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    billed: { label: 'Faturado', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.clientInfo.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-500" />
            Chamados & Solicitações de Serviço
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie todas as solicitações recebidas via formulário público do seu tenant.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente ou problema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input text-xs bg-slate-900 border-slate-800"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Solicitado (Novo)</option>
            <option value="quoting">Em Orçamento</option>
            <option value="approved">Aprovado</option>
            <option value="completed">Executado</option>
          </select>
        </div>
      </div>

      {/* Lista de Solicitações */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const statusInfo = statusLabels[req.status] || statusLabels.pending;
          return (
            <div
              key={req.id}
              className="glass-panel p-5 space-y-4 hover:border-slate-700 transition-all border-slate-800"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                    #{req.id.replace('req-', '')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{req.clientInfo.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {req.clientInfo.phone}</span>
                      {req.clientInfo.address && (
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {req.clientInfo.address}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(req.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Descrição e Fotos */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                  {req.description}
                </p>

                {req.photoUrls && req.photoUrls.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {req.photoUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Anexo"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-800 hover:scale-105 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => navigate(`/orcamentos?requestId=${req.id}`)}
                  className="glass-button-primary text-xs py-2"
                >
                  <FilePlus className="w-4 h-4" />
                  Gerar Orçamento para este Chamado
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
