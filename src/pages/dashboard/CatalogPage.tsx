import React, { useState } from 'react';
import { Package, Wrench, Plus, Tag, CircleDollarSign, Layers } from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';
import { Product, Service } from '../../types';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockStore.getProducts());
  const [services, setServices] = useState<Service[]>(mockStore.getServices());
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(10);

  const [servName, setServName] = useState('');
  const [servDesc, setServDesc] = useState('');
  const [servPrice, setServPrice] = useState(0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || salePrice <= 0) return;

    mockStore.addProduct({
      tenantId: DEMO_TENANT.id,
      sku: prodSku || `SKU-${Date.now().toString().slice(-4)}`,
      name: prodName,
      costPrice,
      salePrice,
      stock,
      unit: 'un'
    });

    setProducts(mockStore.getProducts());
    setShowModal(false);
    setProdName('');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servName || servPrice <= 0) return;

    mockStore.addService({
      tenantId: DEMO_TENANT.id,
      name: servName,
      description: servDesc,
      defaultPrice: servPrice
    });

    setServices(mockStore.getServices());
    setShowModal(false);
    setServName('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            Catálogo de Serviços & Peças
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre os valores padrão de mão de obra e peças com custo, venda e estoque.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="glass-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'services' ? 'Novo Serviço' : 'Nova Peça / Produto'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'services'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Catálogo de Serviços ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'products'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <Package className="w-4 h-4" />
          Peças & Produtos ({products.length})
        </button>
      </div>

      {/* Conteúdo Serviços */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((serv) => (
            <div key={serv.id} className="glass-panel p-5 space-y-3 border-slate-800">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-100 text-sm">{serv.name}</h3>
                <span className="text-blue-400 font-bold text-sm bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  R$ {serv.defaultPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-400">{serv.description || 'Sem descrição cadastrada.'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo Produtos */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((prod) => (
            <div key={prod.id} className="glass-panel p-5 space-y-3 border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{prod.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">SKU: {prod.sku}</span>
                </div>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  R$ {prod.salePrice.toFixed(2)}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <span className="text-slate-500 block text-[10px]">Custo</span>
                  <span className="text-slate-300 font-medium">R$ {prod.costPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Margem Lucro</span>
                  <span className="text-emerald-400 font-bold">
                    +{(((prod.salePrice - prod.costPrice) / prod.costPrice) * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Estoque</span>
                  <span className="text-slate-200 font-bold">{prod.stock} {prod.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Modal Cadastros */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel max-w-md w-full p-6 space-y-4 border-slate-700">
            <h2 className="text-lg font-bold text-slate-100">
              {activeTab === 'services' ? 'Novo Serviço' : 'Nova Peça / Produto'}
            </h2>

            {activeTab === 'services' ? (
              <form onSubmit={handleAddService} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Nome do Serviço *</label>
                  <input
                    type="text"
                    required
                    value={servName}
                    onChange={(e) => setServName(e.target.value)}
                    className="glass-input w-full text-xs"
                    placeholder="Ex: Higienização Completa Ar Split"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Preço Padrão (R$) *</label>
                  <input
                    type="number"
                    required
                    value={servPrice || ''}
                    onChange={(e) => setServPrice(Number(e.target.value))}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Descrição do Serviço</label>
                  <textarea
                    rows={3}
                    value={servDesc}
                    onChange={(e) => setServDesc(e.target.value)}
                    className="glass-input w-full text-xs resize-none"
                  />
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
                    Salvar Serviço
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Nome da Peça / Produto *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">SKU / Código</label>
                    <input
                      type="text"
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value)}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Estoque Inicial</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Preço Custo (R$)</label>
                    <input
                      type="number"
                      value={costPrice || ''}
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                      className="glass-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Preço Venda (R$) *</label>
                    <input
                      type="number"
                      required
                      value={salePrice || ''}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="glass-input w-full text-xs"
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
                    Salvar Produto
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
