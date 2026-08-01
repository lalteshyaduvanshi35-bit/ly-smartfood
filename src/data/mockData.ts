import { MenuItem, Review, Order, DeliveryRider } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Double Cheese Crunch Burger",
    nameHindi: "डबल चीज़ क्रंच बर्गर",
    nameHinglish: "Double Cheese Crunch Burger",
    nameSpanish: "Hamburguesa Doble Queso Crujiente",
    nameMarathi: "डबल चीज क्रंच बर्गर",
    description: "Juicy double grilled patty topped with melted cheddar, crispy onion rings, dill pickles & secret sauce.",
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviewCount: 342,
    category: "burgers",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 12,
    calories: 620,
    isBestSeller: true,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Fresh Brioche Bun", "Double Cheddar Cheese", "Crispy Veg Patty", "Pickles", "TastyDash House Sauce"],
    sizes: [
      { name: "Regular Single", extraPrice: 0 },
      { name: "Double Loaded (+₹50)", extraPrice: 50 },
      { name: "Monster Triple (+₹90)", extraPrice: 90 }
    ],
    addons: [
      { name: "Extra Cheese Slice", price: 30 },
      { name: "Crispy Bacon/Veg Strip", price: 40 },
      { name: "Jalapeño Dip", price: 25 }
    ]
  },
  {
    id: "m2",
    name: "Supreme Pepperoni & Mushroom Pizza",
    nameHindi: "सुप्रीम पिज्जा",
    nameHinglish: "Supreme Pepperoni Pizza",
    nameSpanish: "Pizza Suprema de Pepperoni y Champiñones",
    nameMarathi: "सुप्रीम पिझ्झा",
    description: "Hand-tossed sourdough pizza loaded with mozzarella, spicy pepperoni, portobello mushrooms & fresh basil.",
    price: 499,
    originalPrice: 599,
    rating: 4.9,
    reviewCount: 512,
    category: "pizza",
    dietary: "non-veg",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 15,
    calories: 890,
    isBestSeller: true,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Sourdough Crust", "Mozzarella Cheese", "Spicy Pepperoni", "Fresh Mushrooms", "San Marzano Tomato Sauce"],
    sizes: [
      { name: "Personal 8 inch", extraPrice: 0 },
      { name: "Medium 10 inch (+₹150)", extraPrice: 150 },
      { name: "Large 12 inch (+₹280)", extraPrice: 280 }
    ],
    addons: [
      { name: "Cheese Burst Crust", price: 80 },
      { name: "Extra Garlic Butter", price: 30 },
      { name: "Chili Flakes & Oregano Pack", price: 15 }
    ]
  },
  {
    id: "m3",
    name: "Crispy Peri Peri Loaded Fries",
    nameHindi: "पेरी पेरी लोडेड फ्राइज",
    nameHinglish: "Crispy Peri Peri Loaded Fries",
    nameSpanish: "Papas Fritas Cargadas Peri Peri",
    nameMarathi: "पेरी पेरी लोडेड फ्राईज",
    description: "Golden crinkle cut fries tossed in spicy African Peri Peri seasoning, topped with warm liquid cheese & jalapenos.",
    price: 169,
    originalPrice: 199,
    rating: 4.7,
    reviewCount: 289,
    category: "fast_food",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 8,
    calories: 410,
    isBestSeller: true,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Crinkle Cut Potatoes", "Peri Peri Dusting", "Cheese Sauce", "Pickled Jalapeños"],
    sizes: [
      { name: "Medium Box", extraPrice: 0 },
      { name: "Large Jumbo Box (+₹40)", extraPrice: 40 }
    ],
    addons: [
      { name: "Extra Cheese Drizzle", price: 30 },
      { name: "Chipotle Mayo Dip", price: 25 }
    ]
  },
  {
    id: "m4",
    name: "Royal Butter Chicken & Garlic Naan Combo",
    nameHindi: "रॉयल बटर चिकन और बटर नान",
    nameHinglish: "Royal Butter Chicken & Garlic Naan Combo",
    nameSpanish: "Pollo a la Mantequilla con Pan Naan de Ajo",
    nameMarathi: "बटर चिकन आणि गार्लिक नान",
    description: "Tender tandoori chicken cooked in rich cashew and tomato butter gravy, served with 2 hot garlic butter naans.",
    price: 389,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: 620,
    category: "north_indian",
    dietary: "non-veg",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 18,
    calories: 780,
    isBestSeller: true,
    isFastFoodExpress: false,
    isAvailable: true,
    ingredients: ["Boneless Chicken", "Kasuri Methi", "Tomato Makhani Gravy", "Garlic Butter Naan"],
    addons: [
      { name: "Extra Garlic Naan (1 pc)", price: 45 },
      { name: "Sweet Lassi (250ml)", price: 60 }
    ]
  },
  {
    id: "m5",
    name: "Crispy Mysore Masala Dosa",
    nameHindi: "मैसूर मसाला डोसा",
    nameHinglish: "Crispy Mysore Masala Dosa",
    nameSpanish: "Dosa Masala Estilo Mysore",
    nameMarathi: "मैसूर मसाला डोसा",
    description: "Golden crispy crepe smeared with fiery red garlic chutney, filled with spiced potato masala, served with sambar & coconut chutney.",
    price: 179,
    originalPrice: 210,
    rating: 4.8,
    reviewCount: 410,
    category: "south_indian",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 10,
    calories: 390,
    isBestSeller: true,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Fermented Rice Batter", "Mysore Red Chutney", "Aloo Masala", "Ghee"],
    addons: [
      { name: "Extra Amul Butter", price: 25 },
      { name: "Extra Sambar Bowl", price: 30 }
    ]
  },
  {
    id: "m6",
    name: "Paneer Tikka Kathi Roll",
    nameHindi: "पनीर टिक्का काठी रोल",
    nameHinglish: "Paneer Tikka Kathi Roll",
    nameSpanish: "Roll de Paneer Tikka",
    nameMarathi: "पनीर टिक्का काठी रोल",
    description: "Char-grilled marinated paneer cubes rolled in soft flaky paratha with mint chutney, sliced onions and tangy spices.",
    price: 189,
    originalPrice: 220,
    rating: 4.6,
    reviewCount: 195,
    category: "north_indian",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 10,
    calories: 450,
    isBestSeller: false,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Cottage Cheese (Paneer)", "Mint Mayo", "Crispy Lachha Paratha", "Bell Peppers"]
  },
  {
    id: "m7",
    name: "Szechuan Chili Garlic Noodles",
    nameHindi: "सेज़वान चिली गार्लिक नूडल्स",
    nameHinglish: "Schezwan Chili Garlic Noodles",
    nameSpanish: "Fideos de Ajo y Chili Szechuan",
    nameMarathi: "शेझवान चिली गार्लिक नूडल्स",
    description: "Wok-tossed noodles with shredded vegetables, roasted garlic, spring onions & bold spicy Szechuan sauce.",
    price: 219,
    originalPrice: 250,
    rating: 4.7,
    reviewCount: 310,
    category: "chinese",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 12,
    calories: 520,
    isBestSeller: false,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Wheat Noodles", "Szechuan Sauce", "Crispy Garlic", "Capsicum & Cabbage"]
  },
  {
    id: "m8",
    name: "Sizzling Chocolate Brownie Sundae",
    nameHindi: "चॉकलेट ब्राउनी संडे",
    nameHinglish: "Sizzling Chocolate Brownie Sundae",
    nameSpanish: "Helado con Brownie de Chocolate",
    nameMarathi: "चॉकलेट ब्राऊनी संडे",
    description: "Warm fudgy dark chocolate brownie topped with Madagascar vanilla ice cream, hot fudge sauce & roasted walnuts.",
    price: 199,
    originalPrice: 240,
    rating: 4.9,
    reviewCount: 480,
    category: "desserts",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 7,
    calories: 580,
    isBestSeller: true,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Dark Chocolate Brownie", "Vanilla Gelato", "Hot Chocolate Fudge", "Roasted Walnuts"]
  },
  {
    id: "m9",
    name: "Chilled Oreo Thick Shake",
    nameHindi: "ओरियो थिक शेक",
    nameHinglish: "Chilled Oreo Thick Shake",
    nameSpanish: "Malteada Espesa de Oreo",
    nameMarathi: "ओरिओ थिक शेक",
    description: "Rich blended milk ice cream shake with crushed crunchy Oreo cookies, topped with whipped cream & chocolate drizzle.",
    price: 159,
    originalPrice: 180,
    rating: 4.8,
    reviewCount: 290,
    category: "beverages",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 5,
    calories: 420,
    isBestSeller: true,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Full Cream Milk", "Oreo Cookies", "Vanilla Ice Cream", "Whipped Cream"]
  },
  {
    id: "m10",
    name: "Mexican Spicy Fiesta Tacos (3 pcs)",
    nameHindi: "मेक्सिकन स्पाइसी टाकोस",
    nameHinglish: "Mexican Spicy Fiesta Tacos",
    nameSpanish: "Tacos Fiesta Picante Mexicana",
    nameMarathi: "मेक्सिकन स्पायसी टाकोस",
    description: "Crispy tortilla shells stuffed with seasoned black beans, sweet corn, salsa, sour cream & shredded cheese.",
    price: 229,
    originalPrice: 269,
    rating: 4.6,
    reviewCount: 178,
    category: "fast_food",
    dietary: "veg",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    prepTimeMin: 11,
    calories: 460,
    isBestSeller: false,
    isFastFoodExpress: true,
    isAvailable: true,
    ingredients: ["Corn Tortilla", "Refried Beans", "Pico de Gallo Salsa", "Sour Cream", "Cheese"]
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    itemId: "m1",
    userName: "Rahul Sharma",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 hours ago",
    comment: "The Double Cheese Crunch burger arrived piping hot in just 16 minutes! Crisp patty and super juicy cheese. Highly recommended fast food express!",
    tags: ["Hot & Fresh", "Super Fast Delivery", "Juicy Patty"],
    verifiedPurchase: true
  },
  {
    id: "r2",
    itemId: "m2",
    userName: "Priya Patel",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "Yesterday",
    comment: "Amazing pepperoni pizza! Crust was perfectly sourdough with crusty edges. The live tracking showed exact rider movement right up to my door.",
    tags: ["Authentic Sourdough", "Live Tracking Spot On"],
    verifiedPurchase: true
  },
  {
    id: "r3",
    itemId: "m4",
    userName: "Aman Verma",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "3 days ago",
    comment: "Butter chicken gravy was rich, silky, and smoky. Garlic naan remained warm thanks to thermal foil packaging.",
    tags: ["Mouthwatering Gravy", "Great Packaging"],
    verifiedPurchase: true
  }
];

