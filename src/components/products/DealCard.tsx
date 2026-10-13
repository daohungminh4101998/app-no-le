import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatVND, formatPercent } from '../../utils/format';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DealCardProps {
  product: Product;
}

export const DealCard: React.FC<DealCardProps> = ({ product }) => {
  const estimatedCashback = Math.round(product.price * product.cashbackRate);

  return (
    <Link
      to={`/product/${product.id}`}
      className="flex gap-3 p-3 bg-white rounded-brand border border-slate-200/90 shadow-soft hover:shadow-float hover:border-brand-500/40 transition tap-active group"
    >
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-extrabold px-1 rounded shadow">
          Hoàn {formatPercent(product.cashbackRate)}
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
            {product.categoryName}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition">
            {product.name}
          </h4>
        </div>

        <div className="mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-shopee-primary">
              {formatVND(product.price)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="inline-flex items-center gap-1 font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              +{formatVND(estimatedCashback)}
            </span>
            <span className="text-slate-400 text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center">
              Xem <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
