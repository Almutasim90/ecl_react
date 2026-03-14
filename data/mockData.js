// Mock data for development (no backend needed)

export const CATEGORIES = [
  { id: '1', name: 'Restaurants', nameAr: 'مطاعم', icon: 'restaurant-outline', color: '#ef4444' },
  { id: '2', name: 'Cafes', nameAr: 'مقاهي', icon: 'cafe-outline', color: '#f59e0b' },
  { id: '3', name: 'Shopping', nameAr: 'تسوق', icon: 'cart-outline', color: '#8b5cf6' },
  { id: '4', name: 'Healthcare', nameAr: 'رعاية صحية', icon: 'medkit-outline', color: '#10b981' },
  { id: '5', name: 'Beauty', nameAr: 'تجميل', icon: 'cut-outline', color: '#ec4899' },
  { id: '6', name: 'Services', nameAr: 'خدمات', icon: 'construct-outline', color: '#3b82f6' },
  { id: '7', name: 'Education', nameAr: 'تعليم', icon: 'school-outline', color: '#06b6d4' },
  { id: '8', name: 'Entertainment', nameAr: 'ترفيه', icon: 'game-controller-outline', color: '#f97316' },
];

export const FEATURED_BUSINESSES = [
  {
    id: '1',
    name: 'The Coffee House',
    nameAr: 'ذا كوفي هاوس',
    category: 'Cafes',
    categoryAr: 'مقاهي',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    rating: 4.8,
    reviewCount: 234,
    distance: '1.2 km',
    address: 'Downtown, Dubai',
    addressAr: 'وسط المدينة، دبي',
    isOpen: true,
    featured: true,
    verified: true,
    coordinates: {
      latitude: 25.1972,
      longitude: 55.2744,
    },
    contact: {
      phone: '+971 4 123 4567',
      whatsapp: '+971501234567',
      instagram: '@coffeehouse',
    },
  },
  {
    id: '2',
    name: 'Golden Scissors Salon',
    nameAr: 'صالون المقص الذهبي',
    category: 'Beauty',
    categoryAr: 'تجميل',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    rating: 4.9,
    reviewCount: 456,
    distance: '0.8 km',
    address: 'Marina Walk, Dubai',
    addressAr: 'مارينا ووك، دبي',
    isOpen: true,
    featured: true,
    verified: true,
    coordinates: {
      latitude: 25.0801,
      longitude: 55.1417,
    },
    contact: {
      phone: '+971 4 234 5678',
      whatsapp: '+971502345678',
      instagram: '@goldenscissors',
    },
  },
  {
    id: '3',
    name: 'Tech Repair Pro',
    nameAr: 'برو لإصلاح التقنية',
    category: 'Services',
    categoryAr: 'خدمات',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    rating: 4.7,
    reviewCount: 189,
    distance: '2.1 km',
    address: 'Business Bay, Dubai',
    addressAr: 'الخليج التجاري، دبي',
    isOpen: false,
    featured: true,
    verified: true,
    coordinates: {
      latitude: 25.1850,
      longitude: 55.2625,
    },
    contact: {
      phone: '+971 4 345 6789',
      whatsapp: '+971503456789',
      instagram: '@techrepairpro',
    },
  },
  {
    id: '4',
    name: 'Fitness First Gym',
    nameAr: 'فتنس فيرست جيم',
    category: 'Healthcare',
    categoryAr: 'رعاية صحية',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    rating: 4.6,
    reviewCount: 312,
    distance: '1.5 km',
    address: 'JBR, Dubai',
    addressAr: 'جي بي آر، دبي',
    isOpen: true,
    featured: true,
    verified: false,
    coordinates: {
      latitude: 25.0780,
      longitude: 55.1330,
    },
    contact: {
      phone: '+971 4 456 7890',
      whatsapp: '+971504567890',
      instagram: '@fitnessfirstdxb',
    },
  },
];

