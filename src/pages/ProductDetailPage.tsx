import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProducts } from '../data/products';
import { formatVND, formatPercent } from '../utils/format';
import { useAppStore } from '../stores/useAppStore';
import { ShopeeRedirectModal } from '../components/common/ShopeeRedirectModal';
import {
  ArrowLeft,
  Star,
  Store,
  ShieldCheck,
  Share2,
  Bookmark,
  ShoppingBag,
  Check,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleSaveProduct, savedProductIds, showToast } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 mb-4">Không tìm thấy sản phẩm này.</p>
        <Link
          to="/discover"
          className="px-4 py-2 bg-brand-600 text-white font-bold text-sm rounded-brand"
        >
          Khám phá sản phẩm khác
        </Link>
      </div>
    );
  }

  const isSaved = savedProductIds.includes(product.id);
  const estimatedCashback = Math.round(product.price * product.cashbackRate);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Đã sao chép link chia sẻ hoàn tiền!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top back & actions bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 tap-active"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const saved = toggleSaveProduct(product.id);
              showToast(
                saved ? 'Đã lưu sản phẩm vào danh sách!' : 'Đã bỏ lưu sản phẩm',
                'info'
              );
            }}
            className={`p-2 rounded-full border transition tap-active ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition tap-active"
          >
            {copied ? (
              <Check className="w-4 h-4 text-brand-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main product visual card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs">
        <div className="relative aspect-square bg-slate-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isMall && (
            <span className="absolute top-3.5 left-3.5 bg-[#EE4D2D] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
              Shopee Mall
            </span>
          )}
          {product.isPreferred && (
            <span className="absolute top-3.5 left-3.5 bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
              Shop Yêu thích
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {/* Shop & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              {product.shopName}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="tabular-nums text-slate-700">{product.rating}</span>
              <span className="text-slate-400 font-normal">
                ({product.reviewCount} đánh giá)
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3">
            {product.name}
          </h1>

          {/* Price Row */}
          <div className="flex items-baseline gap-2.5 pb-4 border-b border-slate-100">
            <span className="text-2xl font-black text-[#EE4D2D] tabular-nums tracking-tight">
              {formatVND(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through tabular-nums">
                {formatVND(product.originalPrice)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* CASHBACK HIGHLIGHT BOX */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-brand-50/50 border border-emerald-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>💰</span> Quyền lợi hoàn tiền Nô Tì
              </span>
              <span className="text-xs font-black text-brand-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300/80 tabular-nums">
                Hoàn {formatPercent(product.cashbackRate)}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Bạn nhận khoảng</span>
                <span className="text-2xl font-black text-brand-700 tabular-nums tracking-tight">
                  +{formatVND(estimatedCashback)}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Vào ví tiền hoàn
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-200/70 flex items-start gap-2 text-[11px] text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                Tiền hoàn được ghi nhận tự động sau khi đơn hàng giao thành công và hết hạn đổi trả của Shopee.
              </p>
            </div>
          </div>

          {/* Product Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                Đặc điểm nổi bật
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* FIXED BOTTOM CTA BAR (Aligned to max-w-lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-card">
        <div className="max-w-lg mx-auto p-3.5 safe-bottom flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
              Hoàn {formatPercent(product.cashbackRate)}
            </span>
            <span className="text-base font-black text-brand-700 block truncate tabular-nums">
              +{formatVND(estimatedCashback)}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-2 h-12 bg-[#EE4D2D] hover:bg-[#D73211] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base px-6 rounded-2xl shadow-cta flex items-center justify-center gap-2 transition-all tap-active cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Mua & nhận hoàn tiền</span>
          </button>
        </div>
      </div>

      {/* Shopee Simulation Modal */}
      <ShopeeRedirectModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
