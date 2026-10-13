import React, { useState } from "react";
import {
  Link2,
  ClipboardPaste,
  ArrowRight,
  Sparkles,
  // ShieldCheck,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { mockProducts } from "../../data/products";
import { isAuthenticated } from "../../services/api";
import { RegisterModal } from "../auth/RegisterModal";

interface LinkInputProps {
  onLinkConverted?: () => void;
}

export const LinkInput: React.FC<LinkInputProps> = ({ onLinkConverted }) => {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const { convertUrlWithAffiliateApi, convertUrlToProduct, showToast, user } =
    useAppStore();

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          showToast("Đã dán link từ bộ nhớ tạm!", "info");
          return;
        }
      }
    } catch {
      // Fallback if clipboard permission denied
    }
    // Fallback sample
    const sample = mockProducts[0].shopeeUrl;
    setInputUrl(sample);
    showToast("Đã chọn link mẫu!", "info");
  };

  const processLink = async (url: string) => {
    setLoading(true);
    try {
      const result = await convertUrlWithAffiliateApi(url, {
        sub1: user.id,
      });
      showToast(
        "Đã tạo link Shopee an_redir 2026 và tính tiền hoàn!",
        "success",
      );
      if (result.warnings && result.warnings.length > 0) {
        // Thông báo cho người dùng biết nếu hệ thống đã tự động gọt bỏ tham số rác
        showToast(result.warnings[0], "info");
      }
      if (onLinkConverted) onLinkConverted();
    } catch (err: any) {
      console.warn("API error, fallback to local converter:", err);
      // Nếu là lỗi chưa đăng nhập hoặc 401
      if (err.message?.includes("401") || !isAuthenticated()) {
        setPendingUrl(url);
        setShowAuthModal(true);
        showToast(
          "Vui lòng đăng nhập để hệ thống ghi nhận hoa hồng & tiền hoàn!",
          "error",
        );
        return;
      }
      // Fallback nếu server chưa phản hồi kịp
      convertUrlToProduct(url);
      showToast("Đã tính toán số tiền hoàn dự kiến!", "info");
      if (onLinkConverted) onLinkConverted();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = inputUrl.trim();
    if (!url) {
      showToast("Vui lòng dán link sản phẩm Shopee", "error");
      return;
    }

    // Bắt buộc xác thực (Auth) trước khi gọi API tạo link
    if (!isAuthenticated()) {
      setPendingUrl(url);
      setShowAuthModal(true);
      showToast(
        "Vui lòng đăng nhập để tạo link affiliate và nhận hoàn tiền",
        "info",
      );
      return;
    }

    processLink(url);
  };

  // const handleSampleClick = (url: string) => {
  //   setInputUrl(url);
  //   if (!isAuthenticated()) {
  //     setPendingUrl(url);
  //     setShowAuthModal(true);
  //     showToast(
  //       "Vui lòng đăng nhập để tạo link affiliate và nhận hoàn tiền",
  //       "info",
  //     );
  //     return;
  //   }
  //   processLink(url);
  // };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    showToast("Đăng nhập thành công! Đang tiến hành tạo link...", "success");
    if (pendingUrl) {
      const urlToProcess = pendingUrl;
      setPendingUrl(null);
      processLink(urlToProcess);
    }
  };

  return (
    <div className="w-full bg-white rounded-brand-xl p-5 shadow-float border border-slate-200/90 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-emerald-100/60 to-amber-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* Hero Badge */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          🤑 Mua Shopee được hoàn tiền
        </span>
        {/* <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60">
          <ShieldCheck className="w-3 h-3 text-brand-600" />
          Cơ chế an_redir 2026
        </span> */}
      </div>

      {/* Hero Heading */}
      <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-2">
        Nhập link Shopee.
        <br />
        <span className="bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Tạo link Affiliate & Nhận hoàn tiền.
        </span>
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
        Hệ thống tự động chuẩn hoá link sang cơ chế{" "}
        <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[11px]">
          an_redir 2026
        </code>{" "}
        để bảo vệ 100% hoa hồng và tiền hoàn cho bạn.
      </p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Link2 className="w-5 h-5 text-brand-600" />
          </div>

          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Dán link sản phẩm Shopee (shopee.vn/product/...)"
            className="w-full pl-11 pr-24 py-3.5 text-sm sm:text-base bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-brand-600 focus:bg-white rounded-brand text-slate-900 placeholder:text-slate-400 outline-none transition shadow-inner font-medium"
          />

          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="absolute right-2 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1 tap-active"
            title="Dán từ clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-slate-600" />
            <span>Dán</span>
          </button>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 active:scale-[0.99] text-white font-bold text-base rounded-brand shadow-cta flex items-center justify-center gap-2 transition duration-150 tap-active disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang tạo link ...</span>
            </div>
          ) : (
            <>
              <span>Tạo link & Kiểm tra hoàn tiền</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Sample Links */}
      {/* <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Thử link mẫu có sẵn:
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">Hoàn đến 8%</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {mockProducts.slice(0, 4).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSampleClick(p.shopeeUrl)}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 transition font-medium flex items-center gap-1 tap-active"
            >
              <span>{p.name.split(' ').slice(0, 3).join(' ')}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-100 px-1 py-0.2 rounded">
                +{Math.round(p.cashbackRate * 100)}%
              </span>
            </button>
          ))}
        </div>
      </div> */}

      {/* Register / Login Modal popup if user not authenticated */}
      <RegisterModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
