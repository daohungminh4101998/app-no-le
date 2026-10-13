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
      <div className="bg-white rounded-brand-xl overflow-hidden border border-slate-200 shadow-soft">
        <div className="relative aspect-square bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isMall && (
            <span className="absolute top-3 left-3 bg-shopee-primary text-white text-xs font-black px-2 py-0.5 rounded shadow">
              Shopee Mall
            </span>
          )}
          {product.isPreferred && (
            <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded shadow">
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
              <span>{product.rating}</span>
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
            <span className="text-2xl font-black text-shopee-primary">
              {formatVND(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
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
          <div className="mt-4 p-4 rounded-brand bg-gradient-to-br from-emerald-50 via-teal-50/50 to-brand-50 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <span>💰</span> Quyền lợi hoàn tiền
              </span>
              <span className="text-xs font-extrabold text-brand-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                Hoàn {formatPercent(product.cashbackRate)}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Bạn nhận khoảng</span>
                <span className="text-2xl font-black text-brand-700">
                  +{formatVND(estimatedCashback)}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Vào ví Hoàn Xu
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-start gap-1.5 text-[11px] text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Tiền hoàn được xác nhận sau khi đơn hàng đủ điều kiện và hết hạn đổi trả của Shopee.
              </p>
            </div>
          </div>

          {/* Product Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Đặc điểm nổi bật
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
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

      {/* FIXED BOTTOM CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-float">
        <div className="max-w-md mx-auto p-3.5 safe-bottom flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Hoàn {formatPercent(product.cashbackRate)}
            </span>
            <span className="text-base font-black text-brand-700 block truncate">
              +{formatVND(estimatedCashback)}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-2 h-12 bg-shopee-primary hover:bg-[#D73211] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base px-6 rounded-brand shadow-orange-cta flex items-center justify-center gap-2 transition tap-active cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Mua và nhận hoàn tiền</span>
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