export const NEARBY_BUSINESSES = [
  {
    id: '5',
    name: 'Pizza Palace',
    nameAr: 'قصر البيتزا',
    category: 'Restaurants',
    categoryAr: 'مطاعم',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    rating: 4.5,
    reviewCount: 178,
    distance: '0.5 km',
    address: 'Al Barsha, Dubai',
    addressAr: 'البرشاء، دبي',
    isOpen: true,
    featured: false,
    verified: true,
    coordinates: {
      latitude: 25.1123,
      longitude: 55.1943,
    },
    contact: {
      phone: '+971 4 567 8901',
      whatsapp: '+971505678901',
    },
  },
  {
    id: '6',
    name: 'Book Haven',
    nameAr: 'ملاذ الكتب',
    category: 'Shopping',
    categoryAr: 'تسوق',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    rating: 4.4,
    reviewCount: 92,
    distance: '1.8 km',
    address: 'Mall of the Emirates',
    addressAr: 'مول الإمارات',
    isOpen: true,
    featured: false,
    verified: false,
    coordinates: {
      latitude: 25.1181,
      longitude: 55.2007,
    },
    contact: {
      phone: '+971 4 678 9012',
      instagram: '@bookhaven',
    },
  },
  {
    id: '7',
    name: 'Kids Academy',
    nameAr: 'أكاديمية الأطفال',
    category: 'Education',
    categoryAr: 'تعليم',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    rating: 4.9,
    reviewCount: 267,
    distance: '2.3 km',
    address: 'Al Quoz, Dubai',
    addressAr: 'القوز، دبي',
    isOpen: true,
    featured: false,
    verified: true,
    coordinates: {
      latitude: 25.1422,
      longitude: 55.2195,
    },
    contact: {
      phone: '+971 4 789 0123',
      whatsapp: '+971507890123',
      instagram: '@kidsacademy',
      website: 'www.kidsacademy.ae',
    },
  },
  {
    id: '8',
    name: 'Cinema Plus',
    nameAr: 'سينما بلس',
    category: 'Entertainment',
    categoryAr: 'ترفيه',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    rating: 4.3,
    reviewCount: 445,
    distance: '3.2 km',
    address: 'Dubai Mall',
    addressAr: 'دبي مول',
    isOpen: true,
    featured: false,
    verified: true,
    coordinates: {
      latitude: 25.1972,
      longitude: 55.2795,
    },
    contact: {
      phone: '+971 4 890 1234',
      website: 'www.cinemaplus.ae',
    },
  },
];

export const REVIEWS = [
  {
    id: '1',
    businessId: '1',
    userName: 'Ahmed Hassan',
    userAvatar: null,
    rating: 5,
    comment: 'Amazing coffee and great atmosphere! Highly recommended.',
    commentAr: 'قهوة رائعة وأجواء مميزة! أنصح بشدة.',
    date: '2026-01-25',
    helpful: 12,
  },
  {
    id: '2',
    businessId: '1',
    userName: 'Sarah Mohammed',
    userAvatar: null,
    rating: 4,
    comment: 'Good service but can get crowded on weekends.',
    commentAr: 'خدمة جيدة ولكن يمكن أن يكون مزدحماً في عطلات نهاية الأسبوع.',
    date: '2026-01-20',
    helpful: 8,
  },
  {
    id: '3',
    businessId: '2',
    userName: 'Fatima Ali',
    userAvatar: null,
    rating: 5,
    comment: 'Best salon in Dubai! Professional and friendly staff.',
    commentAr: 'أفضل صالون في دبي! طاقم محترف وودود.',
    date: '2026-01-28',
    helpful: 15,
  },
];

export const BUSINESS_HOURS = {
  monday: { open: '09:00', close: '22:00', closed: false },
  tuesday: { open: '09:00', close: '22:00', closed: false },
  wednesday: { open: '09:00', close: '22:00', closed: false },
  thursday: { open: '09:00', close: '23:00', closed: false },
  friday: { open: '10:00', close: '23:00', closed: false },
  saturday: { open: '10:00', close: '22:00', closed: false },
  sunday: { open: '10:00', close: '22:00', closed: false },
};

// Helper function to get business by ID
export const getBusinessById = (id) => {
  return [...FEATURED_BUSINESSES, ...NEARBY_BUSINESSES].find((b) => b.id === id);
};

// Helper function to get businesses by category
export const getBusinessesByCategory = (categoryName) => {
  return [...FEATURED_BUSINESSES, ...NEARBY_BUSINESSES].filter(
    (b) => b.category === categoryName
  );
};

// Helper function to search businesses
export const searchBusinesses = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return [...FEATURED_BUSINESSES, ...NEARBY_BUSINESSES].filter(
    (b) =>
      b.name.toLowerCase().includes(lowercaseQuery) ||
      b.nameAr.includes(query) ||
      b.category.toLowerCase().includes(lowercaseQuery)
  );
};
