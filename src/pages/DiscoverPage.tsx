import React, { useState } from 'react';
import { mockProducts } from '../data/products';
import { mockVouchers } from '../data/vouchers';
import { ProductCard } from '../components/products/ProductCard';
import { VoucherCard } from '../components/products/VoucherCard';
import { Search, Flame, TrendingUp, Ticket, Coins } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'all' | 'deals' | 'popular' | 'vouchers' | 'top_cashback'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả ngành hàng' },
    { id: 'electronics', label: 'Điện Tử' },
    { id: 'beauty', label: 'Mỹ Phẩm' },
    { id: 'tech', label: 'Công Nghệ' },
    { id: 'home', label: 'Gia Dụng' },
    { id: 'fashion', label: 'Thời Trang' },
    { id: 'groceries', label: 'Bách Hóa' },
  ];

  // Filtering products
  const filteredProducts = mockProducts.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highCashbackDeals = [...filteredProducts].sort((a, b) => b.cashbackRate - a.cashbackRate);
  const mostPopular = [...filteredProducts].sort((a, b) => b.soldCount - a.soldCount);
  const highestCashbackAmount = [...filteredProducts].sort(
    (a, b) => b.price * b.cashbackRate - a.price * a.cashbackRate
  );

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Khám phá Deal Shopee
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Khám phá sản phẩm có tỷ lệ hoàn tiền cao nhất hôm nay
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm sản phẩm, thương hiệu Mall..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15 shadow-2xs font-medium transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all tap-active ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 shadow-2xs'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* SECTION NAV TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveSection('deals')}
          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition tap-active shadow-2xs ${
            activeSection === 'deals'
              ? 'bg-orange-50/70 border-orange-200/90 text-orange-950 font-bold ring-1 ring-orange-400/30'
              : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs block font-bold leading-tight truncate">Deal hoàn cao</span>
            <span className="text-[10px] text-slate-400 block font-normal">Đến 8%</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('popular')}
          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition tap-active shadow-2xs ${
            activeSection === 'popular'
              ? 'bg-blue-50/70 border-blue-200/90 text-blue-950 font-bold ring-1 ring-blue-400/30'
              : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs block font-bold leading-tight truncate">Mua nhiều</span>
            <span className="text-[10px] text-slate-400 block font-normal">Top bán chạy</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('vouchers')}
          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition tap-active shadow-2xs ${
            activeSection === 'vouchers'
              ? 'bg-amber-50/70 border-amber-200/90 text-amber-950 font-bold ring-1 ring-amber-400/30'
              : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs block font-bold leading-tight truncate">Voucher Shopee</span>
            <span className="text-[10px] text-slate-400 block font-normal">16 mã hot</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('top_cashback')}
          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition tap-active shadow-2xs ${
            activeSection === 'top_cashback'
              ? 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 font-bold ring-1 ring-brand-400/30'
              : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-brand-600 flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs block font-bold leading-tight truncate">Hoàn cao nhất</span>
            <span className="text-[10px] text-slate-400 block font-normal">Đến 249K/đơn</span>
          </div>
        </button>
      </div>

      {/* VOUCHER SECTION (If vouchers or all) */}
      {(activeSection === 'all' || activeSection === 'vouchers') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Ticket className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Voucher Shopee áp dụng kèm hoàn tiền
              </h3>
            </div>
            {activeSection !== 'vouchers' && (
              <button
                onClick={() => setActiveSection('vouchers')}
                className="text-xs text-brand-600 font-bold hover:text-brand-700 transition"
              >
                Xem tất cả
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {mockVouchers.slice(0, activeSection === 'vouchers' ? 16 : 4).map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        </section>
      )}

      {/* PRODUCTS GRID */}
      {activeSection !== 'vouchers' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              {activeSection === 'deals' && (
                <>
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                  <span>Deal hoàn tiền cao nhất</span>
                </>
              )}
              {activeSection === 'popular' && (
                <>
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                  <span>Đang được mua nhiều nhất</span>
                </>
              )}
              {activeSection === 'top_cashback' && (
                <>
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-brand-600 flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5" />
                  </span>
                  <span>Hoàn tiền cao nhất (VNĐ)</span>
                </>
              )}
              {activeSection === 'all' && (
                <>
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    ✨
                  </span>
                  <span>Gợi ý sản phẩm nổi bật</span>
                </>
              )}
            </h3>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(activeSection === 'deals'
              ? highCashbackDeals
              : activeSection === 'popular'
              ? mostPopular
              : activeSection === 'top_cashback'
              ? highestCashbackAmount
              : filteredProducts
            ).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
