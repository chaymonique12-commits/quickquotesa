import { useState } from 'react';
import { User, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuoteStore } from '../stores/quoteStore';
import { validatePhone, formatPhone } from '../utils/phone';

export function CustomerForm() {
  const { currentQuote, setCustomer } = useQuoteStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [phoneError, setPhoneError] = useState('');

  const customer = currentQuote.customer || { name: '', phone: '', email: '', address: '' };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setCustomer({ phone: formatted });
    if (formatted.length >= 10) {
      if (validatePhone(formatted)) {
        setPhoneError('');
      } else {
        setPhoneError('Please enter a valid SA WhatsApp number');
      }
    } else {
      setPhoneError('');
    }
  };

  return (
    <div className="bg-surface rounded-card border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-text-primary font-heading">Customer Details</span>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={customer.name}
              onChange={(e) => setCustomer({ name: e.target.value })}
              placeholder="Customer name *"
              className="w-full h-12 pl-10 pr-3 rounded-card border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="WhatsApp number *"
              className={`w-full h-12 pl-10 pr-3 rounded-card border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${
                phoneError ? 'border-error ring-2 ring-error/20' : 'border-gray-200 focus:ring-primary'
              }`}
            />
          </div>
          {phoneError && <p className="text-xs text-error -mt-1">{phoneError}</p>}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="email"
              value={customer.email || ''}
              onChange={(e) => setCustomer({ email: e.target.value })}
              placeholder="Email (optional)"
              className="w-full h-12 pl-10 pr-3 rounded-card border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={customer.address || ''}
              onChange={(e) => setCustomer({ address: e.target.value })}
              placeholder="Address (optional)"
              className="w-full h-12 pl-10 pr-3 rounded-card border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}