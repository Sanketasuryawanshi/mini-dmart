import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ClipboardList,
  Store,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function StaffDashboardPage() {
  const [activeTab, setActiveTab] = useState('packing'); // 'packing', 'pickups', 'returns'
  const [ordersQueue, setOrdersQueue] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Processing state for returns
  const [processingReturnId, setProcessingReturnId] = useState(null);
  const [staffNote, setStaffNote] = useState('');
  const [restockInventory, setRestockInventory] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [queueRes, returnsRes] = await Promise.all([
        api.get('/orders/queue'),
        api.get('/returns/all'),
      ]);

      if (queueRes.data.success) {
        setOrdersQueue(queueRes.data.data);
      }
      if (returnsRes.data.success) {
        setReturnRequests(returnsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load staff queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order updated to ${newStatus.replace(/_/g, ' ')}`);
        fetchData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status.';
      toast.error(msg);
    }
  };

  const handleProcessReturn = async (requestId, status) => {
    try {
      const res = await api.patch(`/returns/${requestId}/process`, {
        status,
        staffNotes: staffNote || (status === 'APPROVED' ? 'Approved by store staff' : 'Rejected after inspection'),
        restockInventory,
      });

      if (res.data.success) {
        toast.success(`Return request ${status.toLowerCase()} successfully!`);
        setProcessingReturnId(null);
        setStaffNote('');
        fetchData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process return request.';
      toast.error(msg);
    }
  };

  // Filter queues
  const packingOrders = ordersQueue.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED' || o.status === 'PREPARING');
  const pickupOrders = ordersQueue.filter((o) => o.fulfillmentType === 'STORE_PICKUP');
  const pendingReturns = returnRequests.filter((r) => r.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" />
            <span>Store Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Staff Order Packing & Fulfillment Portal
          </h1>
          <p className="text-xs text-amber-100 mt-1">
            Manage incoming grocery bags, store pickup dispatch, and return request approvals
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-950/60 border border-amber-700/50 p-3 rounded-2xl text-center">
            <p className="text-[10px] text-amber-300 font-bold uppercase">Packing Queue</p>
            <p className="text-xl font-black text-white">{packingOrders.length}</p>
          </div>
          <div className="bg-amber-950/60 border border-amber-700/50 p-3 rounded-2xl text-center">
            <p className="text-[10px] text-amber-300 font-bold uppercase">Pending Returns</p>
            <p className="text-xl font-black text-amber-300">{pendingReturns.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'packing'
              ? 'bg-[#0F8A5F] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Packing Queue ({packingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pickups'
              ? 'bg-[#0F8A5F] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Pickup Dispatch ({pickupOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'returns'
              ? 'bg-[#0F8A5F] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Returns Queue ({pendingReturns.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : activeTab === 'packing' ? (
        /* Packing Queue */
        packingOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-[#0F8A5F] mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">All Caught Up!</h3>
            <p className="text-xs text-slate-500 mt-1">No orders currently pending preparation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {packingOrders.map((order) => {
              const isPickup = order.fulfillmentType === 'STORE_PICKUP';
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 text-base">
                        #{order.orderNumber}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {order.status}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        {isPickup ? <Store className="w-3.5 h-3.5 text-[#0F8A5F]" /> : <Truck className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{isPickup ? 'Store Pickup' : 'Home Delivery'}</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">
                        Customer: {order.user?.fullName} ({order.user?.phone || 'No phone'})
                      </p>
                      {isPickup && order.pickupSlot && (
                        <p className="text-emerald-700 font-semibold">
                          Scheduled Slot: {order.pickupSlot.storeName} ({order.pickupSlot.slotDate} • {order.pickupSlot.startTime} - {order.pickupSlot.endTime})
                        </p>
                      )}
                    </div>

                    {/* Items checklist */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                        Items to Bag ({order.items?.length || 0}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <span className="font-black text-[#0F8A5F] px-1.5 py-0.5 bg-emerald-50 rounded">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-slate-800 truncate">{item.productName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Progression Actions */}
                  <div className="flex flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase text-center lg:text-right">Update Order Stage</p>
                    
                    {order.status === 'PLACED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors"
                      >
                        Confirm & Reserve Stock
                      </button>
                    )}

                    {(order.status === 'CONFIRMED' || order.status === 'PLACED') && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors"
                      >
                        Start Bagging (Preparing)
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order.id,
                            isPickup ? 'READY_FOR_PICKUP' : 'OUT_FOR_DELIVERY'
                          )
                        }
                        className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isPickup ? 'Ready at Pickup Counter' : 'Hand to Delivery Driver'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === 'pickups' ? (
        /* Store Pickups Queue */
        pickupOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Store className="w-12 h-12 text-[#0F8A5F] mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No Pickup Orders</h3>
            <p className="text-xs text-slate-500 mt-1">No scheduled pickup orders in queue.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pickupOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-base">#{order.orderNumber}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold">
                    Customer: {order.user?.fullName} • {order.items?.length || 0} items (₹{Number(order.finalAmount).toFixed(0)})
                  </p>
                  {order.pickupSlot && (
                    <p className="text-xs text-slate-500">
                      Counter: <strong>{order.pickupSlot.storeName}</strong> ({order.pickupSlot.slotDate} • {order.pickupSlot.startTime} - {order.pickupSlot.endTime})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'PICKED_UP')}
                      className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors"
                    >
                      Mark as Handed Over / Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Returns Approval Queue */
        returnRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-[#0F8A5F] mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No Pending Returns</h3>
            <p className="text-xs text-slate-500 mt-1">All customer return requests have been processed.</p>
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
                    <span className="font-black text-slate-900 text-base">
                      {req.requestType} for Order #{req.order?.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Customer: <strong>{req.user?.fullName}</strong> ({req.user?.email})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">
                      Reason: <span className="text-rose-600 font-semibold">{req.reason.replace(/_/g, ' ')}</span>
                    </p>
                    {req.customerComments && (
                      <p className="text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg">
                        Customer Note: "{req.customerComments}"
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">Items to return:</p>
                    {req.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600">
                        <span>{item.quantity}x {item.product?.name}</span>
                        <span className="font-bold text-slate-800">{item.itemAction}</span>
                      </div>
                    ))}
                    {req.refundAmount && (
                      <p className="mt-2 pt-2 border-t border-slate-200 font-bold text-slate-900">
                        Calculated Refund: <span className="text-[#0F8A5F]">₹{Number(req.refundAmount).toFixed(0)}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Processing controls */}
                {req.status === 'PENDING' && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Staff response notes (e.g. Verified defective packaging, refund approved)..."
                        value={processingReturnId === req.id ? staffNote : ''}
                        onChange={(e) => {
                          setProcessingReturnId(req.id);
                          setStaffNote(e.target.value);
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8A5F]"
                      />

                      <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={restockInventory}
                          onChange={(e) => setRestockInventory(e.target.checked)}
                          className="w-4 h-4 text-[#0F8A5F] rounded focus:ring-emerald-500"
                        />
                        <span>Restock items back to inventory</span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleProcessReturn(req.id, 'APPROVED')}
                        className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Refund</span>
                      </button>

                      <button
                        onClick={() => handleProcessReturn(req.id, 'REJECTED')}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject Request</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
