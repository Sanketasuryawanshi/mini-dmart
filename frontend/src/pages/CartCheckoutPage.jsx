import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Store,
  Truck,
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function CartCheckoutPage() {
  const { items, totalItemsCount, totalMrp, subtotal, totalSavings, deliveryFee, finalTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Checkout Form State
  const [fulfillmentType, setFulfillmentType] = useState('STORE_PICKUP');
  const [pickupSlots, setPickupSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryPhone, setDeliveryPhone] = useState(user?.phone || '');
  const [deliveryPincode, setDeliveryPincode] = useState(user?.pincode || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
      return;
    }

    // Load available pickup slots
    const fetchSlots = async () => {
      try {
        const res = await api.get('/slots');
        if (res.data.success) {
          setPickupSlots(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedSlotId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [items, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to complete your order');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (fulfillmentType === 'STORE_PICKUP' && !selectedSlotId) {
      toast.error('Please select an available store pickup slot.');
      return;
    }

    if (fulfillmentType === 'HOME_DELIVERY') {
      if (!deliveryAddress.trim() || !deliveryPhone.trim() || !deliveryPincode.trim()) {
        toast.error('Please enter your complete delivery address, contact phone, and pincode.');
        return;
      }
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        fulfillmentType,
        paymentMethod,
        pickupSlotId: fulfillmentType === 'STORE_PICKUP' ? Number(selectedSlotId) : null,
        deliveryAddress: fulfillmentType === 'HOME_DELIVERY' ? deliveryAddress : null,
        deliveryPhone: fulfillmentType === 'HOME_DELIVERY' ? deliveryPhone : null,
        deliveryPincode: fulfillmentType === 'HOME_DELIVERY' ? deliveryPincode : null,
        deliveryNotes: fulfillmentType === 'HOME_DELIVERY' ? deliveryNotes : null,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        const order = res.data.data;
        clearCart();
        navigate(`/order-confirmed/${order.orderNumber}`, { state: { order } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your items, choose store pickup or home delivery, and finalize payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Step Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Fulfillment Type */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <span className="w-8 h-8 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center font-black text-sm">
                1
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Choose Fulfillment Method</h3>
                <p className="text-xs text-slate-500">Pick up at DMart Ready or get doorstep home delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFulfillmentType('STORE_PICKUP')}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                  fulfillmentType === 'STORE_PICKUP'
                    ? 'border-[#0F8A5F] bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="absolute top-4 right-4 bg-emerald-100 text-[#0F8A5F] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Zero Fee
                </span>
                <Store className="w-6 h-6 text-[#0F8A5F] mb-2" />
                <h4 className="font-black text-slate-900 text-sm">Scheduled Store Pickup</h4>
                <p className="text-xs text-slate-500 mt-1">Collect from nearest DMart Ready pickup center at your scheduled time.</p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('HOME_DELIVERY')}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                  fulfillmentType === 'HOME_DELIVERY'
                    ? 'border-[#0F8A5F] bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Doorstep
                </span>
                <Truck className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-black text-slate-900 text-sm">Express Home Delivery</h4>
                <p className="text-xs text-slate-500 mt-1">Delivered directly to your flat/doorstep in insulated temperature-safe bags.</p>
              </button>
            </div>

            {/* If Store Pickup: Slot Selector */}
            {fulfillmentType === 'STORE_PICKUP' ? (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select DMart Ready Store & Time Slot
                </label>
                {loadingSlots ? (
                  <div className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                ) : pickupSlots.length === 0 ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-4 rounded-xl">No pickup slots currently open.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {pickupSlots.map((slot) => {
                      const isSelected = String(selectedSlotId) === String(slot.id);
                      const availableCap = slot.maxCapacity - slot.bookedCount;
                      const isFull = availableCap <= 0;

                      return (
                        <div
                          key={slot.id}
                          onClick={() => !isFull && setSelectedSlotId(slot.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isFull
                              ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-emerald-50 border-[#0F8A5F] ring-1 ring-[#0F8A5F]'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 text-xs truncate max-w-[170px]">
                              {slot.storeName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isFull ? 'Full' : `${availableCap} left`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{slot.slotDate}</span>
                            <span>•</span>
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* If Home Delivery: Address Inputs */
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    rows="2"
                    required
                    placeholder="House / Flat No., Building Name, Street, Landmark"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0F8A5F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0F8A5F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400076"
                      value={deliveryPincode}
                      onChange={(e) => setDeliveryPincode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0F8A5F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave with security, Ring doorbell twice"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0F8A5F]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <span className="w-8 h-8 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center font-black text-sm">
                2
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Select Payment Method</h3>
                <p className="text-xs text-slate-500">Fast, encrypted and secure simulated checkout</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'UPI', label: 'UPI / QR Code', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                { key: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                { key: 'WALLET', label: 'DMart Wallet', icon: Wallet, desc: 'Instant 1-Click Pay' },
                { key: 'CASH_ON_DELIVERY', label: 'Cash on Delivery / Pickup', icon: Banknote, desc: 'Pay with cash at counter/doorstep' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMethod(m.key)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#0F8A5F] bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#0F8A5F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{m.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 text-base pb-3 border-b border-slate-100">
              Basket Summary ({totalItemsCount} Items)
            </h3>

            {/* Items list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[180px]">
                    <span className="font-bold text-[#0F8A5F]">{quantity}x</span>
                    <span className="text-slate-800 font-medium truncate">{product.name}</span>
                  </div>
                  <span className="font-black text-slate-900">
                    ₹{(Number(product.price) * quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Savings Highlight */}
            {totalSavings > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs font-bold text-amber-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Total DMart Savings</span>
                </span>
                <span className="text-amber-700 text-sm font-extrabold">₹{totalSavings.toFixed(0)}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Total MRP Value</span>
                <span className="line-through text-slate-400">₹{totalMrp.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>DMart Special Discount</span>
                <span>- ₹{totalSavings.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery / Pickup Charges</span>
                <span>
                  {fulfillmentType === 'STORE_PICKUP' || deliveryFee === 0 ? (
                    <strong className="text-emerald-700 uppercase">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Final Payable</span>
                <span className="text-xl text-[#0F8A5F]">
                  ₹{(subtotal + (fulfillmentType === 'STORE_PICKUP' ? 0 : deliveryFee)).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {placingOrder ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <span>CONFIRM & PLACE ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F8A5F]" /> 100% Encrypted & Authenticated Order Placement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
