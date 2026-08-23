import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Check, ShieldCheck, Clock, Sparkles, Package, AlertCircle } from 'lucide-react';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id);
  const mrp = Number(product.mrp) || Number(product.price);
  const price = Number(product.price);
  const savings = Math.max(0, mrp - price);
  const discountPercent = mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAdd = () => {
    addToCart(product, selectedQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image side */}
            <div className="p-8 bg-slate-50 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{discountPercent}% OFF</span>
                </span>
              )}
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
                alt={product.name}
                className="max-h-64 max-w-full object-contain rounded-2xl drop-shadow-md"
              />

              <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Shelf Life: {product.shelfLife || 'Fresh Daily'}</span>
                </span>
                {product.isPerishable && (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Perishable
                  </span>
                )}
              </div>
            </div>

            {/* Details side */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-semibold">
                  <span className="text-[#0F8A5F]">{product.category?.name}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">{product.unit}</span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">By {product.brand || 'DMart Fresh'}</p>

                {/* Price tag */}
                <div className="mt-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-slate-900">₹{price.toFixed(0)}</span>
                    {mrp > price && (
                      <span className="text-sm text-slate-400 line-through font-semibold">
                        MRP ₹{mrp.toFixed(0)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-xs font-bold text-emerald-800 mt-1">
                      You Save ₹{savings.toFixed(0)} ({discountPercent}% Discount)
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Details</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-h-24 overflow-y-auto">
                    {product.description || 'Premium quality grocery staple sourced with stringent quality standards. Guaranteed fresh, hygienically packed, and delivered safely to your home or nearest pickup hub.'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                {isOutOfStock ? (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Currently Out of Stock
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button
                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200 shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-extrabold text-sm text-slate-800">{selectedQty}</span>
                      <button
                        onClick={() => setSelectedQty(Math.min(product.stockQuantity, selectedQty + 1))}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 active:scale-98 transition-all"
                    >
                      <Package className="w-4 h-4" />
                      <span>ADD TO BASKET • ₹{(price * selectedQty).toFixed(0)}</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#0F8A5F]" /> 100% Genuine</span>
                  <span>•</span>
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
