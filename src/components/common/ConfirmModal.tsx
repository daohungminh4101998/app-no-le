import React, { useEffect } from 'react';
import { X, LucideIcon, TriangleAlert } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'brand' | 'default';
  icon?: LucideIcon;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'default',
  icon: Icon = TriangleAlert,
  onClose,
  onConfirm,
}) => {
  // Đóng bằng phím ESC + khóa scroll nền khi mở
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconStyle =
    variant === 'danger'
      ? 'bg-rose-100 text-rose-600'
      : variant === 'brand'
        ? 'bg-emerald-100 text-brand-600'
        : 'bg-slate-100 text-slate-600';

  const confirmBtnStyle =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 shadow-[0_4px_12px_rgba(225,29,72,0.35)]'
      : variant === 'brand'
        ? 'bg-brand-600 hover:bg-brand-700 shadow-cta'
        : 'bg-slate-900 hover:bg-slate-800';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-float border border-slate-200/90 text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition tap-active cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs ${iconStyle}`}
        >
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={onClose}
            className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition tap-active cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`h-10 text-white font-bold text-xs rounded-xl transition tap-active cursor-pointer ${confirmBtnStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