export const DEFAULT_RIDER: DeliveryRider = {
  id: "rider_01",
  name: "Vikram Singh",
  phone: "+91 98765 43210",
  vehicle: "TVS iQube EV (UP-16-EV-8842)",
  rating: 4.9,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  currentLat: 28.6139,
  currentLng: 77.2090
};

export const INITIAL_MOCK_ORDER: Order = {
  id: "TD-882910",
  items: [
    {
      id: "cart_01",
      menuItem: INITIAL_MENU_ITEMS[0],
      quantity: 1,
      selectedSize: "Regular Single",
      selectedAddons: [{ name: "Extra Cheese Slice", price: 30 }],
      unitPrice: 279,
      totalPrice: 279
    },
    {
      id: "cart_02",
      menuItem: INITIAL_MENU_ITEMS[2],
      quantity: 1,
      selectedAddons: [],
      unitPrice: 169,
      totalPrice: 169
    }
  ],
  subtotal: 448,
  deliveryFee: 0,
  tax: 22.4,
  discount: 50,
  tip: 30,
  totalAmount: 450.4,
  paymentMethod: "upi",
  paymentStatus: "paid",
  orderStatus: "out_for_delivery",
  createdAt: "12 mins ago",
  estimatedDeliveryTimeMinutes: 8,
  deliveryAddress: {
    street: "Flat 402, Block C, Green Park Apartments",
    city: "New Delhi",
    landmark: "Near Main Park Gate",
    zipCode: "110016"
  },
  customerName: "Gaurav Kumar",
  customerPhone: "+91 99112 23344",
  rider: DEFAULT_RIDER,
  riderCoordinates: {
    lat: 28.6139,
    lng: 77.2090,
    progressPct: 65
  },
  trackingHistory: [
    {
      status: "placed",
      title: "Order Received",
      description: "Your order TD-882910 was confirmed.",
      timestamp: "12 mins ago",
      completed: true,
      active: false
    },
    {
      status: "confirmed",
      title: "Accepted by Restaurant",
      description: "TastyDash Express Kitchen accepted your order.",
      timestamp: "10 mins ago",
      completed: true,
      active: false
    },
    {
      status: "preparing",
      title: "Cooking in Kitchen",
      description: "Chef is frying fresh patties and crisping loaded fries.",
      timestamp: "7 mins ago",
      completed: true,
      active: false
    },
    {
      status: "out_for_delivery",
      title: "Out for Delivery",
      description: "Rider Vikram Singh picked up your hot food package.",
      timestamp: "3 mins ago",
      completed: true,
      active: true
    },
    {
      status: "delivered",
      title: "Delivered",
      description: "Package handed to customer.",
      timestamp: "--",
      completed: false,
      active: false
    }
  ]
};
