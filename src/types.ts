export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitRate: number;
  amount: number;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Business {
  name: string;
  phone: string;
  email: string;
  address: string;
  logo?: string;
  companyRegNumber?: string;
  physicalAddress?: string;
}

export interface BankingDetails {
  bankName: string;
  accountNumber: string;
  branchCode: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  validUntil: string;
  customer: Customer;
  business: Business;
  lineItems: LineItem[];
  subtotal: number;
  vatRate: number;
  vatEnabled: boolean;
  totalWithVat: number;
  discountType: 'percent' | 'fixed' | null;
  discountValue: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'accepted' | 'queried';
  signature?: string;
  queryNote?: string;
  queryNoteTimestamp?: string;
}

export interface Template {
  id: string;
  name: string;
  lineItems: Omit<LineItem, 'id'>[];
  defaultNotes: string;
  createdAt: string;
}

export interface Settings {
  business: Business;
  bankingDetails: BankingDetails;
  defaultVatRate: number;
  defaultValidityDays: number;
  defaultNotes: string;
  accentColor: string;
  primaryCurrency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
  baseCurrencyEnabled: boolean;
  baseCurrency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
  exchangeRate: number;
  vatLabel: string;
}

export type TabType = 'builder' | 'templates' | 'history' | 'settings';
