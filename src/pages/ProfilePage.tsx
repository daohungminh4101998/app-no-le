import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { formatVND } from '../utils/format';
import { ReferralCard } from '../components/profile/ReferralCard';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { isAuthenticated } from '../services/api';
import { RegisterModal } from '../components/auth/RegisterModal';
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
  User,
  LogIn,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    wallet,
    resetAllData,
    logout,
    showToast,
    refreshUserProfile,
    refreshWalletData,
    syncUserData,
  } = useAppStore();
  const [showSupport, setShowSupport] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const isAuth = isAuthenticated();

  // Luôn đồng bộ thông tin người dùng + số dư ví từ API mỗi khi vào trang
  useEffect(() => {
    if (!isAuth) return;
    refreshUserProfile();
    refreshWalletData();
  }, [isAuth, refreshUserProfile, refreshWalletData]);

  if (!isAuth) {
    return (
      <div className="space-y-4 pb-6 pt-2">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-center shadow-2xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-2xs">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Tài khoản Nô Tì</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Đăng nhập hoặc tạo tài khoản để quản lý ví tiền hoàn, thông tin rút tiền và theo dõi các đơn hàng Shopee.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm shadow-cta transition-all tap-active cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập / Đăng ký ngay</span>
          </button>
        </div>
        <RegisterModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  const handleConfirmResetData = () => {
    resetAllData();
    setShowResetModal(false);
    showToast('Đã đặt lại dữ liệu dùng thử!', 'info');
    // Đồng bộ lại từ API vì dữ liệu server là nguồn chính
    syncUserData();
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
      color: 'text-blue-600 bg-blue-50/80',
    },
    {
      to: '/wallet',
      icon: Wallet,
      title: 'Ví tiền hoàn & Rút tiền',
      badge: `${formatVND(wallet.available)}`,
      badgeColor: 'text-brand-700 bg-emerald-100/80 font-bold tabular-nums',
      color: 'text-brand-600 bg-emerald-50/80',
    },
    {
      to: '/withdraw',
      icon: CreditCard,
      title: 'Phương thức nhận tiền',
      badge: 'MB Bank, MoMo',
      color: 'text-amber-600 bg-amber-50/80',
    },
    {
      to: '/referral',
      icon: Users,
      title: 'Giới thiệu bạn bè',
      badge: '+10.000đ/bạn',
      badgeColor: 'text-purple-700 bg-purple-100/80 font-bold tabular-nums',
      color: 'text-purple-600 bg-purple-50/80',
    },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3.5 mb-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20 shadow-2xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {user?.name ?? 'Đang tải...'}
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 uppercase tracking-wider">
                {user?.memberTier ?? '—'}
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate">{user?.phone || 'Chưa cập nhật'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || 'Chưa cập nhật'}</p>
          </div>
        </div>

        {/* Quick balance banner */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">
              Tổng tích lũy Hoàn Xu
            </span>
            <span className="text-lg font-black text-brand-700 tabular-nums">
              {formatVND(wallet.totalCashback)}
            </span>
          </div>

          <Link
            to="/wallet"
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors tap-active"
          >
            Rút tiền ngay
          </Link>
        </div>
      </div>

      {/* Referral Banner */}
      <ReferralCard />

      {/* Main Navigation Menu */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 transition tap-active"
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
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        <button
          onClick={() => setShowSupport(!showSupport)}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 transition tap-active text-left"
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
          <div className="p-4 sm:p-5 bg-slate-50/70 space-y-3 text-xs text-slate-600 border-t border-slate-100">
            <div>
              <p className="font-bold text-slate-800 mb-1">
                ❓ Bao lâu thì tiền hoàn về ví có thể rút?
              </p>
              <p className="text-slate-500 leading-relaxed">
                Thường từ 7 đến 15 ngày sau khi bạn nhận hàng thành công và hết hạn đổi trả của Shopee.
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">
                ❓ Có bị mất mã giảm giá Shopee khi mua qua link không?
              </p>
              <p className="text-slate-500 leading-relaxed">
                Không. Bạn vẫn áp mã Shopee, ShopeePay, Freeship Xtra bình thường và nhận thêm tiền hoàn song song.
              </p>
            </div>
            <div className="pt-2 flex gap-2">
              <a
                href="tel:19001000"
                className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Hotline 1900 1000
              </a>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 transition tap-active text-left"
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
        className="w-full flex items-center justify-center gap-2 p-3.5 bg-white rounded-2xl border border-rose-200/80 text-rose-600 font-bold text-sm hover:bg-rose-50 transition tap-active shadow-2xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Đăng xuất</span>
      </button>

      {/* App Version Info */}
      <div className="text-center text-[11px] text-slate-400 pt-2">
        <p className="font-bold text-slate-500">Nô Tì · Phiên bản 1.0.0</p>
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
