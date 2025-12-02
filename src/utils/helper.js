import { ROLE_ENUM } from "./constant";
import { SHIPPING_RATES } from "./data";

export const formatErrorMessage = (error) => {
  if (error?.response) {
    return error.response.data?.message ||
      error.response.data?.error ||
      'An error occurred';
  }

  if (error?.request) {
    return 'Network error. Please check your connection.';
  }

  return error?.message || 'An unexpected error occurred';
};

export function getPrimaryRole(roles = []) {
  const ROLE_HIERARCHY = Object.keys(ROLE_ENUM);

  if (!Array.isArray(roles) || roles.length === 0) return "user";

  for (const role of ROLE_HIERARCHY) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return "user";
}

export const isActivePath = (pathname, itemPath) => {
  if (itemPath === '/') return pathname === '/';
  return pathname === itemPath || pathname?.startsWith(itemPath + '/');
};

export function buildBreadcrumb(config) {
  const { page, data = {} } = config;
  const items = [];

  items.push({ name: 'Home', url: '/' });

  switch (page) {
    case 'allProducts':
      items.push({
        name: 'Products',
        url: '/products',
        current: true
      });
      break;

    case 'category':
      items.push({ name: 'Products', url: '/products' });
      items.push({
        name: data.category?.title,
        url: `/products?category=${data.category?.slug}`,
        current: true
      });
      break;

    case 'subcategory':
      items.push({ name: 'Products', url: '/products' });
      items.push({
        name: data.category?.title,
        url: `/products?category/${data.category.slug}`
      });
      items.push({
        name: data.subcategory?.title,
        url: `/products?category=${data.category.slug}$subcategory=${data.subcategory.slug}`,
        current: true
      });
      break;

    case 'product':
      items.push({ name: 'Products', url: '/products' });

      if (data.category) {
        items.push({
          name: data.category.title,
          url: `/products?category=${data.category.slug}`
        });
      }

      if (data.subcategory) {
        items.push({
          name: data.subcategory.title,
          url: `/products?category=${data.category.slug}$subcategory=${data.subcategory.slug}`,
        });
      }

      items.push({
        name: data.title,
        url: `/products/${data.slug}`,
        current: true
      });
      break;

    case 'about':
      items.push({ name: 'About Us', url: '/about', current: true });
      break;

    case 'contact':
      items.push({ name: 'Contact Us', url: '/contact', current: true });
      break;

    case 'services':
      items.push({ name: 'Services', url: '/services', current: true });
      break;

    case 'singleService':
      items.push({ name: 'Services', url: '/services' });
      items.push({
        name: data.title,
        url: `/services/${data.slug}`,
        current: true
      });
      break;

    default:
      items.push({ name: 'Page', url: '#', current: true });
  }

  return items;
}

export const getPriceValidUntil = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const formatCurrency = (amount) => {
  if (!amount) return 0
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};


const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, ''); // Remove special characters
};

export const findShippingRate = (state, city) => {
  if (!state || !city) return null;

  const normalizedState = normalizeString(state);
  const normalizedCity = normalizeString(city);

  // Try exact match first
  const exactMatch = SHIPPING_RATES.find(
    rate =>
      normalizeString(rate.state) === normalizedState &&
      normalizeString(rate.city) === normalizedCity
  );

  if (exactMatch) return exactMatch.amount;

  const partialMatch = SHIPPING_RATES.find(
    rate => {
      const rateState = normalizeString(rate.state);
      const rateCity = normalizeString(rate.city);

      return (
        rateState === normalizedState &&
        (rateCity.includes(normalizedCity) || normalizedCity.includes(rateCity))
      );
    }
  );

  if (partialMatch) return partialMatch.amount;
  return null;
};

