import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { WalletSummary } from '../components/wallet/WalletSummary';
import { TransactionItem } from '../components/wallet/TransactionItem';
import { WithdrawalModal } from '../components/wallet/WithdrawalModal';
import { EmptyState } from '../components/common/EmptyState';
import { History, Info } from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { wallet, transactions, refreshWalletData } = useAppStore();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'cashback' | 'withdrawal'>('all');

  useEffect(() => {
    refreshWalletData();
  }, [refreshWalletData]);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'cashback') {
      return t.type === 'cashback_received' || t.type === 'cashback_pending' || t.type === 'referral_bonus';
    }
    if (filterType === 'withdrawal') {
      return t.type === 'withdrawal';
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Ví tiền hoàn
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý số dư, theo dõi lịch sử và rút tiền về tài khoản
        </p>
      </div>

      {/* Main Hero Wallet Card */}
      <WalletSummary
        balance={wallet}
        onWithdrawClick={() => setIsWithdrawOpen(true)}
      />

      {/* Trust notice */}
      <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Số dư <strong>Khả dụng</strong> là tiền hoàn đã được Shopee đối soát hoàn tất. Bạn có thể rút trực tiếp về Ngân hàng (hỗ trợ chuyển khoản 24/7 qua Napas).
        </p>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <History className="w-4 h-4 text-slate-400" />
            Lịch sử giao dịch
          </h3>

          {/* Filter Pills */}
          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('cashback')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterType === 'cashback'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Hoàn tiền
            </button>
            <button
              onClick={() => setFilterType('withdrawal')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterType === 'withdrawal'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Rút tiền
            </button>
          </div>
        </div>

        {/* Transactions list */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={History}
            title="Chưa có giao dịch phù hợp"
            description="Lịch sử cộng tiền hoàn và rút tiền sẽ hiển thị ở đây."
          />
        )}
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </div>
  );
};
