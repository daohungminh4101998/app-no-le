import React from 'react';
import { Wallet, ArrowDownRight, Clock, Award, ShieldCheck } from 'lucide-react';
import { WalletBalance } from '../../types';
import { formatVND } from '../../utils/format';

interface WalletSummaryProps {
  balance: WalletBalance;
  onWithdrawClick: () => void;
}

export const WalletSummary: React.FC<WalletSummaryProps> = ({
  balance,
  onWithdrawClick,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-brand-950 to-emerald-950 text-white rounded-brand-xl p-5 shadow-float relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
            Ví tiền hoàn
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bảo chứng 100%</span>
        </div>
      </div>

      {/* Main Available Balance */}
      <div className="mb-5">
        <span className="text-xs text-slate-300 block mb-1">
          Số dư có thể rút ngay
        </span>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatVND(balance.available)}
          </h2>

          <button
            onClick={onWithdrawClick}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-brand-500 hover:from-emerald-600 hover:to-brand-600 active:scale-95 text-white font-extrabold text-sm rounded-brand shadow-cta transition flex items-center gap-1.5 tap-active"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Rút tiền</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-white/10">
        <div className="bg-white/5 rounded-brand p-2.5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Đang chờ xác nhận</span>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-amber-300">
            {formatVND(balance.pending)}
          </p>
        </div>

        <div className="bg-white/5 rounded-brand p-2.5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tổng tiền hoàn</span>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-emerald-300">
            {formatVND(balance.totalCashback)}
          </p>
        </div>
      </div>
    </div>
  );
};
