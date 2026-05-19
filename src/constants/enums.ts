// ============================================================
// Navigation & Layout
// ============================================================

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const;

export const FOOTER_CUSTOMER_SERVICE = [
  { label: 'Shipping & Returns', to: '/shipping-returns' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Caliber Guide', to: '/caliber-guide' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
] as const;

export const CONTACT_INFO = {
  email: 'desilva.sam17.sgds@gmail.com',
  phone: '+63 948 014 0546',
  address: 'Purok 6, Dulangan, San Luis, Batangas, Philippines, 4210',
} as const;

// ============================================================
// Product Categories
// ============================================================

export const PRODUCT_CATEGORIES = [
  'All',
  'Pellets',
  'Slugs',
  'Diabolo',
  'Hollow Point',
  'Match Grade',
] as const;

export const CATEGORY_PAGE_DATA = [
  {
    name: 'Pellets',
    description: 'Precision diabolo pellets for air rifles',
    color: 'from-blue-500 to-blue-700',
    count: '24 products',
  },
  {
    name: 'Slugs',
    description: 'High-performance monolithic slugs',
    color: 'from-purple-500 to-purple-700',
    count: '36 products',
  },
  {
    name: 'Hollow Point',
    description: 'Expanding hollow point ammunition',
    color: 'from-yellow-500 to-yellow-700',
    count: '18 products',
  },
  {
    name: 'Match Grade',
    description: 'Competition-grade precision rounds',
    color: 'from-green-500 to-green-700',
    count: '12 products',
  },
  {
    name: 'Diabolo',
    description: 'Classic waisted diabolo pellets',
    color: 'from-red-500 to-red-700',
    count: '42 products',
  },
  {
    name: 'Accessories',
    description: 'Pellet tins, targets, and more',
    color: 'from-indigo-500 to-indigo-700',
    count: '15 products',
  },
] as const;

// ============================================================
// Home Page
// ============================================================

export const FEATURES = [
  {
    title: 'Premium Quality',
    description: 'Precision-crafted ammunition',
  },
  {
    title: 'Consistency',
    description: 'Tight tolerances guaranteed',
  },
  {
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    title: 'Easy Returns',
    description: '30-day satisfaction guarantee',
  },
] as const;

export const ABOUT_STATS = [
  { label: 'Premium Quality', value: '100%' },
  { label: 'Happy Customers', value: '10K+' },
  { label: 'Products Available', value: '100+' },
  { label: 'Years Experience', value: '15+' },
] as const;

// ============================================================
// Auth / Profile Labels
// ============================================================

export const PROFILE_FIELDS = {
  PERSONAL: [
    { key: 'firstname', label: 'First Name', icon: 'User' },
    { key: 'lastname', label: 'Last Name', icon: 'User' },
    { key: 'nickname', label: 'Nickname', icon: 'AtSign' },
    { key: 'email', label: 'Email', icon: 'Mail' },
  ],
  ADDRESS: [
    { key: 'full_address', label: 'Full Address', icon: 'MapPin' },
    { key: 'street', label: 'Street', icon: 'Home' },
    { key: 'barangay', label: 'Barangay', icon: 'Road' },
    { key: 'city', label: 'City', icon: 'Building2' },
    { key: 'province', label: 'Province', icon: 'Globe' },
    { key: 'zipcode', label: 'Zip Code', icon: 'Hash' },
  ],
} as const;

// ============================================================
// Order Status
// ============================================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// ============================================================
// Theme
// ============================================================

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// ============================================================
// User Role
// ============================================================

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
} as const;
