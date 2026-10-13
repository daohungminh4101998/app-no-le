import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { LinkInput } from '../components/home/LinkInput';
import { LinkPreviewCard } from '../components/home/LinkPreviewCard';
import { StepProcess } from '../components/home/StepProcess';
import { DealCard } from '../components/products/DealCard';
import { ShopeeRedirectModal } from '../components/common/ShopeeRedirectModal';
import { mockProducts } from '../data/products';
import { Product } from '../types';
import { Flame, ArrowRight, Zap, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatVND } from '../utils/format';

export const HomePage: React.FC = () => {
  const { currentPreviewProduct, wallet } = useAppStore();
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hotDeals = mockProducts.filter((p) => p.isHotDeal).slice(0, 4);

  const handlePurchase = (product: Product) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Mini Wallet Bar for immediate gratification */}
      <div className="bg-white rounded-brand p-3 border border-slate-200/90 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-brand-600">
            <Coins className="w-4 h-4 fill-emerald-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Ví Hoàn Xu của bạn
            </span>
            <span className="text-sm font-black text-slate-800">
              Có thể rút: <span className="text-brand-700">{formatVND(wallet.available)}</span>
            </span>
          </div>
        </div>

        <Link
          to="/wallet"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 px-2.5 py-1 bg-brand-50 hover:bg-brand-100 rounded-lg transition"
        >
          Xem ví & rút
        </Link>
      </div>

      {/* CORE EXPERIENCE: Hero Link Input */}
      <section>
        <LinkInput />
      </section>

      {/* LINK CONVERSION RESULT PREVIEW */}
      {currentPreviewProduct && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" /> Kết quả kiểm tra hoàn tiền
            </span>
            <span className="text-xs text-brand-600 font-bold">Sẵn sàng kích hoạt</span>
          </div>
          <LinkPreviewCard
            product={currentPreviewProduct}
            onPurchaseClick={handlePurchase}
          />
        </section>
      )}

      {/* Real-time live cashback activity ticker */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-brand p-2.5 border border-emerald-200/70 flex items-center gap-2 overflow-hidden text-xs">
        <span className="shrink-0 flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <div className="truncate text-slate-700 font-medium">
          <strong className="text-emerald-800 font-bold">lananh_98</strong> vừa nhận hoàn{' '}
          <strong className="text-brand-700">+34.800đ</strong> từ đơn Kem chống nắng La Roche-Posay
        </div>
      </div>

      {/* HOT DEALS PREVIEW */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              🔥 Deal hoàn tiền cao hôm nay
            </h3>
          </div>
          <Link
            to="/discover"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {hotDeals.map((product) => (
            <DealCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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
