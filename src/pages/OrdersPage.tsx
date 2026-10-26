import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { OrderStatus } from '../types';
import { OrderCard } from '../components/orders/OrderCard';
import { EmptyState } from '../components/common/EmptyState';
import { ShoppingBag, Search } from 'lucide-react';
import { isAuthenticated } from '../services/api';
import { RegisterModal } from '../components/auth/RegisterModal';

export const OrdersPage: React.FC = () => {
  const { orders, fetchUserOrders } = useAppStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAuth = isAuthenticated();

  useEffect(() => {
    if (isAuth) {
      fetchUserOrders();
    }
  }, [fetchUserOrders, isAuth]);

  if (!isAuth) {
    return (
      <div className="space-y-4 pb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Theo dõi đơn hàng & hoàn tiền
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tiến độ hoàn tiền các đơn đã đặt qua link Shopee
          </p>
        </div>
        <EmptyState
          icon={ShoppingBag}
          title="Bạn chưa đăng nhập"
          description="Vui lòng đăng nhập để xem lịch sử đơn hàng và tiến độ hoàn tiền của bạn."
          actionText="Đăng nhập ngay"
          onAction={() => setShowAuthModal(true)}
        />
        <RegisterModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  const tabs: { key: OrderStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending_record', label: 'Chờ ghi nhận' },
    { key: 'confirming', label: 'Đang xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'cashback_paid', label: 'Đã hoàn tiền' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Theo dõi đơn hàng & tiền hoàn
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tiến trình đối soát và giải ngân tiền hoàn từ Shopee
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo mã đơn hoặc tên món đồ..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 outline-none focus:border-brand-600 shadow-2xs font-medium"
        />
      </div>

      {/* Status Filter Tabs (Horizontal scrollable) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? orders.length
              : orders.filter((o) => o.status === tab.key).length;

          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition tap-active flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="Chưa có đơn hàng nào"
          description="Dán link sản phẩm Shopee và mua hàng để nhận tiền hoàn đầu tiên của bạn!"
          actionText="Dán link mua ngay"
          actionLink="/"
        />
      )}
    </div>
  );
};
