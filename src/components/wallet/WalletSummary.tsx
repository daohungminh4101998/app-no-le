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
    <div className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-card border border-slate-800/80 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
            Ví tiền hoàn
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bảo chứng 100%</span>
        </div>
      </div>

      {/* Main Available Balance */}
      <div className="mb-5">
        <span className="text-xs text-slate-400 font-medium block mb-1">
          Số dư có thể rút ngay
        </span>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
            {formatVND(balance.available)}
          </h2>

          <button
            onClick={onWithdrawClick}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-cta transition flex items-center gap-1.5 tap-active cursor-pointer"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Rút tiền</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-white/10">
        <div className="bg-white/[0.05] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Đang chờ duyệt</span>
          </div>
          <p className="text-sm sm:text-base font-black text-amber-300 tabular-nums">
            {formatVND(balance.pending)}
          </p>
        </div>

        <div className="bg-white/[0.05] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1 font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tổng tích lũy</span>
          </div>
          <p className="text-sm sm:text-base font-black text-emerald-300 tabular-nums">
            {formatVND(balance.totalCashback)}
          </p>
        </div>
      </div>
    </div>
  );
};
