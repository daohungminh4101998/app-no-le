import React, { useState } from "react";
import {
  Link2,
  ClipboardPaste,
  ArrowRight,
  Sparkles,
  // ShieldCheck,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
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

  const { convertUrlWithAffiliateApi, showToast, user } =
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
      showToast("Không thể đọc clipboard, hãy dán link thủ công.", "info");
    }
  };

  const processLink = async (url: string) => {
    setLoading(true);
    try {
      const result = await convertUrlWithAffiliateApi(url, {
        sub1: user?.id ?? ""
      });
    
      if (result.warnings && result.warnings.length > 0) {
        // Thông báo cho người dùng biết nếu hệ thống đã tự động gọt bỏ tham số rác
        showToast(result.warnings[0], "info");
      }
      if (onLinkConverted) onLinkConverted();
    } catch (err: any) {
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
      showToast(err?.message || "Có lỗi xảy ra, vui lòng thử lại.", "error");
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
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-card border border-slate-200/80 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Trust Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          Tiết kiệm thông minh
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          Cơ chế an_redir 2026
        </span>
      </div>

      {/* Hero Heading */}
      <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-2">
        Dán link sản phẩm Shopee.
        <br />
        <span className="text-brand-700">
          Nhận tiền hoàn trực tiếp vào ví.
        </span>
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-5 leading-relaxed">
        Chỉ cần sao chép link món đồ muốn mua trên Shopee và dán vào đây. Hệ thống tự động tạo mã nhận tiền hoàn cho bạn.
      </p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Link2 className="w-4.5 h-4.5 text-brand-600 stroke-[2.2]" />
          </div>

          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Dán link sản phẩm Shopee (shopee.vn/...)"
            className="w-full pl-10 pr-22 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 focus:border-brand-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-none transition font-medium"
          />

          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="absolute right-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1 tap-active cursor-pointer"
            title="Dán từ clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-slate-500" />
            <span>Dán link</span>
          </button>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 sm:h-12 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-cta flex items-center justify-center gap-2 transition tap-active disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang kiểm tra hoàn tiền...</span>
            </div>
          ) : (
            <>
              <span>Tạo link & Kiểm tra hoàn tiền</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Register / Login Modal popup if user not authenticated */}
      <RegisterModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
