import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, FileText, Calendar, ShieldCheck, Phone, Mail, Building2, User, Printer } from 'lucide-react';
import { mockStore, DEMO_TENANT } from '../../lib/firebase';
import { Quote } from '../../types';

export const QuoteApprovalPage: React.FC = () => {
  const { quoteToken } = useParams<{ quoteToken: string }>();
  const [notes, setNotes] = useState('');
  const [actionDone, setActionDone] = useState<'approved' | 'rejected' | null>(null);

  const quotes = mockStore.getQuotes();
  const quote: Quote | undefined = quotes.find(q => q.token === quoteToken) || quotes[0]; // fallback para demo se token genérico

  const handleApprove = () => {
    if (!quote) return;
    mockStore.approveQuote(quote.token, notes);
    setActionDone('approved');
  };

  const handleReject = () => {
    if (!quote) return;
    mockStore.rejectQuote(quote.token, notes);
    setActionDone('rejected');
  };

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="glass-panel p-8 text-center max-w-md">
          <p className="text-red-400 font-bold">Orçamento não encontrado ou link expirado.</p>
        </div>
      </div>
    );
  }

  const isApproved = quote.status === 'approved' || actionDone === 'approved';
  const isRejected = quote.status === 'rejected' || actionDone === 'rejected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        {/* Banner de Status */}
        {isApproved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Orçamento Aprovado com Sucesso!</p>
              <p className="text-xs text-emerald-300/80">
                A equipe de prestação de serviços foi notificada e dará início ao atendimento conforme agendado.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-400">
            <XCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Orçamento Recusado / Em Revisão</p>
              <p className="text-xs text-red-300/80">
                A solicitação de revisão foi enviada ao prestador.
              </p>
            </div>
          </div>
        )}

        {/* Documento Orçamento em Formato Papel Clean / Web */}
        <div id="printable-quote" className="glass-panel p-6 sm:p-10 space-y-8 border-slate-800 shadow-2xl relative overflow-hidden">
          
          {/* Tarja Marca D'Água de Status */}
          {isApproved && (
            <div className="absolute -right-12 top-8 rotate-45 bg-emerald-500 text-slate-950 font-extrabold text-xs px-12 py-1 uppercase shadow-md tracking-wider">
              Aprovado
            </div>
          )}

          {/* Header do Orçamento */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <img
                src={DEMO_TENANT.logoUrl}
                alt={DEMO_TENANT.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-100">{DEMO_TENANT.name}</h1>
                <p className="text-xs text-slate-400">CNPJ: {DEMO_TENANT.document}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-400" /> {DEMO_TENANT.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> {DEMO_TENANT.email}</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full font-semibold">
                Orçamento #{quote.id}
              </span>
              <div className="text-xs text-slate-400 mt-2 space-y-0.5">
                <p>Data de Emissão: {new Date(quote.createdAt).toLocaleDateString('pt-BR')}</p>
                <p className="text-yellow-400 font-medium">Válido até: {new Date(quote.validUntil).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Cliente Solicitante</span>
              <p className="font-bold text-slate-200 text-sm">{quote.clientInfo.name}</p>
              <p className="text-slate-400">Documento: {quote.clientInfo.document}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Contatos</span>
              <p className="text-slate-300">WhatsApp: {quote.clientInfo.phone}</p>
              <p className="text-slate-300">E-mail: {quote.clientInfo.email}</p>
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Descritivo de Produtos & Serviços
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-2">Item / Descrição</th>
                    <th className="py-2.5 px-2 text-center">Tipo</th>
                    <th className="py-2.5 px-2 text-center">Qtd</th>
                    <th className="py-2.5 px-2 text-right">Valor Unit.</th>
                    <th className="py-2.5 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {quote.items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-900/40">
                      <td className="py-3 px-2 font-medium text-slate-200">{item.description}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.type === 'service' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {item.type === 'service' ? 'Serviço' : 'Peça'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-semibold">{item.quantity}</td>
                      <td className="py-3 px-2 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-100">R$ {item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumo Financeiro Totais */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 max-w-xs space-y-1">
              <p className="font-semibold text-slate-300">Condições de Pagamento & Termos:</p>
              <p>{DEMO_TENANT.settings.termsAndConditions}</p>
              {DEMO_TENANT.settings.pixKey && (
                <p className="text-blue-400 font-mono mt-1">Chave PIX: {DEMO_TENANT.settings.pixKey}</p>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>R$ {quote.subtotal.toFixed(2)}</span>
              </div>
              {quote.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto:</span>
                  <span>- R$ {quote.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between text-sm font-bold text-slate-100 pt-1">
                <span>Total Final:</span>
                <span className="text-base text-blue-400">R$ {quote.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Registro de Assinatura / Aceite Digital se Aprovado */}
          {isApproved && quote.approvalDetails && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Assinatura & Aceite Digital Registrado</span>
              </div>
              <p>Data do Aceite: {new Date(quote.approvalDetails.approvedAt).toLocaleString('pt-BR')}</p>
              <p className="font-mono text-[10px] opacity-75">IP do Cliente: {quote.approvalDetails.ip}</p>
              {quote.approvalDetails.notes && (
                <p className="italic mt-1">Observações do Cliente: "{quote.approvalDetails.notes}"</p>
              )}
            </div>
          )}

        </div>

        {/* Botões de Ação do Cliente */}
        {!isApproved && !isRejected && (
          <div className="glass-panel p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Observações ou Comentários (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Por gentileza, agendar o atendimento para o período da manhã."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="glass-input w-full text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleApprove}
                className="glass-button-success py-3.5 text-base font-bold"
              >
                <CheckCircle2 className="w-5 h-5" />
                APROVAR ORÇAMENTO
              </button>

              <button
                onClick={handleReject}
                className="glass-button-secondary py-3.5 text-base font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 border-red-900/40"
              >
                <XCircle className="w-5 h-5" />
                Solicitar Revisão / Recusar
              </button>
            </div>
          </div>
        )}

      </div>

      <footer className="text-center text-xs text-slate-600 mt-8 flex items-center justify-center gap-4">
        <span>Nexa SERVICE Platform</span>
        <button
          onClick={() => window.print()}
          className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs"
        >
          <Printer className="w-3.5 h-3.5" /> Imprimir / Salvar PDF
        </button>
      </footer>
    </div>
  );
};
