import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  WalletBalance,
  Order,
  CashbackTransaction,
  Product,
  WithdrawalMethod,
} from '../types';
import { mockUser } from '../data/users';
import { mockOrders } from '../data/orders';
import { mockTransactions } from '../data/cashback';
import { mockProducts } from '../data/products';
import { affiliateApi, clearAuthTokens } from '../services/api';
import { getUserCashbackAmount, getUserCashbackRate } from '../utils/cashback';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  user: UserProfile;
  wallet: WalletBalance;
  orders: Order[];
  transactions: CashbackTransaction[];
  savedProductIds: string[];
  claimedVoucherIds: string[];
  currentPreviewProduct: Product | null;
  toast: ToastState;

  // Actions
  setUser: (user: UserProfile) => void;
  convertUrlToProduct: (url: string) => Product;
  convertUrlWithAffiliateApi: (
    url: string,
    subParams?: { sub1?: string; sub2?: string; sub3?: string; sub4?: string; sub5?: string }
  ) => Promise<{ product: Product; affiliateUrl: string; originLink: string; warnings: string[] }>;
  createOrderFromProduct: (product: Product) => Order;
  requestWithdrawal: (
    amount: number,
    method: WithdrawalMethod,
    destination: string
  ) => { success: boolean; message: string };
  toggleSaveProduct: (productId: string) => boolean;
  claimVoucher: (voucherId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  setCurrentPreviewProduct: (product: Product | null) => void;
  resetAllData: () => void;
  logout: () => void;
}

