import React from 'react';
import { formatVND } from '../../utils/format';

interface CashbackAmountProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPrefix?: boolean;
  className?: string;
  isPositive?: boolean;
}

export const CashbackAmount: React.FC<CashbackAmountProps> = ({
  amount,
  size = 'md',
  showPrefix = true,
  className = '',
  isPositive,
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-3xl font-extrabold tracking-tight',
  }[size];

  const positive = isPositive !== undefined ? isPositive : amount > 0;
  const colorClass = amount === 0 
    ? 'text-slate-500' 
    : positive 
      ? 'text-brand-600' 
      : 'text-rose-600';

  const prefix = showPrefix ? (positive ? '+' : '-') : '';
  const displayVal = formatVND(Math.abs(amount));

  return (
    <span className={`inline-flex items-baseline tabular-nums ${sizeClasses} ${colorClass} ${className}`}>
      <span>{prefix}</span>
      <span>{displayVal}</span>
    </span>
  );
};
