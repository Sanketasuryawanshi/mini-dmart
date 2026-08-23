import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, Check, XCircle, Store } from 'lucide-react';

export default function OrderTimeline({ status, fulfillmentType, createdAt, updatedAt }) {
  const isCancelled = status === 'CANCELLED';
  const isStorePickup = fulfillmentType === 'STORE_PICKUP';

  const steps = isStorePickup
    ? [
        { key: 'PLACED', label: 'Order Placed', desc: 'Order received & payment confirmed', icon: Clock },
        { key: 'CONFIRMED', label: 'Confirmed', desc: 'Store inventory allocated', icon: CheckCircle2 },
        { key: 'PREPARING', label: 'Packing Items', desc: 'Store team is bagging your grocery', icon: PackageCheck },
        { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Ready at selected DMart Hub counter', icon: Store },
        { key: 'PICKED_UP', label: 'Completed', desc: 'Order handed over successfully', icon: Check },
      ]
    : [
        { key: 'PLACED', label: 'Order Placed', desc: 'Order received & confirmed', icon: Clock },
        { key: 'CONFIRMED', label: 'Confirmed', desc: 'Store inventory reserved', icon: CheckCircle2 },
        { key: 'PREPARING', label: 'Order Packing', desc: 'Hygienic packing in progress', icon: PackageCheck },
        { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Delivery partner on the way to doorstep', icon: Truck },
        { key: 'DELIVERED', label: 'Delivered', desc: 'Safely delivered to your address', icon: Check },
      ];

  const getStepIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'READY_FOR_PICKUP':
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED':
      case 'PICKED_UP': return 4;
      default: return 0;
    }
  };

  const currentIdx = getStepIndex(status);

  if (isCancelled) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-4 text-rose-900">
        <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
          <XCircle className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-extrabold text-base">Order Cancelled</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            This order was cancelled. Any pre-paid amount has been initiated for refund back to your original source.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h4 className="font-extrabold text-slate-900 text-sm mb-6 flex items-center justify-between">
        <span>Order Status & Live Progress</span>
        <span className="text-xs font-bold text-[#0F8A5F] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          {status.replace(/_/g, ' ')}
        </span>
      </h4>

      {/* Progress Bar & Steps */}
      <div className="relative">
        {/* Track line */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-0">
          <div
            className="h-full bg-[#0F8A5F] transition-all duration-700"
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isUpcoming = idx > currentIdx;

            return (
              <div key={step.key} className="flex md:flex-col items-center gap-3.5 md:gap-2 text-left md:text-center relative z-10">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#0F8A5F] text-white shadow-md shadow-emerald-700/20'
                      : isCurrent
                      ? 'bg-emerald-100 text-[#0F8A5F] ring-4 ring-emerald-400/40 animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step text */}
                <div>
                  <p
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-[#0F8A5F]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[130px] leading-tight hidden md:block mt-0.5 mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
