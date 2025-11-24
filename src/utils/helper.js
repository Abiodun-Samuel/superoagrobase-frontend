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