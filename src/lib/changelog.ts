export interface ChangeLogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    type: 'feature' | 'fix' | 'improvement';
    description: string;
  }[];
}

export const CHANGELOG_HISTORY: ChangeLogEntry[] = [
  {
    version: '1.3.0',
    date: '2026-07-24',
    title: 'URLs Personalizadas por Cliente (Multi-Tenant Slugs) & Recomendações SaaS',
    changes: [
      { type: 'feature', description: 'Geração e personalização de URLs exclusivas para cada cliente/licenciado (/solicitar/nome-do-cliente).' },
      { type: 'feature', description: 'Campo de Slug customizável no cadastro do licenciado no painel de licenças.' },
      { type: 'improvement', description: 'Atalho de teste e cópia rápida de URL do cliente na tabela de licenciados.' }
    ]
  },
  {
    version: '1.2.0',
    date: '2026-07-24',
    title: 'Módulo de Venda de Licenças SaaS & Correção do Tema Claro Padrão',
    changes: [
      { type: 'fix', description: 'Corrigido o fundo da página (index.html) para garantir visualização no Tema Claro (Light Mode) por padrão.' },
      { type: 'feature', description: 'Criado o módulo Gestão de Licenças SaaS (/licencas) para cadastro e gerenciamento de compradores do sistema.' },
      { type: 'feature', description: 'Permite cadastro completo de licenciados: Nome da Empresa, Responsável, CPF/CNPJ, E-mail e Telefone.' },
      { type: 'feature', description: 'Adicionado recurso de Bloquear e Liberar acesso instantaneamente com base no pagamento.' },
      { type: 'feature', description: 'Adicionada funcionalidade de Reset de Senha rápida para licenciados.' }
    ]
  },
  {
    version: '1.1.0',
    date: '2026-07-24',
    title: 'Tema Claro Padrão, Dark Mode e Central de Notas de Versão',
    changes: [
      { type: 'feature', description: 'Design do sistema atualizado para visualização Clara (Light Mode) limpa por padrão.' },
      { type: 'feature', description: 'Adicionada opção de alternar facilmente para o Modo Escuro (Dark Mode) na barra superior.' },
      { type: 'feature', description: 'Criada a tela/modal de Histórico de Mudanças (Changelog) para acompanhar melhorias e correções a cada deploy.' },
      { type: 'improvement', description: 'Número da versão exibido visivelmente na tela pública/solicitação e no menu/barra interna do sistema.' },
      { type: 'improvement', description: 'Automação de versionamento e deploy via scripts configurados no projeto.' }
    ]
  },
  {
    version: '1.0.0',
    date: '2026-07-23',
    title: 'Lançamento Inicial do Nexa SERVICE',
    changes: [
      { type: 'feature', description: 'Módulo de Gestão de Chamados e Solicitações de Clientes.' },
      { type: 'feature', description: 'Gerador de Orçamentos com link público de aprovação rápida.' },
      { type: 'feature', description: 'Painel Financeiro com sincronização automática de orçamentos aprovados.' },
      { type: 'feature', description: 'Cadastro de Clientes, Catálogo de Produtos e Serviços.' }
    ]
  }
];
