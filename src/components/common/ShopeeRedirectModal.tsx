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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-brand-xl p-5 shadow-float border border-slate-200 text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition tap-active"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Animation Header */}
        <div className="my-2">
          {step < 3 ? (
            <div className="w-16 h-16 rounded-full bg-orange-100 text-shopee-primary flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Zap className="w-8 h-8 fill-shopee-primary animate-bounce" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          )}

          <h3 className="text-lg font-black text-slate-900">
            {step === 1 && 'Đang chuyển đổi link...'}
            {step === 2 && 'Gắn mã hoàn tiền tiếp thị...'}
            {step === 3 && 'Sẵn sàng mua trên Shopee!'}
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {step < 3
              ? 'Hệ thống đang tích hợp mã theo dõi để Shopee ghi nhận hoàn tiền cho bạn.'
              : 'Đã gắn mã affiliate thành công. Sau khi bạn đặt hàng trên Shopee, tiền hoàn sẽ tự động ghi nhận.'}
          </p>
        </div>

        {/* Product summary card inside modal */}
        <div className="my-4 p-3 bg-slate-50 rounded-brand border border-slate-200 text-left flex gap-3 items-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
              {product.name}
            </h4>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="font-extrabold text-shopee-primary">
                {formatVND(product.price)}
              </span>
              <span className="font-black text-brand-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
                Hoàn +{formatVND(estimatedCashback)}
              </span>
            </div>
          </div>
        </div>

        {/* Steps simulation checklist */}
        <div className="space-y-2 text-left text-xs mb-5">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2
              className={`w-4 h-4 ${
                step >= 1 ? 'text-brand-600' : 'text-slate-300'
              }`}
            />
            <span>Kiểm tra sản phẩm & danh mục hợp lệ</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2
              className={`w-4 h-4 ${
                step >= 2 ? 'text-brand-600' : 'text-slate-300'
              }`}
            />
            <span>Gắn thẻ tracking đối soát tiếp thị Shopee</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2
              className={`w-4 h-4 ${
                step >= 3 ? 'text-brand-600' : 'text-slate-300'
              }`}
            />
            <span>Tạo đơn chờ ghi nhận #{createdOrder?.orderCode || '...'}</span>
          </div>
        </div>

        {/* Buttons */}
        {step === 3 ? (
          <div className="space-y-2">
            <button
              onClick={handleOpenShopeeAndClose}
              className="w-full h-11 bg-shopee-primary hover:bg-[#D73211] text-white font-extrabold text-sm rounded-brand shadow-orange-cta flex items-center justify-center gap-2 transition tap-active cursor-pointer"
            >
              <span>Mở Shopee & Mua Ngay</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/orders');
              }}
              className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-brand transition"
            >
              Xem danh sách đơn hàng của bạn
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