const initialWallet: WalletBalance = {
  available: 0,
  pending: 0,
  confirmed: 0,
  totalCashback: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: mockUser,
      wallet: initialWallet,
      orders: mockOrders,
      transactions: mockTransactions,
      savedProductIds: ['prod-001', 'prod-003', 'prod-008'],
      claimedVoucherIds: ['vc-001', 'vc-002'],
      currentPreviewProduct: mockProducts[0], // default featured preview
      toast: { show: false, message: '', type: 'info' },

      convertUrlToProduct: (url: string): Product => {
        const cleaned = url.trim().toLowerCase();
        // Check if any product keyword matches
        const matched = mockProducts.find((p) => {
          const nameKeywords = p.name.toLowerCase().split(' ');
          const urlMatches = nameKeywords.some(
            (k) => k.length > 3 && cleaned.includes(k)
          );
          return urlMatches || p.shopeeUrl.toLowerCase() === cleaned;
        });

        if (matched) {
          set({ currentPreviewProduct: matched });
          return matched;
        }

        // If not directly matched, pick deterministically based on hash of the url
        let hash = 0;
        for (let i = 0; i < url.length; i++) {
          hash = (hash << 5) - hash + url.charCodeAt(i);
          hash |= 0;
        }
        const index = Math.abs(hash) % mockProducts.length;
        const selected = mockProducts[index];
        set({ currentPreviewProduct: selected });
        return selected;
      },

      convertUrlWithAffiliateApi: async (
        url: string,
        subParams?: { sub1?: string; sub2?: string; sub3?: string; sub4?: string; sub5?: string }
      ) => {
        // const state = get();
        // Gọi API backend 2026 cơ chế an_redir (kèm token trong header)
        const res = await affiliateApi.generateAnRedirLink({
          url,
          sub1: subParams?.sub1 || '',
          sub2: subParams?.sub2 || '',
          sub3: subParams?.sub3 || '',
          sub4: subParams?.sub4 || '',
          sub5: subParams?.sub5 || '',
        });
        const resolvedItemId = res.itemId || res.product?.itemId;
        const price = res.product?.price && res.product.price > 0 ? res.product.price : 0;
        const originalPrice =
          res.product?.originalPrice && res.product.originalPrice > 0
            ? res.product.originalPrice
            : res.product?.price || 0;
        // Build thuần từ response API, không merge mock/base product.
        // Các trường Product bắt buộc mà API không trả về thì dùng default an toàn.
        const updatedProduct: Product = {
          id: resolvedItemId ? `shopee-${resolvedItemId}` : `aff-${Date.now()}`,
          itemId: resolvedItemId,
          shopId: res.shopId,
          name:
            res.product?.name && !res.product.name.startsWith('Shopee Product')
              ? res.product.name
              : 'Sản phẩm Shopee',
          shopName: res.product?.shopName || 'Shopee',
          price,
          originalPrice,
          discountPercent:
            originalPrice > price && originalPrice > 0
              ? Math.round((1 - price / originalPrice) * 100)
              : 0,
          cashbackRate: res.product?.commissionRate || 0,
          rating: res.product?.rating || 0,
          reviewCount: 0,
          soldCount: res.product?.soldCount || 0,
          imageUrl: res.product?.imageUrl || '',
          category: 'tech',
          categoryName: 'Công nghệ',
          shopeeUrl: res.affiliateUrl, // Gán link chuẩn an_redir 2026
          affiliateUrl: res.affiliateUrl,
          originLink: res.originLink,
          subId: res.subId,
        };

        set({ currentPreviewProduct: updatedProduct });
        return {
          product: updatedProduct,
          affiliateUrl: res.affiliateUrl,
          originLink: res.originLink,
          warnings: res.validation?.warnings || [],
        };
      },

      createOrderFromProduct: (product: Product): Order => {
        const timestamp = new Date().toISOString();
        const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `HX${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${randomCodeNum}`;
        // Người mua nhận 70% tổng hoa hồng (product.cashbackRate), app giữ 30%
        const userCashbackRate = getUserCashbackRate(product.cashbackRate);
        const estimatedCashback = getUserCashbackAmount(product.price, product.cashbackRate);

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderCode,
          shopeeOrderRef: `24${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          items: [
            {
              productId: product.id,
              productName: product.name,
              productImage: product.imageUrl,
              shopName: product.shopName,
              price: product.price,
              cashbackRate: userCashbackRate,
              estimatedCashback,
            },
          ],
          totalAmount: product.price,
          estimatedCashback,
          status: 'pending_record',
          createdAt: timestamp,
          updatedAt: timestamp,
          note: 'Đơn vừa được mở qua link Hoàn Xu. Hệ thống đang đồng bộ dữ liệu với Shopee (15-60 phút).',
        };

        const newTransaction: CashbackTransaction = {
          id: `tx-${Date.now()}`,
          type: 'cashback_pending',
          title: `Ghi nhận hoàn tiền đơn #${orderCode}`,
          description: `${product.name.slice(0, 38)}...`,
          amount: estimatedCashback,
          createdAt: timestamp,
          status: 'processing',
          orderCode,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          transactions: [newTransaction, ...state.transactions],
          wallet: {
            ...state.wallet,
            pending: state.wallet.pending + estimatedCashback,
            totalCashback: state.wallet.totalCashback + estimatedCashback,
          },
        }));

        return newOrder;
      },

      requestWithdrawal: (
        amount: number,
        method: WithdrawalMethod,
        destination: string
      ) => {
        const state = get();
        if (amount < 50000) {
          return {
            success: false,
            message: 'Số tiền rút tối thiểu là 50.000đ',
          };
        }
        if (amount > state.wallet.available) {
          return {
            success: false,
            message: 'Số dư có thể rút không đủ',
          };
        }

        const methodName =
          method === 'bank'
            ? 'Tài khoản Ngân hàng'
            : method === 'momo'
              ? 'Ví MoMo'
              : 'Ví ZaloPay';

        const newTx: CashbackTransaction = {
          id: `tx-${Date.now()}`,
          type: 'withdrawal',
          title: `Rút tiền về ${methodName}`,
          description: destination,
          amount: -amount,
          createdAt: new Date().toISOString(),
          status: 'completed',
          paymentMethod: methodName,
        };

        set((state) => ({
          wallet: {
            ...state.wallet,
            available: state.wallet.available - amount,
          },
          transactions: [newTx, ...state.transactions],
        }));

        return {
          success: true,
          message: 'Yêu cầu rút tiền đã được ghi nhận. Tiền sẽ về trong 5-15 phút.',
        };
      },

      toggleSaveProduct: (productId: string) => {
        const currentSaved = get().savedProductIds;
        const exists = currentSaved.includes(productId);
        if (exists) {
          set({ savedProductIds: currentSaved.filter((id) => id !== productId) });
          return false;
        } else {
          set({ savedProductIds: [...currentSaved, productId] });
          return true;
        }
      },

      claimVoucher: (voucherId: string) => {
        const claimed = get().claimedVoucherIds;
        if (!claimed.includes(voucherId)) {
          set({ claimedVoucherIds: [...claimed, voucherId] });
        }
      },

      setUser: (user: UserProfile) => {
        set({ user });
      },

      showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        set({ toast: { show: true, message, type } });
      },

      hideToast: () => {
        set({ toast: { show: false, message: '', type: 'info' } });
      },

      setCurrentPreviewProduct: (product: Product | null) => {
        set({ currentPreviewProduct: product });
      },

      resetAllData: () => {
        set({
          user: mockUser,
          wallet: initialWallet,
          orders: mockOrders,
          transactions: mockTransactions,
          savedProductIds: ['prod-001', 'prod-003', 'prod-008'],
          claimedVoucherIds: ['vc-001', 'vc-002'],
          currentPreviewProduct: mockProducts[0],
        });
      },

      logout: () => {
        // Xóa token đăng nhập (access + refresh)
        clearAuthTokens();
        // Reset toàn bộ state về mặc định prototype
        set({
          user: mockUser,
          wallet: initialWallet,
          orders: mockOrders,
          transactions: mockTransactions,
          savedProductIds: ['prod-001', 'prod-003', 'prod-008'],
          claimedVoucherIds: ['vc-001', 'vc-002'],
          currentPreviewProduct: mockProducts[0],
          toast: { show: false, message: '', type: 'info' },
        });
      },
    }),
    {
      name: 'hoan_xu_cashback_state_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
