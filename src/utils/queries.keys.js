// utils/queries.keys.js - UPDATED VERSION WITH CATEGORIES & SUBCATEGORIES

export const QUERY_KEYS = {
  admin: {
    all: ['admin'],
    dashboard: () => [...QUERY_KEYS.admin.all, 'dashboard'],
  },

  users: {
    all: ['users'],
    list: (filters) => [...QUERY_KEYS.users.all, 'list', filters],
    detail: (userId) => [...QUERY_KEYS.users.all, 'detail', userId],
    stats: () => [...QUERY_KEYS.users.all, 'stats'],
  },

  userProfile: {
    all: ['userProfile'],
    detail: () => [...QUERY_KEYS.userProfile.all, 'detail'],
  },

  auth: {
    me: () => ['auth', 'me'],
  },

  // ============================================
  // CATEGORIES - EXPANDED
  // ============================================
  categories: {
    all: ['categories'],
    lists: () => [...QUERY_KEYS.categories.all, 'list'],
    list: (filters) => [...QUERY_KEYS.categories.lists(), filters],
    details: () => [...QUERY_KEYS.categories.all, 'detail'],
    detail: (id) => [...QUERY_KEYS.categories.details(), id],
    admin: (filters) => [...QUERY_KEYS.categories.all, 'admin', filters],
    adminDetails: () => [...QUERY_KEYS.categories.all, 'admin', 'detail'],
    adminDetail: (id) => [...QUERY_KEYS.categories.adminDetails(), id],
  },

  // ============================================
  // SUBCATEGORIES - NEW
  // ============================================
  subcategories: {
    all: ['subcategories'],
    lists: () => [...QUERY_KEYS.subcategories.all, 'list'],
    list: (filters) => [...QUERY_KEYS.subcategories.lists(), filters],
    details: () => [...QUERY_KEYS.subcategories.all, 'detail'],
    detail: (id) => [...QUERY_KEYS.subcategories.details(), id],
    byCategory: (categoryId, filters) => [
      ...QUERY_KEYS.subcategories.all,
      'by-category',
      categoryId,
      filters,
    ],
    admin: (filters) => [...QUERY_KEYS.subcategories.all, 'admin', filters],
    adminDetails: () => [...QUERY_KEYS.subcategories.all, 'admin', 'detail'],
    adminDetail: (id) => [...QUERY_KEYS.subcategories.adminDetails(), id],
  },

  reviews: {
    all: ['reviews'],
    lists: (params) => [...QUERY_KEYS.reviews.all, 'lists', params],
    details: () => [...QUERY_KEYS.reviews.all, 'detail'],
    detail: (id) => [...QUERY_KEYS.reviews.details(), id],
  },

  products: {
    all: ['products'],
    lists: (filters) => [...QUERY_KEYS.products.all, 'lists', filters],
    detail: (id) => [...QUERY_KEYS.products.all, 'detail', id],
    featured: () => [...QUERY_KEYS.products.all, 'featured'],
    trending: () => [...QUERY_KEYS.products.all, 'trending'],
    admin: (filters) => [...QUERY_KEYS.products.all, 'admin', filters],
  },

  cart: {
    all: ['cart'],
    details: (sessionId) => [...QUERY_KEYS.cart.all, 'details', sessionId],
  },

  orders: {
    all: ['orders'],
    lists: () => [...QUERY_KEYS.orders.all, 'list'],
    list: (filters) => [...QUERY_KEYS.orders.lists(), filters],
    details: () => [...QUERY_KEYS.orders.all, 'detail'],
    detail: (reference) => [...QUERY_KEYS.orders.details(), reference],
  },

  // User Orders Keys
  myOrders: {
    all: ['my-orders'],
    lists: () => [...QUERY_KEYS.myOrders.all, 'list'],
    list: (filters) => [...QUERY_KEYS.myOrders.lists(), filters],
    details: () => [...QUERY_KEYS.myOrders.all, 'detail'],
    detail: (reference) => [...QUERY_KEYS.myOrders.details(), reference],
  },

  transaction: {
    all: ['transaction'],
    detail: (params) => [...QUERY_KEYS.transaction.all, 'detail', params],
  },

  vendorRequests: {
    all: ['vendor-requests'],
    lists: (filters) => [...QUERY_KEYS.vendorRequests.all, 'lists', filters],
    detail: (id) => [...QUERY_KEYS.vendorRequests.all, 'detail', id],
    byEmail: (email) => [...QUERY_KEYS.vendorRequests.all, 'by-email', email],
  },

  vendorProducts: {
    all: ['vendorProducts'],
    lists: (filters) => [...QUERY_KEYS.vendorProducts.all, 'list', filters],
    detail: (id) => [...QUERY_KEYS.vendorProducts.all, 'detail', id],
  },

  vendors: {
    all: ['vendors'],
    list: (filters) => [...QUERY_KEYS.vendors.all, 'list', filters],
    detail: (vendorId) => [...QUERY_KEYS.vendors.all, 'detail', vendorId],
    stats: () => [...QUERY_KEYS.vendors.all, 'stats'],
    products: (vendorId, params) => [...QUERY_KEYS.vendors.all, 'detail', vendorId, 'products', params],
    orders: (vendorId, params) => [...QUERY_KEYS.vendors.all, 'detail', vendorId, 'orders', params],
  },
};

// ============================================
// INVALIDATION PATTERNS - EXPANDED
// ============================================
export const invalidationPatterns = {
  reviews: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.all });
  },

  userProfile: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile.all });
  },

  // ============================================
  // CATEGORIES - NEW
  // ============================================
  categories: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
  },

  category: (queryClient, id) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.detail(id) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.adminDetail(id) });
  },

  // ============================================
  // SUBCATEGORIES - NEW
  // ============================================
  subcategories: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subcategories.all });
  },

  subcategory: (queryClient, id) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subcategories.detail(id) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subcategories.adminDetail(id) });
  },

  orders: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
  },

  order: (queryClient, reference) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(reference) });
  },

  myOrders: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myOrders.all });
  },

  myOrder: (queryClient, reference) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myOrders.detail(reference) });
  },

  statistics: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics.all });
  },

  adminDashboard: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.dashboard() });
  },
};