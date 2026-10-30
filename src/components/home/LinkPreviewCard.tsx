import React, { useState } from "react";
import { Product } from "../../types";
import { formatVND } from "../../utils/format";
import {
  ShoppingBag,
  Share2,
  Bookmark,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { useNavigate } from "react-router-dom";
import {
  getUserCashbackAmount,
  // getUserCashbackRate,
} from "../../utils/cashback";

interface LinkPreviewCardProps {
  product: Product;
  onPurchaseClick?: (product: Product) => void;
}

export const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({
  product,
  onPurchaseClick,
}) => {
  const navigate = useNavigate();
  const {
    toggleSaveProduct,
    savedProductIds,
    showToast,
    createOrderFromProduct,
  } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const isSaved = savedProductIds.includes(product.id);
  // Người mua chỉ nhận 70% tổng hoa hồng (product.cashbackRate), app giữ 30%
  // const userCashbackRate = getUserCashbackRate(product.cashbackRate);
  const estimatedCashback = getUserCashbackAmount(product.price, product.cashbackRate);

  const handleShare = () => {
    const linkToCopy =
      product.affiliateUrl || window.location.origin + `/product/${product.id}`;
    navigator.clipboard?.writeText(linkToCopy);
    setCopied(true);
    showToast("Đã sao chép", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = () => {
    // product.cashbackRate là tổng hoa hồng; store/modal tự chia 70% khi ghi nhận & hiển thị
    if (onPurchaseClick) {
      onPurchaseClick(product);
      return;
    }

    setRedirecting(true);
    // Mở link chuẩn an_redir 2026 hoặc shopeeUrl
    setTimeout(() => {
      const order = createOrderFromProduct(product);
      setRedirecting(false);
      showToast(
        `Đã mở Shopee! Đơn hàng #${order.orderCode} đã được ghi nhận.`,
        "success",
      );
      const targetUrl = product.affiliateUrl || product.shopeeUrl;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      navigate("/orders");
    }, 600);
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-card border border-emerald-300/60 overflow-hidden transition-all duration-200">
      {/* Top Banner indicating valid Shopee link converted */}
      <div className="bg-brand-700 px-4 py-2 text-white flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Link Shopee hợp lệ · Đã gắn mã Hoàn Xu</span>
        </div>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold">
          an_redir
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Product Meta Row */}
        <div className="flex gap-3.5 items-start mb-4">
          <div className="relative shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 sm:w-12 sm:h-12 object-cover rounded-xl border border-slate-100 shadow-2xs"
            />
            {product.isMall && (
              <span className="absolute bottom-1 left-1 bg-shopee-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                Mall
              </span>
            )}
            {product.isPreferred && (
              <span className="absolute bottom-1 left-1 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                Yêu thích
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-[11px] font-bold text-slate-400 truncate">
                {product.shopName}
              </p>
            </div>

            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug mb-1.5">
              {product.name}
            </h3>

            {(product.rating > 0 ||
              (product.soldCount && product.soldCount > 0)) && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                {product.rating > 0 && (
                  <span className="text-amber-500 font-bold flex items-center gap-0.5 text-xs">
                    ★ {product.rating.toFixed(1)}
                  </span>
                )}
                {product.soldCount > 0 && (
                  <span className="text-[11px] text-slate-400">
                    · Đã bán {product.soldCount.toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            )}

            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-shopee-primary tabular-nums">
                {formatVND(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CASHBACK HIGHLIGHT SPOTLIGHT */}
        <div className="bg-emerald-50/70 rounded-2xl p-3.5 sm:p-4 border border-emerald-200/90 mb-4 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-brand-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>💰</span> Tiền hoàn ước tính của bạn
            </span>
            <span className="text-[10px] font-black text-brand-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              Vào ví sau đối soát
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-brand-700 tracking-tight tabular-nums">
              +{formatVND(estimatedCashback)}
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] text-brand-900 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>
              Shopee tự động ghi nhận hoa hồng sau khi bạn hoàn tất đặt hàng.
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2">
          {/* Primary CTA */}
          <button
            onClick={handleBuy}
            disabled={redirecting}
            className="w-full h-11 sm:h-12 bg-shopee-primary hover:bg-[#D73211] active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-xl shadow-orange-cta flex items-center justify-center gap-2 transition duration-150 tap-active disabled:opacity-75 cursor-pointer"
          >
            {redirecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang kết nối Shopee...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Mua ngay trên Shopee & Nhận hoàn tiền</span>
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="h-10 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/90 flex items-center justify-center gap-1.5 transition tap-active cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-brand-700">Đã chép link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chia sẻ link</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const saved = toggleSaveProduct(product.id);
                showToast(
                  saved
                    ? "Đã lưu sản phẩm vào danh sách yêu thích!"
                    : "Đã bỏ lưu sản phẩm",
                  "info",
                );
              }}
              className={`h-10 px-3 font-bold text-xs rounded-xl border flex items-center justify-center gap-1.5 transition tap-active cursor-pointer ${
                isSaved
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90"
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-500 text-amber-500" : "text-slate-500"}`}
              />
              <span>{isSaved ? "Đã lưu deal" : "Lưu lại"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
