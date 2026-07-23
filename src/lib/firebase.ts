import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  Tenant, Client, Product, Service, ServiceRequest, Quote, FinancialTransaction
} from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ----------------------------------------------------
// DEMO MOCK STORE (Para visualização interativa imediata)
// ----------------------------------------------------

export const DEMO_TENANT: Tenant = {
  id: 'tenant-nexa-demo',
  slug: 'nexa-solucoes',
  name: 'Nexa Soluções Técnicas & Climatização',
  document: '45.123.890/0001-99',
  email: 'contato@nexasolucoes.com.br',
  phone: '(11) 98765-4321',
  logoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80',
  plan: 'pro',
  settings: {
    primaryColor: '#0066ff',
    termsAndConditions: 'Validade do orçamento: 10 dias. Pagamento em até 3x sem juros.',
    pixKey: '45.123.890/0001-99'
  },
  createdAt: new Date().toISOString()
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    tenantId: 'tenant-nexa-demo',
    type: 'PJ',
    name: 'Empresa TechCorp Brasil Ltda',
    document: '12.345.678/0001-90',
    email: 'financeiro@techcorp.com.br',
    phone: '(11) 97123-4455',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Conj. 142',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'client-2',
    tenantId: 'tenant-nexa-demo',
    type: 'PF',
    name: 'Carlos Eduardo Oliveira',
    document: '321.654.987-00',
    email: 'carlos.edu@gmail.com',
    phone: '(11) 99887-6655',
    address: {
      street: 'Rua das Flores',
      number: '250',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01400-000'
    },
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    tenantId: 'tenant-nexa-demo',
    sku: 'PECA-AC-01',
    name: 'Gás Refrigerante R410A (1Kg)',
    costPrice: 45.00,
    salePrice: 120.00,
    stock: 25,
    unit: 'un'
  },
  {
    id: 'prod-2',
    tenantId: 'tenant-nexa-demo',
    sku: 'PECA-AC-02',
    name: 'Capacitor 35uF 450V Dual',
    costPrice: 18.00,
    salePrice: 65.00,
    stock: 14,
    unit: 'un'
  },
  {
    id: 'prod-3',
    tenantId: 'tenant-nexa-demo',
    sku: 'CABO-PP-03',
    name: 'Cabo PP 4x2,5mm (Metro)',
    costPrice: 6.50,
    salePrice: 15.00,
    stock: 100,
    unit: 'm'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    tenantId: 'tenant-nexa-demo',
    name: 'Higienização e Carga de Gás Ar Condicionado 12.000 BTU',
    description: 'Limpeza química completa da condensadora e evaporadora + recarga de fluido refrigerante.',
    defaultPrice: 280.00
  },
  {
    id: 'serv-2',
    tenantId: 'tenant-nexa-demo',
    name: 'Instalação de Ar Condicionado Split Inverter',
    description: 'Instalação padrão até 3 metros de tubulagem de cobre com suporte e vácuo na tubulação.',
    defaultPrice: 650.00
  },
  {
    id: 'serv-3',
    tenantId: 'tenant-nexa-demo',
    name: 'Manutenção Preventiva / Corretiva Elétrica',
    description: 'Diagnóstico técnico especializado e troca de componentes com garantia.',
    defaultPrice: 200.00
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-101',
    tenantId: 'tenant-nexa-demo',
    clientId: 'client-1',
    clientInfo: {
      name: 'Empresa TechCorp Brasil Ltda',
      document: '12.345.678/0001-90',
      email: 'financeiro@techcorp.com.br',
      phone: '(11) 97123-4455',
      address: 'Av. Paulista, 1000 - Bela Vista, SP'
    },
    description: 'Ar condicionado da sala de servidores está pingando água e não está resfriando adequadamente.',
    photoUrls: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'req-102',
    tenantId: 'tenant-nexa-demo',
    clientId: 'client-2',
    clientInfo: {
      name: 'Carlos Eduardo Oliveira',
      document: '321.654.987-00',
      email: 'carlos.edu@gmail.com',
      phone: '(11) 99887-6655',
      address: 'Rua das Flores, 250 - Jardins, SP'
    },
    description: 'Necessidade de instalação de 2 novos aparelhos Split na residência.',
    photoUrls: [],
    status: 'quoting',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-2024-001',
    tenantId: 'tenant-nexa-demo',
    serviceRequestId: 'req-102',
    clientId: 'client-2',
    clientInfo: {
      name: 'Carlos Eduardo Oliveira',
      document: '321.654.987-00',
      email: 'carlos.edu@gmail.com',
      phone: '(11) 99887-6655'
    },
    items: [
      {
        id: 'item-1',
        type: 'service',
        itemId: 'serv-2',
        description: 'Instalação de Ar Condicionado Split Inverter (2 Unidades)',
        quantity: 2,
        unitPrice: 650.00,
        totalPrice: 1300.00
      },
      {
        id: 'item-2',
        type: 'product',
        itemId: 'prod-3',
        description: 'Cabo PP 4x2,5mm (Adicional de Tubulação)',
        quantity: 10,
        unitPrice: 15.00,
        totalPrice: 150.00
      }
    ],
    subtotal: 1450.00,
    discount: 50.00,
    total: 1400.00,
    status: 'sent',
    token: 'token-demo-9988',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 7).toISOString()
  }
];

