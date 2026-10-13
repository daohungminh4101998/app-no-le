import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useAppStore();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show, hideToast]);

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    info: 'border-blue-200 bg-blue-50/95 text-blue-950',
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all duration-300 transform translate-y-0">
      <div
        className={`flex items-center justify-between p-3.5 rounded-brand border shadow-lg backdrop-blur-md ${borderColors[toast.type]}`}
      >
        <div className="flex items-center gap-2.5">
          {icons[toast.type]}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
        <button
          onClick={hideToast}
          className="p-1 rounded-full hover:bg-black/5 text-slate-500 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
