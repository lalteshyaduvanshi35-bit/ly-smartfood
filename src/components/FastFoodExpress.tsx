import React from 'react';
import { Zap, Sparkles, Plus, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { MenuItem, Language, CustomizationOption } from '../types';
import { translations } from '../i18n/translations';

interface FastFoodExpressProps {
  fastFoodItems: MenuItem[];
  currentLang: Language;
  onAddToCart: (item: MenuItem, size?: string, addons?: CustomizationOption[]) => void;
  onAddCombo: (items: MenuItem[], discountPct: number) => void;
}

export const FastFoodExpress: React.FC<FastFoodExpressProps> = ({
  fastFoodItems,
  currentLang,
  onAddToCart,
  onAddCombo,
}) => {
  const t = translations[currentLang] || translations.en;

  // Selected combo items (Burger + Fries + Shake)
  const burger = fastFoodItems.find(i => i.id === 'm1') || fastFoodItems[0];
  const fries = fastFoodItems.find(i => i.id === 'm3') || fastFoodItems[1];
  const shake = fastFoodItems.find(i => i.id === 'm9') || fastFoodItems[2];

  const comboItems = [burger, fries, shake].filter(Boolean);
  const rawComboTotal = comboItems.reduce((acc, i) => acc + i.price, 0);
  const discountedComboTotal = Math.round(rawComboTotal * 0.8); // 20% OFF

  return (
    <section className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-orange-200 relative overflow-hidden my-6">
      {/* Decorative background graphics */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-2 right-12 text-white/10 font-black text-8xl select-none pointer-events-none">
        FAST
      </div>

      <div className="relative z-10 space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white text-orange-600 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {t.expressTitle}
              </span>
              <span className="bg-slate-900/40 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                Under 20 Mins Delivery
              </span>
            </div>
            <p className="text-white/90 text-xs sm:text-sm max-w-xl font-medium">
              {t.expressSub}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-semibold">Hot & Fresh Guarantee or Free Order</span>
          </div>
        </div>

        {/* Express Combo Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                20% OFF EXPRESS COMBO
              </span>
              <h4 className="font-black text-white text-base sm:text-lg">
                The Ultimate Fast-Food Feast
              </h4>
            </div>
            <p className="text-xs text-white/80 line-clamp-1">
              Includes: {burger?.name} + {fries?.name} + {shake?.name}
            </p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl font-black text-white">₹{discountedComboTotal}</span>
              <span className="text-xs text-white/60 line-through">₹{rawComboTotal}</span>
              <span className="text-xs text-amber-300 font-bold">Save ₹{rawComboTotal - discountedComboTotal}</span>
            </div>
          </div>

          <button
            id="add-express-combo-btn"
            onClick={() => onAddCombo(comboItems, 20)}
            className="w-full lg:w-auto bg-white hover:bg-amber-50 text-orange-600 font-black text-xs px-6 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Order Express Combo (1-Click)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Express Grid */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
            Popular Fast Food Items (&lt; 10m Prep Time)
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {fastFoodItems.slice(0, 4).map(item => (
              <div 
                key={item.id}
                className="bg-white/95 text-slate-900 rounded-xl p-2.5 flex flex-col justify-between hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-lg object-cover shrink-0" 
                  />
                  <div className="min-w-0">
                    <h6 className="font-bold text-xs truncate">{item.name}</h6>
                    <span className="text-[10px] text-slate-500 font-semibold block">₹{item.price}</span>
                  </div>
                </div>

                <button
                  id={`fast-food-quick-add-${item.id}`}
                  onClick={() => onAddToCart(item)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{t.quickAdd}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
