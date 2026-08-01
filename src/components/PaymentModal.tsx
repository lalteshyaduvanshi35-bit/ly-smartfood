import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  Loader2, 
  Check, 
  Truck,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  currentLang: Language;
  onPaymentSuccess: (method: 'cod') => void;
  customerName?: string;
  customerPhone?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  grandTotal,
  currentLang,
  onPaymentSuccess,
  customerName,
  customerPhone,
}) => {
  const t = translations[currentLang] || translations.en;
  const [deliveryPayType, setDeliveryPayType] = useState<'cash' | 'upi_qr'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess('cod');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 my-auto flex flex-col border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">Payment on Delivery</h3>
              <p className="text-xs text-amber-300 font-medium">Pay only when food arrives at your door</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Customer Notice */}
        <div className="bg-amber-50/80 border-b border-amber-100 p-4 px-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">Total Payable on Delivery</span>
            {customerName && (
              <span className="text-xs text-amber-700 font-medium">
                Customer: <b>{customerName}</b> {customerPhone ? `(${customerPhone})` : ''}
              </span>
            )}
          </div>
          <span className="text-xl font-black text-amber-700">₹{grandTotal}</span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900">100% Risk-Free Delivery</p>
              <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                Only pay after inspecting your hot & fresh food package from our delivery partner!
              </p>
            </div>
          </div>

          <form onSubmit={handleConfirmOrder} className="space-y-4">
            
            <label className="text-xs font-bold text-slate-800 block">
              Select Doorstep Payment Option:
            </label>

            {/* Option 1: Cash on Delivery */}
            <div
              onClick={() => setDeliveryPayType('cash')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                deliveryPayType === 'cash'
                  ? 'border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  deliveryPayType === 'cash' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Hand over exact cash amount to delivery rider</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                deliveryPayType === 'cash' ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
              }`}>
                {deliveryPayType === 'cash' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Option 2: UPI / QR Code on Delivery */}
            <div
              onClick={() => setDeliveryPayType('upi_qr')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                deliveryPayType === 'upi_qr'
                  ? 'border-orange-500 bg-orange-50/60 text-slate-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  deliveryPayType === 'upi_qr' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Scan UPI QR Code at Doorstep</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Scan rider's GPay/PhonePe/Paytm QR code when order arrives</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                deliveryPayType === 'upi_qr' ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
              }`}>
                {deliveryPayType === 'upi_qr' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Order Confirmation Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 mt-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Confirm Order (Pay ₹{grandTotal} on Delivery)</span>
                </>
              )}
            </button>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                ⚡ Orders prepared & dispatched instantly under 20 mins
              </span>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
