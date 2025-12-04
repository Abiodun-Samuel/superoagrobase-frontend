// const cleanCheckoutUrl = (request, isAuthenticated, user) => {
//   const { pathname, searchParams } = request.nextUrl;

//   // Only process checkout URLs for authenticated users
//   if (!pathname.startsWith(ROUTES.CHECKOUT) || !isAuthenticated) {
//     return null;
//   }

//   const userId = searchParams.get('user_id');

//   // Check if user_id is missing or is a falsy value
//   const isFalsyUserId = !userId || userId === 'undefined' || userId === 'null' || userId === '';

//   if (isFalsyUserId && user?.id) {
//     // Keep all params and add/fix user_id
//     const params = {};

//     searchParams.forEach((value, key) => {
//       params[key] = value;
//     });

//     params.user_id = user.id;

//     return createRedirect(request, ROUTES.CHECKOUT, params);
//   }

//   return null;
// }; import { NextResponse } from 'next/server';
// import { getAuth } from '@/server/auth.server';
// import { getPrimaryRole } from '@/utils/helper';

// const ROUTES = {
//   AUTH: {
//     LOGIN: '/auth/login',
//     REGISTER: '/auth/register',
//     BASE: '/auth',
//   },
//   DASHBOARD: {
//     BASE: '/dashboard',
//     ADMIN: '/dashboard/admin',
//   },
//   HOME: '/',
//   CHECKOUT: '/checkout'
// };

// const PUBLIC_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
// const PROTECTED_ROUTES = [ROUTES.DASHBOARD.BASE, ROUTES.CHECKOUT];
// const ADMIN_ONLY_ROUTES = [ROUTES.DASHBOARD.ADMIN];

// const matchesRoute = (pathname, routes) => {
//   return routes.some((route) => pathname.startsWith(route));
// };

// const createRedirect = (request, path, params = {}) => {
//   const url = request.nextUrl.clone();
//   url.pathname = path;

//   // Clear all existing search params
//   url.search = '';

//   // Add only the specified params
//   Object.entries(params).forEach(([key, value]) => {
//     if (value) {
//       url.searchParams.set(key, value);
//     }
//   });

//   return NextResponse.redirect(url);
// };

// const handleAuthRedirect = (request, isAuthenticated, user) => {
//   const { pathname, searchParams } = request.nextUrl;

//   if (pathname === ROUTES.AUTH.BASE) {
//     return createRedirect(request, ROUTES.AUTH.LOGIN);
//   }

//   if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
//     const redirectPath = searchParams.get('redirect');

//     // Don't redirect if no redirect param or if it's a protected route
//     if (!redirectPath || matchesRoute(redirectPath, PROTECTED_ROUTES)) {
//       return createRedirect(request, ROUTES.HOME);
//     }

//     // If redirecting to checkout, preserve all query params and add/fix user_id
//     if (redirectPath.startsWith(ROUTES.CHECKOUT)) {
//       const redirectUrl = new URL(redirectPath, request.url);
//       const params = {};

//       redirectUrl.searchParams.forEach((value, key) => {
//         params[key] = value;
//       });

//       // Add or fix user_id if it's missing or invalid
//       const userId = params.user_id;
//       if (!userId || userId === 'undefined' || userId === 'null' || userId === '') {
//         params.user_id = user?.id;
//       }

//       return createRedirect(request, ROUTES.CHECKOUT, params);
//     }

//     return createRedirect(request, redirectPath);
//   }

//   return null;
// };

// const handleProtectedRoutes = (request, isAuthenticated) => {
//   const { pathname, searchParams } = request.nextUrl;

//   if (!isAuthenticated && matchesRoute(pathname, PROTECTED_ROUTES)) {
//     // For checkout route, preserve all params in redirect param
//     if (pathname.startsWith(ROUTES.CHECKOUT)) {
//       const params = new URLSearchParams();

//       searchParams.forEach((value, key) => {
//         params.set(key, value);
//       });

//       const redirectUrl = params.toString()
//         ? `${ROUTES.CHECKOUT}?${params.toString()}`
//         : ROUTES.CHECKOUT;

