import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { OrderStatus } from '../types';

dayjs.locale('vi');

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(Math.round(amount)) + 'đ';
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function formatDate(dateString: string, format = 'DD/MM/YYYY'): string {
  return dayjs(dateString).format(format);
}

export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format('HH:mm DD/MM/YYYY');
}

export function calculateEstimatedCashback(price: number, rate = 0.05): number {
  return Math.round(price * rate);
}

export function getStatusConfig(status: OrderStatus): {
  label: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  description: string;
} {
  switch (status) {
    case 'pending_record':
      return {
        label: 'Chờ ghi nhận',
        badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
        badgeText: 'text-amber-700',
        dotColor: 'bg-amber-500',
        description: 'Đơn hàng mới tạo qua link, hệ thống đang đồng bộ từ Shopee (15-60 phút)',
      };
    case 'confirming':
      return {
        label: 'Đang xác nhận',
        badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
        badgeText: 'text-blue-700',
        dotColor: 'bg-blue-500',
        description: 'Shopee đã ghi nhận đơn. Chờ giao hàng thành công & hết hạn trả hàng/hoàn tiền.',
      };
    case 'confirmed':
      return {
        label: 'Đã xác nhận',
        badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        badgeText: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
        description: 'Đơn hàng hoàn tất và hợp lệ. Tiền hoàn sắp chuyển vào số dư ví của bạn.',
      };
    case 'cashback_paid':
      return {
        label: 'Đã hoàn tiền',
        badgeBg: 'bg-green-100 border-green-300 text-green-800',
        badgeText: 'text-green-800',
        dotColor: 'bg-green-600',
        description: 'Tiền hoàn đã được cộng vào ví có thể rút ngay.',
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        badgeBg: 'bg-slate-100 border-slate-200 text-slate-500',
        badgeText: 'text-slate-500',
        dotColor: 'bg-slate-400',
        description: 'Đơn hàng bị hủy, trả hàng hoặc không đủ điều kiện chính sách Shopee.',
      };
    default:
      return {
        label: 'Không xác định',
        badgeBg: 'bg-slate-100 border-slate-200 text-slate-600',
        badgeText: 'text-slate-600',
        dotColor: 'bg-slate-400',
        description: 'Thông tin đang cập nhật',
      };
  }
}

/**
 * Checks if a string looks like a Shopee URL or product share link
 */
export function isShopeeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const cleaned = url.trim().toLowerCase();
  return (
    cleaned.includes('shopee.vn') ||
    cleaned.includes('shp.ee') ||
    cleaned.includes('vn.shp.ee') ||
    cleaned.includes('shope.ee')
  );
}