export const INITIAL_FINANCIAL: FinancialTransaction[] = [
  {
    id: 'fin-1',
    tenantId: 'tenant-nexa-demo',
    type: 'income',
    category: 'Serviços Prestados',
    description: 'Orçamento Aprovado #2024-000 (Manutenção Preventiva)',
    amount: 1850.00,
    status: 'paid',
    dueDate: new Date().toISOString().split('T')[0],
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'fin-2',
    tenantId: 'tenant-nexa-demo',
    type: 'expense',
    category: 'Material de Consumo',
    description: 'Compra de tubulação de cobre e fluidos',
    amount: 450.00,
    status: 'paid',
    dueDate: new Date().toISOString().split('T')[0],
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Helper local store manager
class MockStore {
  tenants = [DEMO_TENANT];
  clients = [...INITIAL_CLIENTS];
  products = [...INITIAL_PRODUCTS];
  services = [...INITIAL_SERVICES];
  requests = [...INITIAL_REQUESTS];
  quotes = [...INITIAL_QUOTES];
  financial = [...INITIAL_FINANCIAL];

  getClients() { return this.clients; }
  addClient(c: Omit<Client, 'id' | 'createdAt'>) {
    const newC: Client = { ...c, id: `client-${Date.now()}`, createdAt: new Date().toISOString() };
    this.clients.push(newC);
    return newC;
  }

  getProducts() { return this.products; }
  addProduct(p: Omit<Product, 'id'>) {
    const newP: Product = { ...p, id: `prod-${Date.now()}` };
    this.products.push(newP);
    return newP;
  }

  getServices() { return this.services; }
  addService(s: Omit<Service, 'id'>) {
    const newS: Service = { ...s, id: `serv-${Date.now()}` };
    this.services.push(newS);
    return newS;
  }

  getRequests() { return this.requests; }
  addRequest(r: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) {
    const newR: ServiceRequest = {
      ...r,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.requests.unshift(newR);
    return newR;
  }

  getQuotes() { return this.quotes; }
  addQuote(q: Omit<Quote, 'id' | 'token' | 'createdAt'>) {
    const newQ: Quote = {
      ...q,
      id: `quote-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      token: `token-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString()
    };
    this.quotes.unshift(newQ);
    return newQ;
  }

  approveQuote(token: string, notes?: string) {
    const q = this.quotes.find(item => item.token === token);
    if (q) {
      q.status = 'approved';
      q.approvalDetails = {
        approvedAt: new Date().toISOString(),
        ip: '189.120.45.12',
        userAgent: navigator.userAgent,
        notes
      };
      // Criar transação de receita automática no financeiro!
      this.financial.unshift({
        id: `fin-${Date.now()}`,
        tenantId: q.tenantId,
        type: 'income',
        category: 'Orçamento Aprovado',
        description: `Receita do Orçamento ${q.id} - ${q.clientInfo.name}`,
        amount: q.total,
        status: 'paid',
        dueDate: new Date().toISOString().split('T')[0],
        paidAt: new Date().toISOString(),
        quoteId: q.id,
        clientId: q.clientId,
        createdAt: new Date().toISOString()
      });
      // Atualiza também o status do chamado se vinculado
      if (q.serviceRequestId) {
        const req = this.requests.find(r => r.id === q.serviceRequestId);
        if (req) req.status = 'approved';
      }
    }
    return q;
  }

  rejectQuote(token: string, reason?: string) {
    const q = this.quotes.find(item => item.token === token);
    if (q) {
      q.status = 'rejected';
      if (q.serviceRequestId) {
        const req = this.requests.find(r => r.id === q.serviceRequestId);
        if (req) req.status = 'rejected';
      }
    }
    return q;
  }

  getFinancial() { return this.financial; }
  addTransaction(t: Omit<FinancialTransaction, 'id' | 'createdAt'>) {
    const newT: FinancialTransaction = { ...t, id: `fin-${Date.now()}`, createdAt: new Date().toISOString() };
    this.financial.unshift(newT);
    return newT;
  }
}

export const mockStore = new MockStore();
