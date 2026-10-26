import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { ReferralCard } from '../components/profile/ReferralCard';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate, formatVND } from '../utils/format';
import { isAuthenticated } from '../services/api';
import { ArrowLeft, Users } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, referrals, fetchReferrals, refreshUserProfile } = useAppStore();
  const [loading, setLoading] = useState(true);

  const isAuth = isAuthenticated();

  // Lấy dữ liệu thật từ API: hồ sơ người dùng + danh sách bạn bè đã giới thiệu
  useEffect(() => {
    if (!isAuth) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([refreshUserProfile(), fetchReferrals()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuth, refreshUserProfile, fetchReferrals]);

  return (
    <div className="space-y-4 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 tap-active"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>

      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Mời bạn bè nhận thưởng
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Càng nhiều bạn bè tham gia, tiền thưởng vào ví càng nhiều
        </p>
      </div>

      {/* Main Referral Card */}
      <ReferralCard />

      {/* 3 Step Explanation */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide mb-4">
          Cách nhận thưởng 3 bước
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              1
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Chia sẻ mã hoặc đường link
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Gửi mã <strong className="font-mono text-slate-700">{user?.referralCode || '—'}</strong> cho bạn bè qua Messenger, Zalo hoặc mạng xã hội.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              2
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Bạn bè đăng ký tài khoản
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Người được giới thiệu nhận ngay voucher 50.000đ chào mừng thành viên mới.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              3
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Nhận 10.000đ sau đơn Shopee đầu tiên
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Khi bạn bè hoàn thành đơn hàng đầu tiên qua Nô Tì, tiền thưởng tự động cộng vào ví của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invited Friends List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-brand-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </span>
            <span>Bạn bè đã tham gia ({referrals.length})</span>
          </h3>
          <span className="text-xs font-black text-brand-700 tabular-nums">
            Tổng nhận: +{formatVND(user?.totalReferralBonus || 0)}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-2.5 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : referrals.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Chưa có bạn bè nào tham gia"
            description="Chia sẻ mã giới thiệu của bạn để nhận 10.000đ cho mỗi bạn bè có đơn Shopee đầu tiên."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {referrals.map((friend) => (
              <div key={friend.id} className="py-3 flex items-center justify-between text-xs">
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 block truncate">{friend.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {friend.phone || friend.email} · Ngày tham gia: {formatDate(friend.createdAt)}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  {friend.bonus > 0 ? (
                    <span className="font-extrabold text-brand-600 block tabular-nums">
                      +{formatVND(friend.bonus)}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium block">
                      Chờ đơn hàng
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {friend.status === 'BONUS_PAID' ? 'Đã nhận thưởng' : 'Đã đăng ký'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
