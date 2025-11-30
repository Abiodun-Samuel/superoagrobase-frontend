const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const AUTH_COOKIE = 'AUTH_COOKIE';
export const SESSION_COOKIE = 'SESSION_COOKIE';

export const ROLE_ENUM = Object.freeze({
    super_admin: "Super Admin",
    admin: "Admin",
    vendor: "Vendor",
    user: "User",
});


export const COOKIE_MAX_AGE = {
    TOKEN: 7 * 24 * 60 * 60,
    SESSION: 400 * 24 * 60 * 60,
};

export const COOKIE_CONFIG = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    // maxAge: IS_PRODUCTION ? SESSION_DURATION.production : SESSION_DURATION.development,
};

export const DEFAULT_AUTH_STATE = {
    token: null,
    user: null,
    isAuthenticated: false,
    role: null,
    roles: [],
};