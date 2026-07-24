import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ServiceRequestsPage } from './pages/dashboard/ServiceRequestsPage';
import { QuoteGeneratorPage } from './pages/dashboard/QuoteGeneratorPage';
import { ClientsPage } from './pages/dashboard/ClientsPage';
import { CatalogPage } from './pages/dashboard/CatalogPage';
import { FinancialPage } from './pages/dashboard/FinancialPage';
import { SubscriptionsPage } from './pages/dashboard/SubscriptionsPage';
import { ClientRequestPage } from './pages/public/ClientRequestPage';
import { QuoteApprovalPage } from './pages/public/QuoteApprovalPage';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/solicitar/:tenantSlug" element={<ClientRequestPage />} />
          <Route path="/aprovar/:quoteToken" element={<QuoteApprovalPage />} />

          {/* Rotas do Painel do Prestador */}
          <Route path="/" element={<DashboardLayout><OverviewPage /></DashboardLayout>} />
          <Route path="/chamados" element={<DashboardLayout><ServiceRequestsPage /></DashboardLayout>} />
          <Route path="/orcamentos" element={<DashboardLayout><QuoteGeneratorPage /></DashboardLayout>} />
          <Route path="/clientes" element={<DashboardLayout><ClientsPage /></DashboardLayout>} />
          <Route path="/catalogo" element={<DashboardLayout><CatalogPage /></DashboardLayout>} />
          <Route path="/financeiro" element={<DashboardLayout><FinancialPage /></DashboardLayout>} />
          <Route path="/licencas" element={<DashboardLayout><SubscriptionsPage /></DashboardLayout>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

