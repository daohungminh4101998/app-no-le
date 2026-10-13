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
    <div className="relative flex bg-white rounded-brand border border-slate-200 shadow-soft overflow-hidden">
      {/* Left voucher coupon stub */}
      <div className="w-24 shrink-0 bg-gradient-to-br from-amber-500 to-orange-500 p-3 text-white flex flex-col justify-between items-center text-center relative border-r border-dashed border-white/60">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded">
          {voucher.tag.split(' ')[0]}
        </span>
        <div className="my-1">
          <Ticket className="w-6 h-6 mx-auto mb-1 opacity-90" />
          <span className="text-sm font-black leading-tight block">
            {voucher.discountValue}
          </span>
        </div>
        <span className="text-[9px] font-semibold text-white/90">
          Đơn từ {formatVND(voucher.minSpend)}
        </span>

        {/* Decorative notch cutouts */}
        <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-slate-100" />
        <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-slate-100" />
      </div>

      {/* Right details */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${getTagColor(
                voucher.tag
              )}`}
            >
              {voucher.tag}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>HSD: {formatDate(voucher.expiryDate, 'DD/MM')}</span>
            </div>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
            {voucher.title}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
            {voucher.description}
          </p>
        </div>

        {/* Action row with usage progress */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${voucher.claimedPercent}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Đã dùng {voucher.claimedPercent}%
            </span>
          </div>

          {/* Claim / Copy button */}
          <button
            onClick={handleCopyOrClaim}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 tap-active shrink-0 ${
              isClaimed
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-shopee-primary text-white hover:bg-shopee-600 shadow-sm'
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
