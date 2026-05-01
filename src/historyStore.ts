import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote } from '../types';

interface HistoryState {
  quotes: Quote[];
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  updateQuoteStatus: (id: string, status: Quote['status'], queryNote?: string) => void;
  getQuoteById: (id: string) => Quote | undefined;
  deleteQuote: (id: string) => void;
  searchQuotes: (query: string) => Quote[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      quotes: [],

      addQuote: (quote) => {
        set((state) => ({
          quotes: [quote, ...state.quotes],
        }));
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        }));
      },

      updateQuoteStatus: (id, status, queryNote) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id
              ? {
                  ...q,
                  status,
                  ...(queryNote !== undefined ? { queryNote, queryNoteTimestamp: new Date().toISOString() } : {}),
                }
              : q
          ),
        }));
      },

      getQuoteById: (id) => {
        return get().quotes.find((q) => q.id === id);
      },

      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        }));
      },

      searchQuotes: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().quotes.filter(
          (q) =>
            q.customer.name.toLowerCase().includes(lowerQuery) ||
            q.quoteNumber.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'qq-history-storage',
    }
  )
);
