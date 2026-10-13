import React, { useState } from 'react';
import { Gift, Copy, Check, Users, Share2 } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { formatVND } from '../../utils/format';

export const ReferralCard: React.FC = () => {
  const { user, showToast } = useAppStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(user.referralCode);
    setCopiedCode(true);
    showToast(`Đã sao chép mã giới thiệu: ${user.referralCode}`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/?ref=${user.referralCode}`;
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    showToast('Đã sao chép link mời bạn bè!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white rounded-brand-xl p-5 shadow-float relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-md">
          <Gift className="w-4 h-4" />
        </span>
        <span className="text-xs font-black tracking-wider uppercase text-amber-100">
          Chương trình giới thiệu
        </span>
      </div>

      <h3 className="text-xl font-black text-white leading-tight mb-1">
        Mời 1 người bạn · Nhận ngay 10.000đ
      </h3>
      <p className="text-xs text-amber-100 mb-4 max-w-sm leading-relaxed">
        Bạn của bạn nhận ngay voucher 50.000đ khi đăng ký. Bạn nhận 10.000đ tiền mặt vào ví ngay sau đơn mua Shopee đầu tiên của họ.
      </p>

      {/* Code Box */}
      <div className="bg-white/15 backdrop-blur-md rounded-brand p-3 border border-white/20 mb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-amber-100 uppercase tracking-wider block">
            Mã giới thiệu của bạn
          </span>
          <span className="font-mono text-xl font-black tracking-wider text-white">
            {user.referralCode}
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-3 py-1.5 bg-white text-orange-600 font-extrabold text-xs rounded-lg shadow-sm hover:bg-amber-50 transition flex items-center gap-1 tap-active"
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
      <div className="flex items-center justify-between pt-2 border-t border-white/20">
        <div className="flex items-center gap-2 text-xs">
          <Users className="w-4 h-4 text-amber-200" />
          <span>
            Đã mời: <strong>{user.totalReferredCount} bạn bè</strong>
          </span>
          <span>·</span>
          <span>
            Đã nhận: <strong>{formatVND(user.totalReferralBonus)}</strong>
          </span>
        </div>

        <button
          onClick={handleCopyLink}
          className="text-xs font-bold text-white bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-lg transition flex items-center gap-1 tap-active"
        >
          <Share2 className="w-3 h-3" />
          <span>{copiedLink ? 'Đã sao chép link' : 'Gửi link'}</span>
        </button>
      </div>
    </div>
  );
};
