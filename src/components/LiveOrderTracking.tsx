import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  Utensils, 
  Store, 
  ChevronRight, 
  Send, 
  Receipt, 
  Sparkles,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { Order, Language, OrderStatus } from '../types';
import { translations } from '../i18n/translations';

interface LiveOrderTrackingProps {
  order: Order;
  currentLang: Language;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onNewOrderClick: () => void;
}

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({
  order,
  currentLang,
  onUpdateOrderStatus,
  onNewOrderClick,
}) => {
  const t = translations[currentLang] || translations.en;
  const [riderProgress, setRiderProgress] = useState(order.riderCoordinates?.progressPct || 65);
  const [etaMinutes, setEtaMinutes] = useState(order.estimatedDeliveryTimeMinutes || 12);
  const [riderInstruction, setRiderInstruction] = useState('');
  const [instructionSent, setInstructionSent] = useState(false);

  // Simulate rider live movement across map canvas
  useEffect(() => {
    if (order.orderStatus === 'out_for_delivery') {
      const interval = setInterval(() => {
        setRiderProgress(prev => {
          if (prev >= 98) {
            onUpdateOrderStatus(order.id, 'delivered');
            return 100;
          }
          return prev + 1;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [order.orderStatus, order.id]);

  const handleSendInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (riderInstruction.trim()) {
      setInstructionSent(true);
      setTimeout(() => setInstructionSent(false), 3000);
      setRiderInstruction('');
    }
  };

  const statusOrderList: OrderStatus[] = [
    'placed',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered'
  ];

  const currentStepIdx = statusOrderList.indexOf(order.orderStatus);

  const handleSimulateNextStep = () => {
    if (currentStepIdx < statusOrderList.length - 1) {
      const nextStatus = statusOrderList[currentStepIdx + 1];
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 px-4 sm:px-0">
      
      {/* Top Banner Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Order #{order.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">{order.createdAt}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {order.orderStatus === 'delivered' ? '🎉 Order Delivered!' : '🛵 Your Meal is En Route'}
            </h2>
          </div>

          {/* ETA Box */}
          <div className="bg-slate-800/90 border border-slate-700 p-3.5 px-5 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.etaLabel}</span>
              <span className="text-lg font-black text-orange-400">
                {order.orderStatus === 'delivered' ? '0 mins' : `${etaMinutes} ${t.minutes}`}
              </span>
            </div>
          </div>
        </div>

        {/* Live Interactive Map Simulation Canvas */}
        <div className="mt-5 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 relative space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Store className="w-4 h-4" /> TastyDash Express Kitchen
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <MapPin className="w-4 h-4" /> {order.deliveryAddress.street}
            </span>
          </div>

          {/* Map Vector Path Bar */}
          <div className="relative h-12 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center px-4">
            
            {/* Background grid lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Progress line */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 opacity-30 transition-all duration-1000"
              style={{ width: `${riderProgress}%` }}
            />

            {/* Start Pin */}
            <div className="absolute left-3 z-10 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
              🏪
            </div>

            {/* Moving Rider Icon */}
            <div 
              className="absolute z-20 transition-all duration-1000 flex items-center justify-center -translate-x-1/2"
              style={{ left: `${Math.max(6, Math.min(94, riderProgress))}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/50 border-2 border-white animate-bounce">
                <Bike className="w-5 h-5" />
              </div>
            </div>

            {/* Destination Pin */}
            <div className="absolute right-3 z-10 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              🏠
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
            <span>Rider Distance: {(100 - riderProgress) * 0.05 + 0.2 < 0.2 ? 'Arrived at location' : `${((100 - riderProgress) * 0.05 + 0.2).toFixed(1)} km remaining`}</span>
            <span className="text-emerald-400 font-bold">GPS Tracking Active</span>
          </div>
        </div>

        {/* Real-time simulation action trigger */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">Testing live tracking updates?</span>
          <button
            id="simulate-next-step-btn"
            onClick={handleSimulateNextStep}
            disabled={order.orderStatus === 'delivered'}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-40"
          >
            ⚡ Advance Order Status to Next Step
          </button>
        </div>

      </div>

      {/* Rider & Delivery Partner Card */}
      {order.rider && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img 
              src={order.rider.avatar} 
              alt={order.rider.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-base">{order.rider.name}</h4>
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  ⭐ {order.rider.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{order.rider.vehicle}</p>
              <span className="text-[10px] text-emerald-600 font-bold">Vaccinated & Temperature Checked (36.5°C)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${order.rider.phone}`}
              className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.callRider}</span>
            </a>
          </div>
        </div>
      )}

      {/* Send Note to Rider */}
      <form onSubmit={handleSendInstruction} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex gap-2">
        <input
          type="text"
          value={riderInstruction}
          onChange={(e) => setRiderInstruction(e.target.value)}
          placeholder="e.g. Leave package at security gate / Don't ring doorbell..."
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-orange-500 focus:outline-hidden"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
      {instructionSent && (
        <div className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl text-center">
          ✓ Delivery instruction dispatched to rider!
        </div>
      )}

      {/* Step by Step Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-500">
          Order Milestone History
        </h4>

        <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {order.trackingHistory.map((step, idx) => {
            const isDone = step.completed || idx <= currentStepIdx;
            const isCurrent = statusOrderList[currentStepIdx] === step.status;

            return (
              <div key={step.status} className="flex items-start gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCurrent 
                    ? 'bg-orange-500 text-white ring-4 ring-orange-100 animate-pulse'
                    : isDone 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-baseline justify-between">
                    <h5 className={`font-bold text-xs sm:text-sm ${isCurrent ? 'text-orange-600' : 'text-slate-900'}`}>
                      {step.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ordered Items Receipt */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm">{t.orderSummary}</h4>
          <button 
            onClick={() => window.print()}
            className="text-xs text-orange-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{t.downloadReceipt}</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items.map(item => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[11px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-slate-800">{item.menuItem.name}</span>
              </div>
              <span className="font-bold text-slate-900">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-black text-slate-900">
          <span>Paid Total</span>
          <span className="text-orange-600">₹{order.totalAmount} ({order.paymentMethod.toUpperCase()})</span>
        </div>

        <button
          onClick={onNewOrderClick}
          className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Order Something Else</span>
        </button>
      </div>

    </div>
  );
};
