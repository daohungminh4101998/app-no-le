import React, { useMemo, useState } from 'react';
import { X, Search, Check, Building2 } from 'lucide-react';
import { Bank } from '../../types';
import { popularBanks, searchBanks, transferableBanks } from '../../data/banks';

interface BankSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bank: Bank) => void;
  selectedBin?: string;
}

const BankLogo: React.FC<{ bank: Bank }> = ({ bank }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
        <Building2 className="w-[18px] h-[18px] text-emerald-600" />
      </div>
    );
  }

  return (
    <img
      src={bank.logo}
      alt={bank.shortName}
      loading="lazy"
      onError={() => setHasError(true)}
      className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 p-1 shrink-0"
    />
  );
};

const BankRow: React.FC<{
  bank: Bank;
  isSelected: boolean;
  onSelect: (bank: Bank) => void;
}> = ({ bank, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(bank)}
    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition tap-active cursor-pointer ${
      isSelected
        ? 'border-brand-600 bg-emerald-50/50 shadow-2xs'
        : 'border-slate-200/80 bg-white hover:bg-slate-50'
    }`}
  >
    <BankLogo bank={bank} />
    <div className="min-w-0 flex-1">
      <span
        className={`block text-xs sm:text-sm font-bold truncate ${
          isSelected ? 'text-brand-900' : 'text-slate-900'
        }`}
      >
        {bank.shortName}
      </span>
      <span className="block text-[11px] text-slate-400 truncate font-medium">{bank.name}</span>
    </div>
    {isSelected && <Check className="w-4.5 h-4.5 text-brand-700 shrink-0 stroke-[2.5]" />}
  </button>
);

export const BankSelectModal: React.FC<BankSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedBin,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchBanks(query), [query]);
  const isSearching = query.trim().length > 0;

  if (!isOpen) return null;

  const handleSelect = (bank: Bank) => {
    onSelect(bank);
    setQuery('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-float border border-slate-200/90 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Chọn ngân hàng nhận tiền</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hệ thống chuyển khoản Napas 24/7
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition tap-active cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-brand-600 outline-none placeholder:text-slate-400"
              placeholder="Tìm theo tên ngân hàng (Vietcombank, MB, Techcombank...)"
            />
            {isSearching && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bank list */}
        <div className="px-5 pb-5 overflow-y-auto overscroll-contain">
          {results.length === 0 ? (
            <div className="py-10 text-center">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Không tìm thấy ngân hàng</p>
              <p className="text-xs text-slate-400 mt-1">
                Thử tìm bằng tên khác hoặc mã ngân hàng (BIN)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {!isSearching && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Ngân hàng phổ biến
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {popularBanks.map((bank) => (
                      <BankRow
                        key={bank.bin}
                        bank={bank}
                        isSelected={bank.bin === selectedBin}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  {isSearching
                    ? `Kết quả (${results.length})`
                    : `Tất cả ngân hàng (${transferableBanks.length})`}
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {results.map((bank) => (
                    <BankRow
                      key={bank.bin}
                      bank={bank}
                      isSelected={bank.bin === selectedBin}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
