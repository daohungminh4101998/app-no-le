import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Compass, User } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { isAuthenticated } from '../../services/api';
import { RegisterModal } from '../auth/RegisterModal';

export const BottomNavigation: React.FC = () => {
  const { orders, showToast } = useAppStore();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const isAuth = isAuthenticated();

  // Pending count for orders badge (chỉ hiển thị khi đã đăng nhập)
  const pendingCount = isAuth
    ? orders.filter(
        (o) => o.status === 'pending_record' || o.status === 'confirming'
      ).length
    : 0;

  const navItems = [
    {
      to: '/',
      label: 'Trang chủ',
      icon: Home,
      requiresAuth: false,
    },
    {
      to: '/orders',
      label: 'Đơn hàng',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? pendingCount : undefined,
      requiresAuth: true,
    },
    // {
    //   to: '/wallet',
    //   label: 'Tiền hoàn',
    //   icon: Wallet,
    // },
    {
      to: '/discover',
      label: 'Khám phá',
      icon: Compass,
      requiresAuth: false,
    },
    {
      to: '/profile',
      label: 'Cá nhân',
      icon: User,
      requiresAuth: true,
    },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navItems)[0]
  ) => {
    if (item.requiresAuth && !isAuthenticated()) {
      e.preventDefault();
      setTargetPath(item.to);
      setShowAuthModal(true);
      showToast(
        item.to === '/orders'
          ? 'Vui lòng đăng nhập để xem đơn hàng và tiền hoàn'
          : 'Vui lòng đăng nhập để xem thông tin cá nhân',
        'info'
      );
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-card">
        <div className="max-w-lg mx-auto px-3 safe-bottom flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={(e) => handleNavClick(e, item)}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full min-w-[56px] min-h-[44px] tap-active transition-all relative ${
                    isActive && (!item.requiresAuth || isAuth)
                      ? 'text-brand-700'
                      : 'text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => {
                  const showActive = isActive && (!item.requiresAuth || isAuth);
                  return (
                    <div className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                      showActive ? 'bg-brand-50/80 text-brand-700' : 'text-slate-400 hover:text-slate-700'
                    }`}>
                      <div className="relative">
                        <Icon
                          className={`w-5 h-5 transition-transform duration-200 ${
                            showActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                          }`}
                        />
                        {item.badge !== undefined && (
                          <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-shopee-primary text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-2xs">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] mt-1 font-bold tracking-tight transition-colors ${
                          showActive ? 'text-brand-700' : 'text-slate-500'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                }}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Auth Modal when guest clicks protected tabs */}
      <RegisterModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setTargetPath(null);
        }}
        onSuccess={() => {
          setShowAuthModal(false);
          if (targetPath) {
            navigate(targetPath);
            setTargetPath(null);
          }
        }}
      />
    </>
  );
};
