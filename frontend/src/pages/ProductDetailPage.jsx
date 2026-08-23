import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import {
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Store,
  Clock,
  Sparkles,
  ChevronRight,
  Leaf,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          const prod = res.data.data;
          setProduct(prod);

          // Fetch related in category
          if (prod.category?.id) {
            const relRes = await api.get(`/products/category/${prod.category.id}`);
            if (relRes.data.success) {
              setRelatedProducts(relRes.data.data.filter((p) => p.id !== prod.id).slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse h-96" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">Product Not Found</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">The grocery item you requested does not exist or was removed.</p>
        <Link to="/products" className="bg-[#0F8A5F] text-white font-bold text-xs px-6 py-3 rounded-xl">
          Browse All Groceries
        </Link>
      </div>
    );
  }

  const mrp = Number(product.mrp) || Number(product.price);
  const price = Number(product.price);
  const savings = Math.max(0, mrp - price);
  const discountPercent = mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-[#0F8A5F]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-[#0F8A5F]">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${product.category?.id}`} className="hover:text-[#0F8A5F]">
          {product.category?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left: Product Image */}
          <div className="bg-slate-50/70 rounded-2xl p-8 flex flex-col items-center justify-center relative border border-slate-100">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{discountPercent}% SAVINGS</span>
              </span>
            )}

            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
              alt={product.name}
              className="max-h-80 max-w-full object-contain rounded-2xl drop-shadow-md hover:scale-105 transition-transform duration-300"
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shelf Life: <strong>{product.shelfLife || 'Fresh Daily'}</strong></span>
              </span>
              {product.isPerishable && (
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farm Fresh Produce</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span className="text-[#0F8A5F] bg-emerald-50 px-2.5 py-1 rounded-lg uppercase font-bold">
                  {product.category?.name}
                </span>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-bold">
                  Pack Size: {product.unit}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Brand: <strong>{product.brand || 'DMart Fresh'}</strong></p>

              {/* Price Banner */}
              <div className="mt-6 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">₹{price.toFixed(0)}</span>
                  {mrp > price && (
                    <span className="text-base text-slate-400 line-through font-semibold">
                      MRP ₹{mrp.toFixed(0)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-xs font-bold text-emerald-800">
                    DMart Discount: Save ₹{savings.toFixed(0)} ({discountPercent}% Below MRP)
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description || 'Premium quality grocery staple sourced with stringent quality standards. Guaranteed fresh, hygienically packed, and delivered safely to your home or nearest pickup hub.'}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {product.stockQuantity > 0 ? (
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>In Stock ({product.stockQuantity} available at warehouse)</span>
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Out of stock
                  </p>
                )}
              </div>
            </div>

            {/* Stepper and Add to Cart Button */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200 shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-extrabold text-sm text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 active:scale-98 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART • ₹{(price * quantity).toFixed(0)}</span>
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-500 font-medium">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <Store className="w-4 h-4 text-[#0F8A5F]" />
                  <span>Zero-Fee Pickup</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#0F8A5F]" />
                  <span>Express Delivery</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#0F8A5F]" />
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Similar Grocery Essentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
