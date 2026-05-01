import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Template, LineItem } from '../types';

interface TemplateState {
  templates: Template[];
  addTemplate: (name: string, lineItems: LineItem[], defaultNotes: string) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  renameTemplate: (id: string, name: string) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set) => ({
      templates: [],

      addTemplate: (name, lineItems, defaultNotes) => {
        const template: Template = {
          id: uuidv4(),
          name,
          lineItems: lineItems.map(({ description, quantity, unitRate, amount }) => ({
            description,
            quantity,
            unitRate,
            amount,
          })),
          defaultNotes,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          templates: [template, ...state.templates],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },

      renameTemplate: (id, name) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, name } : t
          ),
        }));
      },
    }),
    {
      name: 'qq-template-storage',
    }
  )
);