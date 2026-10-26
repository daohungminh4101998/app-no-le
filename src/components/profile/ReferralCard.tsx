import React, { useState } from "react";
import { Gift, Copy, Check, Users, Share2 } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { formatVND } from "../../utils/format";

export const ReferralCard: React.FC = () => {
  const { user, showToast } = useAppStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    const code = user?.referralCode || '';
    if (!code) {
      showToast('Chưa tải được mã giới thiệu, vui lòng thử lại', 'error');
      return;
    }
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    showToast(`Đã sao chép mã giới thiệu: ${code}`, "success");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const code = user?.referralCode || '';
    if (!code) {
      showToast('Chưa tải được mã giới thiệu, vui lòng thử lại', 'error');
      return;
    }
    const inviteLink = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    showToast("Đã sao chép link mời bạn bè!", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-5 shadow-card relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-2 relative z-10">
        <span className="p-1.5 rounded-xl bg-white/20 text-white backdrop-blur-md">
          <Gift className="w-4 h-4" />
        </span>
        <span className="text-[10px] font-black tracking-wider uppercase text-amber-100">
          Chương trình giới thiệu Nô Tì
        </span>
      </div>

      <h3 className="text-xl font-black text-white leading-tight mb-1 relative z-10">
        Mời 1 người bạn · Nhận ngay 10.000đ
      </h3>
      <p className="text-xs text-amber-100/90 mb-4 max-w-sm leading-relaxed relative z-10">
        Bạn của bạn nhận ngay voucher 50.000đ khi đăng ký. Bạn nhận 10.000đ tiền
        mặt vào ví ngay sau đơn mua Shopee đầu tiên của họ.
      </p>

      {/* Code Box */}
      <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-3.5 border border-white/25 mb-3 flex items-center justify-between relative z-10 shadow-2xs">
        <div>
          <span className="text-[10px] text-amber-100 uppercase tracking-wider font-semibold block">
            Mã giới thiệu của bạn
          </span>
          <span className="font-mono text-xl font-black tracking-wider text-white">
            {user?.referralCode || '—'}
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-3.5 py-2 bg-white text-orange-600 font-extrabold text-xs rounded-xl shadow-xs hover:bg-amber-50 transition flex items-center gap-1.5 tap-active"
        >
          {copiedCode ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-600" />
              <span>Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* Stats and Share Link Button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/20 relative z-10">
        <div className="flex items-center gap-2 text-xs">
          <Users className="w-4 h-4 text-amber-200" />
          <span>
            Đã mời: <strong className="tabular-nums">{user?.totalReferredCount ?? 0} bạn bè</strong>
          </span>
          <span>·</span>
          <span>
            Đã nhận: <strong className="tabular-nums">{formatVND(user?.totalReferralBonus || 0)}</strong>
          </span>
        </div>

        <button
          onClick={handleCopyLink}
          className="text-xs font-bold text-white bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 tap-active backdrop-blur-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? "Đã sao chép link" : "Gửi link"}</span>
        </button>
      </div>
    </div>
  );
};
