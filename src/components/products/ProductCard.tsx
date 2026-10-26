import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Product } from '../../types';
import { formatVND } from '../../utils/format';
import { CashbackBadge } from '../common/CashbackBadge';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  const estimatedCashback = Math.round(product.price * product.cashbackRate);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />

        {/* Mall / Preferred Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isMall && (
            <span className="bg-[#EE4D2D] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase">
              Mall
            </span>
          )}
          {product.isPreferred && (
            <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase">
              Yêu thích
            </span>
          )}
        </div>

        {/* Cashback Tag floating */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <CashbackBadge rate={product.cashbackRate} variant="green" />
        </div>
      </Link>

      {/* Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="truncate max-w-[110px] font-medium">{product.shopName}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="tabular-nums text-slate-700">{product.rating}</span>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug hover:text-brand-600 transition mb-2.5"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Cashback Footer */}
        <div className="pt-2.5 border-t border-slate-100/90 mt-1">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-sm sm:text-base font-black text-[#EE4D2D] tabular-nums tracking-tight">
              {formatVND(product.price)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Cashback highlight banner */}
          <div className="bg-emerald-50/70 rounded-xl px-2.5 py-1.5 border border-emerald-100/80 flex items-center justify-between text-xs mb-2.5">
            <span className="text-[11px] text-emerald-800 font-medium">Hoàn khoảng</span>
            <span className="font-extrabold text-brand-700 tabular-nums">
              +{formatVND(estimatedCashback)}
            </span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="w-full h-8.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors tap-active shadow-2xs"
          >
            Mua & nhận hoàn tiền
          </Link>
        </div>
      </div>
    </div>
  );
};
