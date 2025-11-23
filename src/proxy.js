import { NextResponse } from 'next/server';
import { getAuth } from '@/server/auth.action';
import { getPrimaryRole } from '@/utils/helper';

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

const PUBLIC_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
const PROTECTED_ROUTES = [ROUTES.DASHBOARD.BASE];
const ADMIN_ONLY_ROUTES = [ROUTES.DASHBOARD.ADMIN];

const matchesRoute = (pathname, routes) => {
  return routes.some((route) => pathname.startsWith(route));
};

const createRedirect = (request, path, params = {}) => {
  const url = request.nextUrl.clone();
  url.pathname = path;

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url);
};

const handleAuthRedirect = (request, isAuthenticated) => {
  const { pathname } = request.nextUrl;

  if (pathname === ROUTES.AUTH.BASE) {
    return createRedirect(request, ROUTES.AUTH.LOGIN);
  }

  if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || ROUTES.HOME;
    return createRedirect(request, redirectPath);
  }

  return null;
};

const handleProtectedRoutes = (request, isAuthenticated) => {
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && matchesRoute(pathname, PROTECTED_ROUTES)) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, { redirect: pathname });
  }

  return null;
};

const handleAdminRoutes = (request, user, isAuthenticated) => {
  const { pathname } = request.nextUrl;

  if (isAuthenticated && matchesRoute(pathname, ADMIN_ONLY_ROUTES)) {
    const role = getPrimaryRole(user?.roles ?? []);

    if (role !== 'admin') {
      return createRedirect(request, ROUTES.DASHBOARD.BASE);
    }
  }

  return null;
};

export async function proxy(request) {
  try {
    const { user, isAuthenticated } = await getAuth();

    const authRedirect = handleAuthRedirect(request, isAuthenticated);
    if (authRedirect) return authRedirect;

    const protectedRedirect = handleProtectedRoutes(request, isAuthenticated);
    if (protectedRedirect) return protectedRedirect;

    const adminRedirect = handleAdminRoutes(request, user, isAuthenticated);
    if (adminRedirect) return adminRedirect;

    return NextResponse.next();
  } catch (error) {
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