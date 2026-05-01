import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

export function ToastContainer() {
  const { toasts, dismissToast } = useAppStore();

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-success text-white' :
            toast.type === 'error' ? 'bg-error text-white' :
            'bg-secondary text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <AlertCircle size={20} />}
          {toast.type === 'info' && <Info size={20} />}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="p-1">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}