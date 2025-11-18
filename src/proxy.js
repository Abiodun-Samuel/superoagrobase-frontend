import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    BASE: '/auth',
  },
  DASHBOARD: {
    BASE: '/dashboard',
    ADMIN: '/dashboard/admin',
  },
  HOME: '/',
};

// Route groups
const PUBLIC_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
const PROTECTED_ROUTES = [ROUTES.DASHBOARD.BASE];
const ADMIN_ONLY_ROUTES = [ROUTES.DASHBOARD.ADMIN];

/**
 * Check if pathname matches any route in the array
 */
const matchesRoute = (pathname, routes) => {
  return routes.some((route) => pathname.startsWith(route));
};

/**
 * Create redirect response with optional query params
 */
const createRedirect = (
  request,
  path,
  params = {}
) => {
  const url = request.nextUrl.clone();
  url.pathname = path;

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url);
};

/**
 * Handle authentication redirects
 */
const handleAuthRedirect = (
  request,
  token
) => {
  const { pathname } = request.nextUrl;

  // Redirect /auth to /auth/login
  if (pathname === ROUTES.AUTH.BASE) {
    return createRedirect(request, ROUTES.AUTH.LOGIN);
  }

  // Redirect authenticated users away from auth pages
  if (token && PUBLIC_ROUTES.includes(pathname)) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || ROUTES.HOME;
    return createRedirect(request, redirectPath);
  }

  return null;
};

/**
 * Handle protected route access
 */
const handleProtectedRoutes = (
  request,
  token
) => {
  const { pathname } = request.nextUrl;

  if (!token && matchesRoute(pathname, PROTECTED_ROUTES)) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, { redirect: pathname });
  }

  return null;
};

/**
 * Handle admin-only route access
 */
const handleAdminRoutes = (
  request,
  token,
  role
) => {
  const { pathname } = request.nextUrl;

  if (token && matchesRoute(pathname, ADMIN_ONLY_ROUTES) && role !== 'admin') {
    return createRedirect(request, ROUTES.DASHBOARD.BASE);
  }

  return null;
};

/**
 * Main proxy function
 */
export async function proxy(request) {
  try {
    const { token, role } = await getSession();
    // Check redirects in order of priority
    const authRedirect = handleAuthRedirect(request, token);
    if (authRedirect) return authRedirect;

    const protectedRedirect = handleProtectedRoutes(request, token);
    if (protectedRedirect) return protectedRedirect;

    const adminRedirect = handleAdminRoutes(request, token, role);
    if (adminRedirect) return adminRedirect;

    // Allow request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);

    // On session error, redirect to login if on protected route
    const { pathname } = request.nextUrl;
    if (matchesRoute(pathname, PROTECTED_ROUTES)) {
      return createRedirect(request, ROUTES.AUTH.LOGIN, { redirect: pathname });
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};