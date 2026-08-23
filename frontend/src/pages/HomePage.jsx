import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Truck,
  Store,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Leaf
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/all'),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }

        if (prodRes.data.success) {
          const all = prodRes.data.data;
          setFeaturedProducts(all.slice(0, 8));
          // Filter top discounted products as deals
          const topDeals = [...all]
            .sort((a, b) => {
              const discA = (Number(a.mrp) - Number(a.price)) / Number(a.mrp);
              const discB = (Number(b.mrp) - Number(b.price)) / Number(b.mrp);
              return discB - discA;
            })
            .slice(0, 4);
          setDeals(topDeals);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F8A5F] via-[#085037] to-[#043322] text-white p-6 sm:p-12 shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-4">
        {/* Abstract background graphics */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>DMart Bachat Utsav • Minimum 20% to 45% Off</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            Daily Essentials at <span className="text-amber-300 underline decoration-amber-400">Guaranteed Lowest Prices</span>
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base mt-4 leading-relaxed font-medium max-w-xl">
            Stock up on farm-fresh vegetables, organic staples, premium dairy, and household essentials. Enjoy seamless <strong>Scheduled Store Pickup</strong> or doorstep <strong>Express Home Delivery</strong>!
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Link
              to="/products"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-amber-900/20 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SHOP NOW & SAVE</span>
            </Link>

            <Link
              to="/products?category=1"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>Fresh Farm Produce</span>
            </Link>
          </div>

          {/* Key metrics / trust pills */}
          <div className="mt-10 pt-6 border-t border-emerald-700/50 flex flex-wrap gap-6 text-xs text-emerald-200 font-medium">
            <span className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" /> 50+ Pickup Points
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" /> Free Delivery Over ₹500
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> 7-Day Easy Returns
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Handpicked grocery aisles for everyday home needs</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#0F8A5F] hover:text-[#085037] flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-[#0F8A5F] hover:shadow-lg hover:shadow-emerald-900/5 transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-50/70 p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-[#0F8A5F] line-clamp-1 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                Up to 30% Off
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Super Deal of the Day (Grid with savings highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500/10 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-sm">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>DMart Mega Savings Deals</span>
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md uppercase">
                    Limited Time
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Biggest price drops on bestsellers with maximum discount margins!
                </p>
              </div>
            </div>
            <Link
              to="/products"
              className="bg-[#0F8A5F] hover:bg-[#085037] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {deals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Everyday Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0F8A5F]" />
              <span>Trending Grocery Bestsellers</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Most loved staples, snacks, and personal care essentials</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#0F8A5F] hover:text-[#085037] flex items-center gap-1 group"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-72 border border-slate-200 animate-pulse p-4" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Store Pickup & Scheduled Delivery Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-800 to-[#0F8A5F] text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="relative z-10">
              <span className="bg-emerald-700/80 text-emerald-200 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                DMart Ready Pickup
              </span>
              <h3 className="text-2xl font-black mt-3 leading-tight">
                Order Online, Pickup at Your Convenience!
              </h3>
              <p className="text-xs text-emerald-100 mt-2 leading-relaxed max-w-md">
                Select your nearest DMart Ready pickup point, book a 2-hour collection time slot, and skip supermarket checkout queues entirely. <strong>Zero delivery fees!</strong>
              </p>
            </div>
            <div className="mt-6 relative z-10">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-[#0F8A5F] hover:bg-emerald-50 text-xs font-black px-6 py-3 rounded-xl shadow-md transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>FIND PICKUP STORE & ORDER</span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="relative z-10">
              <span className="bg-slate-800 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Home Doorstep Delivery
              </span>
              <h3 className="text-2xl font-black mt-3 leading-tight">
                Sanitized Doorstep Grocery Delivery
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md">
                Enjoy hassle-free home delivery straight to your kitchen. Fast dispatch, live order timeline tracking, and 7-day easy return policy for total peace of mind.
              </p>
            </div>
            <div className="mt-6 relative z-10">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-6 py-3 rounded-xl shadow-md transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>ORDER HOME DELIVERY</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
