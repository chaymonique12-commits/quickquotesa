import { Plus, FileText } from 'lucide-react';
import { useQuoteStore } from '../stores/quoteStore';
import { useAppStore } from '../stores/appStore';
import { useTemplateStore } from '../stores/templateStore';
import { Input, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import { LineItemRow } from '../components/LineItemRow';
import { validatePhone, formatPhone } from '../utils/phone';
import { useState } from 'react';
import type { LineItem } from '../types';

export function QuoteBuilder() {
  const { currentQuote, lineItems, vatEnabled, vatRate, discountType, discountValue, notes, setCustomer, addLineItem, setVatEnabled, setDiscount, setNotes } = useQuoteStore();
  const { openPreview } = useAppStore();
  const { addTemplate } = useTemplateStore();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiscount, setShowDiscount] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [phoneValue, setPhoneValue] = useState(currentQuote.customer?.phone || '');
  
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const vat = subtotal * vatRate;
  let discount = 0;
  if (discountType && discountValue > 0) {
    const base = subtotal + vat;
    discount = discountType === 'percent' ? base * (discountValue / 100) : Math.min(discountValue, base);
  }
  const total = subtotal + vat - discount;

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPhoneValue(formatted);
    setCustomer({ phone: formatted });
    
    if (formatted.length >= 10 && !validatePhone(formatted)) {
      setErrors((prev) => ({ ...prev, phone: 'Please enter a valid SA WhatsApp number (e.g. 082 123 4567)' }));
    } else {
      const { phone, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleSaveTemplate = () => {
    if (templateName.trim() && lineItems.length > 0) {
      addTemplate(templateName, lineItems as LineItem[], notes);
      setTemplateName('');
      setShowSaveTemplate(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:ml-64">
      <div className="max-w-lg mx-auto p-4 md:max-w-2xl">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-secondary mb-4">Customer Details</h2>
          <div className="space-y-4">
            <Input label="Customer Name *" value={currentQuote.customer?.name || ''} onChange={(e) => setCustomer({ name: e.target.value })} error={errors.name} />
            <Input label="WhatsApp Number *" type="tel" value={phoneValue} onChange={(e) => handlePhoneChange(e.target.value)} error={errors.phone} />
            <Input label="Email" type="email" value={currentQuote.customer?.email || ''} onChange={(e) => setCustomer({ email: e.target.value })} />
            <Input label="Address" value={currentQuote.customer?.address || ''} onChange={(e) => setCustomer({ address: e.target.value })} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-secondary">Line Items</h2>
            <Button size="sm" variant="ghost" onClick={addLineItem}>
              <Plus size={16} /> Add Item
            </Button>
          </div>
          
          {lineItems.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items yet. Tap "Add Item" to start.</p>
            </div>
          ) : (
            lineItems.map((item) => <LineItemRow key={item.id} item={item} />)
          )}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-mono font-medium">R{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <span className="text-text-secondary">Include VAT (15%)</span>
            <button onClick={() => setVatEnabled(!vatEnabled)} className={`w-12 h-6 rounded-full transition-colors relative ${vatEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${vatEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          
          {vatEnabled && (
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text-secondary">VAT (15%)</span>
              <span className="font-mono">R{vat.toFixed(2)}</span>
            </div>
          )}
          
          <div className="py-2 border-t border-gray-100">
            <button onClick={() => setShowDiscount(!showDiscount)} className="text-sm text-primary font-medium">
              {showDiscount ? '- ' : '+ '} Add Discount
            </button>
            {showDiscount && (
              <div className="mt-2 flex gap-2">
                <select value={discountType || 'percent'} onChange={(e) => setDiscount(e.target.value as 'percent' | 'fixed', discountValue)} className="px-2 py-1 border rounded text-sm">
                  <option value="percent">%</option>
                  <option value="fixed">R</option>
                </select>
                <input type="number" placeholder="0" value={discountValue || ''} onChange={(e) => setDiscount(discountType, parseFloat(e.target.value) || 0)} className="flex-1 px-2 py-1 border rounded text-sm font-mono" />
              </div>
            )}
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between mb-2 text-success text-sm">
              <span>Discount</span>
              <span className="font-mono">-R{discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>TOTAL</span>
            <span className="font-mono text-primary">R{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <Textarea label="Notes / Terms" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, warranty info, etc." />
        </div>

        <div className="space-y-3">
          <Button variant="secondary" className="w-full" onClick={openPreview}>
            <FileText size={18} /> Preview Quote
          </Button>
          
          {lineItems.length > 0 && (
            <Button variant="ghost" className="w-full" onClick={() => setShowSaveTemplate(!showSaveTemplate)}>
              Save as Template
            </Button>
          )}
          
          {showSaveTemplate && (
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex gap-2">
              <Input label="Template Name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="flex-1" />
              <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>Save</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}