import React, { useEffect, useState } from 'react';
import { Product, Order } from '../../types';
import { ExternalLink, CheckCircle2, Zap, X } from 'lucide-react';
import { formatVND } from '../../utils/format';
import { useAppStore } from '../../stores/useAppStore';
import { useNavigate } from 'react-router-dom';
import { getUserCashbackAmount } from '../../utils/cashback';

interface ShopeeRedirectModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShopeeRedirectModal: React.FC<ShopeeRedirectModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { createOrderFromProduct, showToast } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setStep(1);
      // Step 1 -> 2: convert link
      const timer1 = setTimeout(() => {
        setStep(2);
      }, 700);

      // Step 2 -> 3: ready and order created
      const timer2 = setTimeout(() => {
        const order = createOrderFromProduct(product);
        setCreatedOrder(order);
        setStep(3);
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Người mua nhận 70% tổng hoa hồng, khớp với LinkPreviewCard & ví
  const estimatedCashback = getUserCashbackAmount(product.price, product.cashbackRate);

  const handleOpenShopeeAndClose = () => {
    showToast(`Đã chuyển sang Shopee! Đơn #${createdOrder?.orderCode} đang chờ đối soát.`, 'success');
    onClose();
    const targetUrl = product.affiliateUrl || product.shopeeUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    navigate('/orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-float border border-slate-200/90 text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition tap-active cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Animation Header */}
        <div className="my-2">
          {step < 3 ? (
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-shopee-primary flex items-center justify-center mx-auto mb-3 animate-pulse border border-orange-100">
              <Zap className="w-7 h-7 fill-shopee-primary animate-bounce" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-700 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}

          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {step === 1 && 'Đang chuẩn hoá link Shopee...'}
            {step === 2 && 'Gắn mã hoàn tiền tiếp thị...'}
            {step === 3 && 'Sẵn sàng mua trên Shopee!'}
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {step < 3
              ? 'Hệ thống đang tích hợp mã an_redir để Shopee tự động ghi nhận hoàn tiền vào ví.'
              : 'Đã hoàn tất gắn mã! Bạn chỉ cần đặt hàng trên Shopee, tiền hoàn sẽ tự động ghi nhận.'}
          </p>
        </div>

        {/* Product summary card inside modal */}
        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-left flex gap-3 items-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
              {product.name}
            </h4>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="font-extrabold text-shopee-primary tabular-nums">
                {formatVND(product.price)}
              </span>
              <span className="font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded text-[11px] tabular-nums">
                Hoàn +{formatVND(estimatedCashback)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        {step === 3 ? (
          <div className="space-y-2">
            <button
              onClick={handleOpenShopeeAndClose}
              className="w-full h-11 sm:h-12 bg-shopee-primary hover:bg-[#D73211] text-white font-black text-sm rounded-xl shadow-orange-cta flex items-center justify-center gap-2 transition tap-active cursor-pointer"
            >
              <span>Mở Shopee & Mua Ngay</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/orders');
              }}
              className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Xem danh sách đơn hàng
            </button>
          </div>
        ) : (
          <div className="py-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full transition-all duration-500 rounded-full"
                style={{ width: step === 1 ? '40%' : '85%' }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block font-medium">
              Vui lòng đợi giây lát...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
