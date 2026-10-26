import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  UserProfile,
  WalletBalance,
  Order,
  CashbackTransaction,
  Product,
  Referral,
  WithdrawalMethod,
} from '../types';
import {
  affiliateApi,
  clearAuthTokens,
  isAuthenticated,
  userApi,
  withdrawalApi,
} from '../services/api';
import { getUserCashbackAmount, getUserCashbackRate } from '../utils/cashback';
import { getMemberTier } from '../utils/memberTier';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  user: UserProfile | null;
  wallet: WalletBalance;
  orders: Order[];
  transactions: CashbackTransaction[];
  referrals: Referral[];
  savedProductIds: string[];
  claimedVoucherIds: string[];
  currentPreviewProduct: Product | null;
  toast: ToastState;

  // Actions
  setUser: (user: UserProfile) => void;
  syncUserData: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshWalletData: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchReferrals: () => Promise<void>;
  convertUrlWithAffiliateApi: (
    url: string,
    subParams?: { sub1?: string; sub2?: string; sub3?: string; sub4?: string; sub5?: string }
  ) => Promise<{ product: Product; affiliateUrl: string; originLink: string; warnings: string[] }>;
  createOrderFromProduct: (product: Product) => Order;
  requestWithdrawal: (
    amount: number,
    method: WithdrawalMethod,
    destination: string,
    bankInfo?: { bankName: string; bankAccountNumber: string; bankAccountName: string }
  ) => Promise<{ success: boolean; message: string }>;
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
      user: null,
      wallet: initialWallet,
      orders: [],
      transactions: [],
      referrals: [],
      savedProductIds: [],
      claimedVoucherIds: [],
      currentPreviewProduct: null,
      toast: { show: false, message: '', type: 'info' },

      convertUrlWithAffiliateApi: async (
        url: string,
        subParams?: { sub1?: string; sub2?: string; sub3?: string; sub4?: string; sub5?: string }
      ) => {
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
          shopeeUrl: res.affiliateUrl,
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
        const orderCode = `HX${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${randomCodeNum}`;

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

      syncUserData: async () => {
        if (!isAuthenticated()) return;
        const state = get();
        await Promise.allSettled([
          state.refreshUserProfile(),
          state.refreshWalletData(),
          state.fetchUserOrders(),
          state.fetchReferrals(),
        ]);
      },

      /**
       * Lấy lại hồ sơ người dùng từ API (tên, email, SĐT, avatar, mã giới thiệu,
       * số lượng người được giới thiệu và tổng tiền thưởng giới thiệu).
       */
      refreshUserProfile: async () => {
        if (!isAuthenticated()) return;
        try {
          const profile = await userApi.getProfile();
          if (!profile) return;

          const state = get();
          set({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              phone: profile.phone ?? '',
              avatarUrl:
                profile.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`,
              memberTier: state.user?.memberTier ?? getMemberTier(state.wallet.totalCashback),
              referralCode: profile.referralCode,
              totalReferredCount: profile.totalReferredCount ?? 0,
              totalReferralBonus: profile.totalReferralBonus ?? 0,
            },
          });
        } catch (err: any) {
          console.warn('[useAppStore] refreshUserProfile error:', err?.message);
        }
      },

      /**
       * Lấy danh sách người dùng đã được giới thiệu kèm thưởng đã nhận.
       */
      fetchReferrals: async () => {
        if (!isAuthenticated()) return;
        try {
          const res = await userApi.getReferrals(1, 50);
          if (res?.items) {
            set({ referrals: res.items });
          }
        } catch (err: any) {
          console.warn('[useAppStore] fetchReferrals error:', err?.message);
        }
      },

      refreshWalletData: async () => {
        if (!isAuthenticated()) return;
        try {
          const [walletRes, txRes] = await Promise.all([
            userApi.getWallet(),
            userApi.getTransactions(1, 50),
          ]);

          if (walletRes) {
            const totalCashback = walletRes.totalEarned ?? 0;
            const state = get();
            set({
              wallet: {
                available: walletRes.availableBalance ?? 0,
                pending: walletRes.pendingBalance ?? 0,
                confirmed: walletRes.availableBalance ?? 0,
                totalCashback,
              },
              // Hạng thành viên phụ thuộc tổng tiền đã tích lũy
              ...(state.user
                ? { user: { ...state.user, memberTier: getMemberTier(totalCashback) } }
                : {}),
            });
          }

          if (txRes?.items) {
            const mappedTx: CashbackTransaction[] = txRes.items.map((tx) => {
              let type: CashbackTransaction['type'] = 'cashback_received';
              if (tx.type === 'CASHBACK_PENDING') type = 'cashback_pending';
              else if (tx.type === 'WITHDRAWAL') type = 'withdrawal';
              else if (tx.type === 'BONUS') type = 'referral_bonus';

              return {
                id: tx.id,
                type,
                title:
                  tx.description ||
                  (type === 'withdrawal' ? 'Rút tiền' : 'Hoàn tiền Shopee'),
                description: tx.referenceType
                  ? `${tx.referenceType} #${tx.referenceId || ''}`
                  : '',
                amount:
                  type === 'withdrawal' ? -Math.abs(tx.amount) : Math.abs(tx.amount),
                createdAt: tx.createdAt,
                status: 'completed',
              };
            });

            set({ transactions: mappedTx });
          }
        } catch (err: any) {
          console.warn('[useAppStore] refreshWalletData error:', err?.message);
        }
      },

      fetchUserOrders: async () => {
        if (!isAuthenticated()) return;
        try {
          const ordersRes = await userApi.getOrders(1, 50);
          if (ordersRes?.items) {
            const mappedOrders: Order[] = ordersRes.items.map((conv) => {
              let status: Order['status'] = 'confirming';
              if (conv.status === 'CONFIRMED') status = 'confirmed';
              else if (conv.status === 'CANCELLED') status = 'cancelled';
              else if (conv.cashbackAmount > 0) status = 'cashback_paid';

              return {
                id: conv.id,
                orderCode: conv.checkoutId,
                shopeeOrderRef: conv.checkoutId,
                items: [
                  {
                    productId: conv.externalItemId,
                    productName:
                      conv.itemName || `Sản phẩm Shopee #${conv.checkoutId}`,
                    productImage: conv.itemImage || '',
                    shopName: 'Shopee Store',
                    price: conv.orderAmount,
                    cashbackRate: conv.commissionRate,
                    estimatedCashback:
                      conv.cashbackAmount || conv.commissionAmount * 0.8,
                  },
                ],
                totalAmount: conv.orderAmount,
                estimatedCashback:
                  conv.cashbackAmount || conv.commissionAmount * 0.8,
                actualCashback: conv.cashbackAmount,
                status,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
              };
            });

            set({ orders: mappedOrders });
          }
        } catch (err: any) {
          console.warn('[useAppStore] fetchUserOrders error:', err?.message);
        }
      },

      requestWithdrawal: async (
        amount: number,
        method: WithdrawalMethod,
        destination: string,
        bankInfo?: { bankName: string; bankAccountNumber: string; bankAccountName: string }
      ) => {
        const state = get();

        if (amount < 50000) {
          return { success: false, message: 'Số tiền rút tối thiểu là 50.000đ' };
        }
        if (amount > state.wallet.available) {
          return { success: false, message: 'Số dư có thể rút không đủ' };
        }
        if (!isAuthenticated()) {
          return { success: false, message: 'Vui lòng đăng nhập để rút tiền' };
        }

        const methodName =
          method === 'bank'
            ? 'Tài khoản Ngân hàng'
            : method === 'momo'
              ? 'Ví MoMo'
              : 'Ví ZaloPay';

        try {
          await withdrawalApi.create({
            amount,
            bankName:
              bankInfo?.bankName ||
              (method === 'bank'
                ? destination.split(' - ')[0] || 'MB Bank'
                : methodName),
            bankAccountNumber:
              bankInfo?.bankAccountNumber ||
              (method === 'bank'
                ? destination.split(' - ')[1] || destination
                : destination),
            bankAccountName:
              bankInfo?.bankAccountName || state.user?.name || 'Người dùng',
          });

          // Tải lại ví & giao dịch từ server
          await state.refreshWalletData();

          return {
            success: true,
            message: 'Yêu cầu rút tiền đã được tạo thành công!',
          };
        } catch (err: any) {
          return {
            success: false,
            message: err?.message || 'Có lỗi xảy ra khi tạo yêu cầu rút tiền',
          };
        }
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
          user: null,
          wallet: initialWallet,
          orders: [],
          transactions: [],
          referrals: [],
          savedProductIds: [],
          claimedVoucherIds: [],
          currentPreviewProduct: null,
        });
      },

      logout: () => {
        clearAuthTokens();
        set({
          user: null,
          wallet: initialWallet,
          orders: [],
          transactions: [],
          referrals: [],
          savedProductIds: [],
          claimedVoucherIds: [],
          currentPreviewProduct: null,
          toast: { show: false, message: '', type: 'info' },
        });
      },
    }),
    {
      name: 'hoan_xu_cashback_state_v2',
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist những state không nhạy cảm / không cần fresh từ server mỗi lần
      partialize: (state) => ({
        savedProductIds: state.savedProductIds,
        claimedVoucherIds: state.claimedVoucherIds,
        currentPreviewProduct: state.currentPreviewProduct,
      }),
    }
  )
);
