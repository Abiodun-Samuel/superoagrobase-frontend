export const AUTH_COOKIE = 'AUTH_SESSION';

export const RoleEnum = Object.freeze({
    super_admin: "Super Admin",
    admin: "Admin",
    vendor: "Vendor",
    user: "User",
});

export const NAVBAR_CONFIG = {
    heights: {
        topBar: 36,
        mainNav: 90,
        mainNavScrolled: 74,
    },
    breakpoints: {
        mobile: 'xl:hidden',
        desktop: 'hidden xl:flex'
    }
};