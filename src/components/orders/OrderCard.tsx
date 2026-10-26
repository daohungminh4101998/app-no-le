import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Store, Sparkles } from 'lucide-react';
import { Order } from '../../types';
import { formatVND, formatDate } from '../../utils/format';
import { StatusBadge } from '../common/StatusBadge';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const firstItem = order.items[0];

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all duration-150 p-3.5 sm:p-4 tap-active cursor-pointer"
    >
      {/* Header: Order Code & Status Badge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-slate-900">
            #{order.orderCode}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3" />
            {formatDate(order.createdAt)}
          </span>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      {/* Main product item row */}
      {firstItem && (
        <div className="flex gap-3 items-center">
          <img
            src={firstItem.productImage}
            alt={firstItem.productName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
          />

          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5 truncate font-medium">
              <Store className="w-3 h-3" />
              {firstItem.shopName}
            </p>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
              {firstItem.productName}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">
                Giá: <strong className="text-slate-800 tabular-nums">{formatVND(order.totalAmount)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cashback highlight & action footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px]">Hoàn dự kiến:</span>
          <span className="font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/80 inline-flex items-center gap-1 tabular-nums">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            +{formatVND(order.actualCashback || order.estimatedCashback)}
          </span>
        </div>

        <span className="text-slate-400 font-bold text-xs inline-flex items-center group-hover:text-slate-700 transition">
          Chi tiết <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </Link>
  );
};
