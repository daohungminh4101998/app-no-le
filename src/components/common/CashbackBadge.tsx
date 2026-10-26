import React from 'react';
import { Coins } from 'lucide-react';
import { formatPercent, formatVND } from '../../utils/format';

interface CashbackBadgeProps {
  rate?: number;
  amount?: number;
  variant?: 'green' | 'orange' | 'outline';
  className?: string;
}

export const CashbackBadge: React.FC<CashbackBadgeProps> = ({
  rate,
  amount,
  variant = 'green',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'orange':
        return 'bg-amber-50 text-amber-900 border-amber-200/90';
      case 'outline':
        return 'bg-white text-brand-700 border-brand-200 shadow-2xs';
      case 'green':
      default:
        return 'bg-emerald-50 text-brand-800 border-emerald-200/80';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-extrabold text-[11px] px-2 py-0.5 rounded-full border shadow-2xs tabular-nums ${getVariantStyles()} ${className}`}
    >
      <Coins className="w-3 h-3 text-amber-500 shrink-0 fill-amber-400" />
      {rate !== undefined && <span>Hoàn {formatPercent(rate)}</span>}
      {rate !== undefined && amount !== undefined && <span className="opacity-40">·</span>}
      {amount !== undefined && <span>+{formatVND(amount)}</span>}
    </span>
  );
};
