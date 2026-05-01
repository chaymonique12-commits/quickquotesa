import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, Business, BankingDetails } from '../types';

const defaultSettings: Settings = {
  business: {
    name: '',
    phone: '',
    email: '',
    address: '',
    logo: '',
    companyRegNumber: '',
    physicalAddress: '',
  },
  bankingDetails: {
    bankName: '',
    accountNumber: '',
    branchCode: '',
  },
  defaultVatRate: 0.15,
  defaultValidityDays: 30,
  defaultNotes: '',
  accentColor: '#fbbf24',
  primaryCurrency: 'ZAR',
  baseCurrencyEnabled: false,
  baseCurrency: 'USD',
  exchangeRate: 0.055,
  vatLabel: 'VAT',
};

interface SettingsState {
  settings: Settings;
  updateBusiness: (updates: Partial<Business>) => void;
  updateBankingDetails: (updates: Partial<BankingDetails>) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateBusiness: (updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            business: { ...state.settings.business, ...updates },
          },
        }));
      },

      updateBankingDetails: (updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            bankingDetails: { ...state.settings.bankingDetails, ...updates },
          },
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: 'qq-settings-storage',
    }
  )
);
