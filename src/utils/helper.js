import { RoleEnum } from "./constant";

export const formatErrorMessage = (error) => {
  const message = error?.data?.message || error || 'An error occured.';
  return message;
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