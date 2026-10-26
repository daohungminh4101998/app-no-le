import React, { useEffect, useState } from 'react';
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  ShoppingBag,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Wallet,
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { Toast } from '../components/common/Toast';
import { adminApi, authApi, UserDto } from '../services/api';

// ─── Route Guard ─────────────────────────────────────────────────────────────
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('shopee_cashback_access_token');
  const [authUser, setAuthUser] = useState<UserDto | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setChecking(false); return; }
    authApi.getMe()
      .then(setAuthUser)
      .catch(() => setAuthUser(null))
      .finally(() => setChecking(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/" replace />;

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser || authUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Truy cập bị từ chối</h1>
          <p className="text-slate-400 mb-6 text-sm">
            Bạn không có quyền truy cập vào trang quản trị. Chỉ tài khoản Admin mới được phép.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ─── Navigation Items ─────────────────────────────────────────────────────────
const navItems = [
  { to: '/admin', label: 'Tổng Quan', icon: LayoutDashboard, exact: true },
  { to: '/admin/withdrawals', label: 'Quản lý Rút Tiền', icon: ArrowLeftRight },
  { to: '/admin/users', label: 'Người Dùng & Ví', icon: Users },
  { to: '/admin/conversions', label: 'Đơn Hàng & Đối Soát', icon: ShoppingBag },
];

// ─── Breadcrumb Helper ────────────────────────────────────────────────────────
const BREADCRUMB_MAP: Record<string, string> = {
  '/admin': 'Tổng Quan',
  '/admin/withdrawals': 'Quản lý Rút Tiền',
  '/admin/users': 'Người Dùng & Ví',
  '/admin/conversions': 'Đơn Hàng & Đối Soát',
};

function useBreadcrumb(): string {
  const { pathname } = useLocation();
  return BREADCRUMB_MAP[pathname] || 'Quản Trị';
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────
export const AdminLayout: React.FC = () => {
  const { showToast, logout } = useAppStore();
  const [adminUser, setAdminUser] = useState<UserDto | null>(null);
  const navigate = useNavigate();
  const breadcrumb = useBreadcrumb();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    authApi.getMe().then(setAdminUser).catch(() => {});
    adminApi
      .getStatistics()
      .then((stats) => setPendingCount(stats.pendingWithdrawals))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Đã đăng xuất khỏi trang quản trị', 'info');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/40">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Nô Tì</p>
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-widest">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} size={18} />
                <span className="flex-1">{label}</span>
                {to === '/admin/withdrawals' && pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white leading-none">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-1">
        <a
          href="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          Về Trang Người Dùng
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Đăng Xuất
        </button>
      </div>
    </div>
  );

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Toast />

        {/* ── Desktop Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-slate-900 border-r border-slate-700/50 sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {/* ── Mobile Sidebar Overlay ───────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          </div>
        )}
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <SidebarContent />
        </aside>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 h-14 bg-slate-900/90 border-b border-slate-700/50 backdrop-blur-md flex items-center px-4 lg:px-6 gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-700 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm flex-1">
              <span className="text-slate-500 font-medium">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-semibold">{breadcrumb}</span>
            </div>

            {/* Right: Pending alerts + user info */}
            <div className="flex items-center gap-3">
              {pendingCount > 0 && (
                <NavLink
                  to="/admin/withdrawals"
                  className="relative flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{pendingCount} chờ duyệt</span>
                </NavLink>
              )}

              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-slate-200 text-xs font-semibold leading-tight">{adminUser?.name || 'Admin'}</p>
                  <p className="text-slate-500 text-[11px] leading-tight">Quản trị viên</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};
