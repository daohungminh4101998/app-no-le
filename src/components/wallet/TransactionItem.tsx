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
        <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      );
    }
    if (isPending) {
      return (
        <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      );
    }
    if (isCancelled) {
      return (
        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
      );
    }
    if (isReferral) {
      return (
        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center shrink-0">
        <ArrowDownLeft className="w-5 h-5" />
      </div>
    );
  };

  const getAmountColor = () => {
    if (isWithdrawal) return 'text-rose-600';
    if (isCancelled) return 'text-slate-400 line-through';
    if (isPending) return 'text-amber-600';
    return 'text-brand-600';
  };

  const prefix = isWithdrawal ? '-' : isCancelled ? '' : '+';

  return (
    <div className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 rounded-brand border border-slate-100 transition">
      <div className="flex items-center gap-3 min-w-0">
        {getIcon()}
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
            {transaction.title}
          </h4>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {transaction.description}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {formatDateTime(transaction.createdAt)}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0 ml-2">
        <span className={`text-sm sm:text-base font-extrabold block ${getAmountColor()}`}>
          {prefix}
          {formatVND(Math.abs(transaction.amount))}
        </span>
        {isPending && (
          <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Chờ duyệt
          </span>
        )}
      </div>
    </div>
  );
};
