import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { getStatusConfig, formatVND, formatPercent, formatDate, formatDateTime } from '../utils/format';
import {
  ArrowLeft,
  Store,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders } = useAppStore();

  const order = orders.find((o) => o.id === id || o.orderCode === id);

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 mb-4">Không tìm thấy thông tin đơn hàng này.</p>
        <Link
          to="/orders"
          className="px-4 py-2 bg-brand-600 text-white font-bold text-sm rounded-brand"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const firstItem = order.items[0];

  const getTimelineSteps = () => {
    return [
      {
        title: 'Mở link & đặt hàng Shopee',
        desc: `Hoàn tất lúc ${formatDateTime(order.createdAt)}`,
        done: true,
      },
      {
        title: 'Shopee ghi nhận dữ liệu',
        desc: 'Đơn hàng được gán mã tiếp thị Hoàn Xu hợp lệ',
        done: order.status !== 'cancelled',
      },
      {
        title: 'Giao hàng thành công & hết hạn khiếu nại',
        desc: 'Shopee đối soát tình trạng đơn không đổi trả',
        done: order.status === 'confirmed' || order.status === 'cashback_paid',
      },
      {
        title: 'Tiền hoàn chuyển vào số dư ví',
        desc:
          order.status === 'cashback_paid'
            ? 'Đã cộng vào ví có thể rút ngay'
            : order.estimatedPaidDate
            ? `Dự kiến: ${formatDate(order.estimatedPaidDate)}`
            : 'Đang chờ đối soát hoàn tất',
        done: order.status === 'cashback_paid',
      },
    ];
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 tap-active"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>

      {/* Header status card */}
      <div className="bg-white rounded-brand-xl p-4 sm:p-5 border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
              Mã đơn hàng Hoàn Xu
            </span>
            <span className="text-base font-black font-mono text-slate-900">
              #{order.orderCode}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          {order.note || statusConfig.description}
        </p>

        {order.shopeeOrderRef && (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Mã đối soát Shopee:</span>
            <span className="font-mono font-bold text-slate-700">
              {order.shopeeOrderRef}
            </span>
          </div>
        )}
      </div>

      {/* Item info */}
      {firstItem && (
        <div className="bg-white rounded-brand-xl p-4 sm:p-5 border border-slate-200 shadow-soft">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Thông tin sản phẩm
          </h3>

          <div className="flex gap-3 items-start">
            <img
              src={firstItem.productImage}
              alt={firstItem.productName}
              className="w-20 h-20 rounded-lg object-cover border border-slate-100 shrink-0 bg-slate-50"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1 truncate">
                <Store className="w-3 h-3" /> {firstItem.shopName}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                {firstItem.productName}
              </h4>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Giá thanh toán:</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {formatVND(firstItem.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Cashback breakdown */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 bg-emerald-50/60 rounded-brand p-3 border border-emerald-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-900 font-semibold">Tỷ lệ hoàn tiền:</span>
              <span className="font-extrabold text-emerald-800">
                {formatPercent(firstItem.cashbackRate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {order.status === 'cashback_paid' ? 'Tiền đã hoàn vào ví:' : 'Tiền hoàn dự kiến:'}
              </span>
              <span className="text-lg font-black text-brand-700">
                +{formatVND(order.actualCashback || order.estimatedCashback)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="bg-white rounded-brand-xl p-4 sm:p-5 border border-slate-200 shadow-soft">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
          Tiến trình xác nhận đơn hàng
        </h3>

        <div className="relative pl-6 space-y-5">
          {/* Vertical connecting line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />

          {getTimelineSteps().map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                  step.done ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                )}
              </div>

              <div>
                <h4
                  className={`text-xs sm:text-sm font-bold ${
                    step.done ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ notice */}
      <div className="p-3.5 bg-slate-50 rounded-brand border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Cần hỗ trợ về đối soát đơn hàng? Bạn có thể gửi yêu cầu hỗ trợ kèm mã #{order.orderCode} tại trang Cá nhân.
        </span>
      </div>
    </div>
  );
};
