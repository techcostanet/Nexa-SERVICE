import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Wrench, Upload, Send, CheckCircle2, MapPin, Phone, Mail, User, FileText, Camera } from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';
import packageJson from '../../../package.json';


export const ClientRequestPage: React.FC = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    // Simulate photo reading
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !description) {
      alert('Por favor, preencha o seu nome, WhatsApp e a descrição do problema.');
      return;
    }

    mockStore.addRequest({
      tenantId: DEMO_TENANT.id,
      clientInfo: {
        name,
        document: document || 'Não informado',
        email,
        phone,
        address
      },
      description,
      photoUrls: photos
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 animate-fade-in border-emerald-500/30">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Solicitação Enviada!</h2>
            <p className="text-slate-400 text-sm mt-2">
              Sua solicitação foi recebida com sucesso pela equipe de <strong className="text-slate-200">{DEMO_TENANT.name}</strong>.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
            <p><strong>Solicitante:</strong> {name}</p>
            <p><strong>Contato:</strong> {phone}</p>
            <p><strong>Status:</strong> <span className="text-yellow-400 font-semibold">Em Análise / Orçamento</span></p>
          </div>
          <p className="text-xs text-slate-500">
            Entraremos em contato via WhatsApp/E-mail assim que o orçamento estiver pronto.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName('');
              setPhone('');
              setDescription('');
              setPhotos([]);
            }}
            className="w-full glass-button-secondary py-3 text-sm"
          >
            Fazer outra solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        
        {/* Header da Empresa */}
        <div className="glass-panel p-6 flex items-center justify-between border-blue-500/20">
          <div className="flex items-center gap-4">
            <img
              src={DEMO_TENANT.logoUrl}
              alt={DEMO_TENANT.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-100">{DEMO_TENANT.name}</h1>
              <p className="text-xs text-slate-400">CNPJ: {DEMO_TENANT.document}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-blue-400">
                <Phone className="w-3.5 h-3.5" />
                <span>{DEMO_TENANT.phone}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 items-center justify-center border border-blue-500/20">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        {/* Form Box */}
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Solicitar Orçamento de Serviço
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Preencha os dados abaixo para receber uma proposta personalizada da nossa equipe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Seção 1: Dados do Cliente */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1. Seus Dados de Contato
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nome Completo ou Razão Social *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input w-full pl-10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    CPF ou CNPJ
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="glass-input w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="glass-input w-full pl-10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input w-full pl-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Endereço do Local de Atendimento
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Rua, número, bairro e cidade"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="glass-input w-full pl-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Descrição do Serviço */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                2. Detalhes do Problema / Serviço
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descreva o que precisa ser feito ou o defeito apresentado *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ex: Preciso de higienização de 2 aparelhos de ar condicionado e conserto de um vazamento de água..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full text-sm resize-none"
                />
              </div>

              {/* Photos upload */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Fotos / Anexos do Problema (Opcional)
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                      <img src={url} alt={`Anexo ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-blue-400">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Anexar</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full glass-button-primary py-3 text-base font-semibold mt-4"
            >
              <Send className="w-5 h-5" />
              Solicitar Orçamento Agora
            </button>
          </form>
        </div>

      </div>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-500 mt-8 space-y-1">
        <p>Nexa SERVICE Multi-Tenant Platform &copy; 2026 - Todos os direitos reservados.</p>
        <p className="font-mono text-[11px]">Versão do Sistema: v{packageJson.version}</p>
      </footer>
    </div>
  );
};

