// ============================================
// utils/queries.keys.js
// ============================================
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
    lists: () => [...QUERY_KEYS.products.all, 'lists'],
    featured: () => [...QUERY_KEYS.products.all, 'featured'],
    trending: () => [...QUERY_KEYS.products.all, 'trending'],
  },

  cart: {
    all: ['cart'],
    details: (sessionId) => [...QUERY_KEYS.cart.all, 'details', sessionId],
  },

  order: {
    all: ['order'],
    detail: (params) => [...QUERY_KEYS.order.all, 'detail', params],
  },

  transaction: {
    all: ['transaction'],
    detail: (params) => [...QUERY_KEYS.transaction.all, 'detail', params],
  },

  //  transaction: {
  //       all: ['transactions'],
  //       lists: () => [...QUERY_KEYS.transaction.all, 'list'],
  //       list: (filters) => [...QUERY_KEYS.transaction.lists(), filters],
  //       details: () => [...QUERY_KEYS.transaction.all, 'detail'],
  //       detail: (params) => [...QUERY_KEYS.transaction.details(), params],
  //   },
};