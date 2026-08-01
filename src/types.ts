export type Language = 'en' | 'hi' | 'hinglish' | 'es' | 'mr';

export type FoodCategory = 
  | 'all'
  | 'fast_food'
  | 'burgers'
  | 'pizza'
  | 'north_indian'
  | 'south_indian'
  | 'chinese'
  | 'desserts'
  | 'beverages';

export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameHindi?: string;
  nameHinglish?: string;
  nameSpanish?: string;
  nameMarathi?: string;
  description: string;
  descriptionHindi?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: FoodCategory;
  dietary: DietaryType;
  image: string;
  prepTimeMin: number;
  calories?: number;
  isBestSeller?: boolean;
  isFastFoodExpress?: boolean;
  isAvailable?: boolean;
  ingredients?: string[];
  sizes?: { name: string; extraPrice: number }[];
  addons?: CustomizationOption[];
}

export interface CartItem {
  id: string; // Unique instance id
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: string;
  selectedAddons: CustomizationOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  itemId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  tags?: string[];
  verifiedPurchase: boolean;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

export interface DeliveryRider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  avatar: string;
  currentLat: number;
  currentLng: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  tip: number;
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryTimeMinutes: number;
  deliveryAddress: {
    street: string;
    city: string;
    landmark?: string;
    zipCode: string;
  };
  customerName: string;
  customerPhone: string;
  rider?: DeliveryRider;
  trackingHistory: TrackingStep[];
  riderCoordinates?: { lat: number; lng: number; progressPct: number };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promo' | 'delivery' | 'recommendation';
  orderId?: string;
}

export interface AiRecommendation {
  title: string;
  description: string;
  itemIds: string[];
  discountPct: number;
  reason: string;
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email?: string;
  isLoggedIn: boolean;
  loginTime?: string;
}

