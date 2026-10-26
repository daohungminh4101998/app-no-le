import React, { useEffect, useState, useCallback } from 'react';
import { Copy, CheckCircle2, XCircle, RefreshCw, Wallet, Clock, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { adminApi, AdminWithdrawal, AdminStatistics } from '../../services/api';
import { useAppStore } from '../../stores/useAppStore';
import {
  SectionCard, StatusBadge, Pagination, TableSkeleton,
  EmptyState, ConfirmModal, formatCurrency, formatDate,
} from '../../components/admin/AdminShared';

type FilterStatus = 'ALL' | AdminWithdrawal['status'];

const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'ALL',        label: 'Tất cả' },
  { key: 'PENDING',    label: 'Chờ duyệt' },
  { key: 'PROCESSING', label: 'Đang xử lý' },
  { key: 'COMPLETED',  label: 'Hoàn thành' },
  { key: 'REJECTED',   label: 'Từ chối' },
  { key: 'CANCELLED',  label: 'Đã hủy' },
];

function badgeInfo(status: AdminWithdrawal['status']) {
  const map = {
    PENDING:    { variant: 'warning' as const, label: 'Chờ duyệt' },
    PROCESSING: { variant: 'info'    as const, label: 'Đang xử lý' },
    COMPLETED:  { variant: 'success' as const, label: 'Hoàn thành' },
    REJECTED:   { variant: 'error'   as const, label: 'Từ chối' },
    CANCELLED:  { variant: 'neutral' as const, label: 'Đã hủy' },
  };
  return map[status] ?? { variant: 'neutral' as const, label: status };
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────
interface RejectModalProps {
  open: boolean;
  loading: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}
const RejectModal: React.FC<RejectModalProps> = ({ open, loading, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  useEffect(() => { if (!open) setReason(''); }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!loading ? onCancel : undefined} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-slate-100 font-bold text-lg mb-1">Từ Chối Lệnh Rút Tiền</h3>
        <p className="text-slate-400 text-sm mb-4">Số tiền sẽ tự động hoàn lại vào ví người dùng.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do từ chối (bắt buộc)..."
          className="w-full h-28 bg-slate-800 border border-slate-600 rounded-xl px-3.5 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 resize-none transition"
          disabled={loading}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={loading || !reason.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Copy Button ──────────────────────────────────────────────────────────────
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={handle}
      title="Sao chép"
      className="ml-1.5 p-1 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────
export const AdminWithdrawalsPage: React.FC = () => {
  const { showToast } = useAppStore();
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminWithdrawal[]>([]);
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Approve
  const [approveTarget, setApproveTarget] = useState<AdminWithdrawal | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  // Reject
  const [rejectTarget, setRejectTarget] = useState<AdminWithdrawal | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'ALL' ? undefined : filter;
      const [res, statsData] = await Promise.all([
        adminApi.getWithdrawals(page, 15, status),
        adminApi.getStatistics(),
      ]);
      setItems(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
      setStats(statsData);
    } catch (e: any) {
      showToast(e?.message || 'Không thể tải danh sách rút tiền', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, page, refreshKey]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [filter]);

  const handleApprove = async () => {
    if (!approveTarget) return;
    setApproveLoading(true);
    try {
      await adminApi.approveWithdrawal(approveTarget.id);
      showToast(`✅ Đã duyệt lệnh rút ${formatCurrency(approveTarget.amount)} của ${approveTarget.user.name}`, 'success');
      setApproveTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      showToast(e?.message || 'Duyệt lệnh thất bại', 'error');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      await adminApi.rejectWithdrawal(rejectTarget.id, reason);
      showToast(`Đã từ chối lệnh rút của ${rejectTarget.user.name} và hoàn tiền vào ví`, 'info');
      setRejectTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      showToast(e?.message || 'Từ chối lệnh thất bại', 'error');
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Quản Lý Rút Tiền</h1>
          <p className="text-slate-500 text-sm mt-0.5">Duyệt hoặc từ chối yêu cầu thanh toán của người dùng</p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Admin Fund Status Bar */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Số Dư Tiền Admin Còn Lại</p>
              <p className="text-base font-bold text-white">{formatCurrency(stats.adminBalance || 0)}</p>
              <p className="text-[10px] text-slate-500">Từ hoa hồng Shopee đã đối soát</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Tổng Tiền Đang Chờ Chi</p>
              <p className="text-base font-bold text-rose-400">{formatCurrency(stats.pendingWithdrawalsAmount || 0)}</p>
              <p className="text-[10px] text-slate-500">{stats.pendingWithdrawals} lệnh đang chờ duyệt</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Đã Chuyển Khoản Cho User</p>
              <p className="text-base font-bold text-emerald-400">{formatCurrency(stats.totalWithdrawn || 0)}</p>
              <p className="text-[10px] text-slate-500">Lệnh rút đã hoàn thành</p>
            </div>
          </div>
        </div>
      )}

      {stats && stats.adminBalance < (stats.pendingWithdrawalsAmount || 0) && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Lưu ý:</strong> Số dư hoa hồng Shopee đã xác nhận ({formatCurrency(stats.adminBalance)}) hiện thấp hơn tổng tiền chờ chi ({formatCurrency(stats.pendingWithdrawalsAmount)}). Hãy kiểm tra đối soát thêm đơn trước khi duyệt tiếp.
          </span>
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
      <SectionCard title={`${total} lệnh rút tiền`}>
        {loading ? (
          <TableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon="💸" title="Không có lệnh rút tiền nào" subtitle="Thử thay đổi bộ lọc trạng thái" />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/50">
                    <th className="text-left py-3 pr-4 font-semibold">Người dùng</th>
                    <th className="text-left py-3 pr-4 font-semibold">Ngân hàng</th>
                    <th className="text-left py-3 pr-4 font-semibold">Số tài khoản</th>
                    <th className="text-left py-3 pr-4 font-semibold">Chủ thẻ</th>
                    <th className="text-right py-3 pr-4 font-semibold">Số tiền</th>
                    <th className="text-center py-3 pr-4 font-semibold">Trạng thái</th>
                    <th className="text-left py-3 pr-4 font-semibold">Ngày tạo</th>
                    <th className="text-center py-3 font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((w) => {
                    const badge = badgeInfo(w.status);
                    return (
                      <tr key={w.id} className="hover:bg-slate-800/40 transition group">
                        <td className="py-3.5 pr-4">
                          <p className="text-slate-200 font-semibold">{w.user.name}</p>
                          <p className="text-slate-500 text-xs">{w.user.email}</p>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-300 font-medium">{w.bankName}</td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center">
                            <span className="text-slate-300 font-mono text-xs">{w.bankAccountNumber}</span>
                            <CopyButton text={w.bankAccountNumber} />
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center">
                            <span className="text-slate-300 text-xs font-medium">{w.bankAccountName}</span>
                            <CopyButton text={w.bankAccountName} />
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-white font-bold">{formatCurrency(w.amount)}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-center">
                          <StatusBadge label={badge.label} variant={badge.variant} />
                        </td>
                        <td className="py-3.5 pr-4 text-slate-500 text-xs">{formatDate(w.createdAt)}</td>
                        <td className="py-3.5">
                          {w.status === 'PENDING' || w.status === 'PROCESSING' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setApproveTarget(w)}
                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition"
                                title="Duyệt lệnh"
                              >
                                <CheckCircle2 className="w-4.5 h-4.5" size={18} />
                              </button>
                              <button
                                onClick={() => setRejectTarget(w)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                                title="Từ chối"
                              >
                                <XCircle className="w-4.5 h-4.5" size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs text-center block">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {items.map((w) => {
                const badge = badgeInfo(w.status);
                return (
                  <div key={w.id} className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-200 font-semibold">{w.user.name}</p>
                        <p className="text-slate-500 text-xs">{w.user.email}</p>
                      </div>
                      <StatusBadge label={badge.label} variant={badge.variant} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500 mb-0.5">Ngân hàng</p>
                        <p className="text-slate-300 font-medium">{w.bankName}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-0.5">Số tiền</p>
                        <p className="text-white font-bold">{formatCurrency(w.amount)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-0.5">Số TK</p>
                        <div className="flex items-center">
                          <span className="text-slate-300 font-mono">{w.bankAccountNumber}</span>
                          <CopyButton text={w.bankAccountNumber} />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-0.5">Chủ thẻ</p>
                        <div className="flex items-center">
                          <span className="text-slate-300">{w.bankAccountName}</span>
                          <CopyButton text={w.bankAccountName} />
                        </div>
                      </div>
                    </div>
                    {(w.status === 'PENDING' || w.status === 'PROCESSING') && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setApproveTarget(w)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                        </button>
                        <button
                          onClick={() => setRejectTarget(w)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Từ chối
                        </button>
                      </div>
                    )}
                    <p className="text-slate-600 text-[11px]">{formatDate(w.createdAt)}</p>
                  </div>
                );
              })}
            </div>

            <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPageChange={setPage} />
          </>
        )}
      </SectionCard>

      {/* Approve Modal */}
      <ConfirmModal
        open={!!approveTarget}
        title="Xác nhận Duyệt Lệnh Rút & Đã Chuyển Tiền"
        message={
          approveTarget ? (
            <span>
              Bạn xác nhận đã dùng app ngân hàng chuyển khoản{' '}
              <strong className="text-white">{formatCurrency(approveTarget.amount)}</strong> cho{' '}
              <strong className="text-white">{approveTarget.user.name}</strong>?
              <br /><br />
              <span className="text-slate-300 text-xs font-medium block bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                🏦 Ngân hàng: <strong className="text-white">{approveTarget.bankName}</strong>
                <br />
                💳 Số tài khoản: <strong className="text-white font-mono">{approveTarget.bankAccountNumber}</strong>
                <br />
                👤 Chủ thẻ: <strong className="text-white">{approveTarget.bankAccountName}</strong>
              </span>
              <br />
              <span className="text-emerald-400 text-xs block bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                ⚡ Sau khi xác nhận, hệ thống sẽ trừ số tiền này của User và đồng thời trừ vào Quỹ Doanh Thu Shopee của Admin.
              </span>
            </span>
          ) : ''
        }
        confirmLabel="Xác nhận đã chuyển tiền"
        confirmVariant="success"
        loading={approveLoading}
        onConfirm={handleApprove}
        onCancel={() => setApproveTarget(null)}
      />

      {/* Reject Modal */}
      <RejectModal
        open={!!rejectTarget}
        loading={rejectLoading}
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  );
};
