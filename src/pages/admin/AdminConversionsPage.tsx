import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { adminApi, AdminConversion } from '../../services/api';
import { useAppStore } from '../../stores/useAppStore';
import {
  SectionCard, StatusBadge, Pagination, TableSkeleton,
  EmptyState, formatCurrency, formatDate,
} from '../../components/admin/AdminShared';

type FilterStatus = 'ALL' | AdminConversion['status'];

const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'ALL',       label: 'Tất cả' },
  { key: 'PENDING',   label: 'Chờ đối soát' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

function conversionBadge(status: AdminConversion['status']) {
  const map = {
    PENDING:   { variant: 'warning' as const, label: 'Chờ đối soát' },
    CONFIRMED: { variant: 'success' as const, label: 'Đã xác nhận' },
    CANCELLED: { variant: 'neutral' as const, label: 'Đã hủy' },
  };
  return map[status] ?? { variant: 'neutral' as const, label: status };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export const AdminConversionsPage: React.FC = () => {
  const { showToast } = useAppStore();
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminConversion[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'ALL' ? undefined : filter;
      const res = await adminApi.getConversions(page, 15, status);
      setItems(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch (e: any) {
      showToast(e?.message || 'Không thể tải danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, page, refreshKey]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [filter]);

  // Tổng hợp theo filter hiện tại (hiển thị cho page đang xem)
  const totalOrderAmt  = items.reduce((s, c) => s + c.orderAmount, 0);
  const totalCommAmt   = items.reduce((s, c) => s + c.commissionAmount, 0);
  const totalCashback  = items.reduce((s, c) => s + c.cashbackAmount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Đơn Hàng & Đối Soát</h1>
          <p className="text-slate-500 text-sm mt-0.5">Theo dõi toàn bộ đơn hàng chuyển đổi từ Shopee affiliate</p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Summary row (page level) */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tổng doanh số (trang)', value: formatCurrency(totalOrderAmt), color: 'text-white' },
            { label: 'Hoa hồng Shopee', value: formatCurrency(totalCommAmt), color: 'text-brand-400' },
            { label: 'Đã chi hoàn xu', value: formatCurrency(totalCashback), color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3">
              <p className="text-slate-500 text-xs mb-1">{label}</p>
              <p className={`font-bold text-sm ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUS_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filter === key
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <SectionCard title={`${total} đơn hàng`}>
        {loading ? (
          <TableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon="📦" title="Không có đơn hàng nào" subtitle="Thử thay đổi bộ lọc trạng thái" />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/50">
                    <th className="text-left py-3 pr-4 font-semibold">Mã đơn</th>
                    <th className="text-left py-3 pr-4 font-semibold">Người mua</th>
                    <th className="text-left py-3 pr-4 font-semibold">Sản phẩm</th>
                    <th className="text-right py-3 pr-4 font-semibold">Doanh số</th>
                    <th className="text-right py-3 pr-4 font-semibold">Hoa hồng</th>
                    <th className="text-right py-3 pr-4 font-semibold">Hoàn xu</th>
                    <th className="text-center py-3 pr-4 font-semibold">Trạng thái</th>
                    <th className="text-left py-3 font-semibold">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((c) => {
                    const badge = conversionBadge(c.status);
                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 pr-4">
                          <p className="text-slate-200 font-mono text-xs font-semibold">#{c.checkoutId}</p>
                          <p className="text-slate-600 font-mono text-[11px]">item: {c.externalItemId.slice(-8)}</p>
                        </td>
                        <td className="py-3.5 pr-4">
                          <p className="text-slate-200 font-semibold truncate max-w-[120px]">{c.user.name}</p>
                          <p className="text-slate-500 text-xs truncate max-w-[120px]">{c.user.email}</p>
                        </td>
                        <td className="py-3.5 pr-4">
                          {c.itemName ? (
                            <div className="flex items-center gap-2 max-w-[160px]">
                              {c.itemImage && (
                                <img src={c.itemImage} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0 bg-slate-700" />
                              )}
                              <p className="text-slate-300 text-xs truncate">{c.itemName}</p>
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-white font-bold">{formatCurrency(c.orderAmount)}</span>
                          <p className="text-slate-600 text-[11px]">{c.itemCount || 1} sp</p>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-brand-400 font-semibold">{formatCurrency(c.commissionAmount)}</span>
                          <p className="text-slate-600 text-[11px]">{(c.commissionRate * 100).toFixed(1)}%</p>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-amber-400 font-semibold">{formatCurrency(c.cashbackAmount)}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-center">
                          <StatusBadge label={badge.label} variant={badge.variant} />
                        </td>
                        <td className="py-3.5 text-slate-500 text-xs">{formatDate(c.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {items.map((c) => {
                const badge = conversionBadge(c.status);
                return (
                  <div key={c.id} className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-slate-200 font-mono text-xs font-semibold">#{c.checkoutId}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{c.user.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge label={badge.label} variant={badge.variant} />
                      </div>
                    </div>
                    {c.itemName && (
                      <div className="flex items-center gap-2">
                        {c.itemImage && (
                          <img src={c.itemImage} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-700 shrink-0" />
                        )}
                        <p className="text-slate-400 text-xs truncate">{c.itemName}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                        <p className="text-white font-bold">{formatCurrency(c.orderAmount)}</p>
                        <p className="text-slate-600 text-[11px]">Doanh số</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                        <p className="text-brand-400 font-semibold">{formatCurrency(c.commissionAmount)}</p>
                        <p className="text-slate-600 text-[11px]">Hoa hồng</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                        <p className="text-amber-400 font-semibold">{formatCurrency(c.cashbackAmount)}</p>
                        <p className="text-slate-600 text-[11px]">Hoàn xu</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-[11px]">{formatDate(c.createdAt)}</p>
                  </div>
                );
              })}
            </div>

            <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPageChange={setPage} />
          </>
        )}
      </SectionCard>
    </div>
  );
};
