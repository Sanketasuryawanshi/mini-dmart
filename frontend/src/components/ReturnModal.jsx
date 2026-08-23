import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { X, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReturnModal({ order, onClose, onSuccess }) {
  const [requestType, setRequestType] = useState('RETURN');
  const [reason, setReason] = useState('DEFECTIVE_DAMAGED');
  const [customerComments, setCustomerComments] = useState('');
  const [selectedItems, setSelectedItems] = useState(() => {
    // Default select all items with max qty
    const map = {};
    order.items.forEach((item) => {
      map[item.product.id] = {
        selected: true,
        quantity: item.quantity,
        maxQuantity: item.quantity,
        isPerishable: item.product.isPerishable,
        name: item.product.name,
      };
    });
    return map;
  });
  const [submitting, setSubmitting] = useState(false);

  const toggleItem = (productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selected: !prev[productId].selected,
      },
    }));
  };

  const updateQuantity = (productId, qty) => {
    const validQty = Math.max(1, Math.min(selectedItems[productId].maxQuantity, qty));
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: validQty,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsToSubmit = Object.entries(selectedItems)
      .filter(([_, val]) => val.selected)
      .map(([productId, val]) => ({
        productId: Number(productId),
        quantity: val.quantity,
        itemAction: requestType === 'RETURN' ? 'REFUND' : 'EXCHANGE_FOR_SAME',
      }));

    if (itemsToSubmit.length === 0) {
      toast.error('Please select at least one item to return or exchange.');
      return;
    }

    // Check perishable rule
    const hasInvalidPerishable = itemsToSubmit.some((item) => {
      const p = selectedItems[item.productId];
      return p.isPerishable && reason !== 'DEFECTIVE_DAMAGED' && reason !== 'EXPIRED';
    });

    if (hasInvalidPerishable) {
      toast.error(
        'Perishable grocery items can only be returned if damaged or expired. Please select a valid reason or uncheck perishable items.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        orderId: order.id,
        requestType,
        reason,
        customerComments,
        items: itemsToSubmit,
      };

      const res = await api.post('/returns', payload);
      if (res.data.success) {
        toast.success('Return/Exchange request submitted successfully! Our store team will review it shortly.');
        onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit return request.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Request Return or Exchange</h3>
                <p className="text-xs text-slate-500">Order #{order.orderNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Request Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Choose Action
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRequestType('RETURN')}
                  className={`p-3 rounded-xl border text-center transition-all font-bold text-xs ${
                    requestType === 'RETURN'
                      ? 'bg-emerald-50 border-[#0F8A5F] text-[#0F8A5F] ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  💰 Return & Get Refund
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('EXCHANGE')}
                  className={`p-3 rounded-xl border text-center transition-all font-bold text-xs ${
                    requestType === 'EXCHANGE'
                      ? 'bg-emerald-50 border-[#0F8A5F] text-[#0F8A5F] ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🔄 Exchange For Replacement
                </button>
              </div>
            </div>

            {/* Select Items */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Items to Return / Exchange
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {order.items.map((item) => {
                  const state = selectedItems[item.product.id] || { selected: false, quantity: 1 };
                  return (
                    <div
                      key={item.product.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        state.selected ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={state.selected}
                          onChange={() => toggleItem(item.product.id)}
                          className="w-4 h-4 text-[#0F8A5F] rounded focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.productName}</p>
                          <p className="text-[11px] text-slate-500">
                            Ordered: {item.quantity} × ₹{Number(item.unitPrice).toFixed(0)}
                            {item.product.isPerishable && (
                              <span className="ml-2 text-amber-700 font-semibold">(Perishable)</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {state.selected && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-medium">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={state.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                            className="w-14 text-center bg-white border border-slate-300 rounded-lg py-1 text-xs font-bold text-slate-800"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Reason for Return / Exchange
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0F8A5F]"
              >
                <option value="DEFECTIVE_DAMAGED">Damaged / Broken / Leaking Item</option>
                <option value="EXPIRED">Expired or Past Best Before Date</option>
                <option value="WRONG_ITEM">Received Wrong Product / Size</option>
                <option value="QUALITY_ISSUE">Freshness / Quality Issue</option>
                <option value="NOT_AS_DESCRIBED">Item Does Not Match Description</option>
                <option value="CHANGED_MIND">Changed Mind (Non-perishable only)</option>
              </select>
            </div>

            {/* Customer Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Additional Comments / Description
              </label>
              <textarea
                rows="2"
                placeholder="Please describe the defect or reason for return..."
                value={customerComments}
                onChange={(e) => setCustomerComments(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0F8A5F]"
              />
            </div>

            {/* Policy notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Mini D-Mart Policy:</strong> Returns are accepted within 7 days of delivery. Perishable grocery items (fresh produce, dairy) are returnable only in cases of damage or expiry.
              </span>
            </div>

            {/* Submit buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
