import React, { useEffect, useState } from 'react';
import {
  Users, ShoppingBag, Wallet, TrendingUp,
  ArrowUpRight, Clock, MousePointerClick, BadgeDollarSign,
} from 'lucide-react';
import { adminApi, AdminStatistics, AdminWithdrawal, AdminConversion } from '../../services/api';
import { useAppStore } from '../../stores/useAppStore';
import {
  StatCard, StatCardSkeleton, SectionCard,
  StatusBadge, EmptyState, TableSkeleton,
  formatCurrency, formatDate,
} from '../../components/admin/AdminShared';

// ─── Withdrawal Status Map ────────────────────────────────────────────────────
function withdrawalVariant(status: AdminWithdrawal['status']) {
  const map = {
    PENDING:    { variant: 'warning' as const, label: 'Chờ duyệt' },
    PROCESSING: { variant: 'info'    as const, label: 'Đang xử lý' },
    COMPLETED:  { variant: 'success' as const, label: 'Hoàn thành' },
    REJECTED:   { variant: 'error'   as const, label: 'Từ chối' },
    CANCELLED:  { variant: 'neutral' as const, label: 'Đã hủy' },
  };
  return map[status] ?? { variant: 'neutral' as const, label: status };
}

function conversionVariant(status: AdminConversion['status']) {
  const map = {
    PENDING:   { variant: 'warning' as const, label: 'Chờ đối soát' },
    CONFIRMED: { variant: 'success' as const, label: 'Đã xác nhận' },
    CANCELLED: { variant: 'neutral' as const, label: 'Đã hủy' },
    RETURNED:  { variant: 'error'   as const, label: 'Trả hàng' },
    REJECTED:  { variant: 'error'   as const, label: 'Từ chối' },
  };
  return map[status] ?? { variant: 'neutral' as const, label: status };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export const AdminDashboardPage: React.FC = () => {
  const { showToast } = useAppStore();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [recentWithdrawals, setRecentWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [recentConversions, setRecentConversions] = useState<AdminConversion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, withdrawalsData, conversionsData] = await Promise.all([
          adminApi.getStatistics(),
          adminApi.getWithdrawals(1, 5),
          adminApi.getConversions(1, 5),
        ]);
        setStats(statsData);
        setRecentWithdrawals(withdrawalsData.items);
        setRecentConversions(conversionsData.items);
      } catch (e: any) {
        showToast(e?.message || 'Không thể tải dữ liệu thống kê', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Tổng Quan Hệ Thống</h1>
        <p className="text-slate-500 text-sm mt-0.5">Dữ liệu thời gian thực từ Hoàn Xu Cashback</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              title="Tổng Người Dùng"
              value={stats.totalUsers.toLocaleString('vi-VN')}
              icon={<Users className="w-5 h-5" />}
              accent="blue"
              subtitle="Tài khoản đã đăng ký"
            />
            <StatCard
              title="Tổng Click Affiliate"
              value={stats.totalClicks.toLocaleString('vi-VN')}
              icon={<MousePointerClick className="w-5 h-5" />}
              accent="purple"
              subtitle="Lần click link hoàn xu"
            />
            <StatCard
              title="Tổng Đơn Hàng"
              value={stats.totalConversions.toLocaleString('vi-VN')}
              icon={<ShoppingBag className="w-5 h-5" />}
              accent="orange"
              subtitle="Đơn Shopee được ghi nhận"
            />
            <StatCard
              title="Chờ Duyệt Rút Tiền"
              value={`${stats.pendingWithdrawals} lệnh`}
              icon={<Clock className="w-5 h-5" />}
              accent="rose"
              badge={stats.pendingWithdrawals > 0 ? `Cần chi: ${formatCurrency(stats.pendingWithdrawalsAmount || 0)}` : '✓ Không có'}
              subtitle="Chờ admin chuyển khoản"
            />
            <StatCard
              title="Hoa Hồng Shopee Đã Nhận"
              value={formatCurrency(stats.confirmedCommission || 0)}
              icon={<TrendingUp className="w-5 h-5" />}
              accent="green"
              subtitle="Nguồn tiền từ đơn đối soát thành công"
            />
            <StatCard
              title="Đã Chuyển Khoản Cho User"
              value={formatCurrency(stats.totalWithdrawn || 0)}
              icon={<ArrowUpRight className="w-5 h-5" />}
              accent="orange"
              subtitle="Tổng tiền admin đã tự chuyển chi trả"
            />
            <StatCard
              title="Số Dư Tiền Admin Còn Lại"
              value={formatCurrency(stats.adminBalance || 0)}
              icon={<Wallet className="w-5 h-5" />}
              accent="blue"
              subtitle="Doanh thu Shopee sau khi trừ đã chi"
              badge={stats.adminBalance < (stats.pendingWithdrawalsAmount || 0) ? '⚠ Cần đối soát thêm' : '✓ Đủ khả năng chi'}
            />
            <StatCard
              title="Lợi Nhuận Ròng Ước Tính"
              value={formatCurrency(stats.netProfit || 0)}
              icon={<BadgeDollarSign className="w-5 h-5" />}
              accent="purple"
              subtitle="Hoa hồng giữ lại sau khi chi"
              badge={stats.confirmedCommission > 0 ? `+${(((stats.netProfit || 0) / (stats.confirmedCommission || 1)) * 100).toFixed(1)}%` : '—'}
            />
          </>
        ) : null}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Withdrawals */}
        <SectionCard
          title="Yêu Cầu Rút Tiền Gần Đây"
          toolbar={
            <a href="/admin/withdrawals" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-3 h-3" />
            </a>
          }
        >
          {loading ? (
            <TableSkeleton rows={5} />
          ) : recentWithdrawals.length === 0 ? (
            <EmptyState icon="💸" title="Chưa có lệnh rút tiền" />
          ) : (
            <div className="space-y-2">
              {recentWithdrawals.map((w) => {
                const badge = withdrawalVariant(w.status);
                return (
                  <div key={w.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm font-semibold truncate">{w.user.name}</p>
                      <p className="text-slate-500 text-xs truncate">{w.bankName} • {w.bankAccountNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-slate-100 text-sm font-bold">{formatCurrency(w.amount)}</p>
                      <StatusBadge label={badge.label} variant={badge.variant} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Recent Conversions */}
        <SectionCard
          title="Đơn Hàng Chuyển Đổi Gần Đây"
          toolbar={
            <a href="/admin/conversions" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-3 h-3" />
            </a>
          }
        >
          {loading ? (
            <TableSkeleton rows={5} />
          ) : recentConversions.length === 0 ? (
            <EmptyState icon="📦" title="Chưa có đơn hàng" />
          ) : (
            <div className="space-y-2">
              {recentConversions.map((c) => {
                const badge = conversionVariant(c.status);
                return (
                  <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm font-semibold font-mono truncate">#{c.externalOrderId.slice(-8)}</p>
                      <p className="text-slate-500 text-xs truncate">{c.user.name} • {formatDate(c.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-slate-100 text-sm font-bold">{formatCurrency(c.orderAmount)}</p>
                      <StatusBadge label={badge.label} variant={badge.variant} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};
