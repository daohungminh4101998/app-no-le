import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { formatVND } from '../utils/format';
import { WithdrawalMethod } from '../types';
import { defaultSavedBankAccounts } from '../data/users';
import { ArrowLeft, Building2, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, requestWithdrawal, showToast } = useAppStore();
  const [method, setMethod] = useState<WithdrawalMethod>('bank');
  const [amount, setAmount] = useState<number>(wallet.available > 50000 ? 100000 : wallet.available);
  const [selectedBank, setSelectedBank] = useState(defaultSavedBankAccounts[0]);
  const [walletPhone, setWalletPhone] = useState('0988 123 456');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickAmounts = [50000, 100000, 200000, wallet.available];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 50000) {
      showToast('Số tiền rút tối thiểu là 50.000đ', 'error');
      return;
    }
    if (amount > wallet.available) {
      showToast('Số dư có thể rút không đủ', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const destination =
        method === 'bank'
          ? `${selectedBank.bankName} - ${selectedBank.accountNumber}`
          : `${method === 'momo' ? 'MoMo' : 'ZaloPay'} ${walletPhone}`;

      const res = requestWithdrawal(amount, method, destination);
      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    }, 600);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 tap-active"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại ví</span>
      </button>

      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Rút tiền về tài khoản
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Miễn phí chuyển khoản 24/7 qua hệ thống Napas & Ví điện tử
        </p>
      </div>

      <div className="bg-white rounded-brand-xl p-5 border border-slate-200 shadow-soft">
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                {formatVND(amount)}
              </h3>
              <p className="text-sm font-semibold text-brand-700">
                Yêu cầu rút tiền đã được ghi nhận!
              </p>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Hệ thống đang tiến hành đối soát và giải ngân tự động. Dự kiến trong 5 - 15 phút.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-brand border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Hình thức:</span>
                <span className="font-bold text-slate-800 uppercase">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số dư khả dụng còn lại:</span>
                <span className="font-bold text-brand-700">{formatVND(wallet.available)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/wallet')}
              className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-brand transition tap-active shadow-cta"
            >
              Xem lịch sử giao dịch
            </button>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4">
            {/* Balance banner */}
            <div className="bg-emerald-50 p-3.5 rounded-brand border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-900 block">
                  Số dư có thể rút
                </span>
                <span className="text-2xl font-black text-brand-800">
                  {formatVND(wallet.available)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                Tối thiểu: 50.000đ
              </span>
            </div>

            {/* Methods */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Phương thức nhận tiền:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-3 rounded-brand border text-center transition flex flex-col items-center gap-1.5 ${
                    method === 'bank'
                      ? 'border-brand-600 bg-emerald-50/50 text-brand-700 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">Ngân hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('momo')}
                  className={`p-3 rounded-brand border text-center transition flex flex-col items-center gap-1.5 ${
                    method === 'momo'
                      ? 'border-[#A50064] bg-pink-50/50 text-[#A50064] font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#A50064]" />
                  <span className="text-xs">Ví MoMo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('zalopay')}
                  className={`p-3 rounded-brand border text-center transition flex flex-col items-center gap-1.5 ${
                    method === 'zalopay'
                      ? 'border-[#0068FF] bg-blue-50/50 text-[#0068FF] font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#0068FF]" />
                  <span className="text-xs">ZaloPay</span>
                </button>
              </div>
            </div>

            {/* Bank details */}
            {method === 'bank' ? (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chọn tài khoản ngân hàng:
                </label>
                <div className="space-y-2">
                  {defaultSavedBankAccounts.map((b) => (
                    <div
                      key={b.accountNumber}
                      onClick={() => setSelectedBank(b)}
                      className={`p-3 rounded-brand border text-xs cursor-pointer flex items-center justify-between transition ${
                        selectedBank.accountNumber === b.accountNumber
                          ? 'border-brand-600 bg-emerald-50/40 text-brand-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="block text-sm">{b.bankName}</span>
                        <span className="text-slate-500 font-mono">
                          {b.accountNumber} · {b.accountName}
                        </span>
                      </div>
                      {selectedBank.accountNumber === b.accountNumber && (
                        <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Số điện thoại đăng ký {method === 'momo' ? 'MoMo' : 'ZaloPay'}:
                </label>
                <input
                  type="text"
                  value={walletPhone}
                  onChange={(e) => setWalletPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-brand font-medium focus:bg-white focus:border-brand-600 outline-none"
                  placeholder="0988 123 456"
                />
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nhập số tiền muốn rút (VNĐ):
              </label>
              <input
                type="number"
                min={50000}
                max={wallet.available}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-3 text-lg font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-brand focus:border-brand-600 focus:bg-white outline-none"
              />

              <div className="flex gap-2 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {q === wallet.available ? 'Tất cả' : formatVND(q).replace('đ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting || amount < 50000 || amount > wallet.available}
              className="w-full h-12 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-base rounded-brand shadow-cta flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer tap-active"
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
    </div>
  );
};
