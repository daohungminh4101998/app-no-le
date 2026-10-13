import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Mail, Lock, User, Phone, Gift, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { authApi, RegisterPayload, UserDto } from '../../services/api';
import { useAppStore } from '../../stores/useAppStore';
import { UserProfile } from '../../types';

// Map API UserDto → UserProfile used in the store
const mapUserDtoToProfile = (dto: UserDto): UserProfile => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  phone: dto.phone ?? '',
  avatarUrl: dto.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dto.name)}`,
  memberTier: 'Bạc',
  referralCode: dto.referralCode,
  totalReferredCount: 0,
  totalReferralBonus: 0,
});

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast, setUser } = useAppStore();
  const [isLoginTab, setIsLoginTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<RegisterPayload>({
    name: '',
    email: '',
    phone: '',
    password: '',
    referralCode: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isLoginTab) {
        // Đăng nhập
        const result = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        setUser(mapUserDtoToProfile(result.user));
        showToast(`Chào mừng trở lại, ${result.user.name}!`, 'success');
      } else {
        // Đăng ký
        if (!formData.name.trim()) {
          throw new Error('Vui lòng nhập họ và tên');
        }
        if (formData.password.length < 6) {
          throw new Error('Mật khẩu tối thiểu 6 ký tự');
        }

        const result = await authApi.register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || undefined,
          password: formData.password,
          referralCode: formData.referralCode?.trim() || undefined,
        });

        setUser(mapUserDtoToProfile(result.user));
        showToast(`Đăng ký thành công! Chào mừng ${result.user.name}`, 'success');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient badge */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition tap-active"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] mb-2 uppercase tracking-wider">
            🪙 Hoàn Xu Cashback
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {isLoginTab ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            {isLoginTab
              ? 'Đăng nhập để theo dõi đơn và số dư ví'
              : 'Tích lũy hoàn tiền mọi đơn hàng Shopee'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              !isLoginTab
                ? 'border-brand-600 text-brand-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Đăng Ký
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              isLoginTab
                ? 'border-brand-600 text-brand-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Đăng Nhập
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isLoginTab && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Họ và Tên
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Số Điện Thoại (Tùy chọn)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mã Giới Thiệu (Nếu có)
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="referralCode"
                  placeholder="Nhập mã bạn bè chia sẻ"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition uppercase"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 tap-active disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>{isLoginTab ? 'Đăng Nhập' : 'Tạo Tài Khoản Ngay'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 text-center border-t border-slate-100 text-[11px] text-slate-500">
          Bằng việc tiếp tục, bạn đồng ý với{' '}
          <span className="font-semibold text-brand-700">Điều khoản dịch vụ</span> của Hoàn Xu.
        </div>
      </div>
    </div>,
    document.body
  );
};
