import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { WalletSummary } from '../components/wallet/WalletSummary';
import { TransactionItem } from '../components/wallet/TransactionItem';
import { WithdrawalModal } from '../components/wallet/WithdrawalModal';
import { EmptyState } from '../components/common/EmptyState';
import { History, Info } from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { wallet, transactions } = useAppStore();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'cashback' | 'withdrawal'>('all');

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
      <div className="p-3 bg-amber-50/70 rounded-brand border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Số dư <strong>Có thể rút</strong> là tiền đã được Shopee duyệt hoàn tất. Bạn có thể rút về Ngân hàng hoặc Ví điện tử bất cứ lúc nào (hỗ trợ 24/7).
        </p>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <History className="w-4 h-4 text-slate-500" />
            Lịch sử giao dịch
          </h3>

          {/* Filter Pills */}
          <div className="flex gap-1 bg-slate-200/60 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded-md transition ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('cashback')}
              className={`px-2 py-0.5 rounded-md transition ${
                filterType === 'cashback'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoàn tiền
            </button>
            <button
              onClick={() => setFilterType('withdrawal')}
              className={`px-2 py-0.5 rounded-md transition ${
                filterType === 'withdrawal'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rút tiền
            </button>
          </div>
        </div>

        {/* Transactions list */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-2">
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
