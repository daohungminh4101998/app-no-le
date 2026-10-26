import React from 'react';

// ─── Status Badge ─────────────────────────────────────────────────────────────
type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  error:   'bg-rose-500/10   text-rose-400   border-rose-500/20',
  info:    'bg-sky-500/10    text-sky-400    border-sky-500/20',
  neutral: 'bg-slate-500/10  text-slate-400  border-slate-500/20',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
}
export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${VARIANT_CLASSES[variant]}`}>
    {label}
  </span>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: 'green' | 'orange' | 'blue' | 'rose' | 'purple';
  badge?: string;
}

const ACCENT_MAP: Record<string, { bg: string; icon: string; badge: string }> = {
  green:  { bg: 'from-brand-600/20  to-brand-700/10',  icon: 'bg-brand-600/20  text-brand-400',  badge: 'bg-brand-600/20  text-brand-300' },
  orange: { bg: 'from-shopee-600/20 to-shopee-600/10', icon: 'bg-shopee-600/20 text-shopee-500', badge: 'bg-shopee-600/20 text-shopee-400' },
  blue:   { bg: 'from-sky-600/20    to-sky-700/10',    icon: 'bg-sky-600/20    text-sky-400',    badge: 'bg-sky-600/20    text-sky-300' },
  rose:   { bg: 'from-rose-600/20   to-rose-700/10',   icon: 'bg-rose-600/20   text-rose-400',   badge: 'bg-rose-600/20   text-rose-300' },
  purple: { bg: 'from-purple-600/20 to-purple-700/10', icon: 'bg-purple-600/20 text-purple-400', badge: 'bg-purple-600/20 text-purple-300' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title, value, subtitle, icon, accent = 'green', badge,
}) => {
  const a = ACCENT_MAP[accent];
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${a.bg} border border-slate-700/50 p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">{title}</p>
          <p className="text-white text-2xl font-bold leading-tight truncate">{value}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.icon}`}>
          {icon}
        </div>
      </div>
      {badge && (
        <div className="mt-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${a.badge}`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
interface SkeletonProps {
  rows?: number;
  className?: string;
}
export const TableSkeleton: React.FC<SkeletonProps> = ({ rows = 6 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 rounded-xl bg-slate-800/60 animate-pulse" />
    ))}
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="h-3 w-24 bg-slate-700 rounded mb-3" />
        <div className="h-7 w-32 bg-slate-700 rounded mb-2" />
        <div className="h-3 w-20 bg-slate-700/60 rounded" />
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-700" />
    </div>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}
export const Pagination: React.FC<PaginationProps> = ({
  page, totalPages, total, limit, onPageChange,
}) => {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-2">
      <p className="text-slate-500 text-xs">{from}–{to} / {total} mục</p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600/20 text-brand-400 border border-brand-600/30">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────
interface SectionCardProps {
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export const SectionCard: React.FC<SectionCardProps> = ({
  title, toolbar, children, className = '',
}) => (
  <div className={`rounded-2xl bg-slate-900 border border-slate-700/50 overflow-hidden ${className}`}>
    {(title || toolbar) && (
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-700/50">
        {title && <h2 className="text-sm font-semibold text-slate-200">{title}</h2>}
        {toolbar && <div className="flex items-center gap-2 shrink-0">{toolbar}</div>}
      </div>
    )}
    <div className="px-5 py-4">{children}</div>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, subtitle }) => (
  <div className="text-center py-14">
    <p className="text-4xl mb-3">{icon}</p>
    <p className="text-slate-300 font-semibold">{title}</p>
    {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'success' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open, title, message, confirmLabel = 'Xác nhận', confirmVariant = 'success',
  loading, onConfirm, onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!loading ? onCancel : undefined} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-slate-100 font-bold text-lg mb-2">{title}</h3>
        <div className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 ${
              confirmVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Formatters ───────────────────────────────────────────────────────────────
export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export const formatDate = (s: string): string => {
  const d = new Date(s);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
