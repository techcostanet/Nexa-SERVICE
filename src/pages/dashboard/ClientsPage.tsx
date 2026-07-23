import React, { useState } from 'react';
import { Users, Plus, Phone, Mail, Building2, User, Search, MapPin } from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';
import { Client } from '../../types';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockStore.getClients());
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [type, setType] = useState<'PF' | 'PJ'>('PF');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const created = mockStore.addClient({
      tenantId: DEMO_TENANT.id,
      type,
      name,
      document,
      email,
      phone,
      address: {
        street,
        number: '100',
        neighborhood,
        city: city || 'São Paulo',
        state: state || 'SP',
        zipCode: '00000-000'
      }
    });

    setClients(mockStore.getClients());
    setShowModal(false);
    // Reset
    setName('');
    setDocument('');
    setEmail('');
    setPhone('');
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.document.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Cadastro de Clientes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie sua carteira de clientes Pessoa Física (PF) e Pessoa Jurídica (PJ).
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="glass-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Cliente
        </button>
      </div>

      {/* Busca */}
      <div className="glass-panel p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar cliente por nome ou CPF/CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-10 text-xs"
          />
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((client) => (
          <div key={client.id} className="glass-panel p-5 space-y-3 border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  {client.type === 'PJ' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{client.name}</h3>
                  <p className="text-xs text-slate-400">Doc: {client.document}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                client.type === 'PJ' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {client.type}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-xs space-y-1 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{client.email}</span>
              </div>
              {client.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{client.address.street}, {client.address.city} - {client.address.state}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel max-w-lg w-full p-6 space-y-4 border-slate-700">
            <h2 className="text-lg font-bold text-slate-100">Cadastrar Novo Cliente</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input type="radio" name="type" checked={type === 'PF'} onChange={() => setType('PF')} />
                  Pessoa Física (PF)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input type="radio" name="type" checked={type === 'PJ'} onChange={() => setType('PJ')} />
                  Pessoa Jurídica (PJ)
                </label>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Nome Completo / Razão Social *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rua / Logradouro</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="glass-input w-full text-xs"
                    placeholder="São Paulo/SP"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="glass-button-primary text-xs">
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
