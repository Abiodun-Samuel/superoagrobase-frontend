import { RoleEnum } from "./constant";

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
  const ROLE_HIERARCHY = Object.keys(RoleEnum);

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

export function formatPrice(price) {
  if (!price) return null
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price);
}

/**
 * @param {Object} config - Breadcrumb configuration
 * @param {string} config.page - Type of page: 
 *    'allProducts' | 'category' | 'subcategory' | 'product' | 'about' | 'contact' | 'services' | 'singleService'
 * @param {Object} [config.data] - Optional data depending on page type
 * @returns {Array<{label: string, href: string, current?: boolean}>}
 */
export function buildBreadcrumb(config) {
  const { page, data = {} } = config;

  const items = [];

  // Always add the base
  items.push({ label: 'Home', href: '/' });

  switch (page) {
    case 'allProducts':
      items.push({
        label: 'Products',
        href: '/products',
        current: true
      });
      break;

    case 'category':
      items.push({ label: 'Products', href: '/products' });
      items.push({
        label: data.category.title,
        href: `/products/categories/${data.category.slug}`,
        current: true,
      });
      break;

    case 'subcategory':
      items.push({ label: 'Products', href: '/products' });
      items.push({
        label: data.category.title,
        href: `/products/categories/${data.category.slug}`,
      });
      items.push({
        label: data.subcategory.title,
        href: `/products/categories/${data.category.slug}/${data.subcategory.slug}`,
        current: true,
      });
      break;

    case 'product':
      items.push({ label: 'Products', href: '/products' });

      if (data.category) {
        items.push({
          label: data.category.title,
          href: `/products/categories/${data.category.slug}`,
        });
      }

      if (data.subcategory) {
        items.push({
          label: data.subcategory.title,
          href: `/products/categories/${data.category.slug}/${data.subcategory.slug}`,
        });
      }

      items.push({
        label: data.title,
        href: `/products/${data.slug}`,
        current: true,
      });
      break;

    case 'about':
      items.push({
        label: 'About Us',
        href: '/about',
        current: true,
      });
      break;

    case 'contact':
      items.push({
        label: 'Contact Us',
        href: '/contact',
        current: true,
      });
      break;

    case 'services':
      items.push({
        label: 'Services',
        href: '/services',
        current: true,
      });
      break;

    case 'singleService':
      items.push({
        label: 'Services',
        href: '/services'
      });
      items.push({
        label: data.title,
        href: `/services/${data.slug}`,
        current: true,
      });
      break;

    default:
      // fallback
      items.push({
        label: 'Page',
        href: '#',
        current: true,
      });
  }

  return items;
}

export const getPriceValidUntil = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};