import { Minus, Plus, Trash2 } from 'lucide-react';
import { useQuoteStore } from '../stores/quoteStore';
import type { LineItem } from '../types';

interface LineItemRowProps {
  item: LineItem;
}

export function LineItemRow({ item }: LineItemRowProps) {
  const { updateLineItem, removeLineItem } = useQuoteStore();

  return (
    <div className="bg-surface rounded-card p-3 mb-2 border border-gray-100">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={item.description}
          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
          placeholder="Service description"
          className="flex-1 h-10 px-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          onClick={() => removeLineItem(item.id)}
          className="h-10 w-10 flex items-center justify-center text-text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] text-text-secondary block mb-1">Qty</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateLineItem(item.id, 'quantity', Math.max(0, item.quantity - 1))}
              className="h-8 w-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
              min="0"
              className="w-12 h-8 text-center text-sm font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => updateLineItem(item.id, 'quantity', item.quantity + 1)}
              className="h-8 w-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <label className="text-[10px] text-text-secondary block mb-1">Rate (R)</label>
          <input
            type="number"
            value={item.unitRate || ''}
            onChange={(e) => updateLineItem(item.id, 'unitRate', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full h-8 px-2 text-sm font-mono text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex-1">
          <label className="text-[10px] text-text-secondary block mb-1">Amount</label>
          <div className="h-8 px-2 flex items-center justify-end font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg">
            R {item.amount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}