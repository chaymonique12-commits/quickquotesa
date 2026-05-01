import { create } from 'zustand';
import type { TabType } from '../types';

interface AppState {
  activeTab: TabType;
  isPreviewOpen: boolean;
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  
  setActiveTab: (tab: TabType) => void;
  openPreview: () => void;
  closePreview: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'builder',
  isPreviewOpen: false,
  toasts: [],

  setActiveTab: (tab) => set({ activeTab: tab }),

  openPreview: () => set({ isPreviewOpen: true }),
  closePreview: () => set({ isPreviewOpen: false }),

  showToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));