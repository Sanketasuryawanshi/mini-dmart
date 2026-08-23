import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Eye, Sparkles, AlertCircle } from 'lucide-react';

export default function ProductCard({ product, onQuickView }) {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const mrp = Number(product.mrp) || Number(product.price);
  const price = Number(product.price);
  const savings = Math.max(0, mrp - price);
  const discountPercent = mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex justify-between items-start pointer-events-none">
        {discountPercent > 0 ? (
          <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>{discountPercent}% OFF</span>
          </span>
        ) : <span />}

        {product.isPerishable && (
          <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-200">
            Fresh Pick
          </span>
        )}
      </div>

      {/* Product Image & Quick View button */}
      <div className="relative pt-4 px-4 pb-2 bg-slate-50/50 flex items-center justify-center h-48 overflow-hidden">
        <Link to={`/products/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
            alt={product.name}
            className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-[#0F8A5F] text-slate-600 hover:text-white p-2 rounded-xl shadow-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Unit */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="truncate max-w-[120px] font-semibold text-slate-500">{product.brand || 'DMart Grocery'}</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600 font-bold">{product.unit}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.id}`}
            className="font-bold text-slate-800 hover:text-[#0F8A5F] text-sm leading-snug line-clamp-2 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Stock Status */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          
          {/* DMart Savings Tag */}
          {savings > 0 && (
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Save ₹{savings.toFixed(0)}
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-black text-slate-900">
              ₹{price.toFixed(0)}
            </span>
            {mrp > price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                MRP ₹{mrp.toFixed(0)}
              </span>
            )}
          </div>

          {/* Low Stock indicator */}
          {isLowStock && (
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mb-2">
              <AlertCircle className="w-3 h-3" /> Only {product.stockQuantity} left!
            </p>
          )}

          {/* Add to Cart / Quantity Stepper */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full bg-emerald-50 hover:bg-[#0F8A5F] text-[#0F8A5F] hover:text-white font-extrabold text-xs py-2.5 rounded-xl border border-emerald-300 hover:border-[#0F8A5F] flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD TO CART</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#0F8A5F] text-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-7 h-7 rounded-lg bg-[#085037] hover:bg-emerald-800 flex items-center justify-center text-white transition-colors active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm px-2">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= product.stockQuantity}
                className="w-7 h-7 rounded-lg bg-[#085037] hover:bg-emerald-800 flex items-center justify-center text-white transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
