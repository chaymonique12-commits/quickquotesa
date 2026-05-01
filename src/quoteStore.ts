import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Quote, LineItem, Customer } from '../types';
import { 
  generateQuoteNumber, 
  calculateLineItemAmount, 
  calculateSubtotal, 
  calculateVAT,
  calculateDiscount,
  calculateTotal,
  addDays 
} from '../utils/quote';

interface QuoteState {
  currentQuote: Partial<Quote>;
  lineItems: LineItem[];
  vatEnabled: boolean;
  vatRate: number;
  discountType: 'percent' | 'fixed' | null;
  discountValue: number;
  notes: string;
  isDirty: boolean;
  
  setCustomer: (customer: Partial<Customer>) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, field: keyof LineItem, value: string | number) => void;
  removeLineItem: (id: string) => void;
  setVatEnabled: (enabled: boolean) => void;
  setDiscount: (type: 'percent' | 'fixed' | null, value: number) => void;
  setNotes: (notes: string) => void;
  loadTemplate: (lineItems: Omit<LineItem, 'id'>[], notes: string) => void;
  resetQuote: () => void;
  getQuote: () => Quote;
}

function createEmptyQuote(): Partial<Quote> {
  return {
    quoteNumber: generateQuoteNumber(),
    createdAt: new Date().toISOString(),
    validUntil: addDays(30),
    customer: { name: '', phone: '', email: '', address: '' },
    business: { name: '', phone: '', email: '', address: '' },
    lineItems: [],
    subtotal: 0,
    vatRate: 0.15,
    vatEnabled: true,
    discountType: null,
    discountValue: 0,
    total: 0,
    notes: '',
    status: 'draft',
  };
}

function createEmptyLineItem(): LineItem {
  return {
    id: uuidv4(),
    description: '',
    quantity: 1,
    unitRate: 0,
    amount: 0,
  };
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      currentQuote: createEmptyQuote(),
      lineItems: [],
      vatEnabled: true,
      vatRate: 0.15,
      discountType: null,
      discountValue: 0,
      notes: '',
      isDirty: false,

      setCustomer: (customer) => {
        set((state) => ({
          currentQuote: {
            ...state.currentQuote,
            customer: { ...state.currentQuote.customer!, ...customer },
          },
          isDirty: true,
        }));
      },

      addLineItem: () => {
        set((state) => ({
          lineItems: [...state.lineItems, createEmptyLineItem()],
          isDirty: true,
        }));
      },

      updateLineItem: (id, field, value) => {
        set((state) => {
          const updated = state.lineItems.map((item) => {
            if (item.id !== id) return item;
            const updatedItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitRate') {
              updatedItem.amount = calculateLineItemAmount(
                field === 'quantity' ? Number(value) : item.quantity,
                field === 'unitRate' ? Number(value) : item.unitRate
              );
            }
            return updatedItem;
          });
          return { lineItems: updated, isDirty: true };
        });
      },

      removeLineItem: (id) => {
        set((state) => ({
          lineItems: state.lineItems.filter((item) => item.id !== id),
          isDirty: true,
        }));
      },

      setVatEnabled: (enabled) => {
        set({ vatEnabled: enabled, isDirty: true });
      },

      setDiscount: (type, value) => {
        set({ discountType: type, discountValue: value, isDirty: true });
      },

      setNotes: (notes) => {
        set({ notes, isDirty: true });
      },

      loadTemplate: (templateLineItems, templateNotes) => {
        const lineItems = templateLineItems.map((item) => ({
          ...item,
          id: uuidv4(),
          amount: item.quantity * item.unitRate,
        }));
        set({ lineItems, notes: templateNotes, isDirty: true });
      },

      resetQuote: () => {
        set({
          currentQuote: createEmptyQuote(),
          lineItems: [],
          vatEnabled: true,
          vatRate: 0.15,
          discountType: null,
          discountValue: 0,
          notes: '',
          isDirty: false,
        });
      },

      getQuote: () => {
        const state = get();
        const subtotal = calculateSubtotal(state.lineItems);
        const vat = calculateVAT(subtotal, state.vatRate);
        const discount = calculateDiscount(subtotal, vat, state.discountType, state.discountValue);
        const total = calculateTotal(subtotal, vat, discount);

        return {
          ...state.currentQuote,
          lineItems: state.lineItems,
          subtotal,
          vatRate: state.vatRate,
          vatEnabled: state.vatEnabled,
          discountType: state.discountType,
          discountValue: discount,
          total,
          notes: state.notes,
        } as Quote;
      },
    }),
    {
      name: 'qq-quote-storage',
      partialize: (state) => ({
        vatEnabled: state.vatEnabled,
        vatRate: state.vatRate,
        notes: state.notes,
      }),
    }
  )
);