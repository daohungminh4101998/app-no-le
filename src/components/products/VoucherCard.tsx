import React, { useState } from 'react';
import { Ticket, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { Voucher } from '../../types';
import { formatVND, formatDate } from '../../utils/format';
import { useAppStore } from '../../stores/useAppStore';

interface VoucherCardProps {
  voucher: Voucher;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({ voucher }) => {
  const { claimedVoucherIds, claimVoucher, showToast } = useAppStore();
  const [copied, setCopied] = useState(false);

  const isClaimed = claimedVoucherIds.includes(voucher.id);

  const handleCopyOrClaim = () => {
    claimVoucher(voucher.id);
    navigator.clipboard?.writeText(voucher.code);
    setCopied(true);
    showToast(`Đã lưu mã ${voucher.code} và sao chép vào bộ nhớ!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Freeship Xtra':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Hoàn Xu Xtra':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Shopee Live':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="relative flex bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200 hover:shadow-card hover:border-slate-300">
      {/* Left voucher coupon stub */}
      <div className="w-24 sm:w-26 shrink-0 bg-gradient-to-br from-amber-500 to-orange-500 p-3 text-white flex flex-col justify-between items-center text-center relative border-r border-dashed border-white/60">
        <span className="text-[9px] font-black uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-xs">
          {voucher.tag.split(' ')[0]}
        </span>
        <div className="my-1">
          <Ticket className="w-5 h-5 mx-auto mb-1 opacity-90" />
          <span className="text-sm sm:text-base font-black leading-tight block tracking-tight">
            {voucher.discountValue}
          </span>
        </div>
        <span className="text-[9px] font-semibold text-white/90 tabular-nums">
          Đơn từ {formatVND(voucher.minSpend)}
        </span>

        {/* Decorative notch cutouts */}
        <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-slate-50 border-b border-l border-slate-200/80" />
        <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-slate-50 border-t border-l border-slate-200/80" />
      </div>

      {/* Right details */}
      <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${getTagColor(
                voucher.tag
              )}`}
            >
              {voucher.tag}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>HSD: {formatDate(voucher.expiryDate, 'DD/MM')}</span>
            </div>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
            {voucher.title}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
            {voucher.description}
          </p>
        </div>

        {/* Action row with usage progress */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2.5">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${voucher.claimedPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium tabular-nums">
              Đã dùng {voucher.claimedPercent}%
            </span>
          </div>

          {/* Claim / Copy button */}
          <button
            onClick={handleCopyOrClaim}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 tap-active shrink-0 shadow-2xs ${
              isClaimed
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-[#EE4D2D] text-white hover:bg-[#D73211]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-brand-700">Đã chép</span>
              </>
            ) : isClaimed ? (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép mã</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>Lưu mã</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