//       return createRedirect(request, ROUTES.AUTH.LOGIN, {
//         redirect: redirectUrl
//       });
//     }

//     return createRedirect(request, ROUTES.AUTH.LOGIN, { redirect: pathname });
//   }

//   return null;
// };

// const handleAdminRoutes = (request, user, isAuthenticated) => {
//   const { pathname } = request.nextUrl;

//   if (isAuthenticated && matchesRoute(pathname, ADMIN_ONLY_ROUTES)) {
//     const role = getPrimaryRole(user?.roles ?? []);

//     if (role !== 'admin') {
//       return createRedirect(request, ROUTES.DASHBOARD.BASE);
//     }
//   }

//   return null;
// };



// export async function proxy(request) {
//   try {
//     const { user, isAuthenticated } = await getAuth();

//     // Clean checkout URL first if needed (add user_id for authenticated users)
//     const cleanupRedirect = cleanCheckoutUrl(request, isAuthenticated, user);
//     if (cleanupRedirect) return cleanupRedirect;

//     const authRedirect = handleAuthRedirect(request, isAuthenticated, user);
//     if (authRedirect) return authRedirect;

//     const protectedRedirect = handleProtectedRoutes(request, isAuthenticated);
//     if (protectedRedirect) return protectedRedirect;

//     const adminRedirect = handleAdminRoutes(request, user, isAuthenticated);
//     if (adminRedirect) return adminRedirect;

//     return NextResponse.next();
//   } catch (error) {
//     const { pathname, searchParams } = request.nextUrl;

//     if (matchesRoute(pathname, PROTECTED_ROUTES)) {
//       // For checkout, preserve all params in redirect
//       if (pathname.startsWith(ROUTES.CHECKOUT)) {
//         const params = new URLSearchParams();

//         searchParams.forEach((value, key) => {
//           params.set(key, value);
//         });

//         const redirectUrl = params.toString()
//           ? `${ROUTES.CHECKOUT}?${params.toString()}`
//           : ROUTES.CHECKOUT;

//         return createRedirect(request, ROUTES.AUTH.LOGIN, {
//           redirect: redirectUrl
//         });
//       }

//       return createRedirect(request, ROUTES.AUTH.LOGIN, { redirect: pathname });
//     }

//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/auth/:path*',
//     '/checkout',
//     '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };
import { NextResponse } from 'next/server';
import { getAuth } from '@/server/auth.server';
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
  CHECKOUT: '/checkout'
};

const PUBLIC_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
const PROTECTED_ROUTES = [ROUTES.DASHBOARD.BASE, ROUTES.CHECKOUT];
const ADMIN_ONLY_ROUTES = [ROUTES.DASHBOARD.ADMIN];

const matchesRoute = (pathname, routes) => {
  return routes.some((route) => pathname.startsWith(route));
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

const handleAuthRedirect = (request, isAuthenticated) => {
  const { pathname, searchParams } = request.nextUrl;

  // Redirect /auth to /auth/login
  if (pathname === ROUTES.AUTH.BASE) {
    return createRedirect(request, ROUTES.AUTH.LOGIN);
  }

  // If authenticated and on public routes (login/register)
  if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
    const redirectPath = searchParams.get('redirect');

    // If no redirect param or redirect is to a protected route, go home
    if (!redirectPath || matchesRoute(redirectPath, PROTECTED_ROUTES)) {
      return createRedirect(request, ROUTES.HOME);
    }

    // Redirect to the specified path (without query params)
    return createRedirect(request, redirectPath);
  }

  return null;
};

const handleProtectedRoutes = (request, isAuthenticated) => {
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && matchesRoute(pathname, PROTECTED_ROUTES)) {
    // Redirect to login with the pathname (no query params preserved)
    return createRedirect(request, ROUTES.AUTH.LOGIN, {
      redirect: pathname
    });
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

    // On error, redirect to login if trying to access protected routes
    if (matchesRoute(pathname, PROTECTED_ROUTES)) {
      return createRedirect(request, ROUTES.AUTH.LOGIN, {
        redirect: pathname
      });
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/checkout',
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};