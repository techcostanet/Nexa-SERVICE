import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Share2,
  Send,
  CheckCircle2,
  Search,
  Calculator,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';
import { QuoteItem, Client, Product, Service } from '../../types';

export const QuoteGeneratorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');

  const clients = mockStore.getClients();
  const products = mockStore.getProducts();
  const services = mockStore.getServices();

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [generatedQuoteToken, setGeneratedQuoteToken] = useState<string | null>(null);

  // Custom Item Inputs
  const [customDesc, setCustomDesc] = useState('');
  const [customQty, setCustomQty] = useState(1);
  const [customPrice, setCustomPrice] = useState(0);

  // Se veio de um chamado específico, vincula automaticamente
  useEffect(() => {
    if (requestId) {
      const req = mockStore.getRequests().find(r => r.id === requestId);
      if (req) {
        // Encontra ou cria cliente
        const existingClient = clients.find(c => c.name.toLowerCase() === req.clientInfo.name.toLowerCase());
        if (existingClient) {
          setSelectedClientId(existingClient.id);
        }
      }
    }
  }, [requestId]);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleAddProduct = (prod: Product) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      type: 'product',
      itemId: prod.id,
      description: prod.name,
      quantity: 1,
      unitPrice: prod.salePrice,
      totalPrice: prod.salePrice
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleAddService = (serv: Service) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      type: 'service',
      itemId: serv.id,
      description: serv.name,
      quantity: 1,
      unitPrice: serv.defaultPrice,
      totalPrice: serv.defaultPrice
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleAddCustom = () => {
    if (!customDesc || customPrice <= 0) return;
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      type: 'custom',
      description: customDesc,
      quantity: customQty,
      unitPrice: customPrice,
      totalPrice: customQty * customPrice
    };
    setItems(prev => [...prev, newItem]);
    setCustomDesc('');
    setCustomPrice(0);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleQtyChange = (id: string, qty: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, qty);
        return { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice };
      }
      return i;
    }));
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const total = Math.max(0, subtotal - discount);

  const handleGenerateQuote = () => {
    if (!selectedClient) {
      alert('Selecione um cliente para prosseguir.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos 1 item ao orçamento.');
      return;
    }

    const created = mockStore.addQuote({
      tenantId: DEMO_TENANT.id,
      serviceRequestId: requestId || undefined,
      clientId: selectedClient.id,
      clientInfo: {
        name: selectedClient.name,
        document: selectedClient.document,
        email: selectedClient.email,
        phone: selectedClient.phone
      },
      items,
      subtotal,
      discount,
      total,
      status: 'sent',
      validUntil: new Date(Date.now() + 86400000 * 7).toISOString()
    });

    setGeneratedQuoteToken(created.token);
  };

  const approvalUrl = generatedQuoteToken
    ? `${window.location.origin}/aprovar/${generatedQuoteToken}`
    : '';

  const whatsappMessage = `Olá ${selectedClient?.name || ''}! 👋\n\nAqui é da *${DEMO_TENANT.name}*. Conforme solicitado, elaboramos o seu orçamento no valor total de *R$ ${total.toFixed(2)}*.\n\nVocê pode visualizar os detalhes completos e aprovar diretamente através do link exclusivo abaixo:\n👉 ${approvalUrl}\n\nFicamos à disposição!`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    const cleanPhone = selectedClient?.phone.replace(/\D/g, '') || '';
    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-blue-500" />
          Gerador de Orçamentos
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Crie orçamentos profissionais dinâmicos, calcule descontos e compartilhe via WhatsApp ou E-mail com link exclusivo de aprovação.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda: Form de Criação */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Seleção do Cliente */}
          <div className="glass-panel p-5 space-y-3 border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Seleção de Cliente (PF ou PJ)
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="glass-input w-full text-sm bg-slate-900 border-slate-800"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type} - {c.phone})
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between">
                <span>Doc: {selectedClient.document}</span>
                <span>Email: {selectedClient.email}</span>
              </div>
            )}
          </div>

          {/* Adição de Itens do Catálogo */}
          <div className="glass-panel p-5 space-y-4 border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Adicionar Itens do Catálogo (Produtos & Serviços)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Adicionar Serviços */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-400">Serviços Cadastrados</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleAddService(s)}
                      className="w-full p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/40 text-left flex justify-between items-center transition-colors text-xs"
                    >
                      <span className="truncate max-w-[160px] text-slate-200">{s.name}</span>
                      <span className="text-blue-400 font-semibold">R$ {s.defaultPrice.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adicionar Produtos */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-400">Peças & Produtos</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddProduct(p)}
                      className="w-full p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 text-left flex justify-between items-center transition-colors text-xs"
                    >
                      <span className="truncate max-w-[160px] text-slate-200">{p.name}</span>
                      <span className="text-emerald-400 font-semibold">R$ {p.salePrice.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Adição Avulsa */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400">Ou adicione um item avulso:</span>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Descrição do item avulso"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="glass-input text-xs flex-1"
                />
                <input
                  type="number"
                  placeholder="Qtd"
                  value={customQty}
                  onChange={(e) => setCustomQty(Number(e.target.value))}
                  className="glass-input text-xs w-16 text-center"
                />
                <input
                  type="number"
                  placeholder="Preço R$"
                  value={customPrice || ''}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="glass-input text-xs w-24"
                />
                <button onClick={handleAddCustom} className="glass-button-primary text-xs">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabela de Itens Selecionados */}
          <div className="glass-panel p-5 space-y-3 border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Itens Incluídos no Orçamento
            </h3>

            {items.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">
                Nenhum item adicionado ainda. Clique nos itens do catálogo acima.
              </p>
            ) : (
              <div className="divide-y divide-slate-800 text-xs">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <span className="font-semibold text-slate-200">{item.description}</span>
                      <span className="text-[10px] text-slate-500 block capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                        className="glass-input text-xs w-14 py-1 text-center"
                      />
                      <span className="w-20 text-right text-slate-300 font-medium">
                        R$ {item.totalPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Coluna Direita: Resumo & Envio */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-5 border-blue-500/20 sticky top-20">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="w-4 h-4 text-blue-400" />
              Resumo & Totais
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal dos itens:</span>
                <span className="font-semibold text-slate-200">R$ {subtotal.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Desconto Especial (R$)</label>
                <input
                  type="number"
                  min="0"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="glass-input w-full text-xs"
                  placeholder="0.00"
                />
              </div>

              <div className="h-px bg-slate-800" />

              <div className="flex justify-between items-center text-sm font-bold pt-1">
                <span className="text-slate-200">VALOR TOTAL:</span>
                <span className="text-xl text-blue-400">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {!generatedQuoteToken ? (
              <button
                onClick={handleGenerateQuote}
                className="w-full glass-button-primary py-3 text-sm font-bold"
              >
                <FileSpreadsheet className="w-4 h-4" />
                GERAR ORÇAMENTO E LINK
              </button>
            ) : (
              <div className="space-y-3 pt-2 border-t border-slate-800 animate-fade-in">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Orçamento Gerado com Sucesso!</span>
                </div>

                <button
                  onClick={handleShareWhatsApp}
                  className="w-full glass-button-success py-3 text-xs font-bold"
                >
                  <MessageSquare className="w-4 h-4" />
                  ENVIAR VIA WHATSAPP
                </button>

                <a
                  href={approvalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full glass-button-secondary py-2.5 text-xs text-blue-400 justify-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver Página de Aprovação
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
