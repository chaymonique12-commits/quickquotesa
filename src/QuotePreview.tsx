import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Send } from 'lucide-react';
import { useQuoteStore } from '../stores/quoteStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAppStore } from '../stores/appStore';
import { useHistoryStore } from '../stores/historyStore';
import { formatDate, validateQuote, formatQuoteForWhatsApp, generateWhatsAppUrl, copyToClipboard } from '../utils/quote';
import { Button } from './Button';

export function QuotePreview() {
  const { isPreviewOpen, closePreview, showToast } = useAppStore();
  const quote = useQuoteStore((state) => state.getQuote());
  const { settings } = useSettingsStore();
  const { addQuote } = useHistoryStore();
  
  const handleSendWhatsApp = async () => {
    const validation = validateQuote(quote);
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    const message = formatQuoteForWhatsApp(quote);
    const whatsappUrl = generateWhatsAppUrl(quote.customer.phone, message);
    
    // Save to history as sent
    addQuote({ ...quote, status: 'sent' });
    
    try {
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened) {
        const copied = await copyToClipboard(message);
        if (copied) {
          showToast('Quote copied! Paste into WhatsApp', 'success');
        } else {
          showToast('Could not open WhatsApp', 'error');
        }
      } else {
        showToast('Opening WhatsApp...', 'success');
      }
    } catch {
      const copied = await copyToClipboard(message);
      if (copied) {
        showToast('Quote copied! Paste into WhatsApp', 'success');
      } else {
        showToast('Could not open WhatsApp', 'error');
      }
    }
  };

  return (
    <AnimatePresence>
      {isPreviewOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-background rounded-t-modal z-50 overflow-hidden flex flex-col md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:rounded-modal"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <h2 className="font-heading font-bold text-lg text-text-primary">Quote Preview</h2>
              <button
                onClick={closePreview}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-surface rounded-card p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  {settings.business.logo && (
                    <img src={settings.business.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-text-primary">
                      {settings.business.name || 'Your Business'}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {settings.business.address && <span>{settings.business.address}<br /></span>}
                      {settings.business.phone && <span>{settings.business.phone}<br /></span>}
                      {settings.business.email && <span>{settings.business.email}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm mb-4 pb-4 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Quote #:</span>
                    <span className="font-mono font-medium">{quote.quoteNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Date:</span>
                    <span>{formatDate(quote.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Valid Until:</span>
                    <span>{formatDate(quote.validUntil)}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs text-text-secondary uppercase tracking-wide mb-1">To:</h4>
                  <p className="font-medium text-text-primary">{quote.customer.name}</p>
                  {quote.customer.address && (
                    <p className="text-sm text-text-secondary">{quote.customer.address}</p>
                  )}
                </div>
                
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-text-secondary font-medium">Item</th>
                      <th className="text-center py-2 text-text-secondary font-medium">Qty</th>
                      <th className="text-right py-2 text-text-secondary font-medium">Rate</th>
                      <th className="text-right py-2 text-text-secondary font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-2 text-text-primary">{item.description}</td>
                        <td className="py-2 text-center font-mono">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">R {item.unitRate.toFixed(2)}</td>
                        <td className="py-2 text-right font-mono">R {item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="space-y-1 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-mono">R {quote.subtotal.toFixed(2)}</span>
                  </div>
                  {quote.vatEnabled && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">VAT ({(quote.vatRate * 100).toFixed(0)}%)</span>
                      <span className="font-mono">R {(quote.subtotal * quote.vatRate).toFixed(2)}</span>
                    </div>
                  )}
                  {quote.discountValue > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span className="font-mono">-R {quote.discountValue.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="font-mono text-primary">R {quote.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {quote.notes && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs text-text-secondary uppercase tracking-wide mb-1">Notes</h4>
                    <p className="text-sm text-text-primary whitespace-pre-wrap">{quote.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
              <Button variant="secondary" onClick={closePreview} className="flex-1">
                <FileText className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="primary" onClick={handleSendWhatsApp} className="flex-1 bg-whatsapp hover:bg-whatsapp/90">
                <Send className="w-4 h-4" />
                Send via WhatsApp
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}