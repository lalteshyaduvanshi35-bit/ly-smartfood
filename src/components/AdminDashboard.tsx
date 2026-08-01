import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Bike, 
  Clock, 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Store, 
  Utensils, 
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { MenuItem, Order, OrderStatus, FoodCategory, DietaryType, Language } from '../types';
import { translations } from '../i18n/translations';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  onToggleStock: (itemId: string) => void;
  currentLang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  menuItems,
  onUpdateOrderStatus,
  onAddMenuItem,
  onToggleStock,
  currentLang,
}) => {
  const t = translations[currentLang] || translations.en;

  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<FoodCategory>('burgers');
  const [itemDietary, setItemDietary] = useState<DietaryType>('veg');
  const [itemPrice, setItemPrice] = useState(199);
  const [itemImage, setItemImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');
  const [itemPrepTime, setItemPrepTime] = useState(12);
  const [itemDesc, setItemDesc] = useState('');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const activeDeliveriesCount = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || itemPrice <= 0) return;

    const newItem: MenuItem = {
      id: `m_${Date.now()}`,
      name: itemName.trim(),
      description: itemDesc.trim() || 'Delicious freshly prepared dish.',
      price: itemPrice,
      rating: 5.0,
      reviewCount: 1,
      category: itemCategory,
      dietary: itemDietary,
      image: itemImage,
      prepTimeMin: itemPrepTime,
      isBestSeller: false,
      isFastFoodExpress: true,
      isAvailable: true
    };

    onAddMenuItem(newItem);
    setShowAddForm(false);
    setItemName('');
    setItemDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4 px-4 sm:px-6">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Control Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {t.adminTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Live Orders Queue ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.manageMenu} ({menuItems.length})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">{t.todayRevenue}</span>
            <span className="text-lg font-black text-slate-900">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">{t.totalOrdersCount}</span>
            <span className="text-lg font-black text-slate-900">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">{t.activeDeliveries}</span>
            <span className="text-lg font-black text-amber-600">{activeDeliveriesCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">{t.avgDeliveryTime}</span>
            <span className="text-lg font-black text-slate-900">16 mins</span>
          </div>
        </div>

      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
            <span>{t.ordersQueue}</span>
            <span className="text-xs text-slate-400 font-normal">Real-time status updater</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {orders.map(ord => (
              <div key={ord.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">#{ord.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ord.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">₹{ord.totalAmount}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Customer: <b>{ord.customerName}</b> ({ord.customerPhone}) • {ord.deliveryAddress.street}
                  </p>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Items: {ord.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as OrderStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => onUpdateOrderStatus(ord.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        ord.orderStatus === st
                          ? 'bg-slate-900 text-white font-black shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'placed' ? 'Placed' : st === 'confirmed' ? 'Accept' : st === 'preparing' ? 'Kitchen' : st === 'out_for_delivery' ? 'Dispatch' : 'Delivered'}
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Menu Management Tab */
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">{t.manageMenu}</h3>
            <button
              id="add-new-food-item-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addItemTitle}</span>
            </button>
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <form onSubmit={handleCreateMenuItem} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
              <h4 className="font-bold text-slate-800 text-xs uppercase">{t.addItemTitle}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">{t.itemName}</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Maharaja Mac Burger"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">{t.itemPrice}</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">{t.itemCategory}</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="burgers">Burgers</option>
                    <option value="pizza">Pizza</option>
                    <option value="fast_food">Fast Food</option>
                    <option value="north_indian">North Indian</option>
                    <option value="south_indian">South Indian</option>
                    <option value="chinese">Chinese</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">{t.itemImage}</label>
                  <input
                    type="text"
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs"
                >
                  {t.saveItem}
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {menuItems.map(item => (
              <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{item.name}</h5>
                    <span className="text-[11px] text-slate-500 font-mono font-bold">₹{item.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleStock(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                    item.isAvailable !== false
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  {item.isAvailable !== false ? t.inStock : t.outOfStock}
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
