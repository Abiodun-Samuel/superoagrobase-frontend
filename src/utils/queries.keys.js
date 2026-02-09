// utils/queries.keys.js
export const QUERY_KEYS = {
  auth: {
    me: () => ['auth', 'me'],
  },

  categories: {
    all: ['categories'],
    lists: () => [...QUERY_KEYS.categories.all, 'lists'],
  },

  reviews: {
    all: ['reviews'],
    lists: (params) => [...QUERY_KEYS.reviews.all, 'lists', params],
  },

  products: {
    all: ['products'],
    lists: (filters) => [...QUERY_KEYS.products.all, 'lists', filters],
    detail: (id) => [...QUERY_KEYS.products.all, 'detail', id],
    featured: () => [...QUERY_KEYS.products.all, 'featured'],
    trending: () => [...QUERY_KEYS.products.all, 'trending'],
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
    lists: () => [...QUERY_KEYS.vendorProducts.all, 'list'],
    detail: (id) => [...QUERY_KEYS.vendorProducts.all, 'detail', id],
  },
};

export const invalidationPatterns = {
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
};