import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Search, Wallet, Eye, X } from 'lucide-react';
import { adminApi, AdminUser, AdminUserDetail } from '../../services/api';
import { useAppStore } from '../../stores/useAppStore';
import {
  SectionCard, StatusBadge, Pagination, TableSkeleton,
  EmptyState, formatCurrency, formatDate,
} from '../../components/admin/AdminShared';

// ─── Adjust Wallet Modal ──────────────────────────────────────────────────────
interface AdjustWalletModalProps {
  user: AdminUser | AdminUserDetail | null;
  onClose: () => void;
  onSuccess: () => void;
}
const AdjustWalletModal: React.FC<AdjustWalletModalProps> = ({ user, onClose, onSuccess }) => {
  const { showToast } = useAppStore();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setAmount(''); setDescription(''); }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async () => {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsed) || parsed === 0) {
      showToast('Vui lòng nhập số tiền hợp lệ (khác 0)', 'error');
      return;
    }
    if (!description.trim() || description.trim().length < 3) {
      showToast('Lý do điều chỉnh phải có ít nhất 3 ký tự', 'error');
      return;
    }
    setLoading(true);
    try {
      await adminApi.adjustWallet(user.id, parsed, description.trim());
      showToast(`✅ Đã điều chỉnh ví của ${user.name}: ${parsed > 0 ? '+' : ''}${formatCurrency(parsed)}`, 'success');
      onSuccess();
      onClose();
    } catch (e: any) {
      showToast(e?.message || 'Điều chỉnh ví thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  const parsedAmt = parseFloat(amount.replace(/,/g, '')) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-slate-100 font-bold text-lg">Điều Chỉnh Số Dư Ví</h3>
            <p className="text-slate-400 text-sm mt-0.5">{user.name} — {user.email}</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current balance */}
        {user.wallet && (
          <div className="grid grid-cols-2 gap-2 mb-5 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Số dư khả dụng</p>
              <p className="text-white font-bold text-sm">{formatCurrency(user.wallet.availableBalance)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Số dư chờ</p>
              <p className="text-amber-400 font-bold text-sm">{formatCurrency(user.wallet.pendingBalance)}</p>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Số tiền điều chỉnh (VND)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Dương (+) = cộng tiền, Âm (-) = trừ tiền"
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3.5 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition"
              disabled={loading}
            />
          </div>
          {parsedAmt !== 0 && (
            <p className={`text-xs mt-1.5 font-semibold ${parsedAmt > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {parsedAmt > 0 ? '+ Cộng ' : '- Trừ '} {formatCurrency(Math.abs(parsedAmt))} vào ví
            </p>
          )}
        </div>

        {/* Description Input */}
        <div className="mb-5">
          <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Lý do điều chỉnh (Audit Log)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="VD: Bù tiền hoàn xu do lỗi hệ thống ngày 14/10, mã đơn #XYZ123..."
            className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl px-3.5 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 resize-none transition"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !amount || !description.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận điều chỉnh'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── User Detail Modal ────────────────────────────────────────────────────────
interface UserDetailModalProps {
  userId: string | null;
  onClose: () => void;
  onAdjust: (user: AdminUserDetail) => void;
}
const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, onClose, onAdjust }) => {
  const { showToast } = useAppStore();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setDetail(null); return; }
    setLoading(true);
    adminApi.getUserDetail(userId)
      .then(setDetail)
      .catch((e) => showToast(e?.message || 'Không thể tải chi tiết người dùng', 'error'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  const statusVariant = (s: string) => {
    if (s === 'ACTIVE') return { variant: 'success' as const, label: 'Hoạt động' };
    if (s === 'BLOCKED') return { variant: 'error' as const, label: 'Bị khóa' };
    return { variant: 'warning' as const, label: 'Chờ kích hoạt' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-slate-100 font-bold text-lg">Chi Tiết Người Dùng</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {loading || !detail ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 bg-slate-800 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {detail.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-100 text-lg font-bold">{detail.name}</p>
                  <p className="text-slate-400 text-sm">{detail.email}</p>
                  {detail.phone && <p className="text-slate-500 text-xs">{detail.phone}</p>}
                </div>
                <StatusBadge label={statusVariant(detail.status).label} variant={statusVariant(detail.status).variant} />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 rounded-xl p-3">
                  <p className="text-slate-500 text-xs mb-1">Mã giới thiệu</p>
                  <p className="text-slate-200 font-mono font-semibold text-sm">{detail.referralCode}</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3">
                  <p className="text-slate-500 text-xs mb-1">Ngày đăng ký</p>
                  <p className="text-slate-200 font-semibold text-sm">{formatDate(detail.createdAt)}</p>
                </div>
              </div>

              {/* Wallet */}
              {detail.wallet && (
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-brand-400" />
                    <p className="text-slate-300 font-semibold text-sm">Thông tin ví</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-500 text-xs">Số dư khả dụng</p>
                      <p className="text-emerald-400 font-bold">{formatCurrency(detail.wallet.availableBalance)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Số dư chờ</p>
                      <p className="text-amber-400 font-bold">{formatCurrency(detail.wallet.pendingBalance)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Tổng đã tích lũy</p>
                      <p className="text-slate-200 font-semibold">{formatCurrency(detail.wallet.totalEarned)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Tổng đã rút</p>
                      <p className="text-slate-200 font-semibold">{formatCurrency(detail.wallet.totalWithdrawn)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Counts */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Clicks', value: detail.counts.affiliateClicks, icon: '🖱️' },
                  { label: 'Đơn hàng', value: detail.counts.conversions, icon: '📦' },
                  { label: 'Rút tiền', value: detail.counts.withdrawals, icon: '💸' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-slate-800/60 rounded-xl p-3 text-center">
                    <p className="text-xl mb-1">{icon}</p>
                    <p className="text-white font-bold text-lg">{value}</p>
                    <p className="text-slate-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* Action */}
              <button
                onClick={() => onAdjust(detail)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition"
              >
                <Wallet className="w-4 h-4" />
                Điều Chỉnh Số Dư Ví
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Status variant for user ──────────────────────────────────────────────────
function userStatusBadge(status: AdminUser['status']) {
  const map = {
    ACTIVE:  { variant: 'success' as const, label: 'Hoạt động' },
    BLOCKED: { variant: 'error'   as const, label: 'Bị khóa' },
    PENDING: { variant: 'warning' as const, label: 'Chờ kích hoạt' },
  };
  return map[status] ?? { variant: 'neutral' as const, label: status };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export const AdminUsersPage: React.FC = () => {
  const { showToast } = useAppStore();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [adjustUser, setAdjustUser] = useState<AdminUser | AdminUserDetail | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(page, 15, debouncedSearch || undefined);
      setItems(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch (e: any) {
      showToast(e?.message || 'Không thể tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, refreshKey]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Quản Lý Người Dùng & Ví</h1>
        <p className="text-slate-500 text-sm mt-0.5">Tra cứu tài khoản và điều chỉnh số dư ví</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo Tên, Email, Mã giới thiệu..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <SectionCard title={`${total} người dùng`}>
        {loading ? (
          <TableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon="👤" title="Không tìm thấy người dùng" subtitle="Thử từ khoá khác" />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/50">
                    <th className="text-left py-3 pr-4 font-semibold">Người dùng</th>
                    <th className="text-left py-3 pr-4 font-semibold">Mã giới thiệu</th>
                    <th className="text-right py-3 pr-4 font-semibold">Số dư KD</th>
                    <th className="text-right py-3 pr-4 font-semibold">Chờ duyệt</th>
                    <th className="text-right py-3 pr-4 font-semibold">Tổng tích lũy</th>
                    <th className="text-center py-3 pr-4 font-semibold">Trạng thái</th>
                    <th className="text-left py-3 pr-4 font-semibold">Ngày đăng ký</th>
                    <th className="text-center py-3 font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((u) => {
                    const badge = userStatusBadge(u.status);
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition group">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/30 to-brand-700/30 border border-brand-600/20 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-slate-200 font-semibold">{u.name}</p>
                              <p className="text-slate-500 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">{u.referralCode}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-emerald-400 font-bold text-sm">
                            {u.wallet ? formatCurrency(u.wallet.availableBalance) : '—'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-amber-400 font-semibold text-sm">
                            {u.wallet ? formatCurrency(u.wallet.pendingBalance) : '—'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-slate-300 text-sm">
                            {u.wallet ? formatCurrency(u.wallet.totalEarned) : '—'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-center">
                          <StatusBadge label={badge.label} variant={badge.variant} />
                        </td>
                        <td className="py-3.5 pr-4 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                        <td className="py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setDetailUserId(u.id)}
                              className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 transition"
                              title="Chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setAdjustUser(u)}
                              className="p-1.5 rounded-lg text-brand-400 hover:bg-brand-500/10 transition"
                              title="Điều chỉnh ví"
                            >
                              <Wallet className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {items.map((u) => {
                const badge = userStatusBadge(u.status);
                return (
                  <div key={u.id} className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/30 to-brand-700/30 border border-brand-600/20 flex items-center justify-center text-brand-400 font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-200 font-semibold text-sm">{u.name}</p>
                          <p className="text-slate-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                      <StatusBadge label={badge.label} variant={badge.variant} />
                    </div>
                    {u.wallet && (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center bg-slate-900/50 rounded-lg p-2">
                          <p className="text-emerald-400 font-bold">{formatCurrency(u.wallet.availableBalance)}</p>
                          <p className="text-slate-600 text-[11px]">Khả dụng</p>
                        </div>
                        <div className="text-center bg-slate-900/50 rounded-lg p-2">
                          <p className="text-amber-400 font-bold">{formatCurrency(u.wallet.pendingBalance)}</p>
                          <p className="text-slate-600 text-[11px]">Chờ duyệt</p>
                        </div>
                        <div className="text-center bg-slate-900/50 rounded-lg p-2">
                          <p className="text-slate-300 font-semibold">{formatCurrency(u.wallet.totalEarned)}</p>
                          <p className="text-slate-600 text-[11px]">Tích lũy</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDetailUserId(u.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Chi tiết
                      </button>
                      <button
                        onClick={() => setAdjustUser(u)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 transition"
                      >
                        <Wallet className="w-3.5 h-3.5" /> Điều chỉnh ví
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPageChange={setPage} />
          </>
        )}
      </SectionCard>

      {/* Modals */}
      <UserDetailModal
        userId={detailUserId}
        onClose={() => setDetailUserId(null)}
        onAdjust={(u) => { setDetailUserId(null); setAdjustUser(u); }}
      />
      <AdjustWalletModal
        user={adjustUser}
        onClose={() => setAdjustUser(null)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};
