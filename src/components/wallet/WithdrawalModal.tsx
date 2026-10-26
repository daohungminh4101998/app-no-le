import React, { useEffect, useState } from 'react';
import { X, Building2, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Bank, WithdrawalMethod } from '../../types';
import { formatVND } from '../../utils/format';
import { useAppStore } from '../../stores/useAppStore';
import {
  loadBankDraft,
  saveBankDraft,
  transferableBanks,
} from '../../data/banks';
import { BankSelectModal } from './BankSelectModal';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { wallet, requestWithdrawal, showToast } = useAppStore();
  const [method, setMethod] = useState<WithdrawalMethod>('bank');
  const [amount, setAmount] = useState<number>(wallet.available > 50000 ? 100000 : wallet.available);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [walletPhone, setWalletPhone] = useState('0988 123 456');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const draft = loadBankDraft();
    if (!draft) return;
    const bank = transferableBanks.find((b) => b.bin === draft.bin);
    if (bank) setSelectedBank(bank);
    setAccountNumber(draft.accountNumber);
    setAccountName(draft.accountName);
  }, []);

  if (!isOpen) return null;

  const quickAmounts = [50000, 100000, 200000, wallet.available];

  const isBankInfoValid =
    method !== 'bank' ||
    (Boolean(selectedBank) &&
      accountNumber.trim().length >= 5 &&
      accountName.trim().length >= 2);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 50000) {
      showToast('Số tiền rút tối thiểu là 50.000đ', 'error');
      return;
    }
    if (amount > wallet.available) {
      showToast('Số dư có thể rút không đủ', 'error');
      return;
    }
    if (method === 'bank') {
      if (!selectedBank) {
        showToast('Vui lòng chọn ngân hàng nhận tiền', 'error');
        return;
      }
      if (accountNumber.trim().length < 5) {
        showToast('Số tài khoản không hợp lệ', 'error');
        return;
      }
      if (accountName.trim().length < 2) {
        showToast('Vui lòng nhập tên chủ tài khoản', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const destination =
        method === 'bank'
          ? `${selectedBank!.shortName} - ${accountNumber.trim()}`
          : `${method === 'momo' ? 'MoMo' : 'ZaloPay'} ${walletPhone}`;

      const bankInfo =
        method === 'bank'
          ? {
              bankName: selectedBank!.shortName,
              bankAccountNumber: accountNumber.trim(),
              bankAccountName: accountName.trim().toUpperCase(),
            }
          : {
              bankName: method === 'momo' ? 'Ví MoMo' : 'Ví ZaloPay',
              bankAccountNumber: walletPhone,
              bankAccountName: 'Chủ tài khoản ví',
            };

      const res = await requestWithdrawal(amount, method, destination, bankInfo);
      setIsSubmitting(false);

      if (res.success) {
        if (method === 'bank') {
          saveBankDraft({
            bin: selectedBank!.bin,
            accountNumber: accountNumber.trim(),
            accountName: accountName.trim().toUpperCase(),
          });
        }
        setIsSuccess(true);
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err?.message || 'Có lỗi xảy ra khi tạo yêu cầu rút tiền', 'error');
    }
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-float border border-slate-200/90 overflow-hidden animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {isSuccess ? 'Rút tiền thành công' : 'Rút tiền về tài khoản'}
          </h3>
          <button
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition tap-active cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Result View */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-brand-700 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900 mb-1 tabular-nums">
                {formatVND(amount)}
              </h4>
              <p className="text-sm font-bold text-brand-700">
                Yêu cầu rút tiền đã được ghi nhận!
              </p>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Hệ thống đang đối soát và chuyển khoản tự động. Dự kiến hoàn tất trong 5 - 15 phút.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Hình thức:</span>
                <span className="font-extrabold text-slate-800 uppercase">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số dư khả dụng còn lại:</span>
                <span className="font-black text-brand-700 tabular-nums">{formatVND(wallet.available)}</span>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition tap-active shadow-2xs cursor-pointer"
            >
              Hoàn tất & xem giao dịch
            </button>
          </div>
        ) : (
          /* Withdrawal Form */
          <form onSubmit={handleWithdraw} className="space-y-4">
            {/* Available balance indicator */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-brand-900 block">Số dư có thể rút</span>
                <span className="text-xl font-black text-brand-800 tabular-nums">
                  {formatVND(wallet.available)}
                </span>
              </div>
              <span className="text-[10px] font-black text-brand-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Tối thiểu: 50.000đ
              </span>
            </div>

            {/* Method Tabs */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Chọn phương thức nhận tiền:
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-3 rounded-xl border text-center transition flex items-center justify-center gap-2 cursor-pointer tap-active ${
                    method === 'bank'
                      ? 'border-brand-600 bg-emerald-50/50 text-brand-700 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-brand-600" />
                  <span className="text-xs font-bold">Chuyển khoản Ngân hàng (Napas 24/7)</span>
                </button>
              </div>
            </div>

            {/* Account Details Selection */}
            {method === 'bank' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Ngân hàng nhận tiền:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(true)}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition tap-active cursor-pointer ${
                      selectedBank
                        ? 'border-brand-600 bg-emerald-50/30'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {selectedBank ? (
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={selectedBank.logo}
                          alt={selectedBank.shortName}
                          className="w-7 h-7 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="block text-sm font-bold text-slate-900 truncate">
                            {selectedBank.shortName}
                          </span>
                          <span className="block text-[10px] text-slate-500 truncate">
                            {selectedBank.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 font-medium">
                        Chọn ngân hàng nhận tiền
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Số tài khoản:
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value.replace(/\s/g, ''))
                    }
                    inputMode="numeric"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold tracking-wide focus:bg-white focus:border-brand-600 outline-none"
                    placeholder="Nhập số tài khoản nhận tiền..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Tên chủ tài khoản:
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold uppercase focus:bg-white focus:border-brand-600 outline-none"
                    placeholder="NGUYEN VAN A"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Số điện thoại {method === 'momo' ? 'MoMo' : 'ZaloPay'}:
                </label>
                <input
                  type="text"
                  value={walletPhone}
                  onChange={(e) => setWalletPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-brand-600 outline-none"
                  placeholder="Nhập số điện thoại đăng ký ví..."
                />
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Số tiền muốn rút (VNĐ):
              </label>
              <input
                type="number"
                min={50000}
                max={wallet.available}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-base font-extrabold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-brand-600 focus:bg-white outline-none tabular-nums"
              />

              {/* Quick Amount Pills */}
              <div className="flex gap-1.5 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer tap-active"
                  >
                    {q === wallet.available ? 'Tất cả' : formatVND(q).replace('đ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || amount < 50000 || amount > wallet.available || !isBankInfoValid}
              className="w-full h-11 sm:h-12 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-xl shadow-cta flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer tap-active"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Xác nhận rút {formatVND(amount)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <BankSelectModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSelect={(bank) => setSelectedBank(bank)}
        selectedBin={selectedBank?.bin}
      />
    </div>
  );
};
