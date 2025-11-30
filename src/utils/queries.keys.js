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
    detail: (sessionId, userId) => [...QUERY_KEYS.cart.all, 'detail', sessionId, ...(userId ? [userId] : [])],
  },
};