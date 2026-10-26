import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Sparkles, ExternalLink, UserPlus } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { RegisterModal } from '../auth/RegisterModal';
import { getAccessToken } from '../../services/api';

export const AppHeader: React.FC = () => {
  const { user } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuth = !!getAccessToken();

  const notifications = [
    {
      id: 1,
      title: '🎉 Hoàn tiền mới!',
      desc: 'Đơn hàng #HX260925D4 đã được duyệt +85.050đ vào ví có thể rút.',
      time: '10 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: '🎁 Mã Freeship Xtra mới',
      desc: 'Giảm 70K phí vận chuyển Shopee vừa được cập nhật tại mục Khám Phá.',
      time: '2 giờ trước',
      unread: true,
    },
    {
      id: 3,
      title: '✨ Thưởng giới thiệu',
      desc: 'Bạn vừa nhận +20.000đ khi bạn bè mua đơn Shopee đầu tiên.',
      time: 'Hôm qua',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 sm:px-5 transition-all">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group tap-active">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-cta group-hover:scale-105 transition-transform duration-200">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 6v12" />
              <path d="M16 10H9.5a2.5 2.5 0 0 0 0 5H14" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Nô Tì
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-extrabold bg-brand-50 text-brand-700 rounded-full border border-brand-200/80 uppercase tracking-wide">
                Cashback
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              Mua Shopee · Hoàn tiền thật
            </p>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 relative">
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition tap-active cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-shopee-primary rounded-full ring-2 ring-white" />
          </button>

          {/* Register / Login Button if not authenticated */}
          {!isAuth ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition tap-active cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          ) : (
            /* Profile Quick Pill */
            <Link
              to="/profile"
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition tap-active"
            >
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                alt={user?.name || 'User'}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
              />
              <span className="text-xs font-bold text-slate-800 max-w-[70px] truncate hidden xs:inline">
                {(user?.name || '').split(' ').slice(-1)[0] || 'Tài khoản'}
              </span>
              {user?.memberTier && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 leading-none">
                  {user.memberTier}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Register Modal */}
      <RegisterModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

      {/* Notifications Dropdown Modal */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-4 top-13 z-50 w-80 bg-white rounded-2xl shadow-float border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Thông báo mới
              </span>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-[11px] text-brand-700 font-semibold hover:underline cursor-pointer"
              >
                Đã đọc tất cả
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs transition hover:bg-slate-50 ${
                    n.unread ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <p className="font-bold text-slate-900 mb-0.5">{n.title}</p>
                  <p className="text-slate-600 leading-relaxed mb-1 text-[11px]">{n.desc}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                </div>
              ))}
            </div>
            <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
              <Link
                to="/orders"
                onClick={() => setShowNotifications(false)}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
              >
                Xem chi tiết đơn hàng & tiền hoàn <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
