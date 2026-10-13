export type OrderStatus =
  | 'pending_record'    // Chờ ghi nhận
  | 'confirming'        // Đang xác nhận
  | 'confirmed'         // Đã xác nhận
  | 'cashback_paid'     // Đã hoàn tiền
  | 'cancelled';        // Đã hủy

export interface Product {
  id: string;
  itemId?: string;
  shopId?: string;
  name: string;
  shopName: string;
  isMall?: boolean;
  isPreferred?: boolean;
  price: number;
  originalPrice: number;
  discountPercent: number;
  cashbackRate: number; // e.g., 0.05 for 5%
  rating: number;
  reviewCount: number;
  soldCount: number;
  imageUrl: string;
  category: 'electronics' | 'fashion' | 'beauty' | 'home' | 'groceries' | 'tech';
  categoryName: string;
  shopeeUrl: string;
  affiliateUrl?: string;
  subId?: string;
  originLink?: string;
  highlights?: string[];
  inStock?: boolean;
  isHotDeal?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  shopName: string;
  price: number;
  cashbackRate: number;
  estimatedCashback: number;
}

export interface Order {
  id: string;
  orderCode: string;
  items: OrderItem[];
  totalAmount: number;
  estimatedCashback: number;
  actualCashback?: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedPaidDate?: string;
  note?: string;
  shopeeOrderRef?: string;
}

export type TransactionType =
  | 'cashback_received' // + Nhận hoàn tiền
  | 'cashback_pending'  // Ghi nhận chờ duyệt
  | 'withdrawal'        // - Rút tiền
  | 'referral_bonus'    // + Thưởng giới thiệu
  | 'cashback_cancelled'; // Hoàn tiền bị hủy

export interface CashbackTransaction {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  createdAt: string;
  status: 'completed' | 'processing' | 'cancelled';
  orderCode?: string;
  paymentMethod?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountValue: string;
  minSpend: number;
  category: string;
  expiryDate: string;
  claimedPercent: number;
  tag: 'Shopee Live' | 'Hoàn Xu Xtra' | 'Freeship Xtra' | 'Giảm Giá Sốc';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  memberTier: 'Bạc' | 'Vàng' | 'Kim Cương';
  referralCode: string;
  totalReferredCount: number;
  totalReferralBonus: number;
}

export interface WalletBalance {
  available: number;   // Có thể rút
  pending: number;     // Đang chờ xác nhận
  confirmed: number;   // Đã xác nhận chuẩn bị về ví
  totalCashback: number; // Tổng đã hoàn từ trước đến nay
}

export type WithdrawalMethod = 'bank' | 'momo' | 'zalopay';

export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}
