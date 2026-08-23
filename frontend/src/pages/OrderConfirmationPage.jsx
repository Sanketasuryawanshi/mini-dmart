import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import {
  CheckCircle2,
  Package,
  Store,
  Truck,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Printer
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F8A5F', '#10b981', '#F59E0B', '#FFD200'],
      });
    } catch (e) {
      console.error(e);
    }

    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/track/${orderNumber}`);
          if (res.data.success) {
            setOrder(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderNumber, order]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="h-64 bg-white rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">Order Not Found</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">Could not find order #{orderNumber}</p>
        <Link to="/" className="bg-[#0F8A5F] text-white font-bold text-xs px-6 py-3 rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  const isPickup = order.fulfillmentType === 'STORE_PICKUP';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-[#0F8A5F] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="bg-emerald-50 text-[#0F8A5F] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
            Thank you for shopping at DMart!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Your order number is <strong className="text-slate-900 font-extrabold">{order.orderNumber}</strong>. We've sent a confirmation email & SMS receipt.
          </p>
        </div>

        {/* Fulfillment Details Box */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
            {isPickup ? <Store className="w-4 h-4 text-[#0F8A5F]" /> : <Truck className="w-4 h-4 text-[#0F8A5F]" />}
            <span>{isPickup ? 'Store Pickup Reservation' : 'Home Delivery Destination'}</span>
          </div>

          {isPickup && order.pickupSlot ? (
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">{order.pickupSlot.storeName}</p>
              <p className="flex items-center gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5 text-[#0F8A5F]" />
                <span>Date: <strong>{order.pickupSlot.slotDate}</strong></span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-[#0F8A5F]" />
                <span>Time Slot: <strong>{order.pickupSlot.startTime} - {order.pickupSlot.endTime}</strong></span>
              </p>
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 font-medium">
                💡 Please show your Order ID at the DMart Ready collection desk during your selected slot.
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">{order.deliveryAddress}</p>
              <p>Pincode: <strong>{order.deliveryPincode}</strong> | Phone: <strong>{order.deliveryPhone}</strong></p>
            </div>
          )}
        </div>

        {/* Order Items Snapshot */}
        <div className="text-left space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Items Ordered ({order.items?.length || 0})
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {order.items?.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-[#0F8A5F] font-bold flex items-center justify-center">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{item.productName}</p>
                    <p className="text-[11px] text-slate-400">₹{Number(item.unitPrice).toFixed(0)} each</p>
                  </div>
                </div>
                <span className="font-black text-slate-900">
                  ₹{Number(item.subtotal).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total MRP</span>
              <span className="line-through">₹{Number(order.totalMrp).toFixed(0)}</span>
            </div>
            {Number(order.totalDiscount) > 0 && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>You Saved</span>
                <span>- ₹{Number(order.totalDiscount).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery / Handling Fee</span>
              <span>{Number(order.deliveryFee) === 0 ? 'FREE' : `₹${Number(order.deliveryFee).toFixed(0)}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-emerald-200">
              <span>Total Paid</span>
              <span className="text-xl text-[#0F8A5F]">₹{Number(order.finalAmount).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to={`/orders/${order.id}`}
            className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>TRACK LIVE ORDER STATUS</span>
          </Link>

          <Link
            to="/products"
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
