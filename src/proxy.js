import { NextResponse } from 'next/server';
import { getAuth } from '@/server/auth.server';
import { isAdmin, isVendor } from '@/utils/role';

const ROUTES = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  DASHBOARD: {
    BASE: '/dashboard',
  },
  USER: {
    BASE: '/account',
    PROFILE: '/account/profile',
    PRODUCTS: '/account/products',
  },
  PROTECTED: {
    CHECKOUT: '/checkout',
  },
};

const PROTECTED_ROUTE_PREFIXES = [
  ROUTES.DASHBOARD.BASE,
  ROUTES.USER.BASE,
  ROUTES.AUTH.BASE,
  ROUTES.PROTECTED.CHECKOUT,
];

const matchesProtectedRoute = (pathname) => {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const createRedirect = (request, path, params = {}) => {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = '';

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return NextResponse.redirect(url);
};

const handleUserRedirect = (request) => {
  const { pathname } = request.nextUrl;

  if (pathname === ROUTES.USER.BASE) {
    return createRedirect(request, ROUTES.USER.PROFILE);
  }

  return null;
};

const handleAuthRoutes = (request, isAuthenticated, roles) => {
  const { pathname } = request.nextUrl;

  if (pathname === ROUTES.AUTH.BASE) {
    return createRedirect(request, ROUTES.AUTH.LOGIN);
  }

  if (isAuthenticated && (pathname === ROUTES.AUTH.LOGIN || pathname === ROUTES.AUTH.REGISTER)) {
    const redirectPath = request.nextUrl.searchParams.get('redirect');

    if (redirectPath && !matchesProtectedRoute(redirectPath)) {
      return createRedirect(request, redirectPath);
    }

    if (isAdmin(roles)) {
      return createRedirect(request, ROUTES.DASHBOARD.BASE);
    }

    return createRedirect(request, ROUTES.USER.PROFILE);
  }

  return null;
};

const handleDashboardAccess = (request, isAuthenticated, roles) => {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ROUTES.DASHBOARD.BASE)) {
    return null;
  }

  if (!isAuthenticated) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, {
      redirect: pathname,
    });
  }

  if (!isAdmin(roles)) {
    return createRedirect(request, ROUTES.USER.PROFILE);
  }

  return null;
};

const handleVendorProductsAccess = (request, isAuthenticated, roles) => {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ROUTES.USER.PRODUCTS)) {
    return null;
  }

  if (!isAuthenticated) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, {
      redirect: pathname,
    });
  }

  if (!isVendor(roles)) {
    return createRedirect(request, ROUTES.USER.PROFILE);
  }

  return null;
};

const handleUserAccess = (request, isAuthenticated) => {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ROUTES.USER.BASE)) {
    return null;
  }

  if (!isAuthenticated) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, {
      redirect: pathname,
    });
  }

  return null;
};

const handleProtectedRoutes = (request, isAuthenticated) => {
  const { pathname } = request.nextUrl;

  const checkoutRoutes = [ROUTES.PROTECTED.CHECKOUT];

  if (!isAuthenticated && checkoutRoutes.some(route => pathname.startsWith(route))) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, {
      redirect: pathname,
    });
  }

  return null;
};

const handleMiddlewareError = (request) => {
  const { pathname } = request.nextUrl;

  if (matchesProtectedRoute(pathname)) {
    return createRedirect(request, ROUTES.AUTH.LOGIN, {
      redirect: pathname,
    });
  }

  return NextResponse.next();
};

export async function proxy(request) {
  try {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = matchesProtectedRoute(pathname);

    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    const userRedirect = handleUserRedirect(request);
    if (userRedirect) return userRedirect;

    const { roles = [], isAuthenticated = false } = await getAuth();

    if (pathname.startsWith(ROUTES.AUTH.BASE)) {
      const authRedirect = handleAuthRoutes(request, isAuthenticated, roles);
      if (authRedirect) return authRedirect;
      return NextResponse.next();
    }

    const dashboardRedirect = handleDashboardAccess(request, isAuthenticated, roles);
    if (dashboardRedirect) return dashboardRedirect;

    // Check vendor products access BEFORE general user access
    const vendorProductsRedirect = handleVendorProductsAccess(request, isAuthenticated, roles);
    if (vendorProductsRedirect) return vendorProductsRedirect;

    const userAccessRedirect = handleUserAccess(request, isAuthenticated);
    if (userAccessRedirect) return userAccessRedirect;

    const protectedRedirect = handleProtectedRoutes(request, isAuthenticated);
    if (protectedRedirect) return protectedRedirect;

    return NextResponse.next();
  } catch (error) {
    return handleMiddlewareError(request);
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon|sitemap|robots|manifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};