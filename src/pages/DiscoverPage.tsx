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
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-brand text-xs sm:text-sm placeholder:text-slate-400 outline-none focus:border-brand-600 shadow-2xs font-medium"
        />
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition tap-active ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
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
          className={`p-2.5 rounded-brand border text-left flex items-center gap-2 transition tap-active ${
            activeSection === 'deals'
              ? 'bg-orange-50/80 border-orange-300 text-orange-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs block leading-tight">Deal hoàn cao</span>
            <span className="text-[10px] text-slate-400 block font-normal">Đến 8%</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('popular')}
          className={`p-2.5 rounded-brand border text-left flex items-center gap-2 transition tap-active ${
            activeSection === 'popular'
              ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs block leading-tight">Mua nhiều</span>
            <span className="text-[10px] text-slate-400 block font-normal">Top bán chạy</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('vouchers')}
          className={`p-2.5 rounded-brand border text-left flex items-center gap-2 transition tap-active ${
            activeSection === 'vouchers'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Ticket className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs block leading-tight">Voucher Shopee</span>
            <span className="text-[10px] text-slate-400 block font-normal">16 mã hot</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('top_cashback')}
          className={`p-2.5 rounded-brand border text-left flex items-center gap-2 transition tap-active ${
            activeSection === 'top_cashback'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Coins className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs block leading-tight">Hoàn cao nhất</span>
            <span className="text-[10px] text-slate-400 block font-normal">Đến 249K/đơn</span>
          </div>
        </button>
      </div>

      {/* VOUCHER SECTION (If vouchers or all) */}
      {(activeSection === 'all' || activeSection === 'vouchers') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Ticket className="w-4 h-4 text-amber-500" />
              🎟️ Voucher Shopee áp dụng kèm hoàn tiền
            </h3>
            {activeSection !== 'vouchers' && (
              <button
                onClick={() => setActiveSection('vouchers')}
                className="text-xs text-brand-600 font-bold"
              >
                Xem thêm
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
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              {activeSection === 'deals' && '🔥 Deal hoàn tiền cao nhất'}
              {activeSection === 'popular' && '📈 Đang được mua nhiều nhất'}
              {activeSection === 'top_cashback' && '💰 Hoàn tiền cao nhất (VNĐ)'}
              {activeSection === 'all' && '✨ Gợi ý sản phẩm nổi bật'}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
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
