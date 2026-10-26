import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WalletPage } from './pages/WalletPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReferralPage } from './pages/ReferralPage';
// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminWithdrawalsPage } from './pages/admin/AdminWithdrawalsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminConversionsPage } from './pages/admin/AdminConversionsPage';

import { useAppStore } from './stores/useAppStore';
import { isAuthenticated } from './services/api';

// Scroll to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  const { syncUserData } = useAppStore();

  useEffect(() => {
    if (isAuthenticated()) {
      syncUserData();
    }
  }, [syncUserData]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ─── User App Routes ─────────────────────────── */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="referral" element={<ReferralPage />} />
          {/* Fallback route redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* ─── Admin CMS Routes ────────────────────────── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="conversions" element={<AdminConversionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
