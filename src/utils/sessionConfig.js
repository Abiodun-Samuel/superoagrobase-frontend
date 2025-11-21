
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const SESSION_DURATION = {
  production: 7 * 24 * 60 * 60,
  development: 7 * 24 * 60 * 60 //5 * 60,
};

export const sessionConfig = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax',
  path: '/',
  maxAge: IS_PRODUCTION ? SESSION_DURATION.production : SESSION_DURATION.development,
};