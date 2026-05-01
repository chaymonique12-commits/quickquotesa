import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Banknote, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuoteStore } from '../stores/quoteStore';
import { calculateSubtotal, calculateVAT, calculateDiscount, calculateTotal } from '../utils/quote';

export function Totals() {
  const { lineItems, vatEnabled, vatRate, discountType, discountValue, setVatEnabled, setDiscount } = useQuoteStore();
  const [showDiscount, setShowDiscount] = useState(false);

  const subtotal = calculateSubtotal(lineItems);
  const vat = calculateVAT(subtotal, vatRate);
  const discount = calculateDiscount(subtotal, vat, discountType, discountValue);
  const total = calculateTotal(subtotal, vat, discount);

  return (
    <div className="bg-surface rounded-card border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-mono">R {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">VAT ({(vatRate * 100).toFixed(0)}%)</span>
            <button
              onClick={() => setVatEnabled(!vatEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                vatEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  vatEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          {vatEnabled && (
            <span className="font-mono text-sm">R {vat.toFixed(2)}</span>
          )}
        </div>
        
        <button
          onClick={() => setShowDiscount(!showDiscount)}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
        >
          {showDiscount ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Add Discount
        </button>
        
        {showDiscount && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="pt-2 space-y-2"
          >
            <div className="flex gap-2">
              <button
                onClick={() => setDiscount('percent', discountValue)}
                className={`flex-1 h-9 flex items-center justify-center gap-1 rounded-lg border transition-colors ${
                  discountType === 'percent' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-text-secondary'
                }`}
              >
                <Percent className="w-3 h-3" />
                <span className="text-xs">%</span>
              </button>
              <button
                onClick={() => setDiscount('fixed', discountValue)}
                className={`flex-1 h-9 flex items-center justify-center gap-1 rounded-lg border transition-colors ${
                  discountType === 'fixed' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-text-secondary'
                }`}
              >
                <Banknote className="w-3 h-3" />
                <span className="text-xs">R</span>
              </button>
              {discountType && (
                <button
                  onClick={() => setDiscount(null, 0)}
                  className="h-9 w-9 flex items-center justify-center text-text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {discountType && (
              <input
                type="number"
                value={discountValue || ''}
                onChange={(e) => setDiscount(discountType, parseFloat(e.target.value) || 0)}
                placeholder={discountType === 'percent' ? 'Percentage' : 'Amount'}
                min="0"
                max={discountType === 'percent' ? 100 : undefined}
                className="w-full h-10 px-3 text-sm font-mono text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </motion.div>
        )}
        
        {discount > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Discount</span>
            <span className="font-mono">-R {discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between">
            <span className="font-heading font-bold text-lg text-text-primary">Total</span>
            <span className="font-mono font-bold text-lg text-primary">R {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}