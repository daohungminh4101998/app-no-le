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
      className="block bg-white rounded-brand border border-slate-200 shadow-soft hover:shadow-float hover:border-brand-500/40 transition-all p-3.5 sm:p-4 tap-active"
    >
      {/* Header: Order Code & Status Badge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-800">
            #{order.orderCode}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
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
            className="w-16 h-16 rounded-lg object-cover border border-slate-100 shrink-0 bg-slate-50"
          />

          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5 truncate">
              <Store className="w-3 h-3" />
              {firstItem.shopName}
            </p>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 leading-snug">
              {firstItem.productName}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">
                Giá: <strong className="text-slate-800">{formatVND(order.totalAmount)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cashback highlight & action footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Hoàn dự kiến:</span>
          <span className="font-extrabold text-brand-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            +{formatVND(order.actualCashback || order.estimatedCashback)}
          </span>
        </div>

        <span className="text-slate-400 font-semibold text-xs inline-flex items-center group-hover:text-brand-600 transition">
          Chi tiết <ChevronRight className="w-4 h-4 ml-0.5" />
        </span>
      </div>
    </Link>
  );
};
