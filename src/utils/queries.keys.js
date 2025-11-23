export const QUERY_KEYS = {
  auth: {
    me: () => ['auth', 'me'],
  },

  categories: {
    all: ['categories'],
    lists: () => [...QUERY_KEYS.categories.all, 'lists'],
  },

  products: {
    all: ['products'],
    featured: () => [...QUERY_KEYS.products.all, 'featured'],
    trending: () => [...QUERY_KEYS.products.all, 'trending'],
  },
};