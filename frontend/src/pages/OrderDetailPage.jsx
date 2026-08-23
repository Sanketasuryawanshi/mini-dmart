import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import OrderTimeline from '../components/OrderTimeline';
import ReturnModal from '../components/ReturnModal';
import {
  Package,
  Store,
  Truck,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Printer,
  XCircle,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This will release reserved items.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await api.post(`/orders/${id}/cancel`, { reason: 'Cancelled by customer' });
      if (res.data.success) {
        toast.success('Order cancelled successfully.');
        setOrder(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel order.';
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse h-96" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">Order Not Found</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">Could not find the requested order.</p>
        <Link to="/my-orders" className="bg-[#0F8A5F] text-white font-bold text-xs px-6 py-3 rounded-xl">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isPickup = order.fulfillmentType === 'STORE_PICKUP';
  const canCancel = order.status === 'PLACED' || order.status === 'CONFIRMED';
  const isDelivered = order.status === 'DELIVERED' || order.status === 'PICKED_UP';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/my-orders"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  order.status === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-700'
                    : isDelivered
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800 animate-pulse'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Print invoice"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
            </button>
          )}

          {isDelivered && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-amber-700" />
              <span>Return / Exchange</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Status Timeline */}
      <OrderTimeline
        status={order.status}
        fulfillmentType={order.fulfillmentType}
        createdAt={order.createdAt}
        updatedAt={order.updatedAt}
      />

      {/* Order Info & Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fulfillment Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F8A5F] uppercase tracking-wider pb-2 border-b border-slate-100">
            {isPickup ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
            <span>{isPickup ? 'Store Pickup Details' : 'Delivery Address'}</span>
          </div>

          {isPickup && order.pickupSlot ? (
            <div className="text-xs text-slate-700 space-y-1.5">
              <p className="font-extrabold text-slate-900 text-sm">{order.pickupSlot.storeName}</p>
              <p className="text-slate-500">{order.pickupSlot.storeAddress || 'Main Hub Counter, Sector 14'}</p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#0F8A5F] font-bold">
                <Calendar className="w-4 h-4" />
                <span>{order.pickupSlot.slotDate}</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{order.pickupSlot.startTime} - {order.pickupSlot.endTime}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">{order.deliveryAddress}</p>
              <p className="text-slate-500">Pincode: {order.deliveryPincode}</p>
              <p className="text-slate-500">Phone: {order.deliveryPhone}</p>
              {order.deliveryNotes && (
                <p className="text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 italic">
                  Note: "{order.deliveryNotes}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Payment & Summary Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F8A5F] uppercase tracking-wider pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4" />
            <span>Payment Summary</span>
          </div>

          <div className="text-xs text-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <span>Payment Mode:</span>
              <span className="font-bold text-slate-900">{order.paymentMethod.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payment Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.paymentStatus === 'REFUNDED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-extrabold text-sm text-slate-900">
              <span>Total Paid:</span>
              <span className="text-base text-[#0F8A5F]">₹{Number(order.finalAmount).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="font-black text-slate-900 text-base">
          Grocery Items ({order.items?.length || 0})
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
                  alt={item.productName}
                  className="w-14 h-14 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">
                    {item.productName}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Unit: {item.product?.unit} • Price: ₹{Number(item.unitPrice).toFixed(0)}
                    {Number(item.mrp) > Number(item.unitPrice) && (
                      <span className="ml-2 text-slate-400 line-through">MRP ₹{Number(item.mrp).toFixed(0)}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-black text-slate-900 text-sm">
                  ₹{Number(item.subtotal).toFixed(0)}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold">{item.quantity} units</p>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Summary */}
        <div className="pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal (MRP Value)</span>
            <span className="line-through">₹{Number(order.totalMrp).toFixed(0)}</span>
          </div>
          {Number(order.totalDiscount) > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>DMart Savings Discount</span>
              <span>- ₹{Number(order.totalDiscount).toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Fulfillment / Delivery Charge</span>
            <span>{Number(order.deliveryFee) === 0 ? <strong className="text-emerald-700 uppercase">FREE</strong> : `₹${Number(order.deliveryFee).toFixed(0)}`}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
            <span>Grand Total</span>
            <span className="text-lg text-[#0F8A5F]">₹{Number(order.finalAmount).toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {isReturnModalOpen && (
        <ReturnModal
          order={order}
          onClose={() => setIsReturnModalOpen(false)}
          onSuccess={() => {
            fetchOrder();
          }}
        />
      )}
    </div>
  );
}
