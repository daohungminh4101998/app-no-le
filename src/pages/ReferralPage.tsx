import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { ReferralCard } from '../components/profile/ReferralCard';
import { formatVND } from '../utils/format';
import { ArrowLeft, Users } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  const mockInvitedFriends = [
    {
      id: 1,
      name: 'lananh_98',
      phone: '097***432',
      joinedDate: '30/09/2026',
      status: 'Đã hoàn thành đơn Shopee',
      bonus: 20000,
    },
    {
      id: 2,
      name: 'minhtri_tech',
      phone: '091***890',
      joinedDate: '12/09/2026',
      status: 'Đã hoàn thành đơn Shopee',
      bonus: 10000,
    },
    {
      id: 3,
      name: 'hoang_nam_vlog',
      phone: '098***115',
      joinedDate: '28/08/2026',
      status: 'Đã hoàn thành đơn Shopee',
      bonus: 10000,
    },
    {
      id: 4,
      name: 'thao_my_beauty',
      phone: '093***772',
      joinedDate: '15/08/2026',
      status: 'Đã hoàn thành đơn Shopee',
      bonus: 10000,
    },
    {
      id: 5,
      name: 'duc_anh_gaming',
      phone: '090***654',
      joinedDate: '02/08/2026',
      status: 'Đang chọn sản phẩm',
      bonus: 0,
    },
  ];

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
      <div className="bg-white rounded-brand-xl p-5 border border-slate-200 shadow-soft">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3">
          Cách nhận thưởng 3 bước
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Chia sẻ mã hoặc đường link
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Gửi mã <strong>{user.referralCode}</strong> cho bạn bè qua Messenger, Zalo hoặc mạng xã hội.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Bạn bè đăng ký tài khoản
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Người được giới thiệu nhận ngay voucher 50.000đ chào mừng thành viên mới.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Nhận 10.000đ sau đơn Shopee đầu tiên
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Khi bạn bè hoàn thành đơn hàng đầu tiên qua Hoàn Xu, tiền thưởng tự động cộng vào ví của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invited Friends List */}
      <div className="bg-white rounded-brand-xl p-5 border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-600" />
            Bạn bè đã tham gia ({mockInvitedFriends.length})
          </h3>
          <span className="text-xs font-bold text-brand-700">
            Tổng nhận: +{formatVND(user.totalReferralBonus)}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {mockInvitedFriends.map((friend) => (
            <div key={friend.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">{friend.name}</span>
                <span className="text-[11px] text-slate-400">
                  {friend.phone} · Ngày tham gia: {friend.joinedDate}
                </span>
              </div>

              <div className="text-right">
                {friend.bonus > 0 ? (
                  <span className="font-extrabold text-brand-600 block">
                    +{formatVND(friend.bonus)}
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium block">
                    Chờ đơn hàng
                  </span>
                )}
                <span className="text-[10px] text-slate-400">{friend.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
