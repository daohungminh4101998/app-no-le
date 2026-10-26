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
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
  };

  const styleConfigs = {
    success: 'border-emerald-200/90 bg-white/95 text-slate-800 shadow-card-hover',
    error: 'border-rose-200/90 bg-white/95 text-slate-800 shadow-card-hover',
    info: 'border-blue-200/90 bg-white/95 text-slate-800 shadow-card-hover',
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all duration-200 animate-in fade-in slide-in-from-top-2">
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${styleConfigs[toast.type]}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-lg bg-slate-50 shrink-0">
            {icons[toast.type]}
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={hideToast}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition tap-active shrink-0 cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
