import React from 'react';
import { FoodCategory, DietaryType, Language } from '../types';
import { translations } from '../i18n/translations';

interface CategoryBarProps {
  currentCategory: FoodCategory;
  onSelectCategory: (cat: FoodCategory) => void;
  dietaryFilter: DietaryType | 'all';
  onSelectDietary: (diet: DietaryType | 'all') => void;
  expressOnly: boolean;
  onToggleExpressOnly: () => void;
  highRatedOnly: boolean;
  onToggleHighRated: () => void;
  currentLang: Language;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  currentCategory,
  onSelectCategory,
  dietaryFilter,
  onSelectDietary,
  expressOnly,
  onToggleExpressOnly,
  highRatedOnly,
  onToggleHighRated,
  currentLang,
}) => {
  const t = translations[currentLang] || translations.en;

  const categoriesList: { id: FoodCategory; labelKey: string; icon: string }[] = [
    { id: 'all', labelKey: 'cat_all', icon: '🍽️' },
    { id: 'fast_food', labelKey: 'cat_fast_food', icon: '⚡' },
    { id: 'burgers', labelKey: 'cat_burgers', icon: '🍔' },
    { id: 'pizza', labelKey: 'cat_pizza', icon: '🍕' },
    { id: 'north_indian', labelKey: 'cat_north_indian', icon: '🍛' },
    { id: 'south_indian', labelKey: 'cat_south_indian', icon: '🫓' },
    { id: 'chinese', labelKey: 'cat_chinese', icon: '🥢' },
    { id: 'desserts', labelKey: 'cat_desserts', icon: '🍦' },
    { id: 'beverages', labelKey: 'cat_beverages', icon: '🥤' },
  ];

  return (
    <div className="bg-white border-b border-slate-100 sticky top-[61px] z-30 shadow-xs py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
        
        {/* Categories horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categoriesList.map(cat => {
            const isSelected = currentCategory === cat.id;
            const label = t[cat.labelKey] || cat.id;
            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200 scale-105 font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Dietary & Speed Filters bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Filters:
          </span>

          {/* Veg / NonVeg buttons */}
          <button
            id="filter-dietary-all-btn"
            onClick={() => onSelectDietary('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              dietaryFilter === 'all'
                ? 'bg-slate-800 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types
          </button>

          <button
            id="filter-dietary-veg-btn"
            onClick={() => onSelectDietary(dietaryFilter === 'veg' ? 'all' : 'veg')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span>{t.filter_veg}</span>
          </button>

          <button
            id="filter-dietary-nonveg-btn"
            onClick={() => onSelectDietary(dietaryFilter === 'non-veg' ? 'all' : 'non-veg')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
              dietaryFilter === 'non-veg'
                ? 'bg-rose-500 text-white border-rose-600 font-bold'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span>{t.filter_nonveg}</span>
          </button>

          {/* Express Delivery Toggle */}
          <button
            id="filter-express-delivery-btn"
            onClick={onToggleExpressOnly}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
              expressOnly
                ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>{t.filter_express}</span>
          </button>

          {/* High Rated Toggle */}
          <button
            id="filter-high-rated-btn"
            onClick={onToggleHighRated}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
              highRatedOnly
                ? 'bg-purple-600 text-white border-purple-700 font-bold'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span>{t.filter_high_rated}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
