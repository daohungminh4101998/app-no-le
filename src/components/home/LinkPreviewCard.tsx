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
    <div className="w-full bg-white rounded-brand-xl shadow-float border-2 border-brand-500/30 overflow-hidden transition-all duration-200">
      {/* Top Banner indicating valid Shopee link converted */}
      <div className="bg-gradient-to-r from-emerald-600 to-brand-700 px-4 py-2 text-white flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Link Shopee hợp lệ · Đã gắn mã Hoàn Xu</span>
        </div>
        {/* <div className="flex items-center gap-2">
          {product.itemId && (
            <span className="bg-black/25 text-emerald-100 text-[11px] px-2 py-0.5 rounded border border-emerald-300/30 font-mono">
              Item ID: <strong className="text-white">{product.itemId}</strong>
            </span>
          )}
          <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
            Xác thực 100%
          </span>
        </div> */}
      </div>

      <div className="p-4 sm:p-5">
        {/* Product Meta Row */}
        <div className="flex gap-3.5 items-start mb-4">
          <div className="relative shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-brand border border-slate-100 shadow-sm"
            />
            {product.isMall && (
              <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow">
                Shopee Mall
              </span>
            )}
            {product.isPreferred && (
              <span className="absolute bottom-1 left-1 bg-amber-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow">
                Yêu thích
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-xs font-semibold text-slate-500 truncate">
                {product.shopName}
              </p>
              {/* {product.itemId && (
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  ID:{" "}
                  <span className="text-slate-900 font-bold">
                    {product.itemId}
                  </span>
                </span>
              )} */}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-1">
              {product.name}
            </h3>

            {(product.rating > 0 ||
              (product.soldCount && product.soldCount > 0)) && (
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                {product.rating > 0 && (
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    ★ {product.rating.toFixed(1)}
                  </span>
                )}
                {product.soldCount > 0 && (
                  <span>
                    · Đã bán {product.soldCount.toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            )}

            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-shopee-primary">
                {formatVND(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
              {/* {product.discountPercent > 0 && (
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                  -{product.discountPercent}%
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* CASHBACK HIGHLIGHT SECTION */}
        <div className="bg-gradient-to-br from-emerald-50 via-brand-50/40 to-amber-50/50 rounded-brand p-4 border border-emerald-200/90 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <span>💰</span> Bạn được hoàn tiền
            </span>
            {/* <span className="text-xs font-extrabold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
              Hoàn dự kiến: {formatPercent(userCashbackRate)}
            </span> */}
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-brand-700 tracking-tight">
                +{formatVND(estimatedCashback)}
              </span>
            </div>
            {/* <span className="text-xs text-slate-500 font-medium">
              ≈ {formatPercent(userCashbackRate)} giá trị đơn (70% hoa hồng)
            </span> */}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] text-emerald-900">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              Tiền hoàn được ghi nhận vào ví ngay sau khi hoàn tất mua trên
              Shopee.
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2">
          {/* Primary CTA */}
          <button
            onClick={handleBuy}
            disabled={redirecting}
            className="w-full h-12 bg-shopee-primary hover:bg-[#D73211] active:scale-[0.99] text-white font-extrabold text-base rounded-brand shadow-orange-cta flex items-center justify-center gap-2 transition duration-150 tap-active disabled:opacity-75 cursor-pointer"
          >
            {redirecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang kết nối Shopee...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Mua và nhận hoàn tiền</span>
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-brand border border-slate-200 flex items-center justify-center gap-1.5 transition tap-active"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-brand-600" />
                  <span className="text-brand-600 font-bold">Đã chép link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
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
              className={`h-10 px-3 font-semibold text-xs sm:text-sm rounded-brand border flex items-center justify-center gap-1.5 transition tap-active ${
                isSaved
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-amber-500 text-amber-500" : "text-slate-500"}`}
              />
              <span>{isSaved ? "Đã lưu deal" : "Lưu lại xem sau"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
