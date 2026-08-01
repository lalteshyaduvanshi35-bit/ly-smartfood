import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Globe, 
  Bell, 
  Bike, 
  LayoutDashboard,
  X,
  Check,
  ChevronDown,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Language, NotificationItem, Order, UserProfile } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  activeOrder?: Order | null;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  userProfile?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  activeTab,
  onSelectTab,
  notifications,
  onMarkNotificationsRead,
  activeOrder,
  isAdmin,
  onToggleAdmin,
  userProfile,
  onOpenAuthModal,
  onLogout,
}) => {
  const t = translations[currentLang] || translations.en;
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Connaught Place, New Delhi");
  const [tempLocation, setTempLocation] = useState("");
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const languagesList: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'hinglish', name: 'Hinglish', flag: '⚡' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🚩' },
  ];

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLocation.trim()) {
      setSelectedLocation(tempLocation.trim());
      setShowLocationModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      {/* Top Banner for Fast Delivery */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">⚡ Express Fast</span>
        <span>Free delivery on orders above ₹299! Average delivery time: <b>18 mins</b></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-4">
            <button 
              id="brand-logo-btn"
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
                🍕
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  <span className="text-orange-600 font-black">LY </span>Smart<span className="text-orange-500">Food</span><span className="text-slate-800 font-semibold text-lg"> Delivery</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  {t.tagline}
                </span>
              </div>
            </button>

            {/* Location Selector */}
            <div className="hidden md:flex items-center border-l border-slate-200 pl-4">
              <button
                id="location-picker-btn"
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-orange-600 font-medium bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="max-w-[130px] truncate font-semibold">{selectedLocation}</span>
                <span className="text-[10px] text-orange-600 font-bold hover:underline">({t.changeLocation})</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-100/80 border border-slate-200 focus:border-orange-500 focus:bg-white focus:outline-hidden text-xs rounded-full pl-9 pr-8 py-2 text-slate-800 placeholder-slate-400 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions & Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Live Tracking Chip (if order exists) */}
            {activeOrder && (
              <button
                id="active-order-chip-btn"
                onClick={() => onSelectTab('tracking')}
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-emerald-100 transition-all animate-pulse"
              >
                <Bike className="w-4 h-4 text-emerald-600" />
                <span className="hidden lg:inline">{t.status_out_for_delivery}</span>
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">Live</span>
              </button>
            )}

            {/* User Profile / Auth Pill */}
            {userProfile?.isLoggedIn ? (
              <div className="relative">
                <button
                  id="user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[11px]">
                    {userProfile.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{userProfile.fullName}</span>
                  <ChevronDown className="w-3 h-3 text-orange-600" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-xs">{userProfile.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">+91 {userProfile.phone}</p>
                      <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Verified via OTP
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-xs text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout / Switch Phone</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / OTP</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                id="language-dropdown-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-2 rounded-lg font-semibold transition-colors border border-slate-200 cursor-pointer"
                title={t.selectLang}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase text-[11px] font-bold">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Language / भाषा चुनें
                  </div>
                  {languagesList.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer ${currentLang === lang.code ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Center */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (unreadNotifCount > 0) onMarkNotificationsRead();
                }}
                className="relative p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                title={t.notifications}
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce shadow-xs">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-xs">{t.notifications}</span>
                    <button 
                      onClick={() => setShowNotifMenu(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {t.noNotifications}
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-3 text-xs hover:bg-slate-50 transition-colors ${!n.read ? 'bg-orange-50/40' : ''}`}
                        >
                          <div className="font-bold text-slate-800">{n.title}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{n.message}</div>
                          <div className="text-[9px] text-slate-400 mt-1">{n.timestamp}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Toggle Button */}
            <button
              id="toggle-admin-portal-btn"
              onClick={onToggleAdmin}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isAdmin 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Exit Admin' : t.nav_admin}</span>
            </button>

            {/* Food Basket / Cart Trigger */}
            <button
              id="open-cart-drawer-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-200 active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-slate-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">{t.nav_cart}</span>
            </button>

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-100 border border-slate-200 focus:bg-white focus:outline-hidden text-xs rounded-xl pl-9 pr-8 py-2 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Change Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Select Delivery Address
              </h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleLocationSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Enter Street, Area or Pincode
                </label>
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="e.g. Sector 18, Noida or Hauz Khas"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-hidden"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation("Current GPS Location (28.61, 77.20)");
                    setShowLocationModal(false);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  🎯 Use GPS
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
