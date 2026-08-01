import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Bike, 
  LayoutDashboard, 
  Home, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Utensils, 
  PhoneCall, 
  MapPin, 
  Plus,
  Flame,
  Clock
} from 'lucide-react';

import { 
  Language, 
  FoodCategory, 
  DietaryType, 
  MenuItem, 
  CartItem, 
  Order, 
  Review, 
  NotificationItem, 
  OrderStatus, 
  CustomizationOption,
  UserProfile
} from './types';

import { translations } from './i18n/translations';
import { INITIAL_MENU_ITEMS, MOCK_REVIEWS, INITIAL_MOCK_ORDER, DEFAULT_RIDER } from './data/mockData';

import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { FoodCard } from './components/FoodCard';
import { FastFoodExpress } from './components/FastFoodExpress';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { LiveOrderTracking } from './components/LiveOrderTracking';
import { ReviewsModal } from './components/ReviewsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // User Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('smart_food_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('smart_food_user');
      if (!saved) return true;
      const parsed = JSON.parse(saved);
      return !parsed || !parsed.isLoggedIn;
    } catch (e) {
      return true;
    }
  });

  // App State
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentCategory, setCurrentCategory] = useState<FoodCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');
  const [expressOnly, setExpressOnly] = useState(false);
  const [highRatedOnly, setHighRatedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home' | 'express' | 'ai' | 'tracking' | 'admin'
  const [isAdmin, setIsAdmin] = useState(false);

  // Data Stores
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([INITIAL_MOCK_ORDER]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "Order En Route! 🛵",
      message: "Rider Vikram Singh is 8 mins away with your Double Cheese Burger.",
      timestamp: "Just now",
      read: false,
      type: "delivery",
      orderId: INITIAL_MOCK_ORDER.id
    },
    {
      id: "n2",
      title: "Express Fast Food Offer ⚡",
      message: "Use code SMART50 for flat ₹50 OFF on all burgers & pizzas!",
      timestamp: "10 mins ago",
      read: false,
      type: "promo"
    }
  ]);

  // Modal Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState<MenuItem | null>(null);

  // Checkout totals
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    discount: 0,
    tip: 20,
    total: 0
  });

  const t = translations[currentLang] || translations.en;

  // Active Live Order
  const activeLiveOrder = orders.find(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled') || orders[0];

  const handleLoginSuccess = (user: UserProfile) => {
    setUserProfile(user);
    setIsAuthModalOpen(false);
    triggerPushNotification("Welcome to LY Smart Food Delivery! 👋", `Logged in as ${user.fullName}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_food_user');
    setUserProfile(null);
    setIsAuthModalOpen(true);
  };

  // Cart Helper functions
  const handleAddToCart = (
    item: MenuItem, 
    selectedSize?: string, 
    selectedAddons: CustomizationOption[] = [], 
    specialInstructions?: string
  ) => {
    const sizeExtra = item.sizes?.find(s => s.name === selectedSize)?.extraPrice || 0;
    const addonsExtra = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.price + sizeExtra + addonsExtra;

    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        ci => ci.menuItem.id === item.id && ci.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIdx].quantity + 1;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: currentQty,
          totalPrice: currentQty * unitPrice
        };
        return updated;
      } else {
        const newCartItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          menuItem: item,
          quantity: 1,
          selectedSize,
          selectedAddons,
          specialInstructions,
          unitPrice,
          totalPrice: unitPrice
        };
        return [...prev, newCartItem];
      }
    });

    // In-app notification
    triggerPushNotification("Added to Basket 🍕", `${item.name} added to your basket.`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === cartItemId || item.menuItem.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: newQty * item.unitPrice
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const handleAddMultipleToCart = (itemsToAdd: MenuItem[]) => {
    itemsToAdd.forEach(item => handleAddToCart(item));
  };

  const handleAddCombo = (itemsToAdd: MenuItem[], discountPct: number) => {
    itemsToAdd.forEach(item => handleAddToCart(item));
    setIsCartOpen(true);
    triggerPushNotification("Express Combo Discount Applied! ⚡", `${discountPct}% OFF added to your cart.`);
  };

  const triggerPushNotification = (title: string, message: string, type: 'order' | 'promo' | 'delivery' = 'order') => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: "Just now",
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Browser native Notification API attempt
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body: message });
      } catch (e) {
        // ignore iframe permission restriction
      }
    }
  };

  // Payment Flow Completion
  const handleProceedToPayment = (subtotal: number, discount: number, tip: number, total: number) => {
    if (!userProfile?.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setCheckoutTotals({ subtotal, discount, tip, total });
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    const newOrderId = `SFD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: newOrderId,
      items: [...cartItems],
      subtotal: checkoutTotals.subtotal,
      deliveryFee: 0,
      tax: Math.round(checkoutTotals.subtotal * 0.05),
      discount: checkoutTotals.discount,
      tip: checkoutTotals.tip,
      totalAmount: checkoutTotals.total,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'placed',
      createdAt: 'Just now',
      estimatedDeliveryTimeMinutes: 18,
      deliveryAddress: {
        street: 'Connaught Place, Block A, Flat 201',
        city: 'New Delhi',
        zipCode: '110001'
      },
      customerName: userProfile?.fullName || 'Valued Customer',
      customerPhone: userProfile?.phone ? `+91 ${userProfile.phone}` : '+91 98765 43210',
      rider: DEFAULT_RIDER,
      riderCoordinates: { lat: 28.6139, lng: 77.2090, progressPct: 10 },
      trackingHistory: [
        {
          status: 'placed',
          title: 'Order Received',
          description: `Order #${newOrderId} confirmed for Cash/UPI on Delivery.`,
          timestamp: 'Just now',
          completed: true,
          active: true
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsPaymentOpen(false);
    setActiveTab('tracking');

    triggerPushNotification(
      `Order #${newOrderId} Confirmed! 🎉`,
      `Prepared fresh! Pay ₹${checkoutTotals.total} via Cash or UPI when rider delivers in ~18 mins.`,
      'order'
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const history = [...o.trackingHistory];
        const existingIdx = history.findIndex(h => h.status === status);
        
        const statusTitles: Record<OrderStatus, string> = {
          placed: 'Order Placed',
          confirmed: 'Accepted by Kitchen',
          preparing: 'Cooking in Kitchen 👨‍🍳',
          out_for_delivery: 'Out for Delivery 🛵',
          delivered: 'Delivered 🎉',
          cancelled: 'Order Cancelled'
        };

        if (existingIdx === -1) {
          history.push({
            status,
            title: statusTitles[status],
            description: `Status updated to ${status.replace('_', ' ')}.`,
            timestamp: 'Just now',
            completed: true,
            active: true
          });
        }
        return { ...o, orderStatus: status, trackingHistory: history };
      }
      return o;
    }));

    triggerPushNotification(
      `Order Update 🛵`,
      `Your order #${orderId} is now ${status.replace('_', ' ')}.`,
      'delivery'
    );
  };

  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...newReviewData,
      id: `r_${Date.now()}`,
      date: 'Just now'
    };
    setReviews(prev => [newRev, ...prev]);
    
    // Update item rating average
    setMenuItems(prev => prev.map(item => {
      if (item.id === newReviewData.itemId) {
        const itemRevs = [...reviews.filter(r => r.itemId === item.id), newRev];
        const avg = itemRevs.reduce((a, b) => a + b.rating, 0) / itemRevs.length;
        return {
          ...item,
          rating: Number(avg.toFixed(1)),
          reviewCount: itemRevs.length
        };
      }
      return item;
    }));

    triggerPushNotification("Review Submitted! ⭐", "Thank you for sharing your feedback.");
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
    triggerPushNotification("New Dish Added 🍔", `${newItem.name} added to the restaurant menu.`);
  };

  const handleToggleStock = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    }));
  };

  // Filtered Food Items logic
  const filteredMenuItems = menuItems.filter(item => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q) || (item.nameHindi && item.nameHindi.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }

    // Category filter
    if (currentCategory !== 'all' && item.category !== currentCategory) {
      if (currentCategory === 'fast_food' && !item.isFastFoodExpress) return false;
      if (currentCategory !== 'fast_food') return false;
    }

    // Dietary filter
    if (dietaryFilter !== 'all' && item.dietary !== dietaryFilter) return false;

    // Express filter
    if (expressOnly && !item.isFastFoodExpress) return false;

    // High rated
    if (highRatedOnly && item.rating < 4.5) return false;

    return true;
  });

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-8 selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        notifications={notifications}
        onMarkNotificationsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        activeOrder={activeLiveOrder}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          setIsAdmin(!isAdmin);
          if (!isAdmin) setActiveTab('admin');
          else setActiveTab('home');
        }}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        
        {/* TAB 1: HOME & MENU */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Category & Filters Bar */}
            <CategoryBar
              currentCategory={currentCategory}
              onSelectCategory={setCurrentCategory}
              dietaryFilter={dietaryFilter}
              onSelectDietary={setDietaryFilter}
              expressOnly={expressOnly}
              onToggleExpressOnly={() => setExpressOnly(!expressOnly)}
              highRatedOnly={highRatedOnly}
              onToggleHighRated={() => setHighRatedOnly(!highRatedOnly)}
              currentLang={currentLang}
            />

            {/* Fast Food Express Special Section */}
            <FastFoodExpress
              fastFoodItems={menuItems.filter(i => i.isFastFoodExpress)}
              currentLang={currentLang}
              onAddToCart={handleAddToCart}
              onAddCombo={handleAddCombo}
            />

            {/* Menu Section Title */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Explore Menu</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                    {filteredMenuItems.length} Items
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Prepared fresh & delivered piping hot to your doorstep
                </p>
              </div>
            </div>

            {/* Food Items Grid */}
            {filteredMenuItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-100 my-8">
                <div className="text-4xl">🔍</div>
                <h3 className="font-bold text-slate-800 text-base">No matching dishes found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different food category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('all');
                    setDietaryFilter('all');
                    setExpressOnly(false);
                    setHighRatedOnly(false);
                  }}
                  className="bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMenuItems.map(item => {
                  const cartItem = cartItems.find(ci => ci.menuItem.id === item.id);
                  return (
                    <FoodCard
                      key={item.id}
                      item={item}
                      currentLang={currentLang}
                      quantityInCart={cartItem ? cartItem.quantity : 0}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateCartQuantity}
                      onOpenReviews={(item) => setReviewModalItem(item)}
                    />
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: FAST FOOD EXPRESS */}
        {activeTab === 'express' && (
          <div className="space-y-6">
            <FastFoodExpress
              fastFoodItems={menuItems.filter(i => i.isFastFoodExpress)}
              currentLang={currentLang}
              onAddToCart={handleAddToCart}
              onAddCombo={handleAddCombo}
            />

            <h3 className="font-bold text-slate-900 text-lg">Fast Food Items (&lt; 15 mins Delivery)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {menuItems.filter(i => i.isFastFoodExpress).map(item => {
                const cartItem = cartItems.find(ci => ci.menuItem.id === item.id);
                return (
                  <FoodCard
                    key={item.id}
                    item={item}
                    currentLang={currentLang}
                    quantityInCart={cartItem ? cartItem.quantity : 0}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onOpenReviews={(item) => setReviewModalItem(item)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ORDER TRACKING */}
        {activeTab === 'tracking' && (
          <LiveOrderTracking
            order={activeLiveOrder}
            currentLang={currentLang}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNewOrderClick={() => setActiveTab('home')}
          />
        )}

        {/* TAB 5: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            menuItems={menuItems}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddMenuItem={handleAddMenuItem}
            onToggleStock={handleToggleStock}
            currentLang={currentLang}
          />
        )}

      </main>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        currentLang={currentLang}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Pay on Delivery Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        grandTotal={checkoutTotals.total}
        currentLang={currentLang}
        onPaymentSuccess={handlePaymentSuccess}
        customerName={userProfile?.fullName}
        customerPhone={userProfile?.phone}
      />

      {/* OTP & Login Gate Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        canCloseWithoutLogin={!!userProfile?.isLoggedIn}
      />

      {/* Customer Reviews Modal */}
      <ReviewsModal
        item={reviewModalItem}
        isOpen={!!reviewModalItem}
        onClose={() => setReviewModalItem(null)}
        reviews={reviews}
        onAddReview={handleAddReview}
        currentLang={currentLang}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          
          <button
            id="mobile-nav-home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 cursor-pointer ${
              activeTab === 'home' ? 'text-orange-500' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t.nav_home}</span>
          </button>

          <button
            id="mobile-nav-express"
            onClick={() => setActiveTab('express')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 cursor-pointer ${
              activeTab === 'express' ? 'text-orange-500' : 'text-slate-500'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>Fast Food</span>
          </button>

          <button
            id="mobile-nav-tracking"
            onClick={() => setActiveTab('tracking')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 cursor-pointer relative ${
              activeTab === 'tracking' ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            <Bike className="w-5 h-5" />
            <span>Live Track</span>
            {activeLiveOrder && activeLiveOrder.orderStatus !== 'delivered' && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          <button
            id="mobile-nav-admin"
            onClick={() => {
              setIsAdmin(true);
              setActiveTab('admin');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold p-1 cursor-pointer ${
              activeTab === 'admin' ? 'text-purple-600' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Admin</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
