import React from 'react';
import { Copy, Compass, ShoppingCart, Banknote, ShieldAlert } from 'lucide-react';

export const StepProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Copy,
      title: 'Dán link Shopee',
      desc: 'Tìm món đồ bạn thích trên Shopee, sao chép link và dán vào thanh tìm kiếm của Hoàn Xu.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '02',
      icon: Compass,
      title: 'Mở link qua Hoàn Xu',
      desc: 'Hệ thống tự động tạo link mua hàng hợp lệ có gắn mã tiếp thị liên kết (affiliate).',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      step: '03',
      icon: ShoppingCart,
      title: 'Mua hàng trên Shopee',
      desc: 'Ứng dụng Shopee mở ra, bạn thanh toán như bình thường, vẫn áp mã giảm giá & freeship.',
      color: 'bg-orange-50 text-shopee-primary border-orange-200',
    },
    {
      step: '04',
      icon: Banknote,
      title: 'Nhận tiền hoàn về ví',
      desc: 'Shopee ghi nhận đơn hàng. Khi đơn hoàn thành đủ điều kiện, tiền hoàn được chuyển vào ví để rút.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <section className="bg-white rounded-brand-xl p-5 shadow-soft border border-slate-200">
      <div className="text-center max-w-sm mx-auto mb-6">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 inline-block mb-1.5">
          Minh bạch & Đơn giản
        </span>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Hoàn tiền hoạt động như thế nào?
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Chỉ cần 4 bước đơn giản, không phát sinh chi phí nào khác
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 relative">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="flex items-start gap-3.5 p-3 rounded-brand bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black text-slate-400">
                    BƯỚC {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Policy Clarification Card */}
      <div className="mt-5 p-3.5 rounded-brand bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-2">
        <div className="flex items-start gap-2 text-slate-700 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Lưu ý quan trọng về điều kiện hoàn tiền:</span>
        </div>
        <ul className="space-y-1.5 pl-6 text-slate-500 list-disc">
          <li>
            Tiền hoàn được ước tính dựa trên giá trị thanh toán thực tế của sản phẩm.
          </li>
          <li>
            Shopee sẽ đối soát và xác nhận đơn hàng sau khi bạn nhận hàng thành công và hết hạn đổi trả khiếu nại (thường từ 7 - 15 ngày).
          </li>
          <li>
            Đơn hàng bị hủy, trả hàng, hoặc vi phạm gian lận theo chính sách Shopee sẽ không được ghi nhận hoàn tiền.
          </li>
        </ul>
      </div>
    </section>
  );
};
