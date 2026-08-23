import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReturnModal from '../components/ReturnModal';
import {
  Package,
  Store,
  Truck,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'returns'
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, returnsRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/returns/my-returns'),
        ]);

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.data);
        }
        if (returnsRes.data.success) {
          setReturnRequests(returnsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders/returns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReturnSuccess = (newReturn) => {
    setReturnRequests((prev) => [newReturn, ...prev]);
    setActiveTab('returns');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Orders & Return Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active deliveries, scheduled store pickups, and manage return/exchange requests
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-[#0F8A5F] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'returns'
                ? 'bg-white text-amber-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Returns & Exchanges ({returnRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'orders' ? (
        orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">No Orders Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
              You haven't placed any grocery orders yet. Start adding essentials to your basket with DMart discounts!
            </p>
            <Link
              to="/products"
              className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPickup = order.fulfillmentType === 'STORE_PICKUP';
              const isDelivered = order.status === 'DELIVERED' || order.status === 'PICKED_UP';
              const isCancelled = order.status === 'CANCELLED';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-emerald-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-black text-slate-900 text-sm">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-700'
                            : isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {isPickup ? <Store className="w-3 h-3 text-[#0F8A5F]" /> : <Truck className="w-3 h-3 text-blue-600" />}
                        <span>{isPickup ? 'Store Pickup' : 'Home Delivery'}</span>
                      </span>
                    </div>

                    {/* Order summary info */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Placed on: {new Date(order.createdAt).toLocaleString()}</span>
                      </p>

                      {isPickup && order.pickupSlot ? (
                        <p className="font-medium text-slate-700">
                          Pickup at: <strong>{order.pickupSlot.storeName}</strong> ({order.pickupSlot.slotDate} • {order.pickupSlot.startTime} - {order.pickupSlot.endTime})
                        </p>
                      ) : (
                        <p className="font-medium text-slate-700 truncate max-w-lg">
                          Deliver to: {order.deliveryAddress}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-500">
                        {order.items?.length || 0} items: {order.items?.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-4 shrink-0">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Amount</p>
                      <p className="text-xl font-black text-slate-900">₹{Number(order.finalAmount).toFixed(0)}</p>
                      {Number(order.totalDiscount) > 0 && (
                        <p className="text-[10px] font-bold text-emerald-700">Saved ₹{Number(order.totalDiscount).toFixed(0)}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isDelivered && (
                        <button
                          onClick={() => setSelectedOrderForReturn(order)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                          <span>Return / Exchange</span>
                        </button>
                      )}

                      <Link
                        to={`/orders/${order.id}`}
                        className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Track Order</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Return Requests Tab */
        returnRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">No Returns or Exchanges</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              You haven't requested any returns or exchanges. Eligible delivered orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {returnRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">
                      {req.requestType} Request for Order #{req.order?.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Requested on: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-700">Reason: <span className="font-normal text-slate-600">{req.reason.replace(/_/g, ' ')}</span></p>
                    {req.customerComments && (
                      <p className="font-bold text-slate-700 mt-1">Customer Note: <span className="font-normal text-slate-600 italic">"{req.customerComments}"</span></p>
                    )}
                    {req.staffNotes && (
                      <p className="font-bold text-emerald-800 mt-1 bg-emerald-50 p-2 rounded-lg">
                        Staff Response: "{req.staffNotes}"
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-800">Items Specified:</p>
                    {req.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600">
                        <span>{item.quantity}x {item.product?.name}</span>
                        <span className="font-bold text-slate-800 uppercase">{item.itemAction}</span>
                      </div>
                    ))}
                    {req.refundAmount && (
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                        <span>Refund Amount:</span>
                        <span className="text-[#0F8A5F]">₹{Number(req.refundAmount).toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Return Request Modal */}
      {selectedOrderForReturn && (
        <ReturnModal
          order={selectedOrderForReturn}
          onClose={() => setSelectedOrderForReturn(null)}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
}
