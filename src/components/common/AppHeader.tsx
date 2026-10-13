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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 transition-all">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <span className="text-xl">🪙</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                HOÀN XU
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 font-medium">
              Mua Shopee · Nhận tiền về
            </p>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2 relative">
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition tap-active"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Register / Login Button if not authenticated */}
          {!isAuth ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-xs shadow-sm transition tap-active cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng Ký</span>
            </button>
          ) : (
            /* Profile Quick Pill */
            <Link
              to="/profile"
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition tap-active"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
              />
              <span className="text-xs font-semibold text-slate-700 max-w-[70px] truncate hidden xs:inline">
                {user.name.split(' ').slice(-1)[0]}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 leading-none">
                {user.memberTier}
              </span>
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
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-4 top-14 z-50 w-80 bg-white rounded-brand shadow-float border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Thông báo
              </span>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                Đã đọc tất cả
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs transition hover:bg-slate-50 ${
                    n.unread ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <p className="font-bold text-slate-800 mb-0.5">{n.title}</p>
                  <p className="text-slate-600 leading-relaxed mb-1">{n.desc}</p>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
              ))}
            </div>
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
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
