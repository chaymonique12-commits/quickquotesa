import { validatePhone } from './phone';
import type { Quote, LineItem } from '../types';

export function generateQuoteNumber(): string {
  const counter = parseInt(localStorage.getItem('qq_quote_counter') || '0', 10) + 1;
  localStorage.setItem('qq_quote_counter', String(counter));
  return 'QQ-' + String(counter).padStart(5, '0');
}

export function calculateLineItemAmount(qty: number, rate: number): number {
  return qty * rate;
}

export function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateVAT(subtotal: number, vatRate: number): number {
  return Math.round(subtotal * vatRate);
}

export function calculateDiscount(subtotal: number, vat: number, type: 'percent' | 'fixed' | null, value: number): number {
  if (type === null || value <= 0) return 0;
  const base = subtotal + vat;
  if (type === 'percent') {
    return Math.round(base * (value / 100));
  }
  return Math.min(value, base);
}

export function calculateTotal(subtotal: number, vat: number, discount: number): number {
  return subtotal + vat - discount;
}

export function formatCurrency(cents: number): string {
  const rands = cents / 100;
  return 'R ' + rands.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '27' + cleaned.slice(1);
  }
  return cleaned;
}

export function validateQuote(quote: Partial<Quote>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!quote.customer?.name?.trim()) {
    errors.push('Customer name is required');
  }
  
  if (!quote.customer?.phone?.trim()) {
    errors.push('WhatsApp number is required');
  } else if (!validatePhone(quote.customer.phone)) {
    errors.push('Please enter a valid SA WhatsApp number (e.g. 082 123 4567)');
  }
  
  if (!quote.lineItems || quote.lineItems.length === 0) {
    errors.push('Add at least one item to your quote');
  }
  
  return { valid: errors.length === 0, errors };
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return 'https://wa.me/' + formattedPhone + '?text=' + encodedMessage;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function formatQuoteForWhatsApp(quote: Quote): string {
  const lines: string[] = [];
  lines.push('QUOTE');
  lines.push('=========================');
  lines.push('');
  lines.push('From: ' + quote.business.name);
  lines.push('Quote #: ' + quote.quoteNumber);
  lines.push('Date: ' + formatDate(quote.createdAt));
  lines.push('Valid Until: ' + formatDate(quote.validUntil));
  lines.push('-------------------------');
  lines.push('TO: ' + quote.customer.name);
  if (quote.customer.address) {
    lines.push('Address: ' + quote.customer.address);
  }
  lines.push('-------------------------');
  lines.push('ITEMS:');
  
  quote.lineItems.forEach(function(item: LineItem) {
    lines.push(item.description);
    lines.push(item.quantity + ' x R' + item.unitRate.toFixed(2) + ' = R' + item.amount.toFixed(2));
  });
  
  lines.push('-------------------------');
  lines.push('Subtotal: R' + quote.subtotal.toFixed(2));
  
  if (quote.vatEnabled) {
    lines.push('VAT (' + (quote.vatRate * 100).toFixed(0) + '%): R' + (quote.subtotal * quote.vatRate).toFixed(2));
  }
  
  if (quote.discountValue > 0) {
    lines.push('Discount: -R' + quote.discountValue.toFixed(2));
  }
  
  lines.push('=========================');
  lines.push('TOTAL: R' + quote.total.toFixed(2));
  lines.push('=========================');
  
  if (quote.notes) {
    lines.push('NOTES:');
    lines.push(quote.notes);
  }
  
  lines.push('-------------------------');
  lines.push('Sent via QuickQuote SA');
  
  return lines.join('\n');
}

export function getQuoteNumberFromStorage(): number {
  return parseInt(localStorage.getItem('qq_quote_counter') || '0', 10);
}