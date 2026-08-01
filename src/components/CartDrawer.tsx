import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  currentLang: Language;
  onProceedToPayment: (subtotal: number, discount: number, tip: number, total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currentLang,
  onProceedToPayment,
}) => {
  const t = translations[currentLang] || translations.en;

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [tip, setTip] = useState(20); // Default ₹20 tip for rider

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 299 ? 0 : 35;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal + deliveryFee + tax + tip - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'TASTY50') {
      const disc = Math.min(subtotal, 50);
      setDiscount(disc);
      setCouponMsg({ text: '₹50 Flat Discount Applied!', isError: false });
    } else if (code === 'FASTFOOD' || code === 'FIRST20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setCouponMsg({ text: '20% Fast Food Discount Applied!', isError: false });
    } else {
      setCouponMsg({ text: 'Invalid Promo Code. Try "TASTY50" or "FASTFOOD"', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{t.cartTitle}</h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'} in basket
              </span>
            </div>
          </div>
          <button 
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-3xl mb-2">
              🍟
            </div>
            <h4 className="font-bold text-slate-800 text-base">{t.emptyCart}</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Explore our burgers, pizzas and express fast food items to fill up your cart!
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-200"
            >
              Explore Menu Now
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
            
            {/* List of Items */}
            <div className="space-y-3 pt-1">
              {items.map(item => (
                <div 
                  key={item.id}
                  className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 relative group"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-bold text-slate-900 text-xs line-clamp-1">
                        {item.menuItem.name}
                      </h5>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Size & Addons summary */}
                    {item.selectedSize && (
                      <span className="text-[10px] text-orange-600 font-semibold block">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <span className="text-[10px] text-slate-500 block truncate">
                        Addons: {item.selectedAddons.map(a => a.name).join(', ')}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-slate-900 text-xs">
                        ₹{item.totalPrice}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-slate-500 hover:text-orange-600 font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1 text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-slate-500 hover:text-orange-600 font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="pt-3 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                <span>{t.applyCoupon}</span>
              </label>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. TASTY50 or FASTFOOD"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-800 focus:border-orange-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <div className={`text-[11px] font-bold flex items-center gap-1 ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponMsg.isError ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  <span>{couponMsg.text}</span>
                </div>
              )}
            </div>

            {/* Delivery Tip for Rider */}
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{t.tipDriver} 🛵</span>
                <span className="text-orange-600">₹{tip}</span>
              </div>
              <div className="flex gap-2">
                {[10, 20, 30, 50].map(tipVal => (
                  <button
                    key={tipVal}
                    onClick={() => setTip(tipVal)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tip === tipVal
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ₹{tipVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary Breakdown */}
            <div className="pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>{t.deliveryFee}</span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t.taxAndCharges} (5%)</span>
                <span className="font-semibold text-slate-800">₹{tax}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>{t.promoDiscount}</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>{t.totalPayable}</span>
                <span className="text-orange-600">₹{grandTotal}</span>
              </div>
            </div>

          </div>
        )}

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white shadow-lg space-y-2">
            <button
              id="proceed-to-payment-btn"
              onClick={() => {
                onProceedToPayment(subtotal, discount, tip, grandTotal);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-between px-5 transition-all cursor-pointer"
            >
              <span>{t.proceedCheckout}</span>
              <div className="flex items-center gap-1 font-black text-sm">
                <span>₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
