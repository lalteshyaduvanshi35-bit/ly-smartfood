import React, { useState } from 'react';
import { Star, Clock, Flame, Plus, Minus, Sparkles, Check, Info } from 'lucide-react';
import { MenuItem, Language, CustomizationOption } from '../types';
import { translations } from '../i18n/translations';

interface FoodCardProps {
  item: MenuItem;
  currentLang: Language;
  quantityInCart: number;
  onAddToCart: (item: MenuItem, size?: string, addons?: CustomizationOption[], notes?: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onOpenReviews: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  currentLang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenReviews,
}) => {
  const t = translations[currentLang] || translations.en;
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    item.sizes?.[0]?.name || ''
  );
  const [selectedAddons, setSelectedAddons] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Localized Name selection
  const getItemName = () => {
    if (currentLang === 'hi' && item.nameHindi) return item.nameHindi;
    if (currentLang === 'hinglish' && item.nameHinglish) return item.nameHinglish;
    if (currentLang === 'es' && item.nameSpanish) return item.nameSpanish;
    if (currentLang === 'mr' && item.nameMarathi) return item.nameMarathi;
    return item.name;
  };

  const handleToggleAddon = (addon: CustomizationOption) => {
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleCustomAdd = () => {
    onAddToCart(item, selectedSize, selectedAddons, specialInstructions);
    setShowCustomizeModal(false);
    setSelectedAddons([]);
    setSpecialInstructions('');
  };

  const extraPriceFromSize = item.sizes?.find(s => s.name === selectedSize)?.extraPrice || 0;
  const extraPriceFromAddons = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalCustomPrice = item.price + extraPriceFromSize + extraPriceFromAddons;

  return (
    <div 
      id={`food-card-${item.id}`}
      className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
    >
      {/* Image & Badges */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Veg/Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-xs flex items-center gap-1.5 border border-slate-200">
          <span className={`w-2.5 h-2.5 rounded-full border ${
            item.dietary === 'veg' 
              ? 'bg-emerald-500 border-emerald-700' 
              : 'bg-rose-500 border-rose-700'
          }`} />
          <span className="text-[10px] font-bold uppercase text-slate-800">
            {item.dietary === 'veg' ? t.vegTag : t.nonVegTag}
          </span>
        </div>

        {/* Fast Food Express & Bestseller Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {item.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wide shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              {t.bestSeller}
            </span>
          )}
          {item.isFastFoodExpress && (
            <span className="bg-orange-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-0.5">
              ⚡ 20m Express
            </span>
          )}
        </div>

        {/* Prep Time & Calories Pill */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 text-white text-[11px] font-semibold drop-shadow-md">
          <span className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-orange-400" />
            {item.prepTimeMin} mins
          </span>
          {item.calories && (
            <span className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 text-amber-400" />
              {item.calories} kcal
            </span>
          )}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-orange-600 transition-colors">
              {getItemName()}
            </h3>

            {/* Rating pill button */}
            <button
              id={`reviews-trigger-${item.id}`}
              onClick={() => onOpenReviews(item)}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-lg border border-amber-200 shrink-0 font-bold transition-colors cursor-pointer"
              title="Click to view reviews"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{item.rating}</span>
              <span className="text-[10px] text-slate-500 font-normal">({item.reviewCount})</span>
            </button>
          </div>

          <p className="text-slate-500 text-xs line-clamp-2 mt-1 font-normal leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{item.price}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>
            {(item.sizes || item.addons) && (
              <span className="text-[10px] text-orange-600 font-semibold block -mt-0.5">
                Customizable
              </span>
            )}
          </div>

          {/* Add / Counter Buttons */}
          <div>
            {quantityInCart > 0 ? (
              <div className="flex items-center gap-2 bg-orange-500 text-white rounded-xl p-1 shadow-md shadow-orange-200">
                <button
                  id={`decrease-cart-btn-${item.id}`}
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center font-bold text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-xs px-1 min-w-[16px] text-center">
                  {quantityInCart}
                </span>
                <button
                  id={`increase-cart-btn-${item.id}`}
                  onClick={() => {
                    if (item.sizes || item.addons) {
                      setShowCustomizeModal(true);
                    } else {
                      onAddToCart(item);
                    }
                  }}
                  className="w-6 h-6 rounded-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center font-bold text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex gap-1.5">
                {(item.sizes || item.addons) ? (
                  <button
                    id={`customize-add-btn-${item.id}`}
                    onClick={() => setShowCustomizeModal(true)}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{t.addBtn}</span>
                    <Plus className="w-3.5 h-3.5 text-orange-500" />
                  </button>
                ) : (
                  <button
                    id={`quick-add-btn-${item.id}`}
                    onClick={() => onAddToCart(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md shadow-orange-200 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{t.addBtn}</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{getItemName()}</h3>
                <p className="text-xs text-slate-500 font-medium">Customize your meal preferences</p>
              </div>
              <button 
                onClick={() => setShowCustomizeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Size Options */}
            {item.sizes && item.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Size
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {item.sizes.map((sz) => (
                    <button
                      key={sz.name}
                      onClick={() => setSelectedSize(sz.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedSize === sz.name
                          ? 'border-orange-500 bg-orange-50 text-orange-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedSize === sz.name ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                          {selectedSize === sz.name && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        <span>{sz.name}</span>
                      </div>
                      {sz.extraPrice > 0 && <span className="text-orange-600 font-bold">+₹{sz.extraPrice}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {item.addons && item.addons.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Extra Add-ons / Dips
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {item.addons.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.name === addon.name);
                    return (
                      <button
                        key={addon.name}
                        onClick={() => handleToggleAddon(addon)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50 text-orange-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${isChecked ? 'border-orange-500 bg-orange-500' : 'border-slate-300'}`}>
                            {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                          </span>
                          <span>{addon.name}</span>
                        </div>
                        <span className="text-slate-600 font-bold">+₹{addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cooking Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Special Cooking Request</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less spicy, extra sauce, double crispy..."
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleCustomAdd}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-between px-4 shadow-lg shadow-orange-200 transition-all"
            >
              <span>Add Custom Item to Cart</span>
              <span className="bg-orange-600 px-2.5 py-1 rounded-lg text-sm font-black">
                ₹{totalCustomPrice}
              </span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
};
