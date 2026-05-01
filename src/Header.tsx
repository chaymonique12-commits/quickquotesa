import { Plus } from 'lucide-react';
import { useQuoteStore } from '../stores/quoteStore';

export function Header() {
  const { resetQuote } = useQuoteStore();

  const handleNewQuote = () => {
    resetQuote();
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-100 z-30">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto md:max-w-2xl md:ml-64">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">QQ</span>
          </div>
          <h1 className="font-heading font-bold text-lg text-secondary">QuickQuote SA</h1>
        </div>
        <button
          onClick={handleNewQuote}
          className="flex items-center gap-1.5 px-3 py-2 text-primary hover:bg-orange-50 rounded-lg transition-colors touch-manipulation min-h-touch"
        >
          <Plus size={20} />
          <span className="font-medium text-sm hidden sm:inline">New Quote</span>
        </button>
      </div>
    </header>
  );
}