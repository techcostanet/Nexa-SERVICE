export interface Tenant {
  id: string;
  slug: string;
  name: string;
  document: string; // CNPJ / CPF
  email: string;
  phone: string;
  logoUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  settings: {
    primaryColor?: string;
    termsAndConditions?: string;
    pixKey?: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'admin' | 'provider' | 'employee';
  avatarUrl?: string;
}

export interface Client {
  id: string;
  tenantId: string;
  type: 'PF' | 'PJ';
  name: string;
  document: string; // CPF ou CNPJ
  email: string;
  phone: string; // WhatsApp
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku?: string;
  name: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  unit: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  defaultPrice: number;
}

export type RequestStatus = 'pending' | 'quoting' | 'awaiting_approval' | 'approved' | 'rejected' | 'completed' | 'billed';

export interface ServiceRequest {
  id: string;
  tenantId: string;
  clientId?: string;
  clientInfo: {
    name: string;
    document: string;
    email: string;
    phone: string;
    address: string;
  };
  description: string;
  photoUrls: string[];
  status: RequestStatus;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  type: 'product' | 'service' | 'custom';
  itemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'completed' | 'billed';

export interface Quote {
  id: string;
  tenantId: string;
  serviceRequestId?: string;
  clientId: string;
  clientInfo: {
    name: string;
    document: string;
    email: string;
    phone: string;
  };
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: QuoteStatus;
  token: string; // Token único público para aprovação
  approvalDetails?: {
    approvedAt: string;
    ip: string;
    userAgent: string;
    notes?: string;
  };
  createdAt: string;
  validUntil: string;
}

export interface FinancialTransaction {
  id: string;
  tenantId: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid';
  dueDate: string;
  paidAt?: string;
  quoteId?: string;
  clientId?: string;
  createdAt: string;
}
