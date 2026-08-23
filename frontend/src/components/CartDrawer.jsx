import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    totalMrp,
    subtotal,
    totalSavings,
    deliveryFee,
    finalTotal,
    freeDeliveryProgress,
    amountNeededForFreeDelivery
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceed = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#0F8A5F] text-white rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">My Grocery Cart</h3>
                <p className="text-xs text-slate-500">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in basket</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Banner Progress */}
          <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0F8A5F]" />
                {amountNeededForFreeDelivery > 0
                  ? `Add ₹${amountNeededForFreeDelivery.toFixed(0)} more for FREE Delivery`
                  : '🎉 You unlocked FREE Delivery!'}
              </span>
              <span className="text-[11px] text-emerald-700">{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0F8A5F] h-2 rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-slate-700 text-lg">Your cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6">
                  Explore our grocery aisles and stock up on daily essentials with exclusive DMart savings!
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/products');
                  }}
                  className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const itemMrp = Number(product.mrp) || Number(product.price);
                const itemPrice = Number(product.price);
                const itemSavings = Math.max(0, itemMrp - itemPrice) * quantity;

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-colors"
                  >
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">{product.unit}</p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{(itemPrice * quantity).toFixed(0)}
                        </span>
                        {itemMrp > itemPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{(itemMrp * quantity).toFixed(0)}
                          </span>
                        )}
                        {itemSavings > 0 && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-1.5 rounded">
                            Save ₹{itemSavings.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockQuantity}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 space-y-3">
              
              {/* Savings pill banner */}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-amber-900 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Your Total DMart Savings:</span>
                  </span>
                  <span className="text-amber-700 font-extrabold text-sm">₹{totalSavings.toFixed(0)}</span>
                </div>
              )}

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Total (MRP)</span>
                  <span className="line-through text-slate-400">₹{totalMrp.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>DMart Discount</span>
                  <span>- ₹{totalSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-700 uppercase">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-base text-[#0F8A5F]">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={clearCart}
                  className="p-3 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                  title="Clear basket"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 active:scale-98 transition-all"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#0F8A5F]" /> 100% Safe & Secure Checkout with DMart Assurance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
