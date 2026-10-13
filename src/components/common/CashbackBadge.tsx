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
        return 'bg-amber-500/10 text-amber-700 border-amber-300';
      case 'outline':
        return 'bg-white text-brand-700 border-brand-200';
      case 'green':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full border shadow-2xs ${getVariantStyles()} ${className}`}
    >
      <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-400" />
      {rate !== undefined && <span>Hoàn {formatPercent(rate)}</span>}
      {rate !== undefined && amount !== undefined && <span>·</span>}
      {amount !== undefined && <span>+{formatVND(amount)}</span>}
    </span>
  );
};
