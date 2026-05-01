import { Search, Send, FileText } from 'lucide-react';
import { useHistoryStore } from '../stores/historyStore';
import { useQuoteStore } from '../stores/quoteStore';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/Button';
import { formatQuoteForWhatsApp, generateWhatsAppUrl, copyToClipboard } from '../utils/quote';
import { useState } from 'react';
import type { Quote } from '../types';

export function History() {
  const { quotes, searchQuotes } = useHistoryStore();
  const { loadTemplate, setCustomer, setNotes } = useQuoteStore();
  const { setActiveTab, showToast } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  
  const filteredQuotes = searchQuery ? searchQuotes(searchQuery) : quotes;

  const handleResend = async (quote: Quote) => {
    const message = formatQuoteForWhatsApp(quote);
    const url = generateWhatsAppUrl(quote.customer.phone, message);
    const opened = window.open(url, '_blank');
    
    if (!opened) {
      const copied = await copyToClipboard(message);
      showToast(copied ? 'Quote copied! Paste into WhatsApp' : 'Could not open WhatsApp', copied ? 'success' : 'error');
    }
  };

  const handleEditQuote = (quote: Quote) => {
    loadTemplate(quote.lineItems, quote.notes);
    setCustomer(quote.customer);
    setNotes(quote.notes);
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:ml-64">
      <div className="max-w-lg mx-auto p-4 md:max-w-2xl">
        <h1 className="font-bold text-2xl text-secondary mb-1">History</h1>
        <p className="text-text-secondary text-sm mb-6">View and resend your past quotes</p>

        {quotes.length > 0 && (
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input type="text" placeholder="Search by customer name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-primary" />
          </div>
        )}

        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <h3 className="font-semibold text-lg text-secondary mb-2">No quotes yet</h3>
            <p className="text-text-secondary text-sm mb-4">Your sent quotes will appear here.</p>
            <Button onClick={() => setActiveTab('builder')}>Create Quote</Button>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p>No quotes found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <button onClick={() => setSelectedQuoteId(selectedQuoteId === quote.id ? null : quote.id)} className="w-full p-4 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-secondary truncate">{quote.customer.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${quote.status === 'sent' ? 'bg-success/10 text-success' : 'bg-gray-100 text-text-secondary'}`}>
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs">{quote.quoteNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-primary">R{quote.total.toFixed(2)}</p>
                  </div>
                </button>
                
                {selectedQuoteId === quote.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEditQuote(quote)}>Edit</Button>
                      <Button size="sm" className="bg-whatsapp" onClick={() => handleResend(quote)}><Send size={14} /> Resend</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}