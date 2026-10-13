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
    <div className="group bg-white rounded-brand border border-slate-200/90 shadow-soft overflow-hidden hover:shadow-float hover:border-brand-500/50 transition-all duration-200 flex flex-col h-full">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Mall / Preferred Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isMall && (
            <span className="bg-shopee-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
              Mall
            </span>
          )}
          {product.isPreferred && (
            <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
              Yêu thích
            </span>
          )}
        </div>

        {/* Cashback Tag floating */}
        <div className="absolute bottom-2 right-2">
          <CashbackBadge rate={product.cashbackRate} variant="green" />
        </div>
      </Link>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="truncate max-w-[120px]">{product.shopName}</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-brand-600 transition mb-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Cashback Footer */}
        <div className="pt-2 border-t border-slate-100 mt-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm sm:text-base font-extrabold text-shopee-primary">
              {formatVND(product.price)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Cashback highlight banner */}
          <div className="bg-emerald-50 rounded-lg p-1.5 border border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-emerald-800 font-medium">Hoàn khoảng</span>
            <span className="font-extrabold text-brand-700">
              +{formatVND(estimatedCashback)}
            </span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="w-full mt-2.5 h-8 bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center transition tap-active"
          >
            Mua & nhận hoàn tiền
          </Link>
        </div>
      </div>
    </div>
  );
};
