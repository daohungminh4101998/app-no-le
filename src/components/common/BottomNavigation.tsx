import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Wallet, Compass, User } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const BottomNavigation: React.FC = () => {
  const { orders } = useAppStore();

  // Pending count for orders badge
  const pendingCount = orders.filter(
    (o) => o.status === 'pending_record' || o.status === 'confirming'
  ).length;

  const navItems = [
    {
      to: '/',
      label: 'Trang chủ',
      icon: Home,
    },
    {
      to: '/orders',
      label: 'Đơn hàng',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? pendingCount : undefined,
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
    },
    {
      to: '/profile',
      label: 'Cá nhân',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-float">
      <div className="max-w-lg mx-auto px-2 safe-bottom flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full min-w-[56px] min-h-[44px] tap-active transition-all relative ${
                  isActive
                    ? 'text-brand-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                      }`}
                    />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1 tracking-tight transition-colors ${
                      isActive ? 'text-brand-600' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-6 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
