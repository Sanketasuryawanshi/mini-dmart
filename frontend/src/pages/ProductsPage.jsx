import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Store,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: 0,
          size: 50,
          sortBy,
          sortDir,
        };

        if (selectedCategory) params.categoryId = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.data.content || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortBy, sortDir]);

  const handleCategoryClick = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === String(catId)) {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const activeCategoryName = categories.find((c) => String(c.id) === selectedCategory)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F8A5F] mb-1 uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Mini D-Mart Product Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {activeCategoryName ? activeCategoryName : searchQuery ? `Search: "${searchQuery}"` : 'All Grocery Items'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} products available for immediate store pickup & doorstep delivery
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb);
                setSortDir(sd);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="id-desc">Featured & Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0F8A5F]" />
                <span>Filters</span>
              </h3>
              {(selectedCategory || searchQuery || minPrice || maxPrice) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                    !selectedCategory ? 'bg-emerald-50 text-[#0F8A5F] font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  {!selectedCategory && <span className="w-2 h-2 rounded-full bg-[#0F8A5F]" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      selectedCategory === String(cat.id)
                        ? 'bg-emerald-50 text-[#0F8A5F] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {selectedCategory === String(cat.id) && (
                      <span className="w-2 h-2 rounded-full bg-[#0F8A5F]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Price Range (₹)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0F8A5F]"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0F8A5F]"
                />
              </div>
            </div>

            {/* DMart Savings Banner */}
            <div className="bg-amber-500/10 border border-amber-300 rounded-xl p-4 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>DMart Price Promise</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Every grocery item listed is priced strictly at or below MRP with authentic grocery savings.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Badges */}
          {(selectedCategory || searchQuery || minPrice || maxPrice) && (
            <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-semibold">Active Filters:</span>
              {activeCategoryName && (
                <span className="bg-emerald-50 text-[#0F8A5F] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  {activeCategoryName}
                  <button onClick={() => handleCategoryClick('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  Query: {searchQuery}
                  <button onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete('search');
                    setSearchParams(p);
                  }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {minPrice && (
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  Min: ₹{minPrice}
                  <button onClick={() => setMinPrice('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {maxPrice && (
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                  Max: ₹{maxPrice}
                  <button onClick={() => setMaxPrice('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse p-4" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">No Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                We could not find any items matching your selected filters. Try clearing your filters or searching for something else.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
