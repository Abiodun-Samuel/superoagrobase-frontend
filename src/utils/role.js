import { ROLE_ENUM } from "./constant";

/**
 * Check if user has any of the specified roles
 * @param {Array<string>} userRoles - Array of user's roles
 * @param {Array<string>} allowedRoles - Array of roles to check against
 * @returns {boolean}
 */
export const hasRole = (userRoles = [], allowedRoles = []) => {
    if (!Array.isArray(userRoles) || !Array.isArray(allowedRoles)) {
        return false;
    }

    return userRoles.some(role => allowedRoles.includes(role));
};

/**
 * Check if user is admin or super admin
 * @param {Array<string>} userRoles - Array of user's roles
 * @returns {boolean}
 */
export const isAdmin = (userRoles = []) => {
    return hasRole(userRoles, [ROLE_ENUM.admin, ROLE_ENUM.super_admin]);
};

/**
 * Check if user is super admin
 * @param {Array<string>} userRoles - Array of user's roles
 * @returns {boolean}
 */
export const isSuperAdmin = (userRoles = []) => {
    return hasRole(userRoles, [ROLE_ENUM.super_admin]);
};

/**
 * Check if user is vendor
 * @param {Array<string>} userRoles - Array of user's roles
 * @returns {boolean}
 */
export const isVendor = (userRoles = []) => {
    return hasRole(userRoles, [ROLE_ENUM.vendor]);
};

/**
 * Filter menu items based on user roles
 * @param {Array<Object>} menuItems - Array of menu items
 * @param {Array<string>} userRoles - Array of user's roles
 * @returns {Array<Object>}
 */
export const filterMenuByRole = (menuItems = [], userRoles = []) => {
    return menuItems.filter(item => {
        if (!item.roles || item.roles.length === 0) {
            return true; // Show items with no role restrictions
        }
        return hasRole(userRoles, item.roles);
    });
};