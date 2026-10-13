import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { formatVND } from '../utils/format';
import { ReferralCard } from '../components/profile/ReferralCard';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  ShoppingBag,
  Wallet,
  CreditCard,
  Users,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  PhoneCall,
  LogOut,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, wallet, resetAllData, logout, showToast } = useAppStore();
  const [showSupport, setShowSupport] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirmResetData = () => {
    resetAllData();
    setShowResetModal(false);
    showToast('Đã đặt lại dữ liệu mặc định!', 'info');
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    showToast('Đã đăng xuất thành công!', 'info');
    navigate('/');
  };

  const menuItems = [
    {
      to: '/orders',
      icon: ShoppingBag,
      title: 'Đơn hàng & Tiền hoàn',
      badge: 'Theo dõi đơn',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      to: '/wallet',
      icon: Wallet,
      title: 'Ví tiền hoàn & Rút tiền',
      badge: `${formatVND(wallet.available)}`,
      badgeColor: 'text-brand-700 bg-emerald-100',
      color: 'text-brand-600 bg-emerald-50',
    },
    {
      to: '/withdraw',
      icon: CreditCard,
      title: 'Phương thức nhận tiền',
      badge: 'MB Bank, MoMo',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      to: '/referral',
      icon: Users,
      title: 'Giới thiệu bạn bè',
      badge: '+10.000đ/bạn',
      badgeColor: 'text-purple-700 bg-purple-100',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-brand-xl p-5 border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3.5 mb-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500/30 shadow-sm"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {user.name}
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 uppercase tracking-wider">
                {user.memberTier}
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate">{user.phone}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Quick balance banner */}
        <div className="bg-slate-50 rounded-brand p-3 border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">
              Tổng tích lũy Hoàn Xu
            </span>
            <span className="text-lg font-black text-brand-700">
              {formatVND(wallet.totalCashback)}
            </span>
          </div>

          <Link
            to="/wallet"
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-sm transition tap-active"
          >
            Rút tiền ngay
          </Link>
        </div>
      </div>

      {/* Referral Banner */}
      <ReferralCard />

      {/* Main Navigation Menu */}
      <div className="bg-white rounded-brand-xl border border-slate-200 shadow-soft divide-y divide-slate-100 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition tap-active"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-800 truncate">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.badge && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secondary Settings & Support */}
      <div className="bg-white rounded-brand-xl border border-slate-200 shadow-soft divide-y divide-slate-100 overflow-hidden">
        <button
          onClick={() => setShowSupport(!showSupport)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition tap-active text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">
                Trung tâm Hỗ trợ & FAQ
              </span>
              <span className="text-[11px] text-slate-400">
                Giải đáp thắc mắc về đối soát tiền hoàn
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {showSupport && (
          <div className="p-4 bg-slate-50 space-y-3 text-xs text-slate-600 border-t border-slate-100">
            <div>
              <p className="font-bold text-slate-800 mb-1">
                ❓ Bao lâu thì tiền hoàn về ví có thể rút?
              </p>
              <p className="text-slate-500">
                Thường từ 7 đến 15 ngày sau khi bạn nhận hàng thành công và hết hạn đổi trả của Shopee.
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">
                ❓ Có bị mất mã giảm giá Shopee khi mua qua link không?
              </p>
              <p className="text-slate-500">
                Không. Bạn vẫn áp mã Shopee, ShopeePay, Freeship Xtra bình thường và nhận thêm tiền hoàn song song.
              </p>
            </div>
            <div className="pt-2 flex gap-2">
              <a
                href="tel:19001000"
                className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-700 flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Hotline 1900 1000
              </a>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition tap-active text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">
                Đặt lại dữ liệu dùng thử
              </span>
              <span className="text-[11px] text-slate-400">
                Khôi phục các đơn hàng & số dư prototype ban đầu
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="w-full flex items-center justify-center gap-2 p-3.5 bg-white rounded-brand-xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition tap-active shadow-soft"
      >
        <LogOut className="w-5 h-5" />
        Đăng xuất
      </button>

      {/* App Version Info */}
      <div className="text-center text-[11px] text-slate-400 pt-2">
        <p className="font-bold text-slate-500">HOÀN XU Việt Nam · Phiên bản 1.0.0</p>
        <p>Nền tảng hoàn tiền mua sắm Shopee thông minh</p>
      </div>

      {/* Reset data confirm modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Đặt lại dữ liệu dùng thử?"
        description="Toàn bộ đơn hàng, số dư ví và voucher sẽ được khôi phục về trạng thái prototype ban đầu."
        confirmText="Đặt lại"
        cancelText="Giữ nguyên"
        variant="brand"
        icon={RotateCcw}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleConfirmResetData}
      />

      {/* Logout confirm modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Đăng xuất tài khoản?"
        description="Bạn sẽ cần đăng nhập lại để theo dõi đơn hàng và số dư ví hoàn tiền."
        confirmText="Đăng xuất"
        cancelText="Ở lại"
        variant="danger"
        icon={LogOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};
