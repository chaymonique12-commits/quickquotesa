import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useHistoryStore } from '../stores/historyStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { Quote } from '../types';

const CURRENCY_SYMBOLS: Record<string, string> = {
  ZAR: 'R',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const CURRENCY_LOCALES: Record<string, string> = {
  ZAR: 'en-ZA',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
};

function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? 'R';
  const locale = CURRENCY_LOCALES[currency] ?? 'en-ZA';
  return `${symbol} ${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat(navigator.language, { dateStyle: 'long' }).format(new Date(dateStr));
}

export function ClientPortal() {
  const { uuid } = useParams<{ uuid: string }>();
  const { quotes } = useHistoryStore();
  const { settings } = useSettingsStore();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [queryNote, setQueryNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [portalCurrency, setPortalCurrency] = useState(settings.primaryCurrency || 'ZAR');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const found = quotes.find((q) => q.id === uuid);
    if (found) {
      setQuote(found);
      if (found.signature) setSignature(found.signature);
      if (found.status === 'accepted') setSubmitted(true);
    } else {
      setNotFound(true);
    }
  }, [uuid, quotes]);

  const handleAccept = () => {
    if (!quote || !signature) return;
    const { updateQuoteStatus } = useHistoryStore.getState();
    updateQuoteStatus(quote.id, 'accepted');
    setSubmitted(true);
  };

  const handleQuerySubmit = () => {
    if (!quote || !queryNote.trim()) return;
    const { updateQuoteStatus } = useHistoryStore.getState();
    updateQuoteStatus(quote.id, 'queried', queryNote);
    setShowQuery(false);
    setSubmitted(true);
  };

  // Signature canvas drawing
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPosRef.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosRef.current = { x, y };
  };

  const endDraw = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) setSignature(canvas.toDataURL('image/png'));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-[#ef4444] mb-4" />
        <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">Quote Not Found</h1>
        <p className="text-[#94a3b8]">This link may be invalid or expired.</p>
      </div>
    );
  }

  if (!quote) return null;

  const subtotal = quote.subtotal;
  const vat = quote.vatEnabled ? subtotal * quote.vatRate : 0;
  const discount = quote.discountValue || 0;
  const total = quote.total;

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      {/* Confetti overlay on accept */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: ['#fbbf24', '#22c55e', '#f59e0b', '#25D366'][Math.floor(Math.random() * 4)],
                }}
                initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: window.innerHeight + 20,
                  x: (Math.random() - 0.5) * 200,
                  rotate: Math.random() * 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur border-b border-[#334155] px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#fbbf24]" />
            <span className="text-sm font-medium text-[#fbbf24]">Verified Business</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Currency toggle */}
        <div className="flex justify-end mb-4">
          <select
            value={portalCurrency}
            onChange={(e) => setPortalCurrency(e.target.value as 'ZAR' | 'USD' | 'EUR' | 'GBP')}
            className="px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155] text-[#f8fafc] text-sm"
          >
            <option value="ZAR">R ZAR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        {/* Business brand header */}
        <div className="text-center mb-8">
          {settings.business.logo && (
            <img src={settings.business.logo} alt="Logo" className="w-16 h-16 rounded-xl mx-auto mb-3 object-contain" />
          )}
          <h1 className="text-xl font-bold">{settings.business.name || 'QuickQuote SA'}</h1>
          {settings.business.physicalAddress && (
            <p className="text-sm text-[#94a3b8] mt-1">{settings.business.physicalAddress}</p>
          )}
          {settings.business.companyRegNumber && (
            <p className="text-xs text-[#64748b] mt-0.5">Reg: {settings.business.companyRegNumber}</p>
          )}
        </div>

        {/* Quote card */}
        <div className="rounded-2xl bg-[#1e293b] border border-[#334155] overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-[#334155]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#64748b] uppercase tracking-wider">Quote</p>
                <p className="text-lg font-bold font-mono">{quote.quoteNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748b]">Valid Until</p>
                <p className="text-sm font-medium">{formatDate(quote.validUntil)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#94a3b8]">Prepared for</p>
                <p className="font-semibold">{quote.customer?.name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                quote.status === 'accepted' ? 'bg-[#22c55e]/20 text-[#22c55e]' :
                quote.status === 'queried' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                quote.status === 'paid' ? 'bg-[#22c55e]/20 text-[#22c55e]' :
                'bg-[#fbbf24]/20 text-[#fbbf24]'
              }`}>
                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Line items */}
          <div className="px-5 py-4 space-y-3">
            {quote.lineItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-[#94a3b8] text-xs">{item.quantity} × {formatCurrency(item.unitRate, portalCurrency)}</p>
                </div>
                <p className="font-mono font-medium">{formatCurrency(item.amount, portalCurrency)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-5 py-4 border-t border-[#334155] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#94a3b8]">Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal, portalCurrency)}</span>
            </div>
            {quote.vatEnabled && (
              <div className="flex justify-between text-sm">
                <span className="text-[#94a3b8]">{settings.vatLabel || 'VAT'} ({(quote.vatRate * 100).toFixed(0)}%)</span>
                <span className="font-mono">{formatCurrency(vat, portalCurrency)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-[#22c55e]">
                <span>Discount</span>
                <span className="font-mono">-{formatCurrency(discount, portalCurrency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#334155]">
              <span>Total</span>
              <span className="font-mono text-[#fbbf24]">{formatCurrency(total, portalCurrency)}</span>
            </div>
            {portalCurrency !== settings.primaryCurrency && (
              <p className="text-xs text-[#64748b] text-right">Indicative rate only</p>
            )}
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="px-5 py-4 border-t border-[#334155]">
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-[#94a3b8]">{quote.notes}</p>
            </div>
          )}

          {/* Signature */}
          {signature && (
            <div className="px-5 py-4 border-t border-[#334155]">
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-2">Client Signature</p>
              <img src={signature} alt="Signature" className="h-16 bg-white rounded-lg p-2" />
            </div>
          )}

          {/* Query note */}
          {quote.queryNote && (
            <div className="px-5 py-4 border-t border-[#334155] bg-[#f59e0b]/5">
              <p className="text-xs text-[#f59e0b] uppercase tracking-wider mb-1">Client Query</p>
              <p className="text-sm text-[#f8fafc]">{quote.queryNote}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!submitted && quote.status === 'draft' || quote.status === 'sent' ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowAccept(true)}
              className="w-full py-4 rounded-xl bg-[#fbbf24] text-[#0f172a] font-bold text-lg hover:bg-[#d97706] transition-colors"
            >
              Approve & Sign
            </button>
            <button
              onClick={() => setShowQuery(true)}
              className="w-full py-3 rounded-xl border border-[#334155] text-[#94a3b8] font-medium hover:border-[#fbbf24]/40 hover:text-[#f8fafc] transition-colors"
            >
              Request Change
            </button>
          </div>
        ) : submitted || quote.status === 'accepted' || quote.status === 'queried' ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="text-[#22c55e] mx-auto mb-2" />
            <p className="font-bold text-lg">
              {quote.status === 'accepted' ? 'Quote Approved!' : 'Change Requested'}
            </p>
            <p className="text-sm text-[#94a3b8] mt-1">
              {quote.status === 'accepted' ? 'Thank you for your approval.' : 'The business has been notified.'}
            </p>
          </div>
        ) : null}

        {/* Professional footer */}
        <div className="mt-8 pt-6 border-t border-[#334155] space-y-1">
          {settings.business.phone && <p className="text-sm text-[#94a3b8]">📞 {settings.business.phone}</p>}
          {settings.business.email && <p className="text-sm text-[#94a3b8]">✉️ {settings.business.email}</p>}
          {settings.business.address && <p className="text-sm text-[#94a3b8]">📍 {settings.business.address}</p>}
          <div className="mt-3 pt-3 border-t border-[#334155]">
            <p className="text-xs text-[#64748b]">Payment Details</p>
            <p className="text-xs text-[#64748b]">Bank: {settings.bankingDetails?.bankName || '—'}</p>
            <p className="text-xs text-[#64748b]">Account: {settings.bankingDetails?.accountNumber || '—'}</p>
            <p className="text-xs text-[#64748b]">Branch: {settings.bankingDetails?.branchCode || '—'}</p>
            <p className="text-xs text-[#64748b] mt-2">Please use Quote Number as reference for payment.</p>
          </div>
        </div>
      </main>

      {/* Accept Modal */}
      <AnimatePresence>
        {showAccept && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !signature && setShowAccept(false)}
          >
            <motion.div
              className="w-full max-w-md bg-[#1e293b] rounded-t-3xl md:rounded-2xl border-t md:border border-[#334155] p-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-1">Approve & Sign</h2>
              <p className="text-sm text-[#94a3b8] mb-4">Draw your signature below to approve this quote.</p>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full max-w-[400px] h-[200px] rounded-xl bg-[#0f172a] border border-[#334155] cursor-crosshair touch-none mx-auto block"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <button onClick={clearSignature} className="mt-2 text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors block mx-auto">
                Clear
              </button>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowAccept(false)}
                  className="flex-1 py-3 rounded-xl border border-[#334155] text-[#94a3b8] font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!signature}
                  className="flex-1 py-3 rounded-xl bg-[#fbbf24] text-[#0f172a] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Approval
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Query Modal */}
      <AnimatePresence>
        {showQuery && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuery(false)}
          >
            <motion.div
              className="w-full max-w-md bg-[#1e293b] rounded-t-3xl md:rounded-2xl border-t md:border border-[#334155] p-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-1">Request a Change</h2>
              <p className="text-sm text-[#94a3b8] mb-4">Let us know what needs to be adjusted.</p>
              <textarea
                value={queryNote}
                onChange={(e) => setQueryNote(e.target.value)}
                placeholder="e.g. Can you reduce the quantity on item 2?"
                className="w-full h-28 px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-[#f8fafc] placeholder:text-[#64748b] resize-none focus:outline-none focus:border-[#fbbf24]"
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowQuery(false)}
                  className="flex-1 py-3 rounded-xl border border-[#334155] text-[#94a3b8] font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuerySubmit}
                  disabled={!queryNote.trim()}
                  className="flex-1 py-3 rounded-xl bg-[#fbbf24] text-[#0f172a] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
