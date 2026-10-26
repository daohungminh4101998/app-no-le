import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { LinkInput } from '../components/home/LinkInput';
import { LinkPreviewCard } from '../components/home/LinkPreviewCard';
import { StepProcess } from '../components/home/StepProcess';
import { ShopeeRedirectModal } from '../components/common/ShopeeRedirectModal';
import { Product } from '../types';
import { Zap, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatVND } from '../utils/format';

export const HomePage: React.FC = () => {
  const { currentPreviewProduct, wallet } = useAppStore();
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = (product: Product) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* Mini Wallet Glance Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center justify-center shadow-2xs">
            <Coins className="w-4.5 h-4.5 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Ví tiền hoàn của bạn
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
              Khả dụng: <span className="text-brand-700 tabular-nums">{formatVND(wallet.available)}</span>
            </span>
          </div>
        </div>

        <Link
          to="/wallet"
          className="text-xs font-bold text-brand-700 hover:text-brand-800 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 rounded-xl transition tap-active flex items-center gap-1 cursor-pointer"
        >
          <span>Xem ví</span>
          <span className="text-brand-500">→</span>
        </Link>
      </div>

      {/* CORE EXPERIENCE: Hero Link Input */}
      <section>
        <LinkInput />
      </section>

      {/* LINK CONVERSION RESULT PREVIEW */}
      {currentPreviewProduct && (
        <section className="space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Kết quả hoàn tiền
            </span>
            <span className="text-[11px] text-brand-700 font-bold bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded-full">
              Đã kiểm tra hợp lệ
            </span>
          </div>
          <LinkPreviewCard
            product={currentPreviewProduct}
            onPurchaseClick={handlePurchase}
          />
        </section>
      )}

      {/* TRUST SECTION: How cashback works */}
      <StepProcess />

      {/* Shopee Simulation Modal */}
      <ShopeeRedirectModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
