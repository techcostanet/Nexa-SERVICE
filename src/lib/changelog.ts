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
