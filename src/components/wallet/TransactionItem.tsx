import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, XCircle, Gift } from 'lucide-react';
import { CashbackTransaction } from '../../types';
import { formatVND, formatDateTime } from '../../utils/format';

interface TransactionItemProps {
  transaction: CashbackTransaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  const isWithdrawal = transaction.type === 'withdrawal';
  const isPending = transaction.type === 'cashback_pending';
  const isCancelled = transaction.type === 'cashback_cancelled';
  const isReferral = transaction.type === 'referral_bonus';

  const getIcon = () => {
    if (isWithdrawal) {
      return (
        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
          <ArrowUpRight className="w-4.5 h-4.5" />
        </div>
      );
    }
    if (isPending) {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
          <Clock className="w-4.5 h-4.5" />
        </div>
      );
    }
    if (isCancelled) {
      return (
        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0">
          <XCircle className="w-4.5 h-4.5" />
        </div>
      );
    }
    if (isReferral) {
      return (
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
          <Gift className="w-4.5 h-4.5" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-brand-700 border border-emerald-100 flex items-center justify-center shrink-0">
        <ArrowDownLeft className="w-4.5 h-4.5" />
      </div>
    );
  };

  const getAmountColor = () => {
    if (isWithdrawal) return 'text-rose-600';
    if (isCancelled) return 'text-slate-400 line-through';
    if (isPending) return 'text-amber-600';
    return 'text-brand-700';
  };

  const prefix = isWithdrawal ? '-' : isCancelled ? '' : '+';

  return (
    <div className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/70 shadow-2xs transition">
      <div className="flex items-center gap-3 min-w-0">
        {getIcon()}
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {transaction.title}
          </h4>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {transaction.description}
          </p>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            {formatDateTime(transaction.createdAt)}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0 ml-2">
        <span className={`text-xs sm:text-sm font-black block tabular-nums ${getAmountColor()}`}>
          {prefix}
          {formatVND(Math.abs(transaction.amount))}
        </span>
        {isPending && (
          <span className="text-[9px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
            Chờ duyệt
          </span>
        )}
      </div>
    </div>
  );
};
